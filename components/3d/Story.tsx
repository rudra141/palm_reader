'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLowPower } from '@/hooks/useLowPower';

const TOTAL_SCROLL_VH = 3; // see /docs/scroll-story.md "Total scroll length"

interface StoryProps {
  /** ARIA label for assistive tech (the canvas itself is decorative). */
  'aria-label'?: string;
}

/**
 * Master scroll-story scene.
 *
 * Strategy at CP2 (Beat 1):
 * - Lazy-mount on hydration (`use client`); poster shown until video metadata loads.
 * - All-intra MP4 from /public/scroll-story/ — frame-perfect `currentTime` scrub.
 * - Scroll progress 0..1 across `TOTAL_SCROLL_VH` viewport heights drives `video.currentTime`.
 * - Mobile (≤768 CSS px): 480p source. Desktop: 720p source.
 * - Reduced-motion or low-power: render the static poster instead of the video.
 *
 * Phase 7 wires per-beat UI overlays + adds the camera/light beats described in
 * /docs/scroll-story.md. At CP2 this ships scroll-tied scrub end-to-end with the
 * Beat 1 overlay surfaced by /components/sections/Hero.tsx.
 */
export function Story({ 'aria-label': ariaLabel }: StoryProps) {
  const reducedMotion = useReducedMotion();
  const lowPower = useLowPower();
  const [mounted, setMounted] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const targetTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const useFallback = reducedMotion || lowPower || !mounted;

  useEffect(() => {
    if (useFallback) return;

    const sentinel = sentinelRef.current;
    const video = videoRef.current;
    if (!sentinel || !video) return;

    const update = () => {
      const rect = sentinel.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      if (range <= 0) {
        targetTimeRef.current = 0;
      } else {
        // scroll progress 0 → 1 across the sentinel's scroll range
        const progress = Math.min(Math.max(-rect.top / range, 0), 1);
        const duration = Number.isFinite(video.duration) ? video.duration : 0;
        targetTimeRef.current = progress * duration;
      }

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(syncFrame);
      }
    };

    const syncFrame = () => {
      rafRef.current = null;
      const v = videoRef.current;
      if (!v) return;
      const target = targetTimeRef.current;
      // Only seek when off by more than half a frame (24 fps → ~21 ms)
      if (Math.abs(v.currentTime - target) > 0.02) {
        try {
          v.currentTime = target;
        } catch {
          // Safari throws while metadata still loading; ignore
        }
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [useFallback]);

  return (
    <div
      ref={sentinelRef}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      style={{ height: `${TOTAL_SCROLL_VH * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[var(--color-bg)]">
        {useFallback ? (
          <Image
            src="/scroll-story/story-poster.jpg"
            alt=""
            role="presentation"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            poster="/scroll-story/story-poster.jpg"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            // controls intentionally omitted; this is decorative content
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source
              src="/scroll-story/story-480p.mp4"
              media="(max-width: 768px)"
              type="video/mp4"
            />
            <source src="/scroll-story/story-720p.mp4" type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
}
