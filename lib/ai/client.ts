// Anthropic + fallback client wiring. Lazy-instantiated so the module imports
// cleanly without ANTHROPIC_API_KEY (build-time, preview without env).

import { createAnthropic } from '@ai-sdk/anthropic';

export const MODELS = {
  vision: 'claude-sonnet-4-6',
  reasoning: 'claude-opus-4-7',
  filter: 'claude-haiku-4-5-20251001',
  fallbackVision: 'gpt-4o',
  fallbackReasoning: 'claude-sonnet-4-6',
  fallbackReasoningTier2: 'gemini-1.5-pro',
} as const;

export type ModelRole = keyof typeof MODELS;

let _anthropic: ReturnType<typeof createAnthropic> | null = null;

export function anthropic() {
  if (_anthropic) return _anthropic;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Live inference requires Anthropic credentials in .env.local.',
    );
  }
  _anthropic = createAnthropic({ apiKey });
  return _anthropic;
}

export function hasLiveAi(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
