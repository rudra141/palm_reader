// Drizzle client. Connection is lazy + memoized so server-only code can import
// without crashing at build time when DATABASE_URL is absent (e.g. CP2 preview).

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let client: ReturnType<typeof drizzle> | null = null;

export function db() {
  if (client) return client;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. The DB-dependent route requires Supabase credentials in .env.local.',
    );
  }
  const sql = postgres(url, { prepare: false });
  client = drizzle(sql, { schema });
  return client;
}

export { schema };
