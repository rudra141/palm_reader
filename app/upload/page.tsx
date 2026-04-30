import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { UploadForm } from '@/components/sections/UploadForm';

export const metadata: Metadata = {
  title: 'Upload your palm — begin a reading',
  description:
    'Submit a clear photograph of your dominant palm. Choose an Indian or Chinese tradition; receive a source-grounded reading.',
};

export default function UploadPage() {
  return (
    <main className="py-[var(--space-9)]">
      <Container size="md">
        <header className="mb-[var(--space-8)] max-w-[44ch]">
          <Eyebrow>Begin a reading</Eyebrow>
          <h1
            className="mt-[var(--space-4)] leading-[var(--leading-tight)] font-[var(--font-display)]"
            style={{ fontSize: 'clamp(2.25rem, 4vw, 3.25rem)' }}
          >
            One palm. One tradition. One reading.
          </h1>
          <p
            className="mt-[var(--space-5)] text-base leading-[var(--leading-relaxed)]"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            Photograph your dominant palm in even daylight, fingers slightly spread, lines visible.
            Every reading cites only its own tradition&rsquo;s classical sources. Reflection, not
            prophecy.
          </p>
        </header>

        <UploadForm />
      </Container>
    </main>
  );
}
