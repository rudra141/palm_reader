// AskTeaser — small home-page strip that surfaces the /ask direct-chat
// surface as an alternative to the full reading flow. Restrained: a single
// line + a CTA. The two glowing pillars above lead to /upload (the long
// reading); this lane offers the quick consultation.

import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { buttonStyles } from '@/components/ui/Button';

export function AskTeaser() {
  return (
    <section
      className="relative py-[var(--space-9)]"
      style={{ background: 'var(--color-surface-inset)' }}
    >
      <Container size="md">
        <div className="mx-auto flex max-w-[44ch] flex-col items-center text-center">
          <Eyebrow>Or, a faster path</Eyebrow>
          <h2
            className="mt-[var(--space-3)] leading-[var(--leading-tight)] font-[var(--font-display)] italic"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}
          >
            Ask the palm directly.
          </h2>
          <p
            className="mt-[var(--space-4)] text-base leading-[var(--leading-relaxed)]"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            Upload a photo, skip the report, start a conversation. Short answers — tap{' '}
            <em>more detail</em> when you want the deep version.
          </p>
          <Link
            href="/ask"
            className={buttonStyles({
              variant: 'primary',
              size: 'md',
              className: 'mt-[var(--space-6)]',
            })}
          >
            Open a consultation
          </Link>
        </div>
      </Container>
    </section>
  );
}
