// Output filter — regex pre-pass + LLM-as-judge.
// Per /docs/ai-spec.md §11: any blocking-dimension failure → reject.

import { generateText } from 'ai';
import { google, MODELS } from './client';
import { OUTPUT_FILTER_JUDGE_SYSTEM, PROMPT_IDS } from './prompts';
import {
  OutputFilterVerdictSchema,
  regexScanReport,
  type OutputFilterVerdict,
} from '@/lib/validation/filterSchema';
import { estimateCostUsd } from './costTracker';
import type { Report } from '@/lib/validation/reportSchema';

export interface OutputFilterResult {
  verdict: OutputFilterVerdict;
  regexHits: string[];
  model: string;
  promptVersion: string;
  costUsd: number;
  latencyMs: number;
}

const STRIP_FENCES = /^```(?:json)?\n?|\n?```$/g;
const parseJson = (raw: string) => JSON.parse(raw.trim().replace(STRIP_FENCES, '').trim());

export async function runOutputFilter(report: Report): Promise<OutputFilterResult> {
  // Regex pre-pass — cheap, catches obvious leaks. Any hit short-circuits to filter.
  const regexHits = regexScanReport(report);
  if (regexHits.length > 0) {
    return {
      verdict: {
        verdict: 'filter',
        scores: {
          disclaimer_presence: 1,
          disallowed_claims: 0,
          citation_density: 1,
          cross_tradition_contamination: 1,
          vocabulary_lock: 1,
          tone_master_practitioner: 3,
          refusal_handling: 1,
        },
        blocking_failures: ['disallowed_claims'],
        notes: `regex pre-pass fired: ${regexHits.join(', ')}`,
      },
      regexHits,
      model: 'regex',
      promptVersion: 'n/a',
      costUsd: 0,
      latencyMs: 0,
    };
  }

  const start = Date.now();
  const raw = await generateText({
    model: google()(MODELS.filter),
    system: OUTPUT_FILTER_JUDGE_SYSTEM,
    temperature: 0,
    maxTokens: 600,
    messages: [
      {
        role: 'user',
        content: `Active tradition: ${report.meta.tradition} / ${report.meta.sub_style}

Report JSON to evaluate:
\`\`\`json
${JSON.stringify(report, null, 2)}
\`\`\`

Return your verdict JSON.`,
      },
    ],
  });

  const latencyMs = Date.now() - start;
  const verdict = OutputFilterVerdictSchema.parse(parseJson(raw.text));
  const costUsd = estimateCostUsd({
    model: MODELS.filter,
    inputTokens: raw.usage?.promptTokens ?? 0,
    outputTokens: raw.usage?.completionTokens ?? 0,
  });

  return {
    verdict,
    regexHits: [],
    model: MODELS.filter,
    promptVersion: PROMPT_IDS.output_filter_judge.version,
    costUsd,
    latencyMs,
  };
}
