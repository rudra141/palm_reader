// AI client + cost-tracking middleware.
// Implementation lands in Phase 4 (CP3). This file is a placeholder so that
// /lib/ai is reserved as the only place model calls are made — never inline
// in routes or components.
//
// See /docs/trd.md §2 (Inference pipeline) and §3 (AI infrastructure).

export const MODELS = {
  vision: 'claude-sonnet-4-6',
  reasoning: 'claude-opus-4-7',
  filter: 'claude-haiku-4-5-20251001',
  fallbackVision: 'gpt-4o',
  fallbackReasoning: 'claude-sonnet-4-6',
  fallbackReasoningTier2: 'gemini-1.5-pro',
} as const;

export type ModelRole = keyof typeof MODELS;

/** Phase 4 will export `inferVision`, `inferReasoning`, `judgeOutput` from here.
 *  All exports route through the cost-tracking + circuit-breaker middleware. */
export const __PLACEHOLDER__ = true;
