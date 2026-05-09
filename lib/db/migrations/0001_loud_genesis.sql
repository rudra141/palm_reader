ALTER TABLE "readings" ADD COLUMN "anon_session_id" text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "readings_anon_session_idx" ON "readings" USING btree ("anon_session_id");