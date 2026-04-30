// Cost tracking + circuit breaker.
// Every AI call should be wrapped so spend is logged and per-user / system caps
// are enforced. See /docs/trd.md §3 (Cost guards) and §11 (Failure modes).

import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

const PER_USER_DAILY_CAP_USD = Number(process.env.PER_USER_DAILY_CAP_USD ?? '5');
const MONTHLY_COST_CAP_USD = Number(process.env.MONTHLY_COST_CAP_USD ?? '500');

function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD UTC
}
function monthKey(d = new Date()): string {
  return d.toISOString().slice(0, 7); // YYYY-MM UTC
}

export interface CostCheckResult {
  ok: boolean;
  reason?: 'per-user-daily-exceeded' | 'system-monthly-exceeded';
  /** Current accumulated spend for the relevant scope (USD). */
  currentSpendUsd: number;
}

/**
 * Pre-flight check before issuing an AI call. Reads (does not increment) the
 * per-user-day and system-month counters; returns whether the call should
 * proceed.
 */
export async function checkBudget(args: {
  userKey: string; // userId or ipHash
}): Promise<CostCheckResult> {
  const r = getRedis();
  if (!r) {
    return { ok: true, currentSpendUsd: 0 };
  }
  const userDay = `cost:user:${args.userKey}:${dayKey()}`;
  const sysMonth = `cost:sys:${monthKey()}`;
  const [userSpend, sysSpend] = await Promise.all([
    r.get<number>(userDay),
    r.get<number>(sysMonth),
  ]);
  if ((userSpend ?? 0) >= PER_USER_DAILY_CAP_USD) {
    return {
      ok: false,
      reason: 'per-user-daily-exceeded',
      currentSpendUsd: userSpend ?? 0,
    };
  }
  if ((sysSpend ?? 0) >= MONTHLY_COST_CAP_USD) {
    return {
      ok: false,
      reason: 'system-monthly-exceeded',
      currentSpendUsd: sysSpend ?? 0,
    };
  }
  return { ok: true, currentSpendUsd: userSpend ?? 0 };
}

/** Increment counters after a successful (or filtered) AI call. */
export async function recordSpend(args: { userKey: string; costUsd: number }): Promise<void> {
  const r = getRedis();
  if (!r) return;
  const userDay = `cost:user:${args.userKey}:${dayKey()}`;
  const sysMonth = `cost:sys:${monthKey()}`;
  // Upstash incrbyfloat works for fractional dollar amounts.
  await Promise.all([
    r.incrbyfloat(userDay, args.costUsd),
    r.expire(userDay, 60 * 60 * 24 * 2),
    r.incrbyfloat(sysMonth, args.costUsd),
    r.expire(sysMonth, 60 * 60 * 24 * 35),
  ]);
}

/** Per-token costs (USD per 1M tokens). Mirrors /docs/trd.md §3 model table. */
export const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'claude-sonnet-4-6': { input: 3.0, output: 15.0 },
  'claude-opus-4-7': { input: 15.0, output: 75.0 },
  'claude-haiku-4-5-20251001': { input: 0.8, output: 4.0 },
  'gpt-4o': { input: 2.5, output: 10.0 },
  'gemini-1.5-pro': { input: 1.25, output: 5.0 },
};

export function estimateCostUsd(args: {
  model: string;
  inputTokens: number;
  outputTokens: number;
}): number {
  const p = MODEL_PRICING[args.model];
  if (!p) return 0;
  return (args.inputTokens / 1_000_000) * p.input + (args.outputTokens / 1_000_000) * p.output;
}
