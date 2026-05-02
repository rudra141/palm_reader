// Lazy user-row upsert. The first time a Clerk-authenticated user hits an
// API route that wants to associate work with them, we make sure there's a
// row in `users` keyed by clerkUserId. Returns the internal UUID so callers
// can set it as a FK (e.g. on `readings.user_id`).
//
// Why lazy instead of webhooks: at v1 we don't want to operate a Clerk
// webhook endpoint + the dependency on Clerk's signing keys. Lazy upsert
// covers every flow that matters (analyze, dashboard read, etc.) and runs
// at most once per user (subsequent calls hit the indexed lookup).

import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';

export interface EnsureUserInput {
  clerkUserId: string;
  email?: string | null;
}

/**
 * Returns the internal `users.id` (UUID) for the given Clerk user, creating
 * the row if missing. Throws if the database isn't configured.
 */
export async function ensureUser({ clerkUserId, email }: EnsureUserInput): Promise<string> {
  if (!process.env.DATABASE_URL) {
    throw new Error('ensureUser called without DATABASE_URL configured');
  }

  const existing = await db()
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.clerkUserId, clerkUserId))
    .limit(1);
  if (existing[0]) return existing[0].id;

  const inserted = await db()
    .insert(schema.users)
    .values({
      clerkUserId,
      email: email ?? null,
    })
    .returning({ id: schema.users.id });
  if (!inserted[0]) {
    throw new Error('ensureUser insert returned no rows');
  }
  return inserted[0].id;
}
