import Link from 'next/link';
import { buttonStyles } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { StoryLoader } from '@/components/3d/StoryLoader';

/**
 * Hero — landing-page Beat 1 surface.
 *
 * Composition:
 * - Story (full scroll-tied video) renders behind, occupying ~300vh of scroll space.
 * - The Beat 1 overlay (eyebrow + H1 + sub + CTA) is `position: fixed` over the first
 *   viewport of the story so it stays anchored while the user reads it; it fades out
 *   as the camera pushes into the lines (Beat 2). The fade-out is a Phase 7 deliverable.
 */
export function Hero() {
  return (
    <section className="relative" aria-labelledby="hero-heading">
      <StoryLoader />

      <div
        className="pointer-events-none fixed inset-0 z-[var(--z-overlay)] flex items-end pb-[var(--space-9)] md:items-center md:pb-0"
        style={{
          // Soft gradient so the gold particles don't wash out the type
          background:
            'linear-gradient(to top, rgb(var(--color-bg) / 0.7) 0%, rgb(var(--color-bg) / 0.0) 40%)',
        }}
      >
        <div className="mx-auto w-full max-w-[72rem] px-[var(--space-5)] md:px-[var(--space-7)]">
          <div className="pointer-events-auto max-w-[36ch]">
            <Eyebrow>Praxa</Eyebrow>
            <h1
              id="hero-heading"
              className="mt-[var(--space-4)] leading-[var(--leading-tight)] font-[var(--font-display)] tracking-[var(--tracking-tight)] text-[var(--color-ink)] text-[var(--text-4xl)] md:text-[var(--text-5xl)]"
            >
              A reading from the original texts.
            </h1>
            <p className="mt-[var(--space-5)] max-w-[40ch] leading-[var(--leading-relaxed)] text-[var(--color-ink-muted)] text-[var(--text-md)]">
              Indian and Chinese palmistry, read by an AI grounded in the classical sources — not
              the pop-culture residue.
            </p>
            <div className="mt-[var(--space-6)]">
              <Link href="/upload" className={buttonStyles({ size: 'lg', variant: 'primary' })}>
                Begin reading
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
