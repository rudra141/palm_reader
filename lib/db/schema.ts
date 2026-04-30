// Drizzle schema — mirrors /docs/trd.md §10.
// Migrations generated via drizzle-kit; live schema lives in Supabase Postgres.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  jsonb,
  boolean,
  timestamp,
  integer,
  bigserial,
  numeric,
  index,
} from 'drizzle-orm/pg-core';

export const subscriptionTier = pgEnum('subscription_tier', ['free', 'premium']);
export const traditionEnum = pgEnum('tradition', ['indian', 'chinese']);
export const inferenceStatus = pgEnum('inference_status', [
  'ok',
  'retried',
  'fallback',
  'filtered',
  'failed',
]);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clerkUserId: text('clerk_user_id').unique(),
    email: text('email'),
    subscriptionTier: subscriptionTier('subscription_tier').notNull().default('free'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    clerkIdx: index('users_clerk_idx').on(t.clerkUserId),
  }),
);

export const readings = pgTable(
  'readings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    ipHash: text('ip_hash'), // anonymous rate-limiting key
    tradition: traditionEnum('tradition').notNull(),
    subStyle: text('sub_style').notNull(),
    contextJson: jsonb('context_json').$type<Record<string, unknown>>(),
    visionObservationJson: jsonb('vision_observation_json').$type<unknown>(),
    reportJson: jsonb('report_json').$type<unknown>(),
    retentionOptIn: boolean('retention_opt_in').notNull().default(false),
    blobImageUrl: text('blob_image_url'),
    blobDeleteAfter: timestamp('blob_delete_after', { withTimezone: true }),
    modelVersions: jsonb('model_versions').$type<Record<string, string>>(),
    promptVersions: jsonb('prompt_versions').$type<Record<string, string>>(),
    costUsd: numeric('cost_usd', { precision: 10, scale: 4 }),
    latencyMs: integer('latency_ms'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('readings_user_idx').on(t.userId),
    traditionIdx: index('readings_tradition_idx').on(t.tradition, t.subStyle),
    blobDeleteIdx: index('readings_blob_delete_idx').on(t.blobDeleteAfter),
  }),
);

export const readingShares = pgTable(
  'reading_shares',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    readingId: uuid('reading_id')
      .notNull()
      .references(() => readings.id, { onDelete: 'cascade' }),
    shareToken: text('share_token').notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
  },
  (t) => ({
    tokenIdx: index('reading_shares_token_idx').on(t.shareToken),
  }),
);

export const inferenceLog = pgTable(
  'inference_log',
  {
    id: bigserial('id', { mode: 'bigint' }).primaryKey(),
    readingId: uuid('reading_id').references(() => readings.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    ipHash: text('ip_hash'),
    model: text('model').notNull(),
    costUsd: numeric('cost_usd', { precision: 10, scale: 4 }).notNull(),
    latencyMs: integer('latency_ms').notNull(),
    promptId: text('prompt_id').notNull(),
    promptVersion: text('prompt_version').notNull(),
    status: inferenceStatus('status').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userDayIdx: index('inference_log_user_day_idx').on(t.userId, t.createdAt),
    statusIdx: index('inference_log_status_idx').on(t.status, t.createdAt),
  }),
);

export const auditLog = pgTable('audit_log', {
  id: bigserial('id', { mode: 'bigint' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  metaJson: jsonb('meta_json').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
