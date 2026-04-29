import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

const baseStyles =
  'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-pill)] font-[var(--font-body)] tracking-[var(--tracking-wide)] transition-colors duration-[var(--duration-base)] ease-[var(--ease-out)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-ink)] text-[var(--color-ink-on-accent)] hover:bg-[var(--color-accent-deep)]',
  secondary:
    'bg-transparent text-[var(--color-ink)] border border-[var(--color-border-strong)] hover:border-[var(--color-ink)]',
  ghost: 'bg-transparent text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]',
  link: 'bg-transparent text-[var(--color-accent-deep)] underline underline-offset-4 hover:text-[var(--color-ink)] p-0',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
};

/** Compose Button styles for any element (use with Next Link, etc.). */
export function buttonStyles(
  opts: {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
  } = {},
): string {
  const { variant = 'primary', size = 'md', className } = opts;
  return cn(baseStyles, variantStyles[variant], variant !== 'link' && sizeStyles[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...rest}
    />
  );
});
