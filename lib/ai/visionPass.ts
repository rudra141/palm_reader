// Vision pass — Llama 4 Scout (multimodal) → SimpleVisionResult.
// We constrain output to a tiny discriminated union so the 17B model can
// reliably comply: either {valid:false, reason} or {valid:true, description}.
// The reasoning pass interprets the description text with the full RAG context.

import { generateObject } from 'ai';
import { groq, MODELS } from './client';
import { PROMPT_IDS } from './prompts';
import { SimpleVisionSchema, type SimpleVisionResult } from '@/lib/validation/visionSchema';
import { estimateCostUsd } from './costTracker';

export interface VisionPassResult {
  observation: SimpleVisionResult;
  model: string;
  promptVersion: string;
  costUsd: number;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
}

export interface VisionPassInput {
  imageBytes: ArrayBuffer | Uint8Array;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
}

const VISION_SYSTEM = `You are observing a photograph of a human palm. Output JSON only.

If the image does not clearly show a human palm, output:
{ "valid_palm_image": false, "reason": "<one sentence>" }

Otherwise output:
{ "valid_palm_image": true, "description": "<rich free-text observation, 200-400 words>" }

Your description should mention everything visible in neutral observational language:
- Hand shape (square, long, rectangular, etc.)
- Finger length and tip shape (square / conic / spatulate / pointed)
- Skin texture (soft / firm / rough / smooth)
- Each visible line: heart line, head line, life line, fate line (if present), sun line (if present), mercury line (if present). For each: where it begins, where it ends, how clear it is, whether it is straight, curved, chained, broken.
- Marriage lines (small horizontal lines on the side of the palm below the little finger): count and clarity.
- Bracelet lines on the wrist: count.
- Mount prominence (Jupiter under index, Saturn under middle, Apollo under ring, Mercury under little, Venus the thumb pad, Luna the percussion, upper/lower Mars).
- Any special markers visible: cross, star, square, triangle, island, chain, grille, fish, conch, temple, trident, lotus, flag, barley/yav.
- Image quality (lighting, sharpness, full hand visible).

You observe only — do not interpret. Do not say what features mean. Do not predict. Use neutral anatomical language. Output the JSON only.`;

function imageBuffer(bytes: ArrayBuffer | Uint8Array): Uint8Array {
  return bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
}

export async function runVisionPass(input: VisionPassInput): Promise<VisionPassResult> {
  const start = Date.now();
  const result = await generateObject({
    model: groq()(MODELS.vision),
    schema: SimpleVisionSchema,
    system: VISION_SYSTEM,
    temperature: 0,
    maxTokens: 1200,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Observe this palm and return the JSON.' },
          {
            type: 'image',
            image: imageBuffer(input.imageBytes),
            mimeType: input.mimeType,
          },
        ],
      },
    ],
  });

  const latencyMs = Date.now() - start;
  const observation = result.object;

  const promptTokens = result.usage?.promptTokens ?? 0;
  const completionTokens = result.usage?.completionTokens ?? 0;
  const costUsd = estimateCostUsd({
    model: MODELS.vision,
    inputTokens: promptTokens,
    outputTokens: completionTokens,
  });

  return {
    observation,
    model: MODELS.vision,
    promptVersion: PROMPT_IDS.vision_observe.version,
    costUsd,
    latencyMs,
    inputTokens: promptTokens,
    outputTokens: completionTokens,
  };
}
