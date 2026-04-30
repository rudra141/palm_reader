import { Eyebrow } from '@/components/ui/Eyebrow';
import type { Report } from '@/lib/validation/reportSchema';

/**
 * Persistent footer of every report rendering — verbatim disclaimers per
 * /docs/ai-spec.md §6. Surfaced both inline at end of report and as the
 * legally-mandated guardrail text.
 */
export function ReportDisclaimers({ report }: { report: Report }) {
  return (
    <footer
      className="mt-[var(--space-10)] border-t border-[var(--color-border)] pt-[var(--space-7)]"
      aria-labelledby="disclaimers-heading"
    >
      <Eyebrow>For the record</Eyebrow>
      <h2 id="disclaimers-heading" className="sr-only">
        Disclaimers
      </h2>
      <p
        className="text-md mt-[var(--space-3)] max-w-[64ch] leading-[var(--leading-relaxed)]"
        style={{ color: 'var(--color-ink-muted)' }}
      >
        {report.disclaimers.entertainment}
      </p>
      <p
        className="text-md mt-[var(--space-4)] max-w-[64ch] leading-[var(--leading-relaxed)]"
        style={{ color: 'var(--color-ink-muted)' }}
      >
        {report.disclaimers.not_professional_advice}
      </p>
    </footer>
  );
}
