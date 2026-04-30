// VisionObservation Zod schema — output of /lib/ai/visionPass.
// Mirrors the JSON shape produced by the `vision_observe` prompt
// in /docs/prompts.md. Every observation has a confidence 0..1.

import { z } from 'zod';

const Confidence = z.number().min(0).max(1);

const Clarity = z.enum(['clear', 'moderate', 'faint', 'unclear']);
const MountStrength = z.enum(['prominent', 'moderate', 'flat', 'unclear']);
const FingerLength = z.enum(['short', 'medium', 'long']);
const FingerTip = z.enum(['square', 'conic', 'spatulate', 'pointed']);
const FingerKnots = z.enum(['none', 'first', 'both']);

const LineObservation = z.object({
  present: z.boolean(),
  clarity: Clarity.optional(),
  endpoint_radial: z.string().optional(),
  endpoint_ulnar: z.string().optional(),
  origin: z.string().optional(),
  termination: z.string().optional(),
  form: z.string().optional(),
  confidence: Confidence,
});

const Marker = z.object({
  marker: z.enum([
    'cross',
    'star',
    'square',
    'triangle',
    'island',
    'chain',
    'grille',
    'mystic_cross',
    'fish',
    'conch',
    'temple',
    'trident',
    'lotus',
    'flag',
    'yav',
  ]),
  location: z.string(),
  confidence: Confidence,
});

const HandShape = z.enum([
  'earth_square',
  'water_long',
  'fire_rectangular_long_fingers',
  'air_square_long_fingers',
]);

export const VisionObservationSchema = z.discriminatedUnion('valid_palm_image', [
  z.object({
    valid_palm_image: z.literal(false),
    reason: z.string().min(1),
  }),
  z.object({
    valid_palm_image: z.literal(true),
    image_quality: z.object({
      lighting: z.enum(['good', 'uneven', 'poor']),
      hand_visible: z.enum(['yes', 'partial', 'no']),
      focus: z.enum(['sharp', 'acceptable', 'blurry']),
    }),
    hand_shape_category: HandShape,
    skin_texture: z.enum(['soft', 'firm', 'rough', 'smooth']),
    finger_length_relative_to_palm: FingerLength,
    lines: z.object({
      heart: LineObservation,
      head: LineObservation,
      life: LineObservation,
      fate: LineObservation,
      sun: LineObservation,
      mercury: LineObservation,
      marriage_lines: z.object({
        count: z.number().int().min(0).max(10),
        clarity: Clarity.optional(),
        confidence: Confidence,
      }),
      bracelet_lines_count: z.number().int().min(0).max(5),
    }),
    mounts: z.object({
      jupiter: MountStrength,
      saturn: MountStrength,
      apollo: MountStrength,
      mercury: MountStrength,
      venus: MountStrength,
      luna: MountStrength,
      mars_active: MountStrength,
      mars_passive: MountStrength,
    }),
    fingers: z.object({
      thumb: z.object({ length: FingerLength, tip: FingerTip, knots: FingerKnots }),
      index: z.object({ length: FingerLength, tip: FingerTip, knots: FingerKnots }),
      middle: z.object({ length: FingerLength, tip: FingerTip, knots: FingerKnots }),
      ring: z.object({ length: FingerLength, tip: FingerTip, knots: FingerKnots }),
      little: z.object({ length: FingerLength, tip: FingerTip, knots: FingerKnots }),
    }),
    markers: z.array(Marker).default([]),
    low_confidence_features: z.array(z.string()).default([]),
  }),
]);

export type VisionObservation = z.infer<typeof VisionObservationSchema>;
