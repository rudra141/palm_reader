import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Class-name composer used by every UI primitive. Resolves Tailwind conflicts
 * (e.g. p-2 + p-4 collapses to p-4).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
