// AI provider client. Primary: Groq (Llama 3.2 90B Vision + Llama 3.3 70B).
// Free tier; no card required at console.groq.com. Anthropic + Google kept as
// fallback wiring points. Lazy-instantiated so the module imports cleanly
// without keys (build-time, preview without env).

import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';

export const MODELS = {
  // Groq Llama 4 Scout 17B: multimodal — small JSON observations.
  vision: 'meta-llama/llama-4-scout-17b-16e-instruct',
  // Groq Llama 3.3 70B Versatile: text-only reasoning, strong at structured JSON.
  reasoning: 'llama-3.3-70b-versatile',
  // Groq Llama 3.1 8B Instant: cheap text-only judge if we re-enable LLM filter.
  filter: 'llama-3.1-8b-instant',
  // retained for fallback wiring; inactive while Groq is primary
  fallbackReasoning: 'gemini-2.0-flash',
} as const;

export type ModelRole = keyof typeof MODELS;

let _groq: ReturnType<typeof createGroq> | null = null;
let _google: ReturnType<typeof createGoogleGenerativeAI> | null = null;
let _anthropic: ReturnType<typeof createAnthropic> | null = null;

export function groq() {
  if (_groq) return _groq;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GROQ_API_KEY is not set. Live inference requires Groq credentials in .env.local.',
    );
  }
  _groq = createGroq({ apiKey });
  return _groq;
}

export function google() {
  if (_google) return _google;
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GOOGLE_GENERATIVE_AI_API_KEY is not set. Google fallback requires credentials in .env.local.',
    );
  }
  _google = createGoogleGenerativeAI({ apiKey });
  return _google;
}

export function anthropic() {
  if (_anthropic) return _anthropic;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Anthropic fallback requires credentials in .env.local.',
    );
  }
  _anthropic = createAnthropic({ apiKey });
  return _anthropic;
}

export function hasLiveAi(): boolean {
  return Boolean(
    process.env.GROQ_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.ANTHROPIC_API_KEY,
  );
}
