// Zod schema for the AI-generated Report output.
// See /docs/ai-spec.md §2 (Outputs produced) for full contract.

import { z } from 'zod';
import { SUB_STYLE_IDS } from './inputSchemas';

/** Required disclaimer strings — verbatim per /docs/ai-spec.md §6. */
export const REQUIRED_DISCLAIMERS = {
  entertainment:
    'This reading is offered for entertainment and reflection. It is one practitioner’s view through one tradition, not a verdict on your life.',
  not_professional_advice:
    'Nothing here is medical, legal, financial, or professional advice. For decisions that matter, consult someone qualified in that domain.',
  health:
    'The following are traditional textual associations between hand markers and constitutional tendencies — they are not medical diagnoses and not a substitute for professional medical care. If anything here concerns you, please speak with a qualified clinician.',
} as const;

const Citations = z.array(z.string().min(1)).min(1, 'every section needs at least one citation');

const SectionWithBody = z.object({
  body: z.string().min(40),
  claim_citations: Citations,
});

const KeyObservationsSection = SectionWithBody.extend({
  key_observations: z.array(z.string()).min(1),
});

const HealthSection = SectionWithBody.extend({
  mandatory_disclaimer: z.literal(REQUIRED_DISCLAIMERS.health),
});

const TrajectorySection = SectionWithBody.extend({
  timing_phrasing: z.literal('qualitative_only'),
});

const Refusal = z.object({
  requested_topic: z.string().min(1),
  refusal_text: z.string().min(1),
});

export const ReportSchema = z.object({
  meta: z.object({
    tradition: z.enum(['indian', 'chinese']),
    sub_style: z.enum(SUB_STYLE_IDS),
    model_versions: z.object({
      vision: z.string().min(1),
      reasoning: z.string().min(1),
    }),
    prompt_versions: z.record(z.string(), z.string()),
    generated_at: z.string().datetime(),
  }),
  opening: z.object({
    hand_impression: z.string().min(20),
    life_essence_summary: z.string().min(40),
    claim_citations: Citations,
  }),
  character_personality: KeyObservationsSection,
  mind_intellect: SectionWithBody,
  emotional_relationships: SectionWithBody,
  career_profession: SectionWithBody,
  wealth_material: SectionWithBody,
  health_indications: HealthSection,
  life_trajectory_timing: TrajectorySection,
  /** Only present if the active sub-style's karmic_supported flag is true (or partial). */
  spiritual_inclinations: SectionWithBody.optional(),
  strengths_to_leverage: SectionWithBody,
  areas_to_be_mindful_of: SectionWithBody,
  closing: SectionWithBody,
  disclaimers: z.object({
    entertainment: z.literal(REQUIRED_DISCLAIMERS.entertainment),
    not_professional_advice: z.literal(REQUIRED_DISCLAIMERS.not_professional_advice),
    health: z.literal(REQUIRED_DISCLAIMERS.health),
  }),
  refusals: z.array(Refusal).optional(),
});

export type Report = z.infer<typeof ReportSchema>;
