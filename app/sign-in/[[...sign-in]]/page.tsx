// /sign-in — Clerk's <SignIn /> rendered inside our own page chrome.
// Catch-all route so Clerk can handle any sub-segments (factor-one,
// SSO callback, etc.) without us managing them by hand.

import { SignIn } from '@clerk/nextjs';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

export const metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

function clerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return false;
  if (/^pk_(test|live)_x+$/i.test(key)) return false;
  return key.length > 30;
}

export default function SignInPage() {
  return (
    <main className="py-[var(--space-9)]">
      <Container size="md">
        <header className="mx-auto mb-[var(--space-7)] max-w-[40ch] text-center">
          <Eyebrow>Welcome back</Eyebrow>
          <h1
            className="mt-[var(--space-3)] leading-[var(--leading-tight)] font-[var(--font-display)] italic"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}
          >
            Sign in to continue.
          </h1>
        </header>
        {clerkConfigured() ? (
          <div className="flex justify-center">
            <SignIn signUpUrl="/sign-up" />
          </div>
        ) : (
          <p
            className="mx-auto max-w-[40ch] text-center text-sm leading-[var(--leading-relaxed)]"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            Sign-in isn&rsquo;t configured on this deployment yet.
          </p>
        )}
      </Container>
    </main>
  );
}
