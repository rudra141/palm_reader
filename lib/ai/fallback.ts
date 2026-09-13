// Provider-failover wrapper around the AI SDK's `generateObject`.
//
// Why: the inference passes run on free tiers — Groq (TPM-capped), Google AI
// Studio (per-model daily/RPM caps + thinking-token truncation on 2.5 models).
// Any one of these can fail a given call (429, NoObjectGenerated/length, schema
// miss). This helper tries each configured model in order and, because the whole
// chain is free, falls over to the next model on ANY error — only surfacing the
// failure if the last model in the chain also fails. Each fallback is logged so
// degraded readings are visible in server logs.

import { generateObject, type CoreMessage, type JSONValue } from 'ai';
import type { z } from 'zod';
import type { ProviderAttempt } from './client';

export interface FallbackResult<T> {
  object: T;
  usage: { promptTokens: number; completionTokens: number };
  providerId: ProviderAttempt['providerId'];
  modelName: string;
  /** True if a provider after the primary served the request. */
  fellBack: boolean;
  /** True if a fallback was engaged (primary did not serve). */
  retried: boolean;
}

function errLabel(err: unknown): string {
  const e = err as { name?: string; statusCode?: number; message?: string };
  const status = e?.statusCode ? ` ${e.statusCode}` : '';
  return `${e?.name ?? 'Error'}${status}: ${String(e?.message ?? '').slice(0, 160)}`;
}

export async function generateObjectWithFallback<T>(opts: {
  attempts: ProviderAttempt[];
  schema: z.ZodType<T>;
  system: string;
  messages: CoreMessage[];
  temperature?: number;
  maxTokens?: number;
  /** Per-provider SDK retry count (intra-provider, before falling over). */
  maxRetries?: number;
  /** Provider-specific options, passed straight through to generateObject.
   *  Unknown provider keys are ignored by providers that don't use them — e.g.
   *  `{ google: { thinkingConfig: { thinkingBudget: 0 } } }` only affects Gemini. */
  providerOptions?: Record<string, Record<string, JSONValue>>;
}): Promise<FallbackResult<T>> {
  if (opts.attempts.length === 0) {
    throw new Error(
      'No AI providers configured. Set GROQ_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, or ANTHROPIC_API_KEY in .env.local.',
    );
  }

  let lastErr: unknown;
  for (let i = 0; i < opts.attempts.length; i++) {
    const attempt = opts.attempts[i];
    if (!attempt) continue;
    const isLast = i === opts.attempts.length - 1;
    try {
      const result = await generateObject({
        model: attempt.model,
        schema: opts.schema,
        system: opts.system,
        messages: opts.messages,
        temperature: opts.temperature,
        // Per-model override (e.g. Groq GPT OSS 8k TPM) wins over the caller default.
        maxTokens: attempt.maxTokens ?? opts.maxTokens,
        maxRetries: opts.maxRetries ?? 2,
        providerOptions: opts.providerOptions,
      });
      return {
        object: result.object,
        usage: {
          promptTokens: result.usage?.promptTokens ?? 0,
          completionTokens: result.usage?.completionTokens ?? 0,
        },
        providerId: attempt.providerId,
        modelName: attempt.modelName,
        fellBack: i > 0,
        retried: i > 0,
      };
    } catch (err) {
      lastErr = err;
      // Whole chain is free → fall over on ANY error; only surface if last.
      if (isLast) throw err;
      console.warn(
        `[ai-fallback] ${attempt.providerId}:${attempt.modelName} failed (${errLabel(err)}) — trying next model`,
      );
    }
  }

  // Unreachable: the last iteration either returns or throws.
  throw lastErr;
}
