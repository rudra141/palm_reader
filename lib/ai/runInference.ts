// Inference orchestrator (RAG + 2-call mode).
//
// Pipeline:
//   A. visionPass    — Llama 4 Scout (multimodal) → VisionObservation JSON
//   B. reasoningPass — Llama 3.3 70B Versatile (text, RAG-augmented) → Report
//   C. regex-only filter — regexScanReport. No LLM judge call (saves quota).
//
// Persistence + cost recording is the route's job.

import { runVisionPass } from './visionPass';
import { runReasoningPass } from './reasoningPass';
import { regexScanReport } from '@/lib/validation/filterSchema';
import type { ClientContext, SubStyleId } from '@/lib/validation/inputSchemas';
import type { Report } from '@/lib/validation/reportSchema';
import { PROMPT_IDS } from './prompts';

export interface InferenceInput {
  imageBytes: Uint8Array;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  clientContext: ClientContext;
  subStyle: SubStyleId;
}

export type InferenceResult =
  | {
      ok: true;
      report: Report;
      meta: {
        models: { vision: string; reasoning: string; filter: string };
        promptVersions: Record<string, string>;
        totalCostUsd: number;
        totalLatencyMs: number;
      };
    }
  | {
      ok: false;
      reason:
        | 'invalid_palm_image'
        | 'vision_parse_failed'
        | 'reasoning_parse_failed'
        | 'filter_rejected';
      detail: string;
      partialCostUsd: number;
    };

export async function runInference(input: InferenceInput): Promise<InferenceResult> {
  // ── Step A: Vision ──────────────────────────────────────────────────────
  let visionResult;
  try {
    visionResult = await runVisionPass({
      imageBytes: input.imageBytes,
      mimeType: input.mimeType,
    });
  } catch (err) {
    return {
      ok: false,
      reason: 'vision_parse_failed',
      detail: (err as Error).message,
      partialCostUsd: 0,
    };
  }
  if (visionResult.observation.valid_palm_image === false) {
    return {
      ok: false,
      reason: 'invalid_palm_image',
      detail: visionResult.observation.reason,
      partialCostUsd: visionResult.costUsd,
    };
  }

  // ── Step B: Reasoning ───────────────────────────────────────────────────
  let reasoningResult;
  try {
    reasoningResult = await runReasoningPass({
      visionObservation: visionResult.observation,
      clientContext: input.clientContext,
      subStyle: input.subStyle,
    });
  } catch (err) {
    return {
      ok: false,
      reason: 'reasoning_parse_failed',
      detail: (err as Error).message,
      partialCostUsd: visionResult.costUsd,
    };
  }

  // ── Step C: Regex-only filter ───────────────────────────────────────────
  const regexHits = regexScanReport(reasoningResult.report);
  if (regexHits.length > 0) {
    return {
      ok: false,
      reason: 'filter_rejected',
      detail: `regex pre-pass fired: ${regexHits.join(', ')}`,
      partialCostUsd: visionResult.costUsd + reasoningResult.costUsd,
    };
  }

  // Stamp meta on the report we return.
  const report: Report = {
    ...reasoningResult.report,
    meta: {
      ...reasoningResult.report.meta,
      model_versions: {
        vision: visionResult.model,
        reasoning: reasoningResult.model,
      },
      prompt_versions: {
        vision_observe: visionResult.promptVersion,
        report_render: reasoningResult.promptVersion,
        output_filter_judge: PROMPT_IDS.output_filter_judge.version,
      },
      generated_at: new Date().toISOString(),
    },
  };

  return {
    ok: true,
    report,
    meta: {
      models: {
        vision: visionResult.model,
        reasoning: reasoningResult.model,
        filter: 'regex',
      },
      promptVersions: report.meta.prompt_versions,
      totalCostUsd: visionResult.costUsd + reasoningResult.costUsd,
      totalLatencyMs: visionResult.latencyMs + reasoningResult.latencyMs,
    },
  };
}
