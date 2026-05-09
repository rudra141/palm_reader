import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import dynamic from 'next/dynamic';
import { auth, currentUser } from '@clerk/nextjs/server';
import { StaticReport } from '@/components/sections/StaticReport';

// Lazy-load the interactive shell so static-generated fixture pages
// don't ship the GSAP/Lenis/MediaPipe glue. It only loads when a real
// reading with a photo URL renders.
const ReportShell = dynamic(() =>
  import('@/components/sections/ReportShell').then((m) => m.ReportShell),
);
import { getSampleReport } from '@/lib/fixtures/sampleReports';
import { ReportSchema, type Report } from '@/lib/validation/reportSchema';
import { db, schema } from '@/lib/db';
import { ensureUser } from '@/lib/auth/ensureUser';
import { readAnonSessionId } from '@/lib/auth/anonSession';
import { claimAnonReadings } from '@/lib/auth/claimAnonReadings';
import { aliasAnon, capture } from '@/lib/analytics/posthog';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Pre-render the review fixtures statically. Real reading IDs (uuid) still
// take the dynamic `ƒ` path; only these two sample IDs are baked. The
// payoff is next/font's per-route font preload kicks in for `○` routes,
// dropping FCP on the fixture pages from ~1360ms to ~760ms.
export async function generateStaticParams() {
  return [{ id: 'sample-indian' }, { id: 'sample-chinese' }];
}

// Allow other dynamic IDs at request time (UUID paths from real readings).
export const dynamicParams = true;

export const metadata: Metadata = {
  title: 'Your reading',
  // Report pages are noindex by default (privacy).
  robots: { index: false, follow: false },
};

interface LoadedReport {
  report: Report;
  clientName?: string;
  blobImageUrl: string | null;
}

function clerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return false;
  if (/^pk_(test|live)_x+$/i.test(key)) return false;
  return key.length > 30;
}

async function loadFixture(id: string): Promise<LoadedReport | null> {
  const fixture = getSampleReport(id);
  if (!fixture) return null;
  return { report: fixture, blobImageUrl: null };
}

interface ReadingRow {
  userId: string | null;
  anonSessionId: string | null;
  reportJson: unknown;
  contextJson: unknown;
  blobImageUrl: string | null;
}

async function loadRow(id: string): Promise<ReadingRow | null> {
  if (!process.env.DATABASE_URL) return null;
  const rows = await db()
    .select({
      userId: schema.readings.userId,
      anonSessionId: schema.readings.anonSessionId,
      reportJson: schema.readings.reportJson,
      contextJson: schema.readings.contextJson,
      blobImageUrl: schema.readings.blobImageUrl,
    })
    .from(schema.readings)
    .where(eq(schema.readings.id, id))
    .limit(1);
  return rows[0] ?? null;
}

function parseRow(row: ReadingRow): LoadedReport | null {
  const parsed = ReportSchema.safeParse(row.reportJson);
  if (!parsed.success) return null;
  const ctx = row.contextJson as { name?: string } | null;
  return {
    report: parsed.data,
    clientName: ctx?.name,
    blobImageUrl: row.blobImageUrl ?? null,
  };
}

export default async function ReportPage({ params }: PageProps) {
  const { id } = await params;

  // ── Public fixtures (demo) — no auth required ──────────────────────────
  if (id.startsWith('sample-')) {
    const fixture = await loadFixture(id);
    if (!fixture) notFound();
    if (!fixture.blobImageUrl) {
      return (
        <StaticReport report={fixture.report} clientName={fixture.clientName} readingId={id} />
      );
    }
    return (
      <ReportShell
        report={fixture.report}
        clientName={fixture.clientName}
        readingId={id}
        blobImageUrl={fixture.blobImageUrl}
      />
    );
  }

  // ── Real readings — auth required ──────────────────────────────────────
  // If Clerk isn't configured (preview without keys), fall back to the
  // legacy public read so review/dev environments keep working. This will
  // never trigger in production where Clerk is provisioned.
  if (!clerkConfigured() || !process.env.DATABASE_URL) {
    const row = await loadRow(id);
    if (!row) notFound();
    const data = parseRow(row);
    if (!data) notFound();
    if (!data.blobImageUrl) {
      return <StaticReport report={data.report} clientName={data.clientName} readingId={id} />;
    }
    return (
      <ReportShell
        report={data.report}
        clientName={data.clientName}
        readingId={id}
        blobImageUrl={data.blobImageUrl}
      />
    );
  }

  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    // Funnel event: user hit the gate without auth. Distinct id is the anon
    // cookie if present, else the report id itself (rare — shared link).
    const anon = await readAnonSessionId();
    await capture({
      distinctId: anon ?? `report:${id}`,
      event: 'report_view_blocked',
      properties: { reading_id: id, has_anon_cookie: Boolean(anon) },
    });
    redirect(`/sign-in?redirect_url=${encodeURIComponent(`/report/${id}`)}`);
  }

  const row = await loadRow(id);
  if (!row) notFound();

  // Resolve the internal user uuid for ownership checks + claim.
  const u = await currentUser();
  const email = u?.emailAddresses[0]?.emailAddress ?? null;
  const internalUserId = await ensureUser({ clerkUserId, email });

  // Ownership decision tree:
  //   1. row.userId === current user            → owner, render
  //   2. row.userId === null && cookie matches  → claim, render
  //   3. row.userId === null && cookie missing  → 404 (someone else's anon link)
  //   4. row.userId === other user              → 404 (don't leak existence)
  if (row.userId && row.userId !== internalUserId) {
    notFound();
  }

  if (!row.userId) {
    const cookieAnonId = await readAnonSessionId();
    if (!cookieAnonId || cookieAnonId !== row.anonSessionId) {
      notFound();
    }
    await claimAnonReadings({ internalUserId, anonSessionId: cookieAnonId });
    // Stitch the anon timeline (upload_completed, report_view_blocked) to the
    // authed identity, then mark the conversion.
    await aliasAnon({ authedDistinctId: internalUserId, anonDistinctId: cookieAnonId });
    await capture({
      distinctId: internalUserId,
      event: 'report_claimed',
      properties: { reading_id: id },
    });
  }

  await capture({
    distinctId: internalUserId,
    event: 'report_viewed',
    properties: { reading_id: id, owner: true },
  });

  const data = parseRow(row);
  if (!data) notFound();

  if (!data.blobImageUrl) {
    return <StaticReport report={data.report} clientName={data.clientName} readingId={id} />;
  }
  return (
    <ReportShell
      report={data.report}
      clientName={data.clientName}
      readingId={id}
      blobImageUrl={data.blobImageUrl}
    />
  );
}
