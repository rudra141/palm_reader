import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { ReportShell } from '@/components/sections/ReportShell';
import { getSampleReport } from '@/lib/fixtures/sampleReports';
import { ReportSchema, type Report } from '@/lib/validation/reportSchema';
import { db, schema } from '@/lib/db';

interface PageProps {
  params: Promise<{ id: string }>;
}

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

  return (
    <ReportShell
      report={data.report}
      clientName={data.clientName}
      readingId={id}
      blobImageUrl={data.blobImageUrl}
    />
  );
}
