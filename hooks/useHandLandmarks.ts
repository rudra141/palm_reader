// Lazy MediaPipe HandLandmarker integration. Runs detection once per imageUrl
// (cached at module scope), returns raw keypoints + derived PalmAnchors.
//
// Loading strategy:
//   - SSR / no DOM: returns 'idle' synchronously, never imports MediaPipe.
//   - On mount: lazy-imports `@mediapipe/tasks-vision` inside requestIdleCallback
//     so first paint is unblocked. Falls back to setTimeout when rIC absent.
//   - Loads model from /models/hand_landmarker.task (self-hosted).
//   - Loads WASM from jsDelivr CDN — Polish step may relocate to public/.

'use client';

import { useEffect, useState } from 'react';
import { deriveAnchors } from '@/lib/palm/deriveAnchors';
import type { PalmAnchors, RawLandmark } from '@/lib/palm/types';

export type LandmarksStatus =
  | 'idle'
  | 'loading-model'
  | 'detecting'
  | 'ready'
  | 'no-hand'
  | 'failed';

export interface LandmarksResult {
  status: LandmarksStatus;
  keypoints: RawLandmark[] | null;
  anchors: PalmAnchors | null;
  error: string | null;
}

const MODEL_PATH = '/models/hand_landmarker.task';
const WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm';

const cache = new Map<string, LandmarksResult>();
let pendingLandmarker: Promise<unknown> | null = null;

const IDLE: LandmarksResult = {
  status: 'idle',
  keypoints: null,
  anchors: null,
  error: null,
};

function deferIdle(fn: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  type IdleScheduler = (cb: () => void, opts?: { timeout: number }) => number;
  const ric = (window as unknown as { requestIdleCallback?: IdleScheduler }).requestIdleCallback;
  const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void })
    .cancelIdleCallback;
  if (typeof ric === 'function') {
    const id = ric(fn, { timeout: 1500 });
    return () => cic?.(id);
  }
  const id = window.setTimeout(fn, 200);
  return () => window.clearTimeout(id);
}

async function loadLandmarker(): Promise<unknown> {
  if (pendingLandmarker) return pendingLandmarker;
  pendingLandmarker = (async () => {
    const tasks = await import('@mediapipe/tasks-vision');
    const fileset = await tasks.FilesetResolver.forVisionTasks(WASM_PATH);
    return tasks.HandLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_PATH, delegate: 'GPU' },
      runningMode: 'IMAGE',
      numHands: 1,
    });
  })();
  return pendingLandmarker;
}

function loadImageAsElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image_load_failed'));
    img.src = url;
  });
}

interface DetectableLandmarker {
  detect(image: HTMLImageElement): {
    landmarks: RawLandmark[][];
    handedness?: Array<Array<{ categoryName?: string; score?: number }>>;
  };
}

/**
 * Hook that returns the detected hand landmarks + derived PalmAnchors for a
 * given image URL. Never throws; surfaces errors via `status` + `error`.
 *
 * Pass `null` to opt out (e.g. when reduced-motion is on).
 */
export function useHandLandmarks(imageUrl: string | null): LandmarksResult {
  const [result, setResult] = useState<LandmarksResult>(() => {
    if (!imageUrl) return IDLE;
    return cache.get(imageUrl) ?? IDLE;
  });

  useEffect(() => {
    if (!imageUrl) {
      setResult(IDLE);
      return;
    }
    const cached = cache.get(imageUrl);
    if (cached) {
      setResult(cached);
      return;
    }

    let cancelled = false;
    setResult({ status: 'loading-model', keypoints: null, anchors: null, error: null });

    const cancelIdle = deferIdle(async () => {
      try {
        const [landmarker, image] = await Promise.all([
          loadLandmarker() as Promise<DetectableLandmarker>,
          loadImageAsElement(imageUrl),
        ]);
        if (cancelled) return;
        setResult((prev) => ({ ...prev, status: 'detecting' }));
        const detection = landmarker.detect(image);
        if (cancelled) return;

        const first = detection.landmarks?.[0];
        if (!first || first.length === 0) {
          const noHand: LandmarksResult = {
            status: 'no-hand',
            keypoints: null,
            anchors: null,
            error: null,
          };
          cache.set(imageUrl, noHand);
          setResult(noHand);
          return;
        }

        const handedness =
          detection.handedness?.[0]?.[0]?.categoryName === 'Left'
            ? 'Left'
            : detection.handedness?.[0]?.[0]?.categoryName === 'Right'
              ? 'Right'
              : 'Unknown';
        const confidence = detection.handedness?.[0]?.[0]?.score ?? 1;

        const anchors = deriveAnchors(first, handedness, confidence);
        const ready: LandmarksResult = {
          status: 'ready',
          keypoints: first,
          anchors,
          error: null,
        };
        cache.set(imageUrl, ready);
        setResult(ready);
      } catch (err) {
        if (cancelled) return;
        const failed: LandmarksResult = {
          status: 'failed',
          keypoints: null,
          anchors: null,
          error: (err as Error).message,
        };
        cache.set(imageUrl, failed);
        setResult(failed);
      }
    });

    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [imageUrl]);

  return result;
}
