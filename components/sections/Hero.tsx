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
      <StoryLoader />

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
          12-column grid lets the type sit cleanly in the left third on desktop while
          centering the visual on the right. Mobile stacks bottom-biased to keep the
          hand visible above. */}
      <div className="pointer-events-none fixed inset-0 z-[var(--z-overlay)] flex items-end pb-[var(--space-9)] md:items-center md:pb-0">
        <div className="mx-auto grid w-full max-w-[88rem] grid-cols-1 px-[var(--space-5)] md:grid-cols-12 md:px-[var(--space-7)] lg:px-[var(--space-8)]">
          <div className="pointer-events-auto md:col-span-6 lg:col-span-5">
            {/* Eyebrow — small caps, tracked extra-wide, accent-deep so it carries on cream */}
            <p
              className="font-[var(--font-body)] tracking-[var(--tracking-extra-wide)] text-[var(--text-xs)] uppercase"
              style={{
                color: 'rgb(255 248 234)',
                textShadow: '0 1px 2px rgba(18,16,14,0.45)',
              }}
            >
              Praxa
            </p>

            {/* H1 — display, large, tight tracking + leading. Cream so it sits on the scrim
                without needing a heavy backdrop. Drop shadow for absolute readability on
                bright frames. */}
            <h1
              id="hero-heading"
              className="mt-[var(--space-4)] leading-[var(--leading-tight)] font-[var(--font-display)] font-medium tracking-[var(--tracking-tight)] text-[var(--text-4xl)] md:text-[var(--text-5xl)]"
              style={{
                color: 'rgb(252 248 240)',
                textShadow: '0 2px 24px rgba(18,16,14,0.55), 0 1px 2px rgba(18,16,14,0.4)',
              }}
            >
              A reading from the original texts.
            </h1>

            {/* Sub — body comfort size, max 38ch for graceful reading rhythm */}
            <p
              className="mt-[var(--space-5)] max-w-[38ch] leading-[var(--leading-relaxed)] text-[var(--text-md)]"
              style={{
                color: 'rgb(238 230 217)',
                textShadow: '0 1px 12px rgba(18,16,14,0.55)',
              }}
            >
              Indian and Chinese palmistry, read by an AI grounded in the classical sources — not
              the pop-culture residue.
            </p>

            {/* CTA cluster — primary pill + secondary text link */}
            <div className="mt-[var(--space-7)] flex flex-wrap items-center gap-x-[var(--space-6)] gap-y-[var(--space-4)]">
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
                className="tracking-[var(--tracking-wide)] text-[var(--text-sm)] underline decoration-[1px] underline-offset-[6px] transition-colors duration-[var(--duration-base)] hover:decoration-[2px]"
                style={{
                  color: 'rgb(238 230 217)',
                  textShadow: '0 1px 8px rgba(18,16,14,0.55)',
                }}
              >
                How we ground the readings
              </Link>
            </div>
          </div>

          {/* Right column reserved for the visual — kept transparent so the hand reads. */}
          <div aria-hidden className="hidden md:col-span-6 md:block lg:col-span-7" />
        </div>
      </div>

      {/* ---------- Footer microcopy ----------
          Tiny disclaimer line locked to bottom; legally required to be visible on
          every page (per /docs/content-plan.md) and reinforces the brand's restraint. */}
      <p
        className="pointer-events-none fixed inset-x-0 bottom-[var(--space-4)] z-[var(--z-overlay)] mx-auto w-full max-w-[88rem] px-[var(--space-5)] text-center font-[var(--font-body)] tracking-[var(--tracking-wide)] text-[var(--text-xs)] md:px-[var(--space-7)] md:text-left lg:px-[var(--space-8)]"
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
