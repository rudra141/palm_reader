// POST /api/quick-vision — runs JUST the vision pass on an already-uploaded
// blob URL. Used by /ask (direct chat consultation) where we don't generate
// the full 12-section report. Returns a free-text description the chat
// prompt can ground on.
//
// Boundaries:
//  1. Auth + rate-limit (per IP)
//  2. Cost circuit breaker (counts toward the user's daily budget)
//  3. Vision pass only — no reasoning pass, no filter, no DB write.

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { runVisionPass } from '@/lib/ai/visionPass';
import { hasLiveAi } from '@/lib/ai/client';
import {
  checkRateLimit,
  LIMIT_ANALYZE_PER_IP_HOUR,
  LIMIT_ANALYZE_PER_IP_DAY,
} from '@/lib/rate-limit';
import { checkBudget, recordSpend } from '@/lib/ai/costTracker';
import { hashIp, getIpFromHeaders } from '@/lib/utils/ipHash';

export const runtime = 'nodejs';
export const maxDuration = 30;

const QuickVisionRequestSchema = z.object({
  blobUrl: z.string().url(),
});

export async function POST(req: Request) {
  if (!hasLiveAi()) {
    return NextResponse.json(
      { error: 'ai_unconfigured', detail: 'GROQ_API_KEY required for vision.' },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = QuickVisionRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_input', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const ipHash = hashIp(getIpFromHeaders(req.headers));
  const userKey = ipHash;
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

  const blobResp = await fetch(parsed.data.blobUrl);
  if (!blobResp.ok) {
    return NextResponse.json({ error: 'blob_fetch_failed' }, { status: 502 });
  }
  const imageBytes = new Uint8Array(await blobResp.arrayBuffer());

  let visionResult;
  try {
    visionResult = await runVisionPass({ imageBytes, mimeType: 'image/jpeg' });
  } catch (err) {
    return NextResponse.json(
      { error: 'vision_failed', detail: (err as Error).message },
      { status: 502 },
    );
  }

  await recordSpend({ userKey, costUsd: visionResult.costUsd });

  if (visionResult.observation.valid_palm_image === false) {
    return NextResponse.json(
      {
        valid: false,
        reason: visionResult.observation.reason,
      },
      { status: 422 },
    );
  }

  return NextResponse.json({
    valid: true,
    description: visionResult.observation.description,
    model: visionResult.model,
    promptVersion: visionResult.promptVersion,
    costUsd: visionResult.costUsd,
    latencyMs: visionResult.latencyMs,
  });
}
