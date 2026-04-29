'use client';

import { useEffect, useState } from 'react';

interface NetworkInfo {
  saveData?: boolean;
}

interface NavigatorWithMaybeConnection extends Navigator {
  connection?: NetworkInfo;
}

/**
 * Heuristic: returns true when the device is likely too constrained to run
 * the full 3D scroll story smoothly. Triggers the static-panel fallback per
 * /docs/scroll-story.md.
 *
 * Conditions:
 * - hardwareConcurrency < 4
 * - WebGL unavailable
 * - prefers-reduced-data / saveData
 */
export function useLowPower(): boolean {
  const [low, setLow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const nav = window.navigator as NavigatorWithMaybeConnection;
    const concurrency = nav.hardwareConcurrency ?? 8;
    const saveData = nav.connection?.saveData === true;

    let webglAvailable = false;
    try {
      const canvas = document.createElement('canvas');
      const ctx =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      webglAvailable = ctx !== null;
    } catch {
      webglAvailable = false;
    }

    setLow(concurrency < 4 || !webglAvailable || saveData);
  }, []);

  return low;
}
