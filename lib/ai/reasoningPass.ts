// Reasoning pass — Claude Opus 4.7 → Report JSON.
// Retry-on-Zod-fail once with corrective prompt; fallback chain to Sonnet 4.6
// (per /docs/trd.md §3 + §11). Output is Zod-parsed before return.

import { generateText } from 'ai';
import type { ZodError } from 'zod';
import { anthropic, MODELS } from './client';
import { composeReportPrompts, PROMPT_IDS, buildCorrectionRetry } from './prompts';
import { getTradition } from './traditions';
import { ReportSchema, REQUIRED_DISCLAIMERS, type Report } from '@/lib/validation/reportSchema';
import type { SubStyleId, ClientContext } from '@/lib/validation/inputSchemas';
import type { VisionObservation } from '@/lib/validation/visionSchema';
import { estimateCostUsd } from './costTracker';

export interface ReasoningPassInput {
  visionObservation: VisionObservation;
  clientContext: ClientContext;
  subStyle: SubStyleId;
}

export interface ReasoningPassResult {
  report: Report;
  model: string;
  promptVersion: string;
  costUsd: number;
  latencyMs: number;
  retried: boolean;
  fellBack: boolean;
}

const STRIP_FENCES = /^```(?:json)?\n?|\n?```$/g;
const parseJson = (raw: string) => JSON.parse(raw.trim().replace(STRIP_FENCES, '').trim());

function formatZodErrors(err: ZodError): string {
  return err.issues.map((i) => `- ${i.path.join('.') || '<root>'}: ${i.message}`).join('\n');
}

export async function runReasoningPass(input: ReasoningPassInput): Promise<ReasoningPassResult> {
  const meta = getTradition(input.subStyle);
  const { system, user } = composeReportPrompts({
    meta,
    subStyleId: input.subStyle,
    visionJson: input.visionObservation,
    clientContext: input.clientContext,
  });

  const start = Date.now();
  let usage = { inputTokens: 0, outputTokens: 0 };

  // First attempt — Opus 4.7 at temperature 0.3.
  let modelUsed: string = MODELS.reasoning;
  let raw = await generateText({
    model: anthropic()(MODELS.reasoning),
    system,
    temperature: 0.3,
    maxTokens: 3500,
    messages: [{ role: 'user', content: user }],
  });
  usage = {
    inputTokens: raw.usage?.promptTokens ?? 0,
    outputTokens: raw.usage?.completionTokens ?? 0,
  };

  let report: Report | null = null;
  let retried = false;
  try {
    report = ReportSchema.parse(stampDisclaimers(parseJson(raw.text)));
  } catch (err) {
    retried = true;
    const correction = buildCorrectionRetry(formatZodErrors(err as ZodError));
    raw = await generateText({
      model: anthropic()(MODELS.reasoning),
      system,
      temperature: 0.1,
      maxTokens: 3500,
      messages: [
        { role: 'user', content: user },
        { role: 'assistant', content: raw.text },
        { role: 'user', content: correction },
      ],
    });
    usage = {
      inputTokens: usage.inputTokens + (raw.usage?.promptTokens ?? 0),
      outputTokens: usage.outputTokens + (raw.usage?.completionTokens ?? 0),
    };
    try {
      report = ReportSchema.parse(stampDisclaimers(parseJson(raw.text)));
    } catch {
      // fall through to fallback
    }
  }

  let fellBack = false;
  if (!report) {
    fellBack = true;
    modelUsed = MODELS.fallbackReasoning;
    raw = await generateText({
      model: anthropic()(MODELS.fallbackReasoning),
      system,
      temperature: 0.2,
      maxTokens: 3500,
      messages: [{ role: 'user', content: user }],
    });
    usage = {
      inputTokens: usage.inputTokens + (raw.usage?.promptTokens ?? 0),
      outputTokens: usage.outputTokens + (raw.usage?.completionTokens ?? 0),
    };
    report = ReportSchema.parse(stampDisclaimers(parseJson(raw.text)));
  }

  const latencyMs = Date.now() - start;
  const costUsd = estimateCostUsd({
    model: modelUsed,
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
  });

  return {
    report,
    model: modelUsed,
    promptVersion: PROMPT_IDS.report_render.version,
    costUsd,
    latencyMs,
    retried,
    fellBack,
  };
}

/**
 * Defensive: even if the model omits or perturbs disclaimer wording, replace
 * with the canonical strings so the schema parse + downstream filter pass.
 * This is belt-and-braces; the prompt also instructs verbatim-match.
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
