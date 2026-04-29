import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/** Small-caps label used above headings — see /docs/design-system.md tracking-extra-wide. */
export function Eyebrow({ className, children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'font-[var(--font-body)] tracking-[var(--tracking-extra-wide)] text-[var(--color-ink-faint)] text-[var(--text-sm)] uppercase',
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
}
