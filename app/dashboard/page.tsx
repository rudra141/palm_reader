// /dashboard — protected by middleware.ts. Shows the signed-in user's past
// readings, newest first. Empty state CTAs to /upload.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { eq, desc } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { buttonStyles } from '@/components/ui/Button';
import { ensureUser } from '@/lib/auth/ensureUser';
import { readAnonSessionId } from '@/lib/auth/anonSession';
import { claimAnonReadings } from '@/lib/auth/claimAnonReadings';
import { db, schema } from '@/lib/db';
import { getTradition } from '@/lib/ai/traditions';
import type { SubStyleId } from '@/lib/validation/inputSchemas';

// auth() reads from request headers — must NOT be statically prerendered.
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Your readings',
  robots: { index: false, follow: false },
};

interface DashboardReading {
  id: string;
  tradition: 'indian' | 'chinese';
  subStyle: string;
  createdAt: Date;
  costUsd: string | null;
}

function clerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return false;
  if (/^pk_(test|live)_x+$/i.test(key)) return false;
  return key.length > 30;
}

async function loadDashboard(): Promise<DashboardReading[]> {
  if (!process.env.DATABASE_URL) return [];
  if (!clerkConfigured()) return [];
  const { userId } = await auth();
  if (!userId) return [];

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? null;
  const internalUserId = await ensureUser({ clerkUserId: userId, email });

  // Claim any readings the user created while anonymous before signing in.
  const anonSessionId = await readAnonSessionId();
  if (anonSessionId) {
    await claimAnonReadings({ internalUserId, anonSessionId });
  }

  const rows = await db()
    .select({
      id: schema.readings.id,
      tradition: schema.readings.tradition,
      subStyle: schema.readings.subStyle,
      createdAt: schema.readings.createdAt,
      costUsd: schema.readings.costUsd,
    })
    .from(schema.readings)
    .where(eq(schema.readings.userId, internalUserId))
    .orderBy(desc(schema.readings.createdAt))
    .limit(50);

  return rows;
}

export default async function DashboardPage() {
  if (!clerkConfigured()) redirect('/sign-in');
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const readings = await loadDashboard();

  return (
    <main className="py-[var(--space-9)]">
      <Container size="md">
        <header className="max-w-[44ch]">
          <Eyebrow>Your readings</Eyebrow>
          <h1
            className="mt-[var(--space-3)] leading-[var(--leading-tight)] font-[var(--font-display)] italic"
            style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}
          >
            Every reading you&rsquo;ve kept.
          </h1>
          <p
            className="mt-[var(--space-4)] text-base leading-[var(--leading-relaxed)]"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            Open any one to revisit the prose, the annotated palm, and continue the conversation
            where you left off.
          </p>
        </header>

        {readings.length === 0 ? (
          <div
            className="mt-[var(--space-8)] rounded-[var(--radius-lg)] border p-[var(--space-7)]"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--color-surface-raised)',
            }}
          >
            <p className="text-xl font-[var(--font-display)]">No readings yet.</p>
            <p
              className="mt-[var(--space-3)] max-w-[60ch] text-base leading-[var(--leading-relaxed)]"
              style={{ color: 'var(--color-ink-muted)' }}
            >
              Upload a clear photograph of your dominant palm and pick a tradition. The reading will
              appear here once it&rsquo;s done.
            </p>
            <Link
              href="/upload"
              className={buttonStyles({
                variant: 'primary',
                size: 'md',
                className: 'mt-[var(--space-5)] self-start',
              })}
            >
              Begin a reading
            </Link>
          </div>
        ) : (
          <ul className="mt-[var(--space-7)] flex flex-col gap-[var(--space-4)]">
            {readings.map((r) => {
              let label = r.subStyle;
              try {
                label = getTradition(r.subStyle as SubStyleId).subStyleLabel;
              } catch {
                /* keep raw subStyle if unknown id (forwards compat) */
              }
              const created = new Date(r.createdAt);
              const dateStr = created.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
              return (
                <li
                  key={r.id}
                  className="rounded-[var(--radius-md)] border p-[var(--space-5)] transition-colors hover:border-[var(--color-ink)]"
                  style={{
                    borderColor: 'var(--color-border)',
                    background: 'var(--color-surface-raised)',
                  }}
                >
                  <Link
                    href={`/report/${r.id}`}
                    className="flex items-baseline justify-between gap-[var(--space-4)]"
                  >
                    <div>
                      <div
                        className="text-xs tracking-[var(--tracking-wide)] uppercase"
                        style={{ color: 'var(--color-ink-faint)' }}
                      >
                        {r.tradition === 'indian' ? 'Indian' : 'Chinese'} · {dateStr}
                      </div>
                      <div
                        className="mt-[var(--space-1)] font-[var(--font-display)] italic"
                        style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }}
                      >
                        {label}
                      </div>
                    </div>
                    <span
                      aria-hidden
                      className="text-sm tracking-[var(--tracking-wide)]"
                      style={{ color: 'var(--color-accent-deep)' }}
                    >
                      Open →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </main>
  );
}
