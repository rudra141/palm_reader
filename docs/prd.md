# PRD — AI Palm Reader

> Locked at CP1. Edits after CP1 require explicit human approval.

---

## 1. Problem

People who are spiritually curious — especially Indian and Indian-diaspora adults, and aesthetically-driven international audiences — have very few options for getting a palm reading that feels **authentic, premium, and intellectually serious**. Today's options:

- Pop-culture fortune-teller apps and websites that conflate Western, Indian, and New Age traditions into a generic horoscope-flavored experience
- In-person practitioners who vary wildly in skill, are difficult to access, and are expensive at the master tier
- Free YouTube content of widely varying quality, with no guarantee of source-grounding

There is no premium digital product that:

1. Reads from authentic primary classical sources (Indian Hasta Samudrika Shastra, Chinese Mian Xiang)
2. Lets the user choose which tradition + sub-style they want
3. Speaks with the conviction of a master practitioner — never wishy-washy
4. Treats the customer surface (visual design, typography, motion) the way a luxury brand would

This product fills that gap.

## 2. Personas

### Persona A — "The Premium Indian Seeker" (primary)

- 28-45, professional, India-resident or Indian diaspora (US/UK/Singapore/UAE)
- Has casual familiarity with Indian wisdom traditions but isn't a scholar
- Comfortable spending ₹500-2,000 on a digital experience that feels handcrafted
- Has paid for therapy, paid premium for ChatGPT, follows brands like Aesop or Native
- Skeptical of "mystic" branding but open to sincere classical traditions
- Mobile-first; reads on phone in evening / weekends

### Persona B — "The Aesop Customer" (secondary)

- 30-50, international (US, UK, EU, Australia)
- Aesthetically driven; pays for craft and quality
- Curious about non-Western wisdom traditions; allergic to kitsch
- Found us through curated newsletter, Are.na, design-Twitter, or word of mouth
- Reads on desktop and phone; appreciates polished web experiences

### Persona C — "The Diaspora Student / Young Professional" (tertiary)

- 22-30, Indian-diaspora or Chinese-diaspora, lives outside heritage country
- Reconnecting with ancestral tradition through curiosity / identity work
- Lower spending power but high engagement; shares strong content
- Mobile-only; iOS Safari + Android Chrome

## 3. User journeys

### J1 — Anonymous first-time reading (the "happy path")

1. User lands on `/` from social, search, or word of mouth
2. Scroll story plays — hand close-up → portal zoom → lifestyle aspiration → CTA
3. User clicks "Begin reading"
4. Routed to `/upload`
5. Uploads a photo of their dominant hand (camera capture or file picker)
6. Optional context entered: name, date of birth, dominant hand confirmation
7. Selects tradition + sub-style from dropdown (e.g., "Indian — Comprehensive Samudrika")
8. Confirms "I understand this is for entertainment and reflection only" (mandatory checkbox)
9. Inference runs — animated loading state with progressive feedback ("Reading your major lines... Examining the mounts... Synthesizing your report...")
10. Routed to `/report/[id]` — full report renders
11. User reads, optionally downloads PDF, optionally shares via private link

### J2 — Returning user with account

1. Same as J1 steps 1-7
2. User clicks "Save to my history" — prompted to sign in (Clerk)
3. After auth, returned to upload state with context pre-filled
4. Inference runs, report saved to account dashboard
5. Future visits: `/dashboard` shows past readings

### J3 — Sharing a reading

1. User finishes reading
2. Clicks "Share" — generates a unique URL
3. URL is `noindex`, requires the share token to view
4. Shared user lands on read-only report view, sees soft CTA to do their own reading

### J4 — User requests reading deletion

1. From dashboard or share-link recipient lands on "Delete this reading" modal
2. Confirms with email or account match
3. Reading + associated image (if still within retention window) hard-deleted
4. Confirmation email

### J5 — User encounters inference failure

1. User uploads, runs inference
2. Vision pass fails to detect a hand (e.g., blurry photo, wrong subject)
3. Friendly explanation surfaces — "We couldn't see your palm clearly. Tips: well-lit, palm fully open, fingers spread, fill the frame." Re-upload affordance.
4. No charge to user (irrelevant in v1 since all free; matters when monetization ships).

## 4. Page inventory

Pages in scope for v1, all listed in `/docs/sitemap.md`:

- `/` — Landing with cinematic 3D scroll story + CTA
- `/upload` — Multi-step upload + context entry flow
- `/report/[id]` — Generated report view (Server Component)
- `/share/[token]` — Read-only shared report view (noindex)
- `/dashboard` — User's saved-readings list (auth required)
- `/sign-in`, `/sign-up` — Clerk-hosted auth
- `/about` — Brand story, methodology, sources (links to research.md context)
- `/methodology` — Detail on traditions + sub-styles + how the AI is grounded
- `/privacy` — Privacy policy (image lifecycle explicit)
- `/terms` — Terms of service (AI-output limitation of liability)
- `/disclaimer` — Standalone disclaimer page (entertainment, not medical/legal/financial)
- `/contact` — Email + form
- `/design-system` — internal route (CP2 deliverable; production-gated by env)

Error/utility:

- `/404`
- `/500`
- `/loading` (per-route `loading.tsx`)

## 5. Features

### P0 — must ship at v1

| ID  | Feature                                         | Notes                                                                        |
| --- | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| F1  | Cinematic 3D scroll-story landing               | 4 beats; Beat 1 in CP2, Beats 2-4 in Phase 7 once reference frames delivered |
| F2  | Hand-photo upload with camera capture on mobile | sharp normalize, EXIF strip, signed URL, 24h retention default               |
| F3  | Optional user context entry                     | Name, gender, DOB, dominant hand                                             |
| F4  | Tradition + sub-style dropdown                  | Indian (3 sub-styles) + Chinese (3 sub-styles) confirmed in research.md      |
| F5  | Mandatory disclaimer checkbox                   | Cannot proceed without checking                                              |
| F6  | Multi-step inference pipeline                   | Vision → reasoning → Zod-parse → persist                                     |
| F7  | Long-form report rendering                      | All 11 standard sections, well-typeset                                       |
| F8  | PDF export                                      | Server-rendered PDF on demand                                                |
| F9  | Private share link                              | Unique token, noindex                                                        |
| F10 | User accounts via Clerk                         | Save history, dashboard                                                      |
| F11 | "Save my reading" opt-in retention toggle       | Drives image lifecycle                                                       |
| F12 | Mandatory disclaimers in report                 | Per ai-spec; rendered in every output                                        |
| F13 | Entertainment / not-medical-advice copy         | Throughout the product                                                       |
| F14 | Reduced-motion + low-power 3D fallbacks         | Static panels narrating same beats                                           |
| F15 | Per-IP and per-user rate limits                 | Upstash; 5 readings/day default                                              |
| F16 | Per-user daily cost cap                         | Circuit breaker at $5/user/day                                               |
| F17 | Cost circuit breaker (system-wide)              | Auto-degrade reasoning model if monthly spend exceeds threshold              |
| F18 | Sentry error capture (no image bytes)           | Errors only                                                                  |
| F19 | Reading deletion request                        | Self-service from dashboard or share link                                    |
| F20 | Cloudflare Turnstile (or equivalent) on upload  | Bot defense                                                                  |
| F21 | Two-hand cross-reference UI stub                | "Coming soon — premium feature" non-functional                               |

### P1 — fast follows after v1 (in v1.1 timeline)

| ID  | Feature                     | Notes                                                   |
| --- | --------------------------- | ------------------------------------------------------- |
| P1a | Stripe + subscription tiers | Activates the `subscription_tier` flag                  |
| P1b | Two-hand cross-reference    | Activates F21                                           |
| P1c | Tier-gated retention        | Free=ephemeral, Premium=opt-in retention                |
| P1d | Hindi locale + content      | Then Tamil, Marathi as P2                               |
| P1e | More Chinese sub-styles     | If research.md surfaces additional canonical sub-styles |

### P2 — speculative

| ID  | Feature                            | Notes                                             |
| --- | ---------------------------------- | ------------------------------------------------- |
| P2a | Astrology / numerology integration | As separate, distinct module per tradition        |
| P2b | Audio narration of report          | TTS in master-practitioner voice                  |
| P2c | Comparison reading                 | Run multiple sub-styles on same hand and contrast |
| P2d | "Practitioner's notebook"          | Long-form exploration of specific markers         |

### Out of scope for v1 (locked from raw idea)

- Live chat with human reader
- Video reading
- Mobile native app
- Astrology / numerology integrations
- White-label / B2B offering
- Multi-user / family readings

## 6. Open questions (carry into Phase 2 + later)

- **Brand name** — pending subagent proposal at end of Phase 1
- **Methodology page depth** — how much of `/docs/research.md` do we surface publicly? Trade-off: transparency vs. exposing the prompt's grounding strategy. Default: a curated, less-technical version.
- **Content strategy / blog** — does v1 ship with `/blog`? Default: no blog at v1; sample-reading explainers live on `/methodology`.
- **Email capture** — do we collect email at upload (for the "1 free per email" gate that was originally proposed)? Default: no email gate at v1 since all free; revisit at v1.1.
- **Analytics consent** — do we ship a cookie banner at v1? Default: yes if any non-essential cookies; PostHog with EU consent gating.

## 7. Monetization model

- **v1**: free for all features. No payment integration. Subscription tier scaffolding is built and feature-flagged off (`SUBSCRIPTION_ENABLED=false`).
- **v1.1**: Stripe integration enabled. Tiers (proposed; finalized at v1.1 PRD review):
  - **Free**: 1 reading per email per month, single-hand only, no PDF export, basic share link, ephemeral retention
  - **Premium** (~$9 / ₹499 single, or ~$29 / ₹1,499 monthly unlimited): full report depth, all sub-styles, PDF export, two-hand cross-reference, opt-in retention, account dashboard

## 8. Disclaimer requirements (locked)

Every report **must** include:

- "For entertainment and reflection purposes."
- "Not a substitute for medical, legal, financial, or professional advice."
- A health-section preamble: "The following are traditional textual associations between hand markers and constitutional tendencies. They are not medical diagnoses or substitutes for professional medical advice. If anything in this section concerns you, consult a qualified clinician."
- No exact dates of death — ever.
- No specific tragedy predictions (no "you will have a car accident in 2027").
- No predictions that could cause psychological harm if believed at face value.

These are enforced by:

1. The system prompt (`/docs/prompts.md` master template)
2. Output filter (regex + LLM-as-judge per `/docs/ai-spec.md`)
3. The Zod schema requiring the disclaimer fields to be present before render
4. The render layer rendering disclaimers as visible UI even if the model omits them

## 9. Success metrics for v1 (track from Day 1)

- **Quality**: eval pass rate ≥90% (per `/docs/evals.md`)
- **Latency**: P50 inference < 12s, P95 < 30s
- **Cost**: avg cost per reading < $0.50; monthly burn within infrastructure budget
- **Performance**: Lighthouse ≥95 all categories on every public page; LCP < 2s
- **Engagement**: median time-on-report > 90s (signal of actual reading)
- **Quality of share**: ≥10% of completed readings result in a share-link generation
- **Safety**: 0 unsafe outputs in production over rolling 30-day window; if any, immediate eval-suite triage

## 10. Out-of-scope (immutable for v1)

Restated for clarity. Anything below is not built, not designed, not sold:

- Live chat with a human reader
- Video reading
- Mobile native app
- Standalone astrology, numerology, or vastu modules
- White-label or B2B offerings
- Multi-user / shared / family readings
- Real-money fortune-telling claims (lottery, investments, betting)
- Past-life identity claims
- Specific medical diagnoses
- Exact dates of death

## 11. Cross-references

- `/docs/brief.md` — original synthesis
- `/docs/trd.md` — technical decisions, model choices, performance budgets
- `/docs/ai-spec.md` — what the AI must / must never do
- `/docs/research.md` — domain knowledge base (citations)
- `/docs/prompts.md` — versioned prompt library
- `/docs/sitemap.md` — IA + URL structure
- `/docs/content-plan.md` — per-page copy
- `/docs/design-system.md` — tokens + components + motion
- `/docs/scroll-story.md` — 3D narrative beat-by-beat
- `/docs/risk-register.md` — known risks + mitigations
