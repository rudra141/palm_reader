// OutputFilterVerdict Zod schema — output of /lib/ai/outputFilter.
// Mirrors the JSON shape produced by the `output_filter_judge` prompt.
// See /docs/prompts.md and /docs/ai-spec.md §11.

import { z } from 'zod';

export const OutputFilterVerdictSchema = z.object({
  verdict: z.enum(['pass', 'filter', 'human_review']),
  scores: z.object({
    disclaimer_presence: z.union([z.literal(0), z.literal(1)]),
    disallowed_claims: z.union([z.literal(0), z.literal(1)]),
    citation_density: z.number().min(0).max(1),
    cross_tradition_contamination: z.union([z.literal(0), z.literal(1)]),
    vocabulary_lock: z.union([z.literal(0), z.literal(1)]),
    tone_master_practitioner: z.number().min(1).max(5),
    refusal_handling: z.union([z.literal(0), z.literal(1)]),
  }),
  blocking_failures: z.array(
    z.enum([
      'disclaimer_presence',
      'disallowed_claims',
      'cross_tradition_contamination',
      'vocabulary_lock',
    ]),
  ),
  notes: z.string().default(''),
});

export type OutputFilterVerdict = z.infer<typeof OutputFilterVerdictSchema>;

/** Forbidden phrasing regex catalog. Pre-LLM sanity pass. */
export const FORBIDDEN_PATTERNS: Array<{ id: string; pattern: RegExp }> = [
  { id: 'death_prediction', pattern: /\byou will die\b|\byour death\b|by\s+\d{4}\s+you will/i },
  { id: 'exact_year_death', pattern: /\bin\s+(19|20|21)\d{2}\s+you (?:will|may)\s+die\b/i },
  {
    id: 'medical_diagnosis_verb',
    pattern:
      /\bI diagnose\b|\byou have (?:diabetes|cancer|covid|alzheimer|tuberculosis|asthma|heart disease)\b/i,
  },
  { id: 'guarantee', pattern: /\b(?:definitely|guaranteed|100%)\s+(?:will|chance)\b/i },
  { id: 'gambling_advice', pattern: /\b(?:lottery|stock|investment recommendation|bet on)\b/i },
  { id: 'past_life_named', pattern: /\bin your past life you were\s+[A-Z][a-z]+/i },
  {
    id: 'system_prompt_leak',
    pattern: /system_prompt|<\/?system>|ignore\s+(?:all|previous)\s+instructions?/i,
  },
];

/**
 * Quick pre-judge regex scan. Returns the list of patterns that fired, if any.
 * Cheaper than the LLM-as-judge step.
 */
export function regexScanReport(reportJson: unknown): string[] {
  const json = JSON.stringify(reportJson).toLowerCase();
  return FORBIDDEN_PATTERNS.filter(({ pattern }) => pattern.test(json)).map(({ id }) => id);
}
