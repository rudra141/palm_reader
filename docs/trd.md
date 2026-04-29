# TRD — AI Palm Reader

> Locked at CP1. Edits after CP1 require explicit human approval.

---

## 1. Stack (versions confirmed at scaffold; bumped only with reason logged in `/docs/decisions.md`)

### Frontend

- **Next.js 15** — App Router, React Server Components by default
- **React 19**
- **TypeScript 5** — strict mode, no `any` without `// justification:` comment
- **Tailwind CSS 4** with CSS custom properties as the source of truth for tokens
- **shadcn/ui** primitives (Radix-based)

### 3D / motion

- **three.js**
- **@react-three/fiber** — R3F renderer
- **@react-three/drei** — helpers (`useScroll`, `Html`, `Environment`)
- **gsap** + **@gsap/react** — ScrollTrigger
- **lenis** — smooth scroll, ScrollTrigger-compatible
- **framer-motion** — component-level micro-interactions

### AI SDK

- **ai** (Vercel AI SDK)
- **@ai-sdk/anthropic** — primary
- **@ai-sdk/openai** — fallback
- **@ai-sdk/google** — second-tier fallback if both above unavailable

### Image handling

- **sharp** (server) — normalize, resize, EXIF strip
- **react-dropzone** (client) — drag-drop + camera capture
- **@vercel/blob** — image storage with signed URLs

### Validation, persistence, infra

- **zod** — every API boundary
- **drizzle-orm** + **postgres-js** — DB layer
- **@upstash/ratelimit** + **@upstash/redis** — rate limiting + cost counters
- **Supabase** (Postgres) — primary DB

### Auth, observability, payments (subset)

- **Clerk** — auth (sign-in, sign-up, session)
- **Sentry** — error tracking (server + client; never captures image bytes)
- **PostHog** — analytics + feature flags (`SUBSCRIPTION_ENABLED`, etc.)
- **Stripe** — payments — **NOT in v1**, scaffolded for v1.1

### Testing + quality

- **Vitest** + **@testing-library/react**
- **Playwright** — E2E + cross-browser + visual snapshots
- **@axe-core/playwright** — accessibility CI
- Custom eval harness in `/evals/`

### Tooling

- **pnpm**
- **Vercel** hosting + CI integration
- **Turnstile** (Cloudflare) — bot defense on upload endpoint

## 2. Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Browser (mobile-first, 3D-capable)                          │
│  - Next.js client + RSC stream                                │
│  - 3D canvas lazy-loaded (next/dynamic, ssr:false)            │
│  - Reduced-motion + low-power detection at hydration          │
└────────────┬─────────────────────────────────────────────────┘
             │ HTTPS
┌────────────▼─────────────────────────────────────────────────┐
│  Vercel Edge / Node runtime                                   │
│  - /app routes (RSC default)                                  │
│  - /app/api/upload     → image ingest, sharp normalize,       │
│                          EXIF strip, signed URL → Blob        │
│  - /app/api/analyze    → orchestrates inference pipeline      │
│  - /app/api/report/[id] → fetch saved report                  │
│  - Middleware: Clerk session, Turnstile verification,         │
│                Upstash rate limits, cost circuit breaker      │
└──┬──────────────────────┬─────────────────────────┬──────────┘
   │                      │                         │
   ▼                      ▼                         ▼
┌──────────┐       ┌──────────────┐        ┌────────────────┐
│ Vercel   │       │ Anthropic    │        │ Supabase       │
│ Blob     │       │ Claude APIs  │        │ Postgres       │
│ (signed  │       │ - Sonnet 4.6 │        │ - users        │
│  URLs,   │       │   (vision)   │        │ - readings     │
│  24h     │       │ - Opus 4.7   │        │ - reading_     │
│  TTL)    │       │   (reasoning)│        │   shares       │
└──────────┘       └──────────────┘        │ - audit_log    │
                          │                 └────────────────┘
                          ▼
                  ┌────────────────┐
                  │ Fallback chain │
                  │ - OpenAI       │
                  │   GPT-4o       │
                  │ - Google       │
                  │   Gemini Pro   │
                  └────────────────┘

   Upstash Redis  ──  rate limits + cost counters per user, per IP
   Sentry         ──  errors only; never logs request bodies
   PostHog        ──  page views, conversion funnel, feature flags
```

### Inference pipeline (in `/app/api/analyze/route.ts`)

1. **Auth + rate-limit gate**
   - Clerk session optional; anonymous allowed
   - Upstash rate limit check (per-user if authed, per-IP otherwise)
   - Cost circuit-breaker check (per-user daily spend, system-wide monthly spend)
   - Turnstile token verification
2. **Step A — Vision pass**
   - Load image from Blob via signed URL (server-only)
   - Send to Claude Sonnet 4.6 with the structured-output system prompt from `/docs/prompts.md` (ID: `vision_observe.v1`)
   - Receive JSON observations: lines, mounts, finger ratios, hand shape, markers
   - Zod-parse against `VisionObservation` schema; on failure → retry once with corrective prompt; on second failure → fallback chain (OpenAI vision)
3. **Step B — Domain reasoning pass**
   - Inputs: vision JSON + user context (name, gender, DOB, dominant hand) + chosen tradition + sub-style + relevant `/docs/research.md` excerpts (selected by tradition + sub-style key)
   - Send to Claude Opus 4.7 with the master-practitioner system prompt (ID: `report_render.v1`)
   - Receive structured report JSON conforming to `Report` schema
   - Zod-parse; on failure → retry once with corrective prompt; on second failure → graceful apology UI (no fabrication)
4. **Step C — Output filter**
   - Regex pass: scan for forbidden phrases (medical diagnoses, exact death dates, tragedy specifics)
   - LLM-as-judge pass (Claude Haiku): score on tone, disallowed-claim presence, citation traceability
   - On any unsafe-output flag → reject + log + return safe fallback
5. **Step D — Persistence**
   - Write `Report` row to Supabase with: `user_id`, `tradition`, `sub_style`, `model_versions`, `prompt_versions`, `vision_observation_json`, `report_json`, `cost_usd`, `latency_ms`, `created_at`
   - Schedule blob deletion at `created_at + 24h` unless `retention_opt_in = true`
6. **Return** report ID to client; client navigates to `/report/[id]`

## 3. AI infrastructure

### Models (locked at CP1; bumped via `/prompt-update` workflow)

| Role                      | Model                       | Provider  | Est. cost / call | Latency target |
| ------------------------- | --------------------------- | --------- | ---------------- | -------------- |
| Vision pass               | `claude-sonnet-4-6`         | Anthropic | $0.05–0.10       | < 5s           |
| Reasoning pass            | `claude-opus-4-7`           | Anthropic | $0.25–0.40       | < 15s          |
| LLM-as-judge filter       | `claude-haiku-4-5-20251001` | Anthropic | $0.001           | < 2s           |
| Vision fallback           | `gpt-4o`                    | OpenAI    | $0.05–0.10       | < 6s           |
| Reasoning fallback        | `claude-sonnet-4-6`         | Anthropic | $0.05–0.15       | < 10s          |
| Reasoning second fallback | `gemini-1.5-pro`            | Google    | $0.05–0.15       | < 12s          |

### Cost guards

- **Per-user daily cap**: $5/day. Reset 00:00 UTC per `userId` (or `ipHash` for anonymous).
- **System-wide monthly cap**: $X (set in `.env`; default $500 for v1). At 80% → alert. At 100% → degrade reasoning model from Opus 4.7 → Sonnet 4.6 + show banner.
- **Per-call cost tracking**: every model call increments a counter in Upstash Redis with `{userId, ipHash, costUsd, model, ts}`. Aggregated daily.
- **Cost dashboard**: admin route `/admin/costs` (gated by Clerk org role). Shows current month spend, daily burn rate, top users, projected monthly total.

### Prompt versioning

- Every prompt has an ID (e.g., `vision_observe`, `report_render`, `output_filter_judge`).
- Prompts live in `/docs/prompts.md` only. Imported at runtime via `/lib/ai/prompts.ts` which reads the markdown at build time and exports typed strings keyed by ID + version.
- Prompts are NEVER inlined in components or routes.
- Updating a prompt = bumping its version + running `/eval-suite`. Promotion gated on no-regression.

### Prompt injection defense

- User-supplied free-text fields (name, optional notes) are passed as `user`-role content blocks, never concatenated into the system prompt.
- Sanitization: strip control chars, limit length, reject obvious injection markers (`<system>`, `</system>`, `Ignore all previous`, etc.) before sending.
- Output filter runs LLM-as-judge looking for "system prompt leak" patterns.

### Hallucination guardrails

- The reasoning system prompt instructs the model to cite the relevant research-base section IDs when making any factual claim about the chosen tradition.
- The Zod schema for `Report` requires a `claim_citations` array; reports without citations are rejected.
- The eval suite includes "factuality traceability" as a scored dimension; regressions block prompt promotion.

## 4. Data flow & privacy

### Image lifecycle (v1)

```
Client uploads → /app/api/upload (Vercel Edge)
  → Turnstile verify
  → sharp.normalize() in Node runtime: resize to 2048px max, re-encode JPEG q85, strip ALL EXIF
  → Vercel Blob put with `addRandomSuffix: true`, signed URL ttl=10min
  → return { imageId, expiresAt } to client
  → no logging of image bytes anywhere

Client posts imageId → /app/api/analyze
  → server fetches blob via internal signed URL (one-time)
  → vision pass + reasoning pass
  → image is NOT sent to Anthropic with any user-identifiable metadata
  → Anthropic API: zero data retention enabled (per Anthropic ZDR addendum, if account supports)
  → image deletion scheduled at upload_ts + 24h via Vercel cron

If user opts in to "Save my reading" with retention:
  → image retained until user-requested deletion or 1 year (whichever first)
  → all retention copy explicit in upload UI

User-requested deletion:
  → DELETE FROM readings WHERE id=?  (cascade to shares)
  → Blob purge if image still exists
  → audit_log row written (with ts, userId, reason, no image bytes)
```

### Never-train guarantee

- Anthropic ZDR is enabled on the production API key (config tracked in `/docs/decisions.md` once enabled).
- OpenAI: opt-out of training enabled at org level.
- Google: opt-out of training enabled at project level.
- The privacy policy states: "We do not train any model on your images. Your images are only used to generate your reading and are deleted within 24 hours by default."

### Where images appear

- ✅ Vercel Blob (encrypted at rest, signed-URL access, 24h default TTL)
- ✅ In-memory only on the inference server during the call (never written to disk except as the Blob copy)
- ✅ Never in Sentry (Sentry SDK configured to drop request bodies)
- ✅ Never in server logs (custom logger redacts known image fields)
- ✅ Never in PostHog
- ✅ Never in DB (only the Blob URL + metadata is stored, never the bytes)

### PII handling

- User-entered name and DOB are PII. Stored in `users.profile_json` encrypted at-rest by Supabase, never logged, redacted from Sentry events.
- Email (from Clerk) lives in Clerk only; never duplicated to our DB.

## 5. Performance budgets

| Metric            | Budget                                                | Verified by                           |
| ----------------- | ----------------------------------------------------- | ------------------------------------- |
| LCP (landing)     | < 2.0s on M1 Safari + mid-tier Android                | Lighthouse + chrome-devtools MCP      |
| LCP (report)      | < 2.0s                                                | same                                  |
| INP               | < 200ms                                               | same                                  |
| CLS               | < 0.1                                                 | same                                  |
| Initial JS bundle | < 200KB gzipped                                       | `pnpm analyze`                        |
| 3D chunk          | code-split, lazy-loaded after page interactive        | `pnpm analyze`                        |
| 3D scene FPS      | 60fps M1, 30fps min mid-tier mobile (4× CPU throttle) | chrome-devtools MCP profile           |
| Inference latency | P50 < 12s, P95 < 30s                                  | structured logs + Sentry transactions |
| Cost / inference  | avg < $0.50                                           | cost-tracking middleware              |
| Lighthouse        | ≥ 95 across all 4 categories on every public route    | CI                                    |

## 6. Browser matrix

- ✅ Chromium ≥ 121 (desktop + Android)
- ✅ Safari ≥ 17 (macOS + iOS)
- ✅ Firefox ≥ 122
- ⚠️ Older browsers: degraded experience — 2D fallback for landing page, no 3D scene
- ❌ IE / pre-Chromium Edge: not supported

3D scene tested explicitly in WebKit (most likely failure surface).

## 7. Security

### Headers (next.config.ts)

- CSP: strict, with allowlist for Anthropic / Vercel Blob / Clerk / Sentry / PostHog / Turnstile
- HSTS: max-age 1y, includeSubDomains, preload
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera (self), microphone (), geolocation ()

### Rate limits (Upstash, sliding window)

- `/api/upload`: 10/hour per IP, 30/day per IP
- `/api/analyze`: 5/hour per IP, 10/day per IP, 5/day per authed user
- `/api/report/[id]`: 60/minute per IP

### Image validation (server-side)

- Whitelist: `image/jpeg`, `image/png`, `image/webp` (no SVG, no GIF)
- Max dimensions: 8000×8000 pixels
- Max file size: 10MB
- Polyglot detection: re-encode through sharp; if encoding fails, reject
- EXIF: stripped via sharp `withMetadata({ exif: {} })` (or equivalent)

### Auth (Clerk)

- Session cookies httpOnly, secure, SameSite=Lax
- CSRF: Clerk's built-in protection
- Org roles: `admin` for cost dashboard

### CORS

- API routes: same-origin only by default. No public CORS at v1.

## 8. Hosting + environments

- **Production**: Vercel project, custom domain, branch = `main`
- **Preview**: Vercel preview deployments per PR
- **Local dev**: `pnpm dev` on `localhost:3000`
- Environment variables documented in `/.env.example`. Required at minimum:
  - `ANTHROPIC_API_KEY`
  - `OPENAI_API_KEY` (fallback)
  - `GOOGLE_GENERATIVE_AI_API_KEY` (fallback)
  - `BLOB_READ_WRITE_TOKEN`
  - `DATABASE_URL` (Supabase)
  - `CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`
  - `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`
  - `SENTRY_DSN` / `SENTRY_AUTH_TOKEN`
  - `POSTHOG_KEY` / `POSTHOG_HOST`
  - `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
  - `MONTHLY_COST_CAP_USD` (default `500`)
  - `SUBSCRIPTION_ENABLED` (default `false`)
  - `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` (only used when `SUBSCRIPTION_ENABLED=true`)

## 9. Monitoring + cost tracking

- **Sentry**: errors + perf transactions; sourcemaps uploaded; release tag = git SHA
- **PostHog**: page views, key conversion events (`reading_started`, `reading_completed`, `share_link_generated`, `pdf_downloaded`, `account_created`)
- **Cost tracking**: every AI call inserts a row in Supabase `inference_log` table; cron job aggregates daily into `cost_daily` view
- **Alerts** (via Sentry + custom webhook):
  - Inference error rate > 2% over 5 minutes
  - P95 latency > 30s over 5 minutes
  - Daily spend > 80% of monthly cap projected
  - User session crosses $5 daily cap (silent — circuit breaker fires)
  - Any unsafe-output filter trigger (high signal — page on-call)

## 10. Migration / schema

Drizzle schema at `/lib/db/schema.ts`. Key tables:

```ts
users (
  id uuid pk,
  clerk_user_id text unique,
  email text,
  subscription_tier enum('free','premium') default 'free',
  created_at timestamptz default now()
)

readings (
  id uuid pk,
  user_id uuid fk users.id null,    -- null for anonymous
  ip_hash text,                      -- for anonymous rate limiting
  tradition enum('indian','chinese'),
  sub_style text,                    -- e.g., 'samudrika_comprehensive'
  context_json jsonb,                -- name, dob, dominant_hand, etc. encrypted at app layer
  vision_observation_json jsonb,
  report_json jsonb,
  retention_opt_in boolean default false,
  blob_image_url text,
  blob_delete_after timestamptz,
  model_versions jsonb,              -- {vision: 'claude-sonnet-4-6', reasoning: 'claude-opus-4-7'}
  prompt_versions jsonb,
  cost_usd numeric(10,4),
  latency_ms int,
  created_at timestamptz default now()
)

reading_shares (
  id uuid pk,
  reading_id uuid fk readings.id,
  share_token text unique,           -- random 32-byte url-safe
  created_at timestamptz default now(),
  expires_at timestamptz null        -- nullable = no expiry
)

inference_log (
  id bigserial pk,
  reading_id uuid fk readings.id,
  user_id uuid fk users.id null,
  ip_hash text,
  model text,
  cost_usd numeric(10,4),
  latency_ms int,
  prompt_id text,
  prompt_version text,
  status enum('ok','retried','fallback','filtered','failed'),
  created_at timestamptz default now()
)

audit_log (
  id bigserial pk,
  user_id uuid null,
  action text,                        -- 'reading_deleted', 'image_purged', etc.
  meta_json jsonb,
  created_at timestamptz default now()
)
```

## 11. Failure modes + recovery

| Failure                                          | Detection          | Response                                                                                                                                                        |
| ------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vision pass hallucinates / returns invalid JSON  | Zod parse fail     | Retry with corrective prompt; if 2nd fail, fallback to OpenAI vision; if still fail, return graceful "we couldn't read your photo" UI with re-upload affordance |
| Reasoning pass produces filtered (unsafe) output | LLM-judge flag     | Reject; do NOT retry verbatim; surface generic apology; log to inference_log + Sentry; add to eval regression set                                               |
| Anthropic API outage                             | timeout / 5xx      | Fallback chain: Sonnet → OpenAI GPT-4o → Gemini Pro; banner shown if any fallback is active                                                                     |
| Cost cap exceeded                                | counter check      | Per-user: friendly "You've hit your daily limit, please come back tomorrow"; system-wide: degrade Opus → Sonnet + banner                                        |
| Image upload fails sharp                         | sharp throws       | Reject with friendly "Photo couldn't be processed; please try a different photo"                                                                                |
| User-supplied prompt-injection attempt           | sanitization layer | Strip + log; if persistent, rate-limit                                                                                                                          |
| DB write fails after successful inference        | try/catch          | Retry once; if still fail, return inference result with `READING_NOT_PERSISTED` flag and email-self-link option                                                 |
| Blob delete cron fails                           | monitor            | Sentry capture; daily retry; alert at 48h overdue                                                                                                               |

## 12. Future-readiness notes (for v1.1+)

- `subscription_tier` exists in DB at v1 even though unused — no migration needed at v1.1
- Stripe webhook handler stub at `/app/api/stripe/webhook/route.ts` can be enabled with env flag
- Two-hand cross-reference: `readings` table accepts `non_dominant_image_url` nullable; pipeline ignores at v1
- Tier-gated retention: add `retention_policy` column at v1.1; default migration to `'24h'` for existing rows
- Hindi locale: routing already accepts `[locale]` segment; content keys exist in `/content/`

## 13. Out of TRD scope

- Disaster recovery cross-region failover (single-region Vercel + Supabase v1)
- Compliance audits (SOC 2, ISO 27001) — revisit if B2B emerges
- Public API for third-party integrations
