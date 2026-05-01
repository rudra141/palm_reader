// Upstash sliding-window rate limiter. Lazy-init so the module imports cleanly
// even when UPSTASH_REDIS_REST_URL is absent (build/preview without env).

import { Ratelimit } from '@upstash/ratelimit';
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

export interface LimitConfig {
  /** Stable identifier — e.g. 'upload', 'analyze', 'report:get'. */
  prefix: string;
  /** Window size + max requests, e.g. 'sliding-1h-5'. */
  requests: number;
  /** Window length: '1 m' | '1 h' | '1 d' (Upstash duration). */
  window: '1 m' | '1 h' | '1 d';
}

export const LIMIT_UPLOAD_PER_IP_HOUR: LimitConfig = {
  prefix: 'rl:upload:ip:hour',
  requests: 10,
  window: '1 h',
};
export const LIMIT_UPLOAD_PER_IP_DAY: LimitConfig = {
  prefix: 'rl:upload:ip:day',
  requests: 30,
  window: '1 d',
};
export const LIMIT_ANALYZE_PER_IP_HOUR: LimitConfig = {
  prefix: 'rl:analyze:ip:hour',
  requests: 5,
  window: '1 h',
};
export const LIMIT_ANALYZE_PER_IP_DAY: LimitConfig = {
  prefix: 'rl:analyze:ip:day',
  requests: 10,
  window: '1 d',
};
export const LIMIT_ANALYZE_PER_USER_DAY: LimitConfig = {
  prefix: 'rl:analyze:user:day',
  requests: 5,
  window: '1 d',
};

/**
 * Check a rate limit. Without Upstash creds the limiter is bypassed (returns
 * { success: true }) so local dev + preview deploys don't 429 themselves.
 */
export async function checkRateLimit(
  config: LimitConfig,
  identifier: string,
): Promise<{ success: boolean; remaining: number; reset: number }> {
  // Dev-mode bypass: local iteration would otherwise burn through the prod
  // limits in minutes. Only honored when NODE_ENV !== 'production'.
  if (process.env.NODE_ENV !== 'production') {
    return { success: true, remaining: Infinity, reset: 0 };
  }
  const r = getRedis();
  if (!r) {
    // Preview without Upstash — bypass the limiter explicitly.
    return { success: true, remaining: Infinity, reset: 0 };
  }
  const limiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    analytics: true,
    prefix: config.prefix,
  });
  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
