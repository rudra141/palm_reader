// GET /api/report/[id] — fetch a saved report by its id.
// Returns the parsed Report JSON.
//
// Auth parity with the page route: real readings require Clerk sign-in and
// ownership (or matching anon session cookie); demo fixtures stay public.

import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db, schema } from '@/lib/db';
import { ReportSchema } from '@/lib/validation/reportSchema';
import { getSampleReport } from '@/lib/fixtures/sampleReports';
import { ensureUser } from '@/lib/auth/ensureUser';
import { readAnonSessionId } from '@/lib/auth/anonSession';
import { claimAnonReadings } from '@/lib/auth/claimAnonReadings';

export const runtime = 'nodejs'; // postgres-js needs node, not edge

interface Ctx {
  params: Promise<{ id: string }>;
}

function clerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return false;
  if (/^pk_(test|live)_x+$/i.test(key)) return false;
  return key.length > 30;
}

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  // Public demo fixtures.
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
      userId: schema.readings.userId,
      anonSessionId: schema.readings.anonSessionId,
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

  // Auth gate. Mirrors /app/report/[id]/page.tsx ownership decisions.
  if (clerkConfigured()) {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const u = await currentUser();
    const email = u?.emailAddresses[0]?.emailAddress ?? null;
    const internalUserId = await ensureUser({ clerkUserId, email });

    if (row.userId && row.userId !== internalUserId) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    if (!row.userId) {
      const cookieAnonId = await readAnonSessionId();
      if (!cookieAnonId || cookieAnonId !== row.anonSessionId) {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
      }
      await claimAnonReadings({ internalUserId, anonSessionId: cookieAnonId });
    }
  }

  const parsed = ReportSchema.safeParse(row.reportJson);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'malformed_report', issues: parsed.error.issues },
      { status: 500 },
    );
  }

  return NextResponse.json({ report: parsed.data, createdAt: row.createdAt });
}
