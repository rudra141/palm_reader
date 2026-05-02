// POST /api/analyze — orchestrate inference, persist, return reading id.
//
// Boundaries (per /docs/trd.md §2):
//  1. Auth + rate-limit + cost circuit breaker
//  2. Vision pass → reasoning pass → output filter
//  3. Persist {readings, inference_log} rows
//  4. Schedule blob deletion at +24h unless retention_opt_in
//  5. Return reading id; client redirects to /report/[id]

import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';
import { AnalyzeRequestSchema } from '@/lib/validation/inputSchemas';
import { runInference } from '@/lib/ai/runInference';
import { hasLiveAi } from '@/lib/ai/client';
import {
  checkRateLimit,
  LIMIT_ANALYZE_PER_IP_HOUR,
  LIMIT_ANALYZE_PER_IP_DAY,
} from '@/lib/rate-limit';
import { checkBudget, recordSpend } from '@/lib/ai/costTracker';
import { hashIp, getIpFromHeaders } from '@/lib/utils/ipHash';
import { ensureUser } from '@/lib/auth/ensureUser';
import { db, schema } from '@/lib/db';

export const runtime = 'nodejs';
export const maxDuration = 60; // Vercel timeout cap for the inference flow

export async function POST(req: Request) {
  if (!hasLiveAi()) {
    return NextResponse.json(
      {
        error: 'ai_unconfigured',
        detail:
          'ANTHROPIC_API_KEY is not set. Live inference requires Anthropic credentials in .env.local.',
      },
      { status: 503 },
    );
  }

  // ── Validate input ──────────────────────────────────────────────────────
  const body = await req.json().catch(() => null);
  const parsed = AnalyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    console.error('[analyze] invalid_input', JSON.stringify(parsed.error.issues, null, 2));
    return NextResponse.json(
      { error: 'invalid_input', issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const input = parsed.data;

  // ── Auth (optional) ────────────────────────────────────────────────────
  // Anonymous reads still flow; if the caller is signed in we link the
  // resulting reading to their `users` row so it appears on /dashboard.
  // auth() throws if Clerk isn't configured (no middleware wrapping) — in
  // that case we just continue anonymous.
  let clerkUserId: string | null = null;
  try {
    const a = await auth();
    clerkUserId = a.userId ?? null;
  } catch {
    clerkUserId = null;
  }

  // ── Rate limit + cost circuit breaker ──────────────────────────────────
  const ipHash = hashIp(getIpFromHeaders(req.headers));
  // Authenticated users get their own per-user budget bucket; anonymous
  // users share the per-IP bucket.
  const userKey = clerkUserId ?? ipHash;

  const [hour, day, budget] = await Promise.all([
    checkRateLimit(LIMIT_ANALYZE_PER_IP_HOUR, ipHash),
    checkRateLimit(LIMIT_ANALYZE_PER_IP_DAY, ipHash),
    checkBudget({ userKey }),
  ]);
  if (!hour.success || !day.success) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }
  if (!budget.ok) {
    return NextResponse.json(
      {
        error: 'budget_exceeded',
        scope: budget.reason,
        currentSpendUsd: budget.currentSpendUsd,
      },
      { status: 429 },
    );
  }

  // ── Fetch the uploaded blob bytes ──────────────────────────────────────
  // Phase 4 ships with a synchronous fetch from the public blob URL the upload
  // endpoint returned. The schema validates blobUrl so we trust it here.
  const blobUrl = input.blobUrl;
  const blobResp = await fetch(blobUrl);
  if (!blobResp.ok) {
    return NextResponse.json({ error: 'blob_fetch_failed' }, { status: 502 });
  }
  const imageBytes = new Uint8Array(await blobResp.arrayBuffer());

  // ── Run inference ───────────────────────────────────────────────────────
  const result = await runInference({
    imageBytes,
    mimeType: 'image/jpeg', // sharp normalized everything to JPEG at upload
    clientContext: input.clientContext,
    subStyle: input.subStyle,
  });

  if (!result.ok) {
    await recordSpend({ userKey, costUsd: result.partialCostUsd });
    return NextResponse.json(
      {
        error: result.reason,
        detail: result.detail,
        partialCostUsd: result.partialCostUsd,
      },
      { status: result.reason === 'invalid_palm_image' ? 422 : 502 },
    );
  }

  // ── Persist ─────────────────────────────────────────────────────────────
  // If the caller is signed in, lazy-upsert the user row so we can FK the
  // reading to it. Failures here don't block the reading — anonymous
  // persistence is the safe fallback.
  let internalUserId: string | null = null;
  if (clerkUserId) {
    try {
      const u = await currentUser();
      const email = u?.emailAddresses[0]?.emailAddress ?? null;
      internalUserId = await ensureUser({ clerkUserId, email });
    } catch (err) {
      console.warn('[analyze] ensureUser failed; continuing anonymous:', (err as Error).message);
    }
  }

  let readingId: string;
  try {
    const inserted = await db()
      .insert(schema.readings)
      .values({
        userId: internalUserId,
        ipHash,
        tradition: input.tradition,
        subStyle: input.subStyle,
        contextJson: input.clientContext as unknown as Record<string, unknown>,
        reportJson: result.report as unknown,
        retentionOptIn: input.retentionOptIn,
        blobImageUrl: blobUrl,
        blobDeleteAfter: input.retentionOptIn ? null : new Date(Date.now() + 24 * 60 * 60 * 1000),
        modelVersions: result.meta.models as unknown as Record<string, string>,
        promptVersions: result.meta.promptVersions,
        costUsd: result.meta.totalCostUsd.toFixed(4),
        latencyMs: result.meta.totalLatencyMs,
      })
      .returning({ id: schema.readings.id });
    readingId = inserted[0]!.id;
  } catch (err) {
    return NextResponse.json(
      { error: 'persistence_failed', detail: (err as Error).message },
      { status: 500 },
    );
  }

  // Inference log row (one per call cluster — vision+reasoning+filter aggregated)
  await db()
    .insert(schema.inferenceLog)
    .values({
      readingId,
      ipHash,
      model: `${result.meta.models.vision}+${result.meta.models.reasoning}+${result.meta.models.filter}`,
      costUsd: result.meta.totalCostUsd.toFixed(4),
      latencyMs: result.meta.totalLatencyMs,
      promptId: 'report_render',
      promptVersion: result.meta.promptVersions.report_render ?? 'v1.0.0',
      status: 'ok',
    });

  await recordSpend({ userKey, costUsd: result.meta.totalCostUsd });

  return NextResponse.json({
    readingId,
    redirectTo: `/report/${readingId}`,
    costUsd: result.meta.totalCostUsd,
    latencyMs: result.meta.totalLatencyMs,
  });
}

// Convenience for clients/tests: GET returns whether live AI is configured.
export async function GET() {
  return NextResponse.json({
    liveAi: hasLiveAi(),
    db: Boolean(process.env.DATABASE_URL),
    blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    upstash: Boolean(process.env.UPSTASH_REDIS_REST_URL),
  });
}

// Suppress unused-import warning for `eq` (kept for future where filter logic adds a lookup)
void eq;
