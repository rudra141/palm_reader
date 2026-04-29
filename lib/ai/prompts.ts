// Prompt registry — typed exports of every prompt referenced in /docs/prompts.md.
// At Phase 4, these will be assembled from the markdown source at build time.
// For now they're declared as IDs so call sites can be wired without inlining.
//
// See /docs/prompts.md for the full prompt text + template variables.

export const PROMPT_IDS = {
  vision_observe: { id: 'vision_observe', version: 'v1.0.0' },
  report_render: { id: 'report_render', version: 'v1.0.0' },
  output_filter_judge: { id: 'output_filter_judge', version: 'v1.0.0' },
  reading_refusal: { id: 'reading_refusal', version: 'v1.0.0' },
  correction_retry: { id: 'correction_retry', version: 'v1.0.0' },
} as const;

export type PromptId = keyof typeof PROMPT_IDS;
