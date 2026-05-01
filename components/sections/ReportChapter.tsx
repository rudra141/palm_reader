'use client';

// One pinned chapter in the cinematic report walkthrough. Each chapter takes
// at least one small-viewport-height (100svh — handles iOS dynamic chrome
// gracefully) and scoped GSAP cleanup is owned by useGSAP.
//
// Animation:
//   - Eyebrow + practitioner cue + title fade up first (slight Y shift)
//   - Body paragraph fades in next
//   - Optional key_observations + preamble fade in last
//
// Pinning is delegated to ReportChapters via ScrollTrigger so all chapters
// share a single ScrollTrigger registry and don't double-register.

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef, type ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

interface Props {
  id: string;
  label: string;
  practitionerCue: string;
  body: string;
  preamble?: string;
  keyObservations?: string[];
  children?: ReactNode;
}

export function ReportChapter({
  id,
  label,
  practitionerCue,
  body,
  preamble,
  keyObservations,
  children,
}: Props) {
  const root = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const ctx = gsap.context(() => {
        gsap.from('[data-chapter-fx="head"]', {
          opacity: 0,
          y: 24,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        });
        gsap.from('[data-chapter-fx="body"]', {
          opacity: 0,
          y: 18,
          duration: 0.9,
          delay: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });
        const tail = root.current!.querySelector('[data-chapter-fx="tail"]');
        if (tail) {
          gsap.from(tail, {
            opacity: 0,
            y: 14,
            duration: 0.9,
            delay: 0.3,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: root.current,
              start: 'top 65%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      }, root);
      return () => ctx.revert();
    },
    { scope: root },
  );

  return (
    <section
      id={id}
      ref={root}
      data-report-chapter
      className="relative flex min-h-[100svh] items-center py-[var(--space-9)]"
    >
      <Container size="md">
        <div data-chapter-fx="head" className="max-w-[64ch]">
          <Eyebrow>{label}</Eyebrow>
          <h2
            className="mt-[var(--space-3)] leading-[var(--leading-tight)] font-[var(--font-display)] italic"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            {practitionerCue}
          </h2>
        </div>

        {preamble ? (
          <p
            data-chapter-fx="body"
            className="mt-[var(--space-5)] max-w-[60ch] border-l-2 pl-[var(--space-4)] text-sm leading-[var(--leading-relaxed)] italic"
            style={{
              borderColor: 'var(--color-accent)',
              color: 'var(--color-ink-muted)',
            }}
          >
            {preamble}
          </p>
        ) : null}

        <p
          data-chapter-fx="body"
          className="mt-[var(--space-6)] max-w-[64ch] text-lg leading-[var(--leading-relaxed)]"
          style={{ color: 'var(--color-ink)' }}
        >
          {body}
        </p>

        {keyObservations && keyObservations.length > 0 ? (
          <ul
            data-chapter-fx="tail"
            className="mt-[var(--space-6)] grid max-w-[64ch] grid-cols-1 gap-[var(--space-3)] sm:grid-cols-2"
          >
            {keyObservations.map((obs, i) => (
              <li
                key={i}
                className="rounded-[var(--radius-md)] border px-[var(--space-4)] py-[var(--space-3)] text-sm leading-[var(--leading-relaxed)]"
                style={{
                  borderColor: 'var(--color-border)',
                  background: 'var(--color-surface-raised)',
                  color: 'var(--color-ink-muted)',
                }}
              >
                {obs}
              </li>
            ))}
          </ul>
        ) : null}

        {children ? (
          <div data-chapter-fx="tail" className="mt-[var(--space-5)]">
            {children}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
