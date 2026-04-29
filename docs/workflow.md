# Autonomous Build Workflow — AI Vision App + 3D Scroll Experience

This is the canonical phase order for AI-powered web apps. Claude reads this every session and follows it. Do not skip phases. Do not reorder.

---

## Phase 1 — Discovery (auto, ends at CP1)

**Goal:** Turn the raw idea into a complete spec layer including AI behavior contract.

**Steps:**

1. Generate `/docs/brief.md` from raw idea.
2. Ask up to 12 batched clarifying questions in ONE message. Cover gaps in: target user, regulatory/disclaimers needed, tone of AI output, monetization, model preference (vision model + LLM), language support, output format, scroll story narrative, brand assets, deadline, hosting, budget for inference costs.
3. After answers, generate IN PARALLEL via subagents:
   - `/docs/prd.md` — Problem, Personas, User Journeys (upload → inference → result), Page Inventory, Features (P0/P1/P2), Out-of-Scope, Open Questions, Monetization model, Disclaimer requirements
   - `/docs/trd.md` — Stack + versions, Architecture (frontend / inference layer / storage / queue if needed), **AI infrastructure** (which vision model, which LLM, which provider, fallback strategy, cost per inference, rate limits), Data flow + privacy (image lifecycle, retention, never-train guarantee), Performance budgets, Browser matrix, Security (rate limits, auth, image validation, CSP), Hosting, Monitoring + cost tracking
   - `/docs/ai-spec.md` — **The AI behavior contract.** Sections:
     - Inputs accepted and their validation rules
     - Outputs produced and their schema (strict JSON schema)
     - System prompt design philosophy
     - What the AI MUST do
     - What the AI MUST NEVER say (hard constraints, disclaimers, refusals)
     - Hallucination guardrails
     - Few-shot examples (5-10 high-quality examples)
     - Fallback behavior on inference failure
     - Confidence/uncertainty handling
     - Evaluation criteria for outputs
   - `/docs/research.md` — Domain knowledge research. Every claim the AI will make must be traceable to a cited source here. For traditional/cultural domains (palmistry, ayurveda, vastu, astrology, etc.), cite primary texts + reputable secondary sources. NO web blog summaries unless cross-verified.
   - `/docs/prompts.md` — Versioned prompt library. Each prompt has: ID, version, purpose, full text, model targeted, expected output schema, last evaluated date, eval score.
   - `/docs/sitemap.md` — IA + URL structure
   - `/docs/content-plan.md` — Per-page copy
   - `/docs/design-system.md` — Tokens + components + motion principles + 3D scene principles
   - `/docs/scroll-story.md` — The 3D narrative beat-by-beat (scroll position → scene state → camera → lighting → UI overlay)
   - `/docs/risk-register.md` — Top risks: hallucination, cost runaway, image abuse, latency, regulatory
4. Update `/CLAUDE.md` Mission and Stack sections with project specifics.
5. Initialize `/docs/decisions.md`, `/docs/progress.md`, `/docs/blockers.md`, `/docs/evals.md`.
6. **→ CHECKPOINT 1.**

---

## Phase 2 — Foundation (auto)

**Goal:** Production-ready scaffold with quality gates active.

**Steps:**

1. Plan mode: confirm scaffold plan from TRD.
2. Scaffold:
   - Next.js 15 App Router + TypeScript strict
   - Tailwind v4 + CSS custom properties
   - shadcn/ui primitives
   - Vitest + Testing Library + Playwright
   - **AI SDK** — install Vercel AI SDK (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/google`) per TRD model choices
   - **3D stack** — `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `@gsap/react`, `lenis`
   - **Validation** — `zod` for all boundaries
   - **Image handling** — `sharp` server-side, `react-dropzone` client-side
   - **Storage** — per TRD (Vercel Blob / S3 / Supabase Storage)
   - **Rate limiting** — `@upstash/ratelimit` + `@upstash/redis`
   - **Observability** — Sentry + cost-tracking middleware
3. Configure `.claude/settings.json` hooks.
4. Configure `.claude/commands/`.
5. Set up `.env.example` with every required key documented.
6. Initial commit.
7. Confirm all commands succeed.

---

## Phase 3 — Design System + 3D Foundation (auto, ends at CP2)

**Goal:** Visual contract + proof-of-concept 3D scene.

**Steps:**

1. Translate `/docs/design-system.md` tokens into `/app/globals.css` and Tailwind config.
2. Build `/app/design-system/page.tsx` rendering all tokens + UI primitives + states.
3. Build UI primitives in `/components/ui/`.
4. Build the **3D scroll story proof-of-concept** in `/components/3d/Story.tsx`:
   - One scene
   - First scroll beat from `/docs/scroll-story.md` (e.g., the hand model rendered in initial frame)
   - Camera tied to scroll progress via GSAP ScrollTrigger
   - Lazy-loaded via `next/dynamic({ ssr: false })`
   - Suspense fallback with meaningful loader
   - 2D fallback for low-power devices
5. Performance baseline: profile on M1 + mid-tier mobile.
6. Run `/audit`.
7. **→ CHECKPOINT 2.** Human reviews tokens + initial 3D scene quality.

---

## Phase 4 — AI Inference Pipeline (auto, ends at CP3)

**Goal:** End-to-end AI flow working with real test images.

**Steps:**

1. Build the inference architecture per `/docs/trd.md`:
   - Image upload endpoint (`/app/api/upload/route.ts`) — validates dimensions, file type, size, runs through `sharp` for normalization, stores to blob/S3 with signed URLs, returns image ID
   - Inference orchestration endpoint (`/app/api/analyze/route.ts`) — receives image ID + analysis params, runs the multi-step pipeline:
     - **Step A — Vision pass**: send image to vision model with the structured-output system prompt from `/docs/prompts.md` to extract observations (e.g., for palmistry: detect lines, mounts, hand shape, finger ratios — return JSON)
     - **Step B — Domain reasoning pass**: send vision JSON + user metadata to LLM with the domain expert system prompt + `/docs/research.md` knowledge base to generate the report
     - **Step C — Validation**: Zod-parse output; if invalid, retry with corrective prompt; if still invalid, fallback gracefully
     - **Step D — Persistence**: save report to DB with image ID, timestamp, model versions, prompt version
2. Implement guardrails:
   - Rate limiting per IP and per user (Upstash)
   - Cost tracking middleware that increments a counter per call and rejects if user exceeds budget
   - Prompt injection defense (treat user-supplied text as untrusted, never let it modify the system prompt)
   - Image validation (no executables, max dimensions, EXIF stripping)
   - Output filtering (regex + LLM-as-judge to catch disallowed claims per `/docs/ai-spec.md` constraints)
3. Build the eval harness in `/evals/`:
   - 10+ test images with expected output characteristics
   - Run `pnpm eval` to score current prompt vs. expected
   - Log scores to `/docs/evals.md`
4. Build the result UI route (`/app/report/[id]/page.tsx`) — Server Component that fetches the saved report and renders it.
5. Run end-to-end test with 5 real images. Manually verify outputs are accurate, on-tone, and within constraints.
6. **→ CHECKPOINT 3.** Human reviews inference quality on real images.

---

## Phase 5 — Section Components (auto, parallel subagents)

Build sections from PRD page inventory. Each section: composed from primitives, mobile-first, tokens only, semantic HTML, keyboard accessible, prefers-reduced-motion, tests + visual snapshot, added to `/design-system`.

Common sections for this app type: Hero (with scroll-story canvas integrated), HowItWorks, FeatureGrid, UploadFlow, SampleReport, Testimonials, Pricing, FAQ, Disclaimer, CTA, Footer, Navbar.

---

## Phase 6 — Page Composition (auto)

Compose pages from `/docs/sitemap.md`. Server Components by default. Per-page metadata. 404 + 500 + loading states. The upload flow is a multi-step client component. The report page is a Server Component.

---

## Phase 7 — Cinematic Scroll Story (auto)

**Goal:** Build out the full 3D narrative from `/docs/scroll-story.md`.

**Steps:**

1. Implement every scroll beat from the spec:
   - Beat 1: Initial frame (e.g., hand close-up)
   - Beat 2: Zoom out / camera movement
   - Beat 3-N: Scene transitions per the narrative
2. Use GSAP ScrollTrigger with `scrub: true` for camera + light + material progress.
3. Use Drei's `useScroll` for finer-grained scene state.
4. Each beat has a 2D fallback layout (HTML + CSS only) for users with reduced-motion or low-power devices.
5. Performance:
   - Models Draco-compressed, total <8MB
   - Texture compression (basis/ktx2)
   - Instanced meshes where possible
   - Frustum culling
   - Profile on 4x CPU throttle, target 60fps M1, 30fps mid-tier mobile
6. Audio (optional per spec): ambient sound with mute toggle, volume tied to scroll if specified.
7. Reduced-motion fallback: replace 3D scene with sequential image+text panels.

---

## Phase 8 — Animation Layer (non-3D motion)

GSAP ScrollTrigger for non-3D scroll-driven UI. Framer Motion for component micro-interactions. Lenis for smooth scroll (configured to not break anchors and not conflict with ScrollTrigger). All rules from CLAUDE.md apply.

---

## Phase 9 — Backend / Auth / Payments (auto, only if PRD requires)

- Auth: Clerk or Auth.js per TRD
- DB: Supabase/Neon/Postgres per TRD; schema versioned with Drizzle/Prisma migrations
- Payments: Stripe per TRD; webhook handling, subscription state synced to DB
- All boundaries Zod-validated

---

## Phase 10 — Quality Gates (auto, parallel subagents)

Five parallel subagents:

**A — Performance**: Lighthouse ≥95 every page, all Core Web Vitals green, 3D scene 60fps M1, inference UI responsive while waiting.

**B — Accessibility**: axe-core clean, keyboard parity, screen reader tested on upload + report flows, color contrast.

**C — SEO**: Per-page metadata, structured data, sitemap, robots.

**D — AI Quality**: Run `/eval-suite`. All test images produce on-spec outputs. No hallucinations beyond research base. All disclaimers present.

**E — Cross-browser**: Playwright on Chromium, WebKit, Firefox, including upload flow and 3D scene rendering.

Iterate until all five clean.

---

## Phase 11 — Cost & Abuse Hardening (auto)

**Goal:** Don't get bankrupted by abuse.

**Steps:**

1. Verify rate limits work (load test with k6 or autocannon)
2. Verify cost tracking — simulate a runaway user, confirm circuit breaker fires
3. Verify image abuse handling — test with non-hand images, NSFW, executables disguised as images
4. Verify prompt injection defense — test with malicious text inputs in any user-supplied field
5. Enable Cloudflare Turnstile or similar bot protection on upload endpoint
6. Add monitoring alerts: cost spike, error rate spike, latency spike, abuse pattern detection

---

## Phase 12 — Pre-Deploy (auto, ends at CP4)

Run `/ship`. Verify and fix every item including AI-app specific:

- All standard launch items (favicons, robots, sitemap, legal pages, env vars, etc.)
- AI-specific:
  - Disclaimers visible on every results page
  - Privacy policy explicitly addresses image handling + AI processing
  - Terms include limitation of liability for AI outputs
  - Cookie/consent banner if needed
  - Cost monitoring dashboard accessible to admin
  - Eval suite passes ≥90%
  - Prompt versions tagged in `/docs/prompts.md`

**→ CHECKPOINT 4.** Human reviews preview URL.

---

## Phase 13 — Deploy (auto, ends at CP5)

Vercel production deploy + custom domain + env vars + Sentry verified + analytics verified + production smoke test (full flow: upload → wait → receive report → verify quality).

**→ CHECKPOINT 5.** Human verifies production with at least 3 real test cases.

---

## Phase 14 — Handoff (auto)

Generate `/docs/handoff.md`:

- Architecture overview
- AI pipeline diagram
- How to update prompts (versioning workflow)
- How to run evals
- Cost monitoring dashboard guide
- How to add a new prompt version safely
- Disclaimer/legal review schedule (recommend quarterly)
- Known limitations from `/docs/risk-register.md`
- Incident response (high cost, hallucination report, etc.)

Tag `v1.0.0`. Final commit.
