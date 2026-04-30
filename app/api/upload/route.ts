// POST /api/upload — image ingest.
// Validates file-type/dimensions/size, sharp-normalizes (resize + EXIF strip),
// uploads to Vercel Blob with a signed URL TTL of 24h, returns { imageId }.

import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import sharp from 'sharp';
import { getIpFromHeaders, hashIp } from '@/lib/utils/ipHash';
import {
  checkRateLimit,
  LIMIT_UPLOAD_PER_IP_HOUR,
  LIMIT_UPLOAD_PER_IP_DAY,
} from '@/lib/rate-limit';

export const runtime = 'nodejs'; // sharp needs Node, not edge

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_DIM = 8000; // 8000 × 8000 px
const TARGET_LONG_EDGE = 2048;

const ACCEPTED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(req: Request) {
  const ipHash = hashIp(getIpFromHeaders(req.headers));

  // Rate limit (per IP, hour + day).
  const [hour, day] = await Promise.all([
    checkRateLimit(LIMIT_UPLOAD_PER_IP_HOUR, ipHash),
    checkRateLimit(LIMIT_UPLOAD_PER_IP_DAY, ipHash),
  ]);
  if (!hour.success || !day.success) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfter: Math.max(hour.reset, day.reset) },
      { status: 429 },
    );
  }

  // Turnstile token verification — only enforced when configured.
  if (process.env.TURNSTILE_SECRET_KEY) {
    const tokenHeader = req.headers.get('cf-turnstile-response');
    if (!tokenHeader) {
      return NextResponse.json({ error: 'turnstile_missing' }, { status: 400 });
    }
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: tokenHeader,
      }),
    });
    const json = (await verify.json()) as { success: boolean };
    if (!json.success) {
      return NextResponse.json({ error: 'turnstile_failed' }, { status: 400 });
    }
  }

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'no_file' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'too_large', maxBytes: MAX_BYTES }, { status: 413 });
  }
  if (!ACCEPTED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: 'unsupported_format', accepted: Array.from(ACCEPTED_MIME) },
      { status: 415 },
    );
  }

  // sharp normalize: re-encode JPEG q85, scale down, strip metadata.
  let normalized: Buffer;
  let width: number;
  let height: number;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pipeline = sharp(Buffer.from(arrayBuffer)).rotate(); // honor EXIF orientation, then strip
    const meta = await pipeline.metadata();
    if ((meta.width ?? 0) > MAX_DIM || (meta.height ?? 0) > MAX_DIM) {
      return NextResponse.json({ error: 'oversize_dimensions', maxDim: MAX_DIM }, { status: 413 });
    }
    const result = await pipeline
      .resize({
        width: TARGET_LONG_EDGE,
        height: TARGET_LONG_EDGE,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85, mozjpeg: true })
      .withMetadata({}) // explicitly drop EXIF
      .toBuffer({ resolveWithObject: true });
    normalized = result.data;
    width = result.info.width;
    height = result.info.height;
  } catch {
    return NextResponse.json({ error: 'image_decode_failed' }, { status: 422 });
  }

  // Vercel Blob upload (gracefully no-op if unconfigured: dev returns local handle).
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error: 'blob_unconfigured',
        detail: 'BLOB_READ_WRITE_TOKEN missing — set in .env.local for live uploads.',
      },
      { status: 503 },
    );
  }

  const imageId = crypto.randomUUID();
  const blob = await put(`readings/${imageId}.jpg`, normalized, {
    access: 'public',
    contentType: 'image/jpeg',
    addRandomSuffix: true,
  });

  return NextResponse.json({
    imageId,
    blobUrl: blob.url,
    width,
    height,
    bytes: normalized.byteLength,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });
}
