CREATE TYPE "public"."inference_status" AS ENUM('ok', 'retried', 'fallback', 'filtered', 'failed');--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('free', 'premium');--> statement-breakpoint
CREATE TYPE "public"."tradition" AS ENUM('indian', 'chinese');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_log" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"meta_json" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inference_log" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"reading_id" uuid,
	"user_id" uuid,
	"ip_hash" text,
	"model" text NOT NULL,
	"cost_usd" numeric(10, 4) NOT NULL,
	"latency_ms" integer NOT NULL,
	"prompt_id" text NOT NULL,
	"prompt_version" text NOT NULL,
	"status" "inference_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reading_shares" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reading_id" uuid NOT NULL,
	"share_token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	CONSTRAINT "reading_shares_share_token_unique" UNIQUE("share_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "readings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"ip_hash" text,
	"tradition" "tradition" NOT NULL,
	"sub_style" text NOT NULL,
	"context_json" jsonb,
	"vision_observation_json" jsonb,
	"report_json" jsonb,
	"retention_opt_in" boolean DEFAULT false NOT NULL,
	"blob_image_url" text,
	"blob_delete_after" timestamp with time zone,
	"model_versions" jsonb,
	"prompt_versions" jsonb,
	"cost_usd" numeric(10, 4),
	"latency_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text,
	"email" text,
	"subscription_tier" "subscription_tier" DEFAULT 'free' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inference_log" ADD CONSTRAINT "inference_log_reading_id_readings_id_fk" FOREIGN KEY ("reading_id") REFERENCES "public"."readings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inference_log" ADD CONSTRAINT "inference_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reading_shares" ADD CONSTRAINT "reading_shares_reading_id_readings_id_fk" FOREIGN KEY ("reading_id") REFERENCES "public"."readings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "readings" ADD CONSTRAINT "readings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inference_log_user_day_idx" ON "inference_log" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inference_log_status_idx" ON "inference_log" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reading_shares_token_idx" ON "reading_shares" USING btree ("share_token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "readings_user_idx" ON "readings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "readings_tradition_idx" ON "readings" USING btree ("tradition","sub_style");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "readings_blob_delete_idx" ON "readings" USING btree ("blob_delete_after");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_clerk_idx" ON "users" USING btree ("clerk_user_id");