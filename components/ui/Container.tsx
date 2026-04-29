import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'wide';

const sizeStyles: Record<ContainerSize, string> = {
  sm: 'max-w-[40rem]',
  md: 'max-w-[56rem]',
  lg: 'max-w-[72rem]',
  wide: 'max-w-[88rem]',
};

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
}

export function Container({ size = 'lg', className, children, ...rest }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-[var(--space-5)] md:px-[var(--space-6)]',
        sizeStyles[size],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
