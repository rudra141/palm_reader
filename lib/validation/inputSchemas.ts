// Zod schemas for the inference pipeline boundary.
// See /docs/ai-spec.md §1 (Inputs accepted) and §13 (sub-style ID list).

import { z } from 'zod';

/** Canonical sub-style IDs locked at CP1; mirrors /docs/ai-spec.md §13. */
export const SUB_STYLE_IDS = [
  'INDIAN.SAMUDRIKA_COMPREHENSIVE',
  'INDIAN.HASTA_REKHA',
  'INDIAN.MOUNT_PLANETARY',
  'CHINESE.WU_XING',
  'CHINESE.MA_YI_CLASSICAL',
  'CHINESE.BAGUA_PALMISTRY',
] as const;

export type SubStyleId = (typeof SUB_STYLE_IDS)[number];

/** Runtime regex used to strip user-supplied control + injection markers
 *  before sending free text into the model as user-role content. */
const INJECTION_MARKERS = /<\/?system>|ignore\s+(?:all|previous)\s+instructions?|system_prompt/gi;

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\x00-\x1f\x7f]/g;

const sanitize = (s: string): string =>
  s.replace(CONTROL_CHARS, '').replace(INJECTION_MARKERS, '').trim();

export const ClientContextSchema = z.object({
  name: z.string().max(80).transform(sanitize).optional(),
  gender: z.enum(['male', 'female', 'nonbinary', 'prefer_not_to_say']).optional(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be ISO YYYY-MM-DD')
    .optional()
    .superRefine((dob, ctx) => {
      if (!dob) return;
      const d = new Date(dob);
      const minAge = new Date();
      minAge.setFullYear(minAge.getFullYear() - 16);
      if (d > minAge) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'must be at least 16 years old',
        });
      }
    }),
  dominantHand: z.enum(['left', 'right']),
});

export const AnalyzeRequestSchema = z.object({
  imageId: z.string().min(8),
  blobUrl: z.string().url(),
  clientContext: ClientContextSchema,
  tradition: z.enum(['indian', 'chinese']),
  subStyle: z.enum(SUB_STYLE_IDS),
  disclaimerAccepted: z.literal(true, {
    errorMap: () => ({ message: 'disclaimer must be accepted to proceed' }),
  }),
  retentionOptIn: z.boolean().default(false),
  turnstileToken: z.string().min(1),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
export type ClientContext = z.infer<typeof ClientContextSchema>;

/** Chat-companion request shape. Two modes:
 *   - "report" mode: caller is the report page; just sends `readingId` and
 *     we look up the persisted vision + report from the DB.
 *   - "direct" mode: caller is the /ask quick-consultation surface; there's
 *     no DB row yet (and might never be), so the caller sends vision +
 *     tradition + clientContext inline with each request. */
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(4000).transform(sanitize),
});

const DirectContextSchema = z.object({
  visionDescription: z.string().min(20).max(8000),
  tradition: z.enum(['indian', 'chinese']),
  subStyle: z.enum(SUB_STYLE_IDS),
  clientContext: ClientContextSchema,
});

export const AskRequestSchema = z
  .object({
    readingId: z.string().min(8).optional(),
    direct: DirectContextSchema.optional(),
    messages: z.array(ChatMessageSchema).min(1).max(40),
  })
  .refine(
    (v) => Boolean(v.readingId) !== Boolean(v.direct),
    'Provide exactly one of readingId or direct',
  );
export type AskRequest = z.infer<typeof AskRequestSchema>;
