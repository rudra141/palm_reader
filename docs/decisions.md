# Decisions Log

Every meaningful technical or product choice gets logged here.

```
## YYYY-MM-DD — [Title]
**Context:** What prompted the decision
**Decision:** What was chosen
**Alternatives:** What else was evaluated
**Rationale:** Why this won
**Consequences:** What this commits us to
```

For AI-specific decisions also include:

- Model choice (provider + model + version)
- Estimated cost per call
- Latency expectation
- Fallback if primary fails

---

## 2026-04-29 — Brand name strategy

**Context:** Raw idea did not specify a brand name.
**Decision:** Domain-researcher / brand subagent will propose 5 candidates with `.com` / `.in` / `.co` availability check; user picks before scaffolding.
**Alternatives:** Ship as "AI Palm Reader" working title; user-supplied name.
**Rationale:** Name ahead of scaffold avoids late-stage rebrand churn (env vars, OG images, copy).
**Consequences:** Domain registration must happen before CP2 to keep deploy paths clean.

---

## 2026-04-29 — Reading-tradition coverage

**Context:** Q2 — raw idea anchored to Indian palmistry exclusively, but user opened the door to other traditions ("indian styles, chinese style etc.").
**Decision:** Multi-tradition product. Each tradition is treated as a **separate, authentically grounded reading style**, never blended. Domain-researcher confirms the canonical technique list per tradition. v1 traditions: **Indian (Hasta Samudrika Shastra)** and **Chinese (Mian Xiang / 面相)**. Within each, multiple sub-styles (e.g., Indian: Comprehensive Samudrika, Hasta-Rekha line-focused, Mount-based; Chinese: Five Elements, Eight Trigrams, classical Ma Yi).
**Alternatives:** Indian-only as raw idea; let domain-researcher pick a single canonical sub-style.
**Rationale:** User explicit. Multiple traditions broadens audience without diluting authenticity, **provided each tradition is sourced from its own primary classical texts** and never conflated. The risk of "Western pop palmistry leaking in" still applies — the disallowed-extensions list in `/docs/research.md` will be enforced per tradition.
**Consequences:**

- `/docs/research.md` must build separate cited sections per tradition.
- The reading-style dropdown groups by tradition.
- The system prompt for the LLM passes the chosen tradition + sub-style as locked context; the model never blends traditions in one report.
- Eval golden set must include ≥3 cases per tradition.
- "Disallowed extensions" must include cross-tradition contamination as a fail mode.

---

## 2026-04-29 — Karmic / past-life elements

**Context:** Q3 — raw idea flagged this as open. Some Indian classical sources discuss karmic markers; Chinese tradition handles fate/destiny differently; many sub-styles are silent.
**Decision:** **Per-technique toggle, default on where the technique authentically supports it.** When a chosen sub-style's primary sources discuss karmic / past-life / destiny themes, the report includes a "Spiritual inclinations & karmic context" section grounded in those sources. When a sub-style's primary sources are silent, the section is omitted entirely (not faked). Domain-researcher annotates each sub-style with a `karmic_supported: true|false` flag in `/docs/research.md`.
**Alternatives:** Always include; always exclude; user-toggleable in UI.
**Rationale:** Authenticity > completeness. Forcing karmic claims into traditions that don't support them is exactly the cross-tradition contamination we're avoiding.
**Consequences:**

- `/docs/ai-spec.md` schema makes the karmic section optional with explicit guard logic in the prompt assembly.
- Eval cases test that karmic-unsupported techniques produce no karmic content.

---

## 2026-04-29 — Localization priority

**Context:** Q4 — international vs India-first.
**Decision:** **International-first, English-only at v1.** USD pricing structure (deferred — see Q10). i18n-ready scaffolding (next-intl or similar) so Hindi + other Indian languages can ship as a fast-follow.
**Alternatives:** India-first INR + Hindi P1; bilingual at launch.
**Rationale:** User picked (b). English maximizes initial reach; Hindi/Indian languages added once core experience proven.
**Consequences:**

- Default locale `en`; routing uses `[locale]` segment from day one.
- All copy authored in `/docs/content-plan.md` with translation-ready keys.
- Pricing copy uses USD numbers but is structurally locale-aware.

---

## 2026-04-29 — Both-hand reading (cross-reference)

**Context:** Q5 — classical Indian palmistry distinguishes dominant vs non-dominant.
**Decision:** **Single hand at v1.** Build the data model + API to accept an optional second hand. Surface "two-hand cross-reference" as a "coming soon — premium feature" stub on the upload screen. Actual implementation deferred to v1.1 alongside subscription rollout.
**Alternatives:** Both hands at v1 (more inference cost); single hand only with no future hook.
**Rationale:** User picked (c). Lets us tease the upgrade path while keeping v1 cost + complexity bounded.
**Consequences:**

- Upload schema accepts `dominantImageId` (required) + `nonDominantImageId` (nullable).
- Inference pipeline ignores the non-dominant slot at v1; v1.1 enables a third pipeline step for cross-reference.
- "Coming Soon" UI is non-functional but visible.

---

## 2026-04-29 — Disclaimer jurisdiction

**Context:** Q6 — drives liability copy.
**Decision:** **India primary jurisdiction**, but copy written conservatively enough to also satisfy US, EU, UK consumer-protection minimums. India primary because product team is India-led; conservative wording protects against international users.
**Alternatives:** US primary; EU primary; multi-region equal-weight.
**Rationale:** User picked (a). Pragmatic: legal entity likely in India, but international users need defensible copy.
**Consequences:**

- `/docs/ai-spec.md` "MUST NEVER" section uses the strictest wording across IN/US/EU/UK.
- Privacy policy + ToS state Indian governing law + arbitration seat, with carve-outs for users protected by mandatory consumer-law jurisdictions.
- Health-section disclaimer cites the strict "informational only, not medical advice" framing required across all four regimes.
- Schedule a legal review of disclaimer copy before CP4.

---

## 2026-04-29 — 3D scroll-story reference imagery

**Context:** Q7 — Beats 3-N (lifestyle aspiration) need reference frames before Phase 7.
**Decision:** **User delivers reference video / frames at CP2.** Until CP2, `/docs/scroll-story.md` defines the beats with placeholder slots + brand interpretation language only.
**Alternatives:** Domain-researcher sources cinematic mood references; hybrid.
**Rationale:** User picked (a). Founders know the brand best.
**Consequences:**

- Phase 3 (Design System + 3D POC) builds Beat 1 (hand close-up) only — does not touch Beats 3-N.
- Phase 7 (full scroll story) is gated on CP2 reference-frame delivery.

---

## 2026-04-29 — Deadline

**Context:** Q8 — raw idea said `[FILL IN]`.
**Decision:** **No hard deadline. Quality over speed.**
**Alternatives:** 6-week sprint; 12-week sprint.
**Rationale:** User explicit — "whatever time it takes."
**Consequences:**

- No artificial pressure to ship at CP1 / CP4 dates.
- Each phase ends when its quality bar is met, not on a calendar.
- If scope creep emerges, it's logged in `/docs/decisions.md` rather than rejected for time.

---

## 2026-04-29 — User accounts in v1

**Context:** Q9 — raw idea was conditional ("Clerk if accounts needed").
**Decision:** **Accounts at v1 via Clerk.** Save-history dashboard, share links, account settings. Anonymous flow remains supported (one free reading per email without sign-up) but the dashboard is gated on account creation.
**Alternatives:** Anonymous-only v1; hybrid optional account.
**Rationale:** User picked (a). Account-bound history + future subscription + future per-user budget cap all benefit.
**Consequences:**

- Clerk added as P0 dependency in `/docs/trd.md`.
- DB schema includes `users`, `readings`, `reading_shares` tables linked by `user_id` (nullable for anonymous).
- Cost-tracking middleware tracks both `userId` and `ipHash` for limits.

---

## 2026-04-29 — Monetization at launch

**Context:** Q10 — "free for now for all the features, will integrate the subscription afterwards."
**Decision:** **Free-for-all at v1. No paid tier active. No Stripe in v1.** Subscription tier scaffolding is built but feature-flagged off (`SUBSCRIPTION_ENABLED=false`). All features available to all users at launch. Stripe integration ships in v1.1 when the team is ready to switch flags.
**Alternatives:** Freemium live at v1; free-only v1 with no subscription scaffolding.
**Rationale:** User explicit. Avoids payment-gateway compliance scope at launch; lets the team validate product-market fit before monetizing.
**Consequences:**

- v1 ships **without Stripe** — no PCI scope, no webhook handling, no subscription state at launch.
- DB schema includes `subscription_tier ENUM ('free', 'premium')` defaulting to `free`; all v1 users get full access regardless.
- Per-user budget cap stays in place ($5/day per user) to prevent runaway abuse, even though all readings are free.
- Cost risk is significant — see TRD + risk-register for mitigations (rate limiting, daily caps, optional cost-optimized tier fallback).
- v1.1 task: enable Stripe, flip flag, retroactively gate features per the cost-saving plan.

---

## 2026-04-29 — Model selection

**Context:** Q11 — premium vs cost-optimized vs hybrid.
**Decision:** **Premium across the board. Vision: Claude Sonnet 4.6. Reasoning: Claude Opus 4.7.**

- Vision pass model: `claude-sonnet-4-6` (1M context capable; well-suited for image analysis at the cost target)
- Reasoning pass model: `claude-opus-4-7` (latest Opus; produces master-practitioner tone)
- Estimated cost per reading: $0.30-0.50 (within budget)
- Estimated latency: P50 ~10-15s, P95 ~25-30s
- Fallback: OpenAI GPT-4o vision + Anthropic Sonnet reasoning if Anthropic outage; defined in TRD.

**Alternatives:** Cost-optimized (Sonnet+Sonnet, $0.10-0.20/reading); hybrid by tier.
**Rationale:** User picked (a). Tone quality is the brand promise; the master-practitioner voice depends on Opus-level reasoning.
**Consequences:**

- v1 ships free + premium models = high inference cost per user with zero direct revenue. Mitigated by per-user daily cap, IP-based rate limiting, Cloudflare Turnstile bot defense.
- Cost circuit breaker: if monthly inference spend exceeds $X (set in TRD), the app automatically degrades the reasoning tier to Sonnet 4.6 and surfaces a banner ("Demand has spiked — readings may be slightly less detailed today"). Logged loud in `/docs/decisions.md` if it ever fires.
- **Open risk:** if v1 goes viral, the cost line could exceed comfortable limits before the v1.1 subscription ships. Risk-register tracks this as the #1 business risk.

---

## 2026-04-29 — Privacy retention

**Context:** Q12 — raw idea proposed 24h-delete-unless-opt-in; user wants tier-gated eventually but starts with the simpler default.
**Decision:** **v1: 24h delete-unless-opt-in.** All uploaded images deleted from blob storage 24h after upload, unless the user chose "Save my reading" at upload time. Reports (the textual output) persist indefinitely unless the user requests deletion. v1.1 will introduce tier-gated retention (free = ephemeral after inference; premium = opt-in retention).
**Alternatives:** Stricter ephemeral at v1; tier-gated at v1.
**Rationale:** User picked "c but for now a." Simpler operational story at launch.
**Consequences:**

- Vercel Blob lifecycle policy or scheduled cron deletes images at upload + 24h.
- Privacy policy explicitly states 24h retention default.
- "Save my reading" toggle on the upload screen is the opt-in.
- v1.1 retention rework requires DB schema for `retention_policy ENUM ('ephemeral','24h','indefinite')` per reading.

---

## 2026-04-29 — React 18 pin (deviation from "React 19" default)

**Context:** Phase 2 scaffolding. The TRD/CLAUDE.md drafts mention React 19, but `@react-three/fiber@9` (R3F + React 19) is still landing as alpha and `@react-three/drei` lags behind on full React 19 compatibility. The 3D scroll story (Beats 1-4) is load-bearing for the brand, so the 3D ecosystem must be stable.
**Decision:** Pin **`react@^18.3.1`** + **`react-dom@^18.3.1`** + **`@react-three/fiber@^8.17.10`** + **`@react-three/drei@^9.117.0`**. Next.js 15 explicitly supports either React 18 or React 19; Next 15 + React 18 is the most production-tested combo for the 3D stack.
**Alternatives:**

- React 19 + R3F 9 alpha: bleeding edge but flaky in WebKit; defers shipping for stability work.
- React 19 + drop R3F: would break the brand's 3D promise.

**Rationale:** Quality > novelty. The brand promise is the cinematic 3D experience; the React major version is invisible to users.
**Consequences:**

- React 19 features (Actions, `useActionState`, etc.) are not available at v1. We don't depend on any of them.
- Upgrade to React 19 reconsidered when R3F 9 stable + drei React-19-compatible release lands. Not before v1.1.

---

## 2026-04-29 — Next.js 15.2.3 (bumped from 15.0.3)

**Context:** Phase 2 scaffolding. Initial pin was `next@15.0.3`; pnpm install surfaced a peer-dep conflict — Clerk requires `next ^15.2.3+`.
**Decision:** Bump to **`next@^15.2.3`**. Stay on Next 15.x major; do not jump to Next 16 (released but not yet validated against our 3D + AI stack).
**Alternatives:** Pin Clerk to an older version (gives up Clerk features); skip Clerk (rejected — accounts are P0).
**Rationale:** Smallest viable bump that resolves the peer warning.
**Consequences:** None — `^15.2.3` will pick up patch releases automatically; we stay below 16 by virtue of caret constraint.

---

## 2026-04-29 — Tailwind CSS v4 beta (over Tailwind v3)

**Context:** TRD specifies Tailwind v4. v4 stable was not yet shipped at scaffold time; `tailwindcss@^4.0.0-beta.5` was the latest tested release. v4 ditches `tailwind.config.ts` in favor of CSS-first `@theme` blocks — aligns with our "tokens in CSS" approach.
**Decision:** Use **`tailwindcss@^4.0.0-beta.5`** + **`@tailwindcss/postcss@^4.0.0-beta.5`** with all design tokens declared in `app/globals.css` via `@theme {}`. No `tailwind.config.ts` file.
**Alternatives:** Tailwind v3 with separate config — feels redundant against our CSS-custom-properties source of truth.
**Rationale:** v4's CSS-first approach is the natural pairing with our token-as-CSS-vars design system.
**Consequences:**

- Pinned to beta until v4 stable lands; bump to stable when available with no expected migration work.
- Some tooling (e.g., older IDE Tailwind LSPs) may not yet recognize v4 syntax. Tracked but not blocking.

---

## 2026-04-29 — Phase 2 scaffold scope (minimal-runnable)

**Context:** The Foundation phase per `/docs/workflow.md` Phase 2 calls for the full stack to be installed and runnable, but does not require any feature code beyond a placeholder home page.
**Decision:** Scaffold contains:

- All deps installed (Next 15, React 18, R3F 8, AI SDK, Zod, Clerk, Sentry, PostHog, Stripe, Drizzle, Upstash, Sharp, etc.)
- `app/layout.tsx` + `app/page.tsx` + `app/not-found.tsx` (placeholder copy from `/docs/content-plan.md`)
- `app/globals.css` with full design-token system per `/docs/design-system.md`
- `lib/utils.ts` (`cn`), `lib/validation/inputSchemas.ts`, `lib/validation/reportSchema.ts`, `lib/ai/client.ts` (placeholder), `lib/ai/prompts.ts` (placeholder ID registry)
- `vitest.config.ts` + `vitest.setup.ts` + `playwright.config.ts`
- `evals/runner.ts` placeholder
- Empty placeholder folders (`/components/ui`, `/components/sections`, `/components/3d`, `/lib/vision`, `/hooks`, `/content/en`, `/public`, `/evals/golden`, `/evals/golden/few_shot`, `/tests/e2e`) with `.gitkeep`
- `.env.example` documenting every required key per TRD §8
- `.gitignore`, `.prettierrc`, `.prettierignore`, `.eslintrc.json`, `.nvmrc`, `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `package.json`, project-specific README

Quality gates verified clean at scaffold time:

- `pnpm typecheck` ✓
- `pnpm lint` ✓
- `pnpm build` ✓ (one CSS warning resolved)
- `pnpm vitest --run --passWithNoTests` ✓

**Consequences:** Phase 3 (Design System + 3D POC) starts from a green build with hooks already enforcing prettier/eslint on save and typecheck/tests on stop.

---

## 2026-04-29 — Hook command syntax fix

**Context:** `.claude/settings.json` Stop hook called `pnpm test --run --passWithNoTests`, which pnpm rejects (intercepts `--run` as a pnpm flag).
**Decision:** Update Stop hook to `pnpm vitest --run --passWithNoTests` (calls vitest binary directly, bypassing pnpm's flag parser). Also gate the entire hook on `[ -d node_modules ]` so it doesn't fail before `pnpm install` runs.
**Rationale:** Both quality-gate runs (typecheck + tests) need to actually work for the hook to be useful.
**Consequences:** None — purely a fix.

---

## 2026-04-29 — Scroll-story asset pipeline (CP2 reference imagery decision)

**Context:** User delivered a Veo-generated 8 s, 24 fps, 1280×720 H.264 MP4 (`asset/Whisk_*.mp4`, 4.2 MB) plus 240 ezgif-extracted JPGs. Watermark "Veo" in bottom-right of every frame must be removed (decision Q1 → option b). Phase 3 (CP2) needs a scroll-tied video pipeline that supports frame-perfect scrub on mobile Safari + low-bandwidth desktop.

**Decision: All-intra H.264 video, served as the canonical scroll-story asset.**

Pipeline (executed at scaffold time; lives in `/scripts/encode-scroll-story.sh` for re-runs):

1. Source: `asset/Whisk_*.mp4` (192 frames; 240 ezgif JPGs were duplicates).
2. Watermark removal: `delogo=x=1150:y=645:w=128:h=70` — content-aware fill from surrounding pixels. Verified clean on first/last frames.
3. Re-encode all-intra (`-g 1 -keyint_min 1 -sc_threshold 0 -bf 0`) so every frame is a self-decodable I-frame → frame-perfect `currentTime` scrub on every browser including Safari.
4. Two output variants:
   - `public/scroll-story/story-720p.mp4` — 1280×720, CRF 23, 6.6 MB (desktop / large viewports)
   - `public/scroll-story/story-480p.mp4` — 854×480, CRF 24, 3.2 MB (mobile)
5. Poster: `public/scroll-story/story-poster.jpg` — frame 1 still, 79 KB. Used as `<video poster>`, fallback for reduced-motion + low-power, and OG image base.
6. Audio dropped (`-an`) — scroll story is silent at v1.

**Why all-intra over delta-encoded H.264:**
Naïve `<video>` + `video.currentTime = scrollProgress` is keyframe-bound; backward scrub stutters, mobile Safari has 50–200 ms paint lag. All-intra makes every frame a keyframe → frame-perfect seek; pair with `requestVideoFrameCallback` in the player for refresh-rate-locked sync. Only cost is ~3× bandwidth vs. delta-encoded video — acceptable on lazy-loaded chunk after page interactive.

**Why not the JPG image-sequence path:**
240 JPGs × 27 KB = 6.5 MB anyway; 240 HTTP requests; CPU image decode on main thread. All-intra video gives equivalent scrub fidelity, hardware-accelerated decode, single request.

**Tooling:** `ffmpeg-static` + `ffprobe-static` added as dev deps so the encode is reproducible without a system ffmpeg install.

**Visual identity:** Per Q2 (decision option a) the lifestyle aesthetic is **distinctly Indian** for v1 (temple terrace, dhoti-kurta figure, Sanskrit-coded landscape). Beats map approximately:

- Beat 1 (frames 1–~50) — sculptural hand close-up with gold-glow lines
- Beat 2 (~50–~90) — portal zoom into the lines
- Beat 2→3 transition (~90–~110) — gold light burst with mountains emerging
- Beat 3 (~110–~170) — landscape with palm tree at golden hour
- Beat 3/4 (~170–~240) — practitioner figure on temple terrace at sunset

Chinese-tradition users see the Indian visual at landing; logged risk to revisit at v1.1 for a parallel Chinese visual track.

**Consequences:**

- Phase 3 (CP2) hero renders Beat 1 from `story-720p.mp4` — full video file shipped; player only renders frames 0 → ~1.6 s for Beat 1.
- Phase 7 (full scroll story) wires all 4 beats to scroll progress using the same single video file.
- `asset/` (raw source) committed to repo as project property; future re-encodes use the script.
