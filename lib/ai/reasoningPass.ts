// Reasoning pass — writes the report prose, constrained to ReportSchema via
// `generateObject`. Runs the all-free provider chain (Gemini 2.5 Flash → 2.0
// Flash → Groq GPT OSS 120B → Groq Llama 3.3 70B); on rate-limit / availability
// / generation errors it falls over to the next free model so a throttled tier
// never breaks a reading.
// Input: SimpleVisionResult.description (prose) + RAG-augmented system prompt.

import { inferenceProviders } from './client';
import { generateObjectWithFallback } from './fallback';
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

  const result = await generateObjectWithFallback({
    attempts: inferenceProviders('reasoning'),
    schema: ReportSchema,
    system,
    temperature: 0.4,
    // Headroom for the full 13-section report. Gemini 2.5 "thinking" tokens count
    // against maxTokens and were truncating the JSON (finishReason: length), so we
    // disable thinking below to give the whole budget to output.
    maxTokens: 6000,
    messages: [{ role: 'user', content: user }],
    // Gemini-only: turn off the thinking budget so structured output isn't
    // starved. Ignored by Groq/other providers.
    providerOptions: { google: { thinkingConfig: { thinkingBudget: 0 } } },
  });

  // Belt-and-braces: stamp the canonical disclaimer strings on top of whatever
  // the model produced. The schema requires verbatim-match strings; even with
  // structured output, models occasionally paraphrase.
  const stamped = stampDisclaimers(result.object);
  const report = ReportSchema.parse(stamped);

  const latencyMs = Date.now() - start;
  const costUsd = estimateCostUsd({
    model: result.modelName,
    inputTokens: result.usage.promptTokens,
    outputTokens: result.usage.completionTokens,
  });

  return {
    report,
    model: result.modelName,
    promptVersion: PROMPT_IDS.report_render.version,
    costUsd,
    latencyMs,
    retried: result.retried,
    fellBack: result.fellBack,
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
