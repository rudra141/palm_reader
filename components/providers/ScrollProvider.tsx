'use client';

// ScrollProvider — initializes Lenis (smooth scroll) + GSAP ScrollTrigger.
// Mounted only inside the interactive report so it doesn't fight the hero's
// native-scroll Story.tsx. Exposes `useScrollTo()` so hotspots / chapter
// nav can request a smooth scroll without bypassing Lenis.
//
// Reduced-motion / low-power callers should NOT mount this provider; the
// chooser at ReportShell renders the static fallback in those cases. As a
// defensive belt, the provider also no-ops if `prefers-reduced-motion` is
// set at mount time.

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';

interface ScrollToOptions {
  /** Offset in px applied above the target (e.g., -64 to leave room above). */
  offset?: number;
  /** Override Lenis's default duration (seconds). */
  duration?: number;
  /** When true, jumps immediately without smoothing. */
  immediate?: boolean;
}

type ScrollTarget = string | HTMLElement | number;

interface ScrollContextValue {
  scrollTo: (target: ScrollTarget, opts?: ScrollToOptions) => void;
  isReady: boolean;
}

const ScrollContext = createContext<ScrollContextValue>({
  scrollTo: (target) => {
    // Fallback when provider isn't mounted (or reduced-motion).
    if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  },
  isReady: false,
});

export function useScrollTo() {
  return useContext(ScrollContext);
}

interface LenisLike {
  raf(time: number): void;
  on(event: string, listener: () => void): void;
  scrollTo(target: ScrollTarget, opts?: ScrollToOptions): void;
  destroy(): void;
}

interface ScrollTriggerLike {
  update(): void;
  killAll?(): void;
  getAll(): { kill(): void }[];
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisLike | null>(null);
  const readyRef = useRef(false);

  const scrollTo = useCallback((target: ScrollTarget, opts?: ScrollToOptions) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, opts);
      return;
    }
    // Fallback when Lenis hasn't loaded yet.
    if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let st: ScrollTriggerLike | null = null;
    let cancelled = false;

    (async () => {
      try {
        const [lenisMod, gsapMod, stMod] = await Promise.all([
          import('lenis'),
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
        if (cancelled) return;

        const Lenis = lenisMod.default;
        gsapMod.gsap.registerPlugin(stMod.ScrollTrigger);
        st = stMod.ScrollTrigger as unknown as ScrollTriggerLike;

        const lenis = new Lenis({
          duration: 1.1,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        }) as unknown as LenisLike;
        lenisRef.current = lenis;
        readyRef.current = true;

        lenis.on('scroll', () => st!.update());

        const tick = (time: number) => {
          lenis.raf(time);
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch (err) {
        // Lenis or GSAP failed to load — fall back to native scrolling.
        console.warn('[ScrollProvider] init failed, native scroll only', err);
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      try {
        st?.getAll().forEach((trigger) => trigger.kill());
      } catch {
        /* ignore */
      }
      lenisRef.current?.destroy();
      lenisRef.current = null;
      readyRef.current = false;
    };
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollTo, isReady: readyRef.current }}>
      {children}
    </ScrollContext.Provider>
  );
}
