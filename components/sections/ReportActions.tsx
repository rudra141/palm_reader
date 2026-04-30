'use client';

import { buttonStyles } from '@/components/ui/Button';

interface ReportActionsProps {
  readingId: string;
}

/**
 * Action bar at the foot of a report. v1 surfaces affordances; the actual
 * PDF / share / delete pipelines wire in Phase 5/6 (PDF) and Phase 9 (account
 * dashboard delete). Buttons here are visible but degrade gracefully if the
 * supporting endpoints aren't live yet.
 */
export function ReportActions({ readingId }: ReportActionsProps) {
  return (
    <div className="mt-[var(--space-7)] flex flex-wrap gap-[var(--space-4)]">
      <button
        type="button"
        className={buttonStyles({ variant: 'primary', size: 'md' })}
        onClick={() => window.print()}
      >
        Print / Save as PDF
      </button>
      <button
        type="button"
        className={buttonStyles({ variant: 'secondary', size: 'md' })}
        onClick={async () => {
          const url = `${window.location.origin}/share/${readingId}`;
          try {
            await navigator.clipboard.writeText(url);
            // Toast component lands in Phase 5; native alert for now.
            alert('Link copied. Anyone with the link can read this.');
          } catch {
            window.prompt('Copy this link:', url);
          }
        }}
      >
        Share privately
      </button>
    </div>
  );
}
