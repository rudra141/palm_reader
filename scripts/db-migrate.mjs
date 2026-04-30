// One-shot migration runner. Run with: node --env-file=.env.local scripts/db-migrate.mjs
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const client = postgres(url, { max: 1, prepare: false });
const db = drizzle(client);

try {
  await migrate(db, { migrationsFolder: 'lib/db/migrations' });
  console.log('migrations applied');
} catch (err) {
  console.error('migration failed:', err.message);
  process.exit(1);
} finally {
  await client.end();
}
