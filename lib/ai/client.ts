// AI provider client. Primary: Groq (Llama 3.2 90B Vision + Llama 3.3 70B).
// Free tier; no card required at console.groq.com. Anthropic + Google kept as
// fallback wiring points. Lazy-instantiated so the module imports cleanly
// without keys (build-time, preview without env).

import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import type { LanguageModelV1 } from 'ai';

export const MODELS = {
  // Groq Llama 4 Scout 17B: multimodal — small JSON observations.
  vision: 'meta-llama/llama-4-scout-17b-16e-instruct',
  // Groq Llama 3.3 70B Versatile: text-only reasoning, strong at structured JSON.
  reasoning: 'llama-3.3-70b-versatile',
  // Groq Llama 3.1 8B Instant: cheap text-only judge if we re-enable LLM filter.
  filter: 'llama-3.1-8b-instant',
  // Chat companion text model — same family as reasoning so the voice
  // composes naturally on top of the report.
  chat: 'llama-3.3-70b-versatile',
  // OpenRouter route used when Groq quota is exhausted; the trailing `:free`
  // hits OpenRouter's free Llama tier.
  chatFallback: 'meta-llama/llama-3.3-70b-instruct:free',
  // retained for fallback wiring; inactive while Groq is primary
  fallbackReasoning: 'gemini-2.0-flash',
} as const;

export type ModelRole = keyof typeof MODELS;

let _groq: ReturnType<typeof createGroq> | null = null;
let _openrouter: ReturnType<typeof createOpenAI> | null = null;
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

/** OpenRouter (OpenAI-compatible). Used as a chat fallback when Groq's free
 *  tier is exhausted or the service is degraded. Free Llama tier route below. */
export function openrouter() {
  if (_openrouter) return _openrouter;
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      'OPENROUTER_API_KEY is not set. Chat fallback requires credentials in .env.local.',
    );
  }
  _openrouter = createOpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    headers: {
      // Per OpenRouter best practices — helps them attribute traffic.
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
      'X-Title': 'Praxa',
    },
  });
  return _openrouter;
}

export function hasLiveAi(): boolean {
  return Boolean(
    process.env.GROQ_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.ANTHROPIC_API_KEY,
  );
}

export interface ChatProviderChoice {
  /** Identifier used for logging + telemetry; not user-visible. */
  providerId: 'groq' | 'openrouter';
  /** The configured Vercel AI SDK LanguageModel ready to pass to streamText. */
  model: LanguageModelV1;
  /** Human-readable model name (matches MODELS table). */
  modelName: string;
}

/**
 * Try chat providers in order, returning the first one whose API key is
 * configured. Caller is responsible for catching runtime errors (rate-limit,
 * outage) and re-invoking with `skip` to fall through.
 */
export function chooseChatProvider(
  skip: ChatProviderChoice['providerId'][] = [],
): ChatProviderChoice | null {
  if (!skip.includes('groq') && process.env.GROQ_API_KEY) {
    return {
      providerId: 'groq',
      model: groq()(MODELS.chat),
      modelName: MODELS.chat,
    };
  }
  if (!skip.includes('openrouter') && process.env.OPENROUTER_API_KEY) {
    return {
      providerId: 'openrouter',
      model: openrouter()(MODELS.chatFallback),
      modelName: MODELS.chatFallback,
    };
  }
  return null;
}
