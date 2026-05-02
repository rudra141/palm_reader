// /sign-up — Clerk's <SignUp /> wrapped in our page chrome.

import { SignUp } from '@clerk/nextjs';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

export const metadata = {
  title: 'Create account',
  robots: { index: false, follow: false },
};

function clerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return false;
  if (/^pk_(test|live)_x+$/i.test(key)) return false;
  return key.length > 30;
}

export default function SignUpPage() {
  return (
    <main className="py-[var(--space-9)]">
      <Container size="md">
        <header className="mx-auto mb-[var(--space-7)] max-w-[40ch] text-center">
          <Eyebrow>Begin here</Eyebrow>
          <h1
            className="mt-[var(--space-3)] leading-[var(--leading-tight)] font-[var(--font-display)] italic"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}
          >
            Create your account.
          </h1>
          <p
            className="mt-[var(--space-4)] text-base leading-[var(--leading-relaxed)]"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            Saves your readings to a private dashboard. Everything stays free at v1.
          </p>
        </header>
        {clerkConfigured() ? (
          <div className="flex justify-center">
            <SignUp signInUrl="/sign-in" />
          </div>
        ) : (
          <p
            className="mx-auto max-w-[40ch] text-center text-sm leading-[var(--leading-relaxed)]"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            Account creation isn&rsquo;t configured on this deployment yet.
          </p>
        )}
      </Container>
    </main>
  );
}
