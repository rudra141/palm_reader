import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button, buttonStyles } from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Begin reading</Button>);
    expect(screen.getByRole('button', { name: 'Begin reading' })).toBeInTheDocument();
  });

  it('defaults type="button" so it never submits a form by accident', () => {
    render(<Button>Begin reading</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('honors a custom type', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('applies disabled state', () => {
    render(<Button disabled>Begin</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('exposes buttonStyles for use on Link / external elements', () => {
    expect(buttonStyles({ variant: 'primary', size: 'lg' })).toMatch(/h-14/);
    expect(buttonStyles({ variant: 'secondary' })).toMatch(/border/);
  });
});
