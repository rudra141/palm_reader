// HowItWorks — homepage explainer. Three steps: photo → reading → conversation.
// Brief by design; the actual flow is /upload, which carries the full context.

import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { buttonStyles } from '@/components/ui/Button';

interface Step {
  number: string;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Photograph the dominant palm.',
    body: 'Even daylight, fingers slightly spread, lines visible. The image is normalised on upload, EXIF stripped, and removed within twenty-four hours unless you choose to retain it.',
  },
  {
    number: '02',
    title: 'Receive the written reading.',
    body: 'The hand is observed against the active tradition. A twelve-section reading is rendered — opening, character, mind, heart, career, wealth, health, trajectory, and the rest — in the master-practitioner register. Source-grounded; never blended.',
  },
  {
    number: '03',
    title: 'Continue the conversation.',
    body: 'Ask follow-ups. The same practitioner answers, in the same tradition, drawing on what your hand actually showed. The reading stays open as long as you want it to.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-[var(--space-9)]">
      <Container size="lg">
        <header className="mx-auto max-w-[44ch] text-center">
          <Eyebrow>How a reading happens</Eyebrow>
          <h2
            className="mt-[var(--space-3)] leading-[var(--leading-tight)] font-[var(--font-display)]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            One photograph. One tradition. One open thread.
          </h2>
        </header>

        <ol className="mt-[var(--space-8)] grid grid-cols-1 gap-[var(--space-6)] md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.number} className="flex flex-col">
              <span
                className="font-[var(--font-display)] tracking-[var(--tracking-wide)]"
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                  color: 'var(--color-accent)',
                }}
              >
                {s.number}
              </span>
              <h3
                className="mt-[var(--space-3)] leading-[var(--leading-tight)] font-[var(--font-display)] italic"
                style={{ fontSize: 'clamp(1.25rem, 2.2vw, 1.625rem)' }}
              >
                {s.title}
              </h3>
              <p
                className="mt-[var(--space-3)] text-base leading-[var(--leading-relaxed)]"
                style={{ color: 'var(--color-ink-muted)' }}
              >
                {s.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-[var(--space-8)] flex justify-center">
          <Link href="/upload" className={buttonStyles({ variant: 'primary', size: 'lg' })}>
            Begin a reading
          </Link>
        </div>
      </Container>
    </section>
  );
}
