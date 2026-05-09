// Claim helper — attach all anonymous readings carrying this session id to
// the given internal user. Idempotent; safe to call on every authed page load.
//
// Used by:
//   - /report/[id] page: claim the single reading the user is viewing
//   - /dashboard: sweep all readings created during this anon session
//
// Returns the number of readings reattached (0 if cookie missing or no rows).

import { and, eq, isNull } from 'drizzle-orm';
import { db, schema } from '@/lib/db';

export interface ClaimAnonReadingsInput {
  internalUserId: string;
  anonSessionId: string | null;
}

export async function claimAnonReadings({
  internalUserId,
  anonSessionId,
}: ClaimAnonReadingsInput): Promise<number> {
  if (!anonSessionId) return 0;
  if (!process.env.DATABASE_URL) return 0;

  const updated = await db()
    .update(schema.readings)
    .set({ userId: internalUserId, anonSessionId: null })
    .where(
      and(
        eq(schema.readings.anonSessionId, anonSessionId),
        isNull(schema.readings.userId),
      ),
    )
    .returning({ id: schema.readings.id });

  return updated.length;
}
