import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type CardVariant = 'surface' | 'inset';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export function Card({ variant = 'surface', className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] p-[var(--space-6)]',
        variant === 'surface'
          ? 'bg-[var(--color-bg-elevated)] shadow-[var(--shadow-soft)]'
          : 'border border-[var(--color-border)] bg-[var(--color-bg-inset)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
