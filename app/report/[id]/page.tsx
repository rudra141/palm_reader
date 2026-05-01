import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import dynamic from 'next/dynamic';
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
  // Per /docs/sitemap.md: report pages are noindex by default (privacy).
  robots: { index: false, follow: false },
};

interface LoadedReport {
  report: Report;
  clientName?: string;
  blobImageUrl: string | null;
}

async function loadReport(id: string): Promise<LoadedReport | null> {
  // Fixture short-circuit (CP3 review path).
  if (id.startsWith('sample-')) {
    const fixture = getSampleReport(id);
    if (!fixture) return null;
    return { report: fixture, blobImageUrl: null };
  }

  if (!process.env.DATABASE_URL) {
    return null;
  }

  const rows = await db()
    .select({
      reportJson: schema.readings.reportJson,
      contextJson: schema.readings.contextJson,
      blobImageUrl: schema.readings.blobImageUrl,
    })
    .from(schema.readings)
    .where(eq(schema.readings.id, id))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

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
  const data = await loadReport(id);
  if (!data) notFound();

  // Without a photo (sample fixtures, retention-deleted blobs) the
  // interactive variant has nothing to annotate — render StaticReport
  // directly from the server. This skips loading ReportShell + the
  // GSAP/Lenis/MediaPipe glue entirely on those routes.
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
