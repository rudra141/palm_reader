// Reasoning pass — Llama 3.3 70B Versatile (text) with `generateObject` so
// the model is constrained to ReportSchema by the SDK's JSON-mode wiring.
// Input: SimpleVisionResult.description (prose) + RAG-augmented system prompt.

import { generateObject } from 'ai';
import { groq, MODELS } from './client';
import { composeReportPrompts, PROMPT_IDS } from './prompts';
import { getTradition } from './traditions';
import { getResearchBlock } from './researchRag';
import { ReportSchema, REQUIRED_DISCLAIMERS, type Report } from '@/lib/validation/reportSchema';
import type { SubStyleId, ClientContext } from '@/lib/validation/inputSchemas';
import type { SimpleVisionResult } from '@/lib/validation/visionSchema';
import { estimateCostUsd } from './costTracker';

export interface ReasoningPassInput {
  visionObservation: SimpleVisionResult;
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

export async function runReasoningPass(input: ReasoningPassInput): Promise<ReasoningPassResult> {
  if (input.visionObservation.valid_palm_image === false) {
    // Caller (runInference) already short-circuits this case; defensive guard.
    throw new Error('reasoning_pass_called_with_invalid_image');
  }

  const meta = getTradition(input.subStyle);
  const researchBlock = getResearchBlock(input.subStyle);
  const { system, user } = composeReportPrompts({
    meta,
    subStyleId: input.subStyle,
    visionJson: { description: input.visionObservation.description },
    clientContext: input.clientContext,
    researchBlock,
  });

  const start = Date.now();
  const modelUsed: string = MODELS.reasoning;

  const result = await generateObject({
    model: groq()(MODELS.reasoning),
    schema: ReportSchema,
    system,
    temperature: 0.4,
    maxTokens: 4500,
    messages: [{ role: 'user', content: user }],
  });

  // Belt-and-braces: stamp the canonical disclaimer strings on top of whatever
  // the model produced. The schema requires verbatim-match strings; even with
  // structured output, models occasionally paraphrase.
  const stamped = stampDisclaimers(result.object);
  const report = ReportSchema.parse(stamped);

  const latencyMs = Date.now() - start;
  const costUsd = estimateCostUsd({
    model: modelUsed,
    inputTokens: result.usage?.promptTokens ?? 0,
    outputTokens: result.usage?.completionTokens ?? 0,
  });

  return {
    report,
    model: modelUsed,
    promptVersion: PROMPT_IDS.report_render.version,
    costUsd,
    latencyMs,
    retried: false,
    fellBack: false,
  };
}

function stampDisclaimers(json: Report): Report {
  return {
    ...json,
    disclaimers: {
      entertainment: REQUIRED_DISCLAIMERS.entertainment,
      not_professional_advice: REQUIRED_DISCLAIMERS.not_professional_advice,
      health: REQUIRED_DISCLAIMERS.health,
    },
    health_indications: {
      ...json.health_indications,
      mandatory_disclaimer: REQUIRED_DISCLAIMERS.health,
    },
  };
}
