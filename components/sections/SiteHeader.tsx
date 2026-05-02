// Global site header. Sticky at top so signed-in users can always reach
// the dashboard / user menu, even mid-scroll on a long report. Translucent
// cream backdrop with backdrop-blur reads cleanly against both the dark
// scroll-story hero and the cream content sections below it.

import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Container } from '@/components/ui/Container';
import { buttonStyles } from '@/components/ui/Button';

function clerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return false;
  if (/^pk_(test|live)_x+$/i.test(key)) return false;
  return key.length > 30;
}

export function SiteHeader() {
  const authReady = clerkConfigured();
  return (
    <header
      className="sticky top-0 z-[var(--z-nav)] border-b backdrop-blur-md"
      style={{
        background: 'color-mix(in srgb, var(--color-surface) 75%, transparent)',
        borderColor: 'color-mix(in srgb, var(--color-border) 60%, transparent)',
      }}
    >
      <Container size="wide">
        <nav className="flex items-center justify-between py-[var(--space-3)]">
          <Link
            href="/"
            className="font-[var(--font-display)] tracking-[var(--tracking-wide)]"
            style={{
              fontSize: 'clamp(1.125rem, 1.6vw, 1.375rem)',
              color: 'var(--color-ink)',
            }}
          >
            Praxa
          </Link>

          <div className="flex items-center gap-[var(--space-4)] sm:gap-[var(--space-5)]">
            {authReady ? (
              <>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="text-sm tracking-[var(--tracking-wide)] underline-offset-[6px] hover:underline"
                      style={{ color: 'var(--color-ink-muted)' }}
                    >
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button
                      type="button"
                      className={buttonStyles({ variant: 'primary', size: 'sm' })}
                    >
                      Create account
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link
                    href="/dashboard"
                    className="text-sm tracking-[var(--tracking-wide)] underline-offset-[6px] hover:underline"
                    style={{ color: 'var(--color-ink-muted)' }}
                  >
                    Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </>
            ) : null}
          </div>
        </nav>
      </Container>
    </header>
  );
}
