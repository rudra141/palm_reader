// AI provider client. All-free inference chain (see `inferenceProviders`):
//   vision    → Groq Llama 4 Scout, then Gemini 2.5/2.0 Flash
//   reasoning → Gemini 2.5 Flash (premium free prose), then 2.0 Flash, then Groq Llama
// Every model in the chain runs on a free tier (Groq console + Google AI Studio).
// Note: Gemini 2.5 Pro is NOT free (AI Studio free-tier limit is 0 — needs
// Google Cloud billing), so it is deliberately excluded; 2.5 Flash is the best
// model that actually works free. Anthropic is wired but kept out of the chain
// (paid). Lazy-instantiated so the module imports cleanly without keys.

import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import type { LanguageModelV1 } from 'ai';

export const MODELS = {
  // Groq deprecated its Llama-4 Scout multimodal model (404s as of 2026-09) and
  // has no replacement vision model on the free tier — Gemini Flash is now the
  // only working vision provider (see INFERENCE_CHAIN). Kept here, unused, only
  // as a record of what broke; do not re-add to INFERENCE_CHAIN without
  // confirming a vision-capable model exists at console.groq.com/docs/models.
  vision: 'meta-llama/llama-4-scout-17b-16e-instruct',
  // Groq GPT OSS 120B: best free Groq reasoning model — frontier-adjacent prose.
  // Free tier is 8k TPM, so it needs a tighter maxTokens (set per-rung in
  // INFERENCE_CHAIN) to avoid 413 "request too large".
  reasoningGroq: 'openai/gpt-oss-120b',
  // Groq Llama 3.3 70B Versatile was retired (404) — GPT OSS 20B is the current
  // never-fails final safety net behind the better models.
  reasoning: 'openai/gpt-oss-20b',
  // Groq Llama 3.1 8B Instant was retired (404) — GPT OSS 20B doubles as the
  // cheap text-only judge if we re-enable the LLM filter.
  filter: 'openai/gpt-oss-20b',
  // Chat companion text model. Llama 3.3 70B was retired (404); GPT OSS 20B is
  // the current fast/cheap Groq text model.
  chat: 'openai/gpt-oss-20b',
  // OpenRouter route used when Groq quota is exhausted; the trailing `:free`
  // hits OpenRouter's free Llama tier.
  chatFallback: 'meta-llama/llama-3.3-70b-instruct:free',
  // Inference fallback chain — ALL FREE TIERS, no paid providers (see
  // INFERENCE_CHAIN for the exact order). Reasoning: Gemini 2.5 Flash → 2.0
  // Flash → Groq GPT OSS 120B → Groq Llama 3.3 70B. Vision: Groq Scout → Gemini.
  // Gemini 2.5/2.0 Flash are free on Google AI Studio (rate-capped).
  // gemini-2.5-pro is NOT free (AI Studio free-tier limit: 0 — needs Google
  // Cloud billing). Kept here for easy re-enable, but left out of INFERENCE_CHAIN.
  reasoningPro: 'gemini-2.5-pro',
  gemini25Flash: 'gemini-2.5-flash',
  gemini20Flash: 'gemini-2.0-flash',
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

export type InferenceRole = 'vision' | 'reasoning';

export interface ProviderAttempt {
  /** Identifier for logging + telemetry; not user-visible. */
  providerId: 'groq' | 'google' | 'anthropic';
  /** Model name (matches MODELS table + costTracker MODEL_PRICING). */
  modelName: string;
  /** Configured Vercel AI SDK LanguageModel ready for generateObject. */
  model: LanguageModelV1;
  /** Per-model output cap. Overrides the caller's maxTokens — needed for models
   *  with a low TPM ceiling (e.g. Groq GPT OSS = 8k TPM) so the request fits. */
  maxTokens?: number;
}

type ChainProvider = ProviderAttempt['providerId'];

interface ChainEntry {
  providerId: ChainProvider;
  modelName: string;
  maxTokens?: number;
}

/**
 * Ordered, all-free fallback chains. The same provider may appear more than once
 * with different models (e.g. Gemini Flash then Groq). No paid providers.
 */
const INFERENCE_CHAIN: Record<InferenceRole, ReadonlyArray<ChainEntry>> = {
  // Vision only emits a neutral description, so quality matters less. Groq no
  // longer has a working free multimodal model (Llama 4 Scout was retired —
  // see MODELS.vision), so Gemini Flash is the whole chain for now.
  vision: [
    { providerId: 'google', modelName: MODELS.gemini25Flash },
    { providerId: 'google', modelName: MODELS.gemini20Flash },
  ],
  // Reasoning writes the prose. Lead with the best FREE model (Gemini 2.5 Flash;
  // Pro is paid-only on this account). Then Gemini 2.0 Flash. Then Groq GPT OSS
  // 120B — frontier-adjacent prose, capped at 3200 out so it fits Groq's 8k TPM.
  // GPT OSS 20B sits last as the never-fails safety net.
  reasoning: [
    { providerId: 'google', modelName: MODELS.gemini25Flash },
    { providerId: 'google', modelName: MODELS.gemini20Flash },
    { providerId: 'groq', modelName: MODELS.reasoningGroq, maxTokens: 3200 },
    { providerId: 'groq', modelName: MODELS.reasoning },
  ],
};

function isProviderKeyPresent(providerId: ChainProvider): boolean {
  switch (providerId) {
    case 'groq':
      return Boolean(process.env.GROQ_API_KEY);
    case 'google':
      return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    case 'anthropic':
      return Boolean(process.env.ANTHROPIC_API_KEY);
  }
}

function modelFor(providerId: ChainProvider, modelName: string): LanguageModelV1 {
  switch (providerId) {
    case 'groq':
      return groq()(modelName);
    case 'google':
      // structuredOutputs:false — our vision schema discriminates on a boolean
      // literal (valid_palm_image: true|false), which Gemini's native
      // response_schema mode rejects ("Invalid value ... enum[0] TYPE_STRING,
      // false") because its OpenAPI schema dialect only allows string enums.
      // Falling back to prompt-based JSON mode avoids that incompatibility.
      return google()(modelName, { structuredOutputs: false });
    case 'anthropic':
      return anthropic()(modelName);
  }
}

/**
 * Ordered provider fallback chain for an inference role. Only entries whose
 * provider key is configured are included, so a throttled or unconfigured
 * provider never breaks the reading. Pass the result to
 * `generateObjectWithFallback`.
 */
export function inferenceProviders(role: InferenceRole): ProviderAttempt[] {
  return INFERENCE_CHAIN[role]
    .filter((entry) => isProviderKeyPresent(entry.providerId))
    .map((entry) => ({
      providerId: entry.providerId,
      modelName: entry.modelName,
      model: modelFor(entry.providerId, entry.modelName),
      maxTokens: entry.maxTokens,
    }));
}
