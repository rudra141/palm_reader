import type { ReactNode } from 'react';
import { Eyebrow } from '@/components/ui/Eyebrow';

interface ReportSectionProps {
  /** Short title — "Heart", "Mind", etc. */
  label: string;
  /** Practitioner-voice eyebrow above the section, e.g. "Who you are." */
  practitionerCue: string;
  /** Optional preamble (used by health section for the mandatory disclaimer). */
  preamble?: string;
  body: string;
  keyObservations?: string[];
  children?: ReactNode;
}

/**
 * One vertical section of the long-form report. Server-rendered.
 * Type rhythm: eyebrow → practitioner cue (display italic) → body (long-form).
 */
export function ReportSection({
  label,
  practitionerCue,
  preamble,
  body,
  keyObservations,
  children,
}: ReportSectionProps) {
  return (
    <section
      className="mt-[var(--space-9)]"
      aria-labelledby={`section-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <Eyebrow>{label}</Eyebrow>
      <h2
        id={`section-${label.toLowerCase().replace(/\s+/g, '-')}`}
        className="mt-[var(--space-3)] max-w-[28ch] font-[var(--font-display)] font-normal italic"
        style={{
          fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
          lineHeight: 1.12,
          letterSpacing: '-0.015em',
          color: 'var(--color-ink)',
        }}
      >
        {practitionerCue}
      </h2>

      {preamble ? (
        <p
          className="mt-[var(--space-5)] max-w-[60ch] rounded-[var(--radius-md)] border-l-2 border-[var(--color-accent)] bg-[var(--color-bg-inset)] p-[var(--space-5)] text-base leading-[var(--leading-relaxed)]"
          style={{ color: 'var(--color-ink-muted)' }}
        >
          {preamble}
        </p>
      ) : null}

      <p
        className="text-md mt-[var(--space-5)] max-w-[64ch] leading-[var(--leading-relaxed)]"
        style={{ color: 'var(--color-ink)' }}
      >
        {body}
      </p>

      {keyObservations && keyObservations.length > 0 ? (
        <ul className="mt-[var(--space-5)] grid max-w-[64ch] grid-cols-1 gap-[var(--space-2)] md:grid-cols-2">
          {keyObservations.map((obs) => (
            <li
              key={obs}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-[var(--space-4)] py-[var(--space-3)] text-sm leading-[var(--leading-relaxed)]"
              style={{ color: 'var(--color-ink-muted)' }}
            >
              {obs}
            </li>
          ))}
        </ul>
      ) : null}

      {children}
    </section>
  );
}
