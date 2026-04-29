import { Suspense } from 'react';
import Link from 'next/link';
import { buttonStyles } from '@/components/ui/Button';
import { StoryLoader } from '@/components/3d/StoryLoader';

/**
 * Hero — landing-page Beat 1 surface.
 *
 * Layered architecture:
 *   1. <StoryLoader>      — 300vh sentinel; sticky video underneath. Lazy-loaded.
 *   2. Anchored scrim     — soft dark bottom-left vignette. Guarantees ≥4.5:1 contrast
 *                            for the type block across every video frame (gold-particle
 *                            close-up, bright sun-burst portal, sunset terrace).
 *   3. Type block         — eyebrow → H1 → sub → CTA. Fixed within the Beat-1 viewport
 *                            so it stays anchored while the user reads it. Pointer-
 *                            events are scoped to the type block only so scroll passes
 *                            through everywhere else.
 *
 * Per /docs/scroll-story.md, the overlay fade-out as Beats 2-4 unfold is a Phase 7
 * deliverable; at CP2 the overlay stays anchored for the full scroll.
 */
export function Hero() {
  return (
    <section className="relative" aria-labelledby="hero-heading">
      {/* Suspense boundary contains the next/dynamic({ssr:false}) bailout so the
          overlay markup renders server-side and is paint-on-arrival. The fallback
          reserves the same 300vh of scroll space the Story occupies → no CLS. */}
      <Suspense
        fallback={
          <div
            aria-hidden
            style={{
              height: '300vh',
              backgroundImage: 'url(/scroll-story/story-poster.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
            }}
          />
        }
      >
        <StoryLoader />
      </Suspense>

      {/* ---------- Anchored scrim ----------
          Soft dark gradient, biased to the bottom-left, that the type block sits on.
          Strong enough to maintain readable contrast on the brightest frame
          (the mid-sequence sun burst) yet subtle enough to disappear into the warm
          gold particles of Beat 1. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[var(--z-overlay)]"
        style={{
          background: [
            'radial-gradient(120% 80% at 0% 100%, rgba(18,16,14,0.62) 0%, rgba(18,16,14,0.42) 28%, rgba(18,16,14,0.0) 56%)',
            'linear-gradient(to top, rgba(18,16,14,0.35) 0%, rgba(18,16,14,0) 32%)',
          ].join(', '),
        }}
      />

      {/* ---------- Type block ----------
          12-column grid; type lives in the left half on tablet+, full-width on mobile.
          Mobile bias bottom (thumb zone). Desktop center-vertical, generous left padding. */}
      <div className="pointer-events-none fixed inset-0 z-[var(--z-overlay)] flex items-end pb-[var(--space-9)] md:items-center md:pb-0">
        <div className="mx-auto grid w-full max-w-[88rem] grid-cols-1 px-[var(--space-5)] md:grid-cols-12 md:px-[var(--space-7)] lg:px-[var(--space-9)]">
          <div className="pointer-events-auto md:col-span-7 lg:col-span-6">
            {/* Eyebrow — small caps, tracked extra-wide, cream so it carries on the gold scrim */}
            <p
              className="text-xs font-[var(--font-body)] tracking-[var(--tracking-extra-wide)] uppercase"
              style={{
                color: 'rgb(255 248 234)',
                textShadow: '0 1px 2px rgba(18,16,14,0.45)',
              }}
            >
              Praxa
            </p>

            {/* H1 — Cormorant Garamond, 40 → 64 px clamp, normal weight for elegant
                editorial feel. max-w-[19ch] forces a clean 2-line break:
                  "A reading from the"
                  "original texts."
                Tight leading + slight negative tracking for premium display rhythm. */}
            <h1
              id="hero-heading"
              className="mt-[var(--space-3)] max-w-[19ch] font-[var(--font-display)] font-normal italic"
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 4rem)',
                lineHeight: 1.06,
                letterSpacing: '-0.02em',
                color: 'rgb(252 248 240)',
                textShadow: '0 2px 24px rgba(18,16,14,0.5), 0 1px 2px rgba(18,16,14,0.35)',
              }}
            >
              A reading from the original texts.
            </h1>

            {/* Sub — 42ch reading rhythm; cream-muted so the H1 stays the focal note */}
            <p
              className="text-md mt-[var(--space-5)] max-w-[42ch] leading-[var(--leading-relaxed)]"
              style={{
                color: 'rgb(238 230 217)',
                textShadow: '0 1px 12px rgba(18,16,14,0.55)',
              }}
            >
              Indian and Chinese palmistry, read by an AI grounded in the classical sources — not
              the pop-culture residue.
            </p>

            {/* CTA cluster — primary pill + secondary text link */}
            <div className="mt-[var(--space-6)] flex flex-wrap items-center gap-x-[var(--space-6)] gap-y-[var(--space-4)] md:mt-[var(--space-7)]">
              <Link
                href="/upload"
                className={buttonStyles({
                  variant: 'primary',
                  size: 'lg',
                  className: 'group gap-[var(--space-3)] shadow-[0_2px_24px_rgba(18,16,14,0.4)]',
                })}
              >
                <span>Begin reading</span>
                <span
                  aria-hidden
                  className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:translate-x-[var(--space-1)]"
                >
                  →
                </span>
              </Link>
              <Link
                href="/methodology"
                className="text-sm tracking-[var(--tracking-wide)] underline decoration-[1px] underline-offset-[6px] transition-colors duration-[var(--duration-base)] hover:decoration-[2px]"
                style={{
                  color: 'rgb(238 230 217)',
                  textShadow: '0 1px 8px rgba(18,16,14,0.55)',
                }}
              >
                How we ground the readings
              </Link>
            </div>
          </div>

          {/* Right column reserved for the visual — transparent so the hand stays unobstructed. */}
          <div aria-hidden className="hidden md:col-span-5 md:block lg:col-span-6" />
        </div>
      </div>

      {/* ---------- Footer microcopy ----------
          Tiny disclaimer line locked to bottom; legally required to be visible on
          every page (per /docs/content-plan.md) and reinforces the brand's restraint. */}
      <p
        className="pointer-events-none fixed inset-x-0 bottom-[var(--space-4)] z-[var(--z-overlay)] mx-auto w-full max-w-[88rem] px-[var(--space-5)] text-center text-xs font-[var(--font-body)] tracking-[var(--tracking-wide)] md:px-[var(--space-7)] md:text-left lg:px-[var(--space-8)]"
        style={{
          color: 'rgb(238 230 217 / 0.78)',
          textShadow: '0 1px 6px rgba(18,16,14,0.6)',
        }}
      >
        For entertainment and reflection. Not medical, legal, or financial advice.
      </p>
    </section>
  );
}
