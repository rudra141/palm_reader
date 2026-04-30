import { Eyebrow } from '@/components/ui/Eyebrow';
import type { Report } from '@/lib/validation/reportSchema';
import { TRADITIONS } from '@/lib/ai/traditions';

interface ReportHeaderProps {
  report: Report;
  clientName?: string;
}

export function ReportHeader({ report, clientName }: ReportHeaderProps) {
  const meta = TRADITIONS[report.meta.sub_style];
  const generatedAt = new Date(report.meta.generated_at);
  const dateLabel = generatedAt.toLocaleDateString('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="border-b border-[var(--color-border)] pb-[var(--space-7)]">
      <Eyebrow>
        {meta.traditionNameNative} · {meta.subStyleLabel} · {dateLabel}
      </Eyebrow>
      <h1
        className="mt-[var(--space-4)] max-w-[24ch] font-[var(--font-display)] font-normal italic"
        style={{
          fontSize: 'clamp(2rem, 4vw, 3.25rem)',
          lineHeight: 1.08,
          letterSpacing: '-0.018em',
          color: 'var(--color-ink)',
        }}
      >
        {clientName ? `A reading for ${clientName}.` : 'A reading.'}
      </h1>
    </header>
  );
}
