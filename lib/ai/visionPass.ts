// Vision pass — Claude Sonnet 4.6 → VisionObservation JSON.
// See /docs/prompts.md (vision_observe v1) and /docs/trd.md §2 step A.

import { generateText } from 'ai';
import { anthropic, MODELS } from './client';
import { VISION_OBSERVE_SYSTEM, PROMPT_IDS } from './prompts';
import { VisionObservationSchema, type VisionObservation } from '@/lib/validation/visionSchema';
import { estimateCostUsd } from './costTracker';

export interface VisionPassResult {
  observation: VisionObservation;
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

const STRIP_FENCES = /^```(?:json)?\n?|\n?```$/g;

function parseJsonFromModel(raw: string): unknown {
  const trimmed = raw.trim().replace(STRIP_FENCES, '').trim();
  return JSON.parse(trimmed);
}

export async function runVisionPass(input: VisionPassInput): Promise<VisionPassResult> {
  const start = Date.now();
  const result = await generateText({
    model: anthropic()(MODELS.vision),
    system: VISION_OBSERVE_SYSTEM,
    temperature: 0,
    maxTokens: 1500,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Observe this hand. Return the JSON only.' },
          {
            type: 'image',
            image:
              input.imageBytes instanceof Uint8Array
                ? input.imageBytes
                : new Uint8Array(input.imageBytes),
            mimeType: input.mimeType,
          },
        ],
      },
    ],
  });

  const latencyMs = Date.now() - start;
  const parsed = parseJsonFromModel(result.text);
  const observation = VisionObservationSchema.parse(parsed);

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
