// Unified pass — single multimodal Gemini call that collapses vision +
// reasoning into one inference. Cuts quota burn from 3 LLM calls per reading
// to 1; pairs with regex-only output filter (no LLM judge).
//
// Returns a Zod-parsed Report on success, or signals invalid_palm_image.
// Retries once on Zod-parse failure with the corrective prompt.

import { generateText } from 'ai';
import type { ZodError } from 'zod';
import { groq, MODELS } from './client';
import { composeUnifiedPrompts, PROMPT_IDS, buildCorrectionRetry } from './prompts';
import { getTradition } from './traditions';
import { getResearchBlock } from './researchRag';
import { ReportSchema, REQUIRED_DISCLAIMERS, type Report } from '@/lib/validation/reportSchema';
import type { SubStyleId, ClientContext } from '@/lib/validation/inputSchemas';
import { estimateCostUsd } from './costTracker';

export interface UnifiedPassInput {
  imageBytes: ArrayBuffer | Uint8Array;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  clientContext: ClientContext;
  subStyle: SubStyleId;
}

export type UnifiedPassResult =
  | {
      ok: true;
      report: Report;
      model: string;
      promptVersion: string;
      costUsd: number;
      latencyMs: number;
      retried: boolean;
    }
  | {
      ok: false;
      reason: 'invalid_palm_image';
      detail: string;
      costUsd: number;
      latencyMs: number;
    };

const STRIP_FENCES = /^```(?:json)?\n?|\n?```$/g;
const parseJson = (raw: string) => JSON.parse(raw.trim().replace(STRIP_FENCES, '').trim());

function formatZodErrors(err: ZodError): string {
  return err.issues.map((i) => `- ${i.path.join('.') || '<root>'}: ${i.message}`).join('\n');
}

function imageBuffer(bytes: ArrayBuffer | Uint8Array): Uint8Array {
  return bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
}

export async function runUnifiedPass(input: UnifiedPassInput): Promise<UnifiedPassResult> {
  const meta = getTradition(input.subStyle);
  const researchBlock = getResearchBlock(input.subStyle);
  const { system, user } = composeUnifiedPrompts({
    meta,
    subStyleId: input.subStyle,
    researchBlock,
    clientContext: input.clientContext,
  });

  const start = Date.now();
  let usage = { inputTokens: 0, outputTokens: 0 };

  // ── First attempt ───────────────────────────────────────────────────────
  let raw = await generateText({
    model: groq()(MODELS.reasoning),
    system,
    temperature: 0.4,
    maxTokens: 4000,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: user },
          { type: 'image', image: imageBuffer(input.imageBytes), mimeType: input.mimeType },
        ],
      },
    ],
  });
  usage = {
    inputTokens: raw.usage?.promptTokens ?? 0,
    outputTokens: raw.usage?.completionTokens ?? 0,
  };

  // Short-circuit: model declared the photo isn't a palm.
  const text = raw.text.trim();
  const earlyParse = tryParseInvalidImage(text);
  if (earlyParse) {
    const latencyMs = Date.now() - start;
    return {
      ok: false,
      reason: 'invalid_palm_image',
      detail: earlyParse.reason,
      costUsd: estimateCostUsd({
        model: MODELS.reasoning,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
      }),
      latencyMs,
    };
  }

  let report: Report | null = null;
  let retried = false;
  try {
    report = ReportSchema.parse(stampDisclaimers(parseJson(raw.text)));
  } catch (err) {
    retried = true;
    const correction = buildCorrectionRetry(formatZodErrors(err as ZodError));
    raw = await generateText({
      model: groq()(MODELS.reasoning),
      system,
      temperature: 0.1,
      maxTokens: 4000,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: user },
            { type: 'image', image: imageBuffer(input.imageBytes), mimeType: input.mimeType },
          ],
        },
        { role: 'assistant', content: raw.text },
        { role: 'user', content: correction },
      ],
    });
    usage = {
      inputTokens: usage.inputTokens + (raw.usage?.promptTokens ?? 0),
      outputTokens: usage.outputTokens + (raw.usage?.completionTokens ?? 0),
    };
    report = ReportSchema.parse(stampDisclaimers(parseJson(raw.text)));
  }

  const latencyMs = Date.now() - start;
  const costUsd = estimateCostUsd({
    model: MODELS.reasoning,
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
  });

  return {
    ok: true,
    report,
    model: MODELS.reasoning,
    promptVersion: PROMPT_IDS.unified_render.version,
    costUsd,
    latencyMs,
    retried,
  };
}

function tryParseInvalidImage(text: string): { reason: string } | null {
  const cleaned = text.replace(STRIP_FENCES, '').trim();
  // Cheap pre-check before JSON.parse — only attempt if it looks tiny + flagged.
  if (cleaned.length > 400 || !cleaned.includes('valid_palm_image')) return null;
  try {
    const j = JSON.parse(cleaned) as { valid_palm_image?: boolean; reason?: string };
    if (j.valid_palm_image === false) {
      return { reason: j.reason ?? 'image not recognized as a palm' };
    }
  } catch {
    /* fall through */
  }
  return null;
}

/**
 * Belt-and-braces — even if the model omits or perturbs disclaimer wording,
 * stamp the canonical strings so the schema parse + downstream regex filter
 * pass. The prompt already instructs verbatim-match.
 */
function stampDisclaimers(json: unknown): unknown {
  if (typeof json !== 'object' || json === null) return json;
  const obj = json as Record<string, unknown>;
  obj.disclaimers = {
    entertainment: REQUIRED_DISCLAIMERS.entertainment,
    not_professional_advice: REQUIRED_DISCLAIMERS.not_professional_advice,
    health: REQUIRED_DISCLAIMERS.health,
  };
  if (
    obj.health_indications &&
    typeof obj.health_indications === 'object' &&
    obj.health_indications !== null
  ) {
    (obj.health_indications as Record<string, unknown>).mandatory_disclaimer =
      REQUIRED_DISCLAIMERS.health;
  }
  return obj;
}
