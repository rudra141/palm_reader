// GET /api/report/[id] — fetch a saved report by its id.
// Returns the parsed Report JSON. Edge runtime — pure DB read.

import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { ReportSchema } from '@/lib/validation/reportSchema';
import { getSampleReport } from '@/lib/fixtures/sampleReports';

export const runtime = 'nodejs'; // postgres-js needs node, not edge

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  // Fixture short-circuit: /report/sample-* renders a hand-crafted reading.
  // Lets reviewers see the full UI before live inference is wired.
  if (id.startsWith('sample-')) {
    const fixture = getSampleReport(id);
    if (!fixture) {
      return NextResponse.json({ error: 'sample_not_found' }, { status: 404 });
    }
    return NextResponse.json({ report: fixture, fromFixture: true });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: 'db_unconfigured', detail: 'Set DATABASE_URL in .env.local for live readings.' },
      { status: 503 },
    );
  }

  const rows = await db()
    .select({
      id: schema.readings.id,
      reportJson: schema.readings.reportJson,
      createdAt: schema.readings.createdAt,
    })
    .from(schema.readings)
    .where(eq(schema.readings.id, id))
    .limit(1);

  const row = rows[0];
  if (!row) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  // Defensive parse — never serve malformed report JSON to the renderer.
  const parsed = ReportSchema.safeParse(row.reportJson);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'malformed_report', issues: parsed.error.issues },
      { status: 500 },
    );
  }

  return NextResponse.json({ report: parsed.data, createdAt: row.createdAt });
}
