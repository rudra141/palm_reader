import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { AskFlow } from '@/components/sections/AskFlow';

export const metadata: Metadata = {
  title: 'Ask the palm — direct consultation',
  description:
    'Upload your palm and start asking questions. No report, no scroll — just a direct conversation grounded in the tradition you choose.',
};

export default function AskPage() {
  return (
    <main className="py-[var(--space-9)]">
      <Container size="md">
        <header className="max-w-[44ch]">
          <Eyebrow>Direct consultation</Eyebrow>
          <h1
            className="mt-[var(--space-3)] leading-[var(--leading-tight)] font-[var(--font-display)]"
            style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)' }}
          >
            Ask the palm.
          </h1>
          <p
            className="mt-[var(--space-5)] text-base leading-[var(--leading-relaxed)]"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            Upload one clear photograph of your dominant palm. Pick a tradition. Then ask anything —
            short, direct answers grounded in what your hand actually shows. Tap{' '}
            <em>More detail</em> on any reply for the full classical reasoning.
          </p>
        </header>
      </Container>

      <AskFlow />
    </main>
  );
}
