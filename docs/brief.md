# Brief — AI Palm Reader (working title)

> Source: `MASTER_PROMPT.md` raw-idea block, 2026-04-28. This brief is the canonical synthesis of the raw idea before PRD/TRD generation. Updated in Phase 1 only; locked after CP1.

---

## One-liner

A premium AI-powered web app that delivers cinematic, personalized palm readings rooted in authentic Indian palmistry tradition — speaking with the conviction of a master practitioner serving VVIP clients, never the wishy-washy hedging of pop-culture fortune-telling.

## What it is

User uploads a photo of their hand on a phone or laptop. The AI:

1. Analyzes lines, mounts, finger structure, hand shape, and other markers using authentic Indian palmistry (Hasta Samudrika Shastra / Samudrika Shastra)
2. Returns a complete personalized report covering character, life path, relationships, career, health indications (with strict disclaimers), fortune timing, strengths, weaknesses, spiritual inclinations, and overall life trajectory
3. Renders the report as a beautifully typeset, sectioned, scrollable page; shareable via privacy-protected URL; downloadable as PDF; optionally saveable to a user account

The landing experience is a cinematic 3D scroll story — hand close-up → portal-zoom through the lines → aspirational lifestyle sequence → upload CTA. Resolves within ~3 viewport heights.

## Why this is different

- **Authentic source-grounding, not pop-palmistry**: Knowledge base is exclusively from Indian primary classical texts and reputable scholar-practitioners. No Western pop-palmistry repackaged. No New Age blog content. Every claim traceable to `/docs/research.md` with citations. Note North vs South Indian regional variations where they exist.
- **Master-practitioner persona, not a horoscope app**: Confident, decisive, authoritative voice. A reader with decades of experience who speaks with conviction — never "maybe" or "could be."
- **Premium product surface**: Apple-product-film 3D quality, Aesop/Hermès typographic restraint, Indian temple aesthetic motifs (subtly, not literally). Not strip-mall psychic vibes.
- **User chooses the reading technique**: Different traditions exist within Indian palmistry. The user picks the system before analysis runs; prompt and report structure adapt to the choice.

## Target user (initial hypothesis — refine in PRD)

Primary: spiritually curious, premium-leaning Indian and Indian-diaspora adults (25-55) who want a serious reading, not a meme. Appreciate craft and depth. Comfortable paying ₹500-2,000 for a premium digital experience that feels handmade.

Secondary: international audiences interested in authentic Indian wisdom traditions (the "Aesop customer" — aesthetically-driven, willing to pay for quality, allergic to kitsch).

## Core user flow

1. Land on the cinematic 3D scroll page
2. Tap CTA → `/upload`
3. Upload a hand photo (clear photo guidance: well-lit, palm fully visible, fingers spread, dominant hand by default; non-dominant optional; both-hand cross-reference TBD per CP1 question)
4. Optional context: name, gender, date of birth (if relevant to the chosen technique), dominant hand
5. Select reading technique from dropdown (techniques TBD — domain-researcher will confirm legitimate options during Phase 1)
6. Inference runs — engaging "analyzing line by line" progressive loading state
7. Personalized report renders on its own page
8. Report is shareable (privacy-protected, noindex), downloadable as PDF, optionally saved to account

## Report structure (per `/docs/ai-spec.md`)

- Opening: overall hand impression and life-essence summary
- Character & personality
- Mind & intellect
- Emotional life & relationships
- Career & profession
- Wealth & material life
- Health indications (mandatory "informational only, not medical advice" disclaimer)
- Life trajectory & timing of major events
- Spiritual inclinations
- Strengths to leverage
- Areas to be mindful of
- Closing: master practitioner's parting guidance

## Mandatory constraints (immutable)

- "For entertainment and reflection purposes" disclaimer on every report
- "Not a substitute for medical, legal, financial, or professional advice"
- Health section never diagnoses conditions
- No exact dates of death — ever
- No predictions that could cause psychological harm if believed (specific tragedy predictions, etc.)
- The `/docs/ai-spec.md` "MUST NEVER" section will be tight on this and reviewed at every CP

## Visual experience (4 scroll beats; finalized in `/docs/scroll-story.md`)

1. **Beat 1 — hook**: hand close-up, sculptural, dramatically lit, lines glowing subtly. The hero moment.
2. **Beat 2 — transition**: camera zooms INTO the hand, through the lines as if entering a portal.
3. **Beats 3-N — aspiration**: lifestyle sequence in master-practitioner aesthetic — premium, aspirational, cinematic; closer to luxury film/editorial than stock lifestyle. Reference imagery TBD at CP2.
4. **Final beat — convert**: resolves into upload CTA.

Reduced-motion + low-power fallback: same narrative as sequential image+text panels (HTML+CSS only), generated from the brand interpretation.

Total scroll story resolves within ~3 viewport heights — never feels endless.

## Brand vibe

Premium, mystical-but-grounded, authoritative, ancient-meets-modern, confident, deeply Indian without being kitsch. Reference points: Apple product film aesthetic for 3D quality; Aesop / Hermès for typography and restraint; traditional Indian temple aesthetics for deeper visual motifs (subtly, not literally). The mental model: a private consultation with a master in a candlelit study, not a strip-mall psychic.

## Tech preferences (defaults; final in `/docs/trd.md`)

- Vision: Claude Sonnet (latest) for image analysis
- Reasoning: Claude Opus or Sonnet (latest) for report generation, depending on cost/quality balance — confirmed at CP1
- Fallback: OpenAI / Google providers per TRD
- Hosting: Vercel
- DB: Supabase (or per TRD)
- Auth: Clerk if user accounts ship in v1
- Payments: Stripe if monetization ships in v1
- Storage: Vercel Blob with strict 24h retention default (delete unless user opts in to "save my reading")

## Privacy posture

User images are sensitive. Strict no-train, no-log, EXIF-stripped, retention-limited, signed URLs only. Privacy policy unambiguous. Allow user to request deletion of their reading at any time. Sentry never captures image bytes.

## Budget

- Per-reading inference cost target: under **$0.50** (vision pass + LLM pass combined)
- Per-user daily budget cap: **~$5** (≈10 readings) to prevent abuse — circuit breaker at this threshold
- Total infra budget at low traffic: **~$100/mo**, scaling with revenue

## Monetization (default proposal — confirm at CP1)

Freemium: one free basic reading per email; paid tier(s) for comprehensive readings, multiple techniques, saved history, PDF export. Pricing tiers proposed in PRD.

## Language

Default English. Hindi as P1 (build i18n-ready, ship English first).

## Platform

Web only at v1. Mobile-responsive non-negotiable — most users on phone, including the camera-capture upload step.

## Out of scope for v1

- Live chat with human reader
- Video reading
- Mobile native app
- Astrology / numerology integrations (P2)
- White-label / B2B offering
- Multi-user accounts / family readings

## Deadline

TBD — see CP1 question 8.

## Top open questions (asked at CP1; deeper list in `/docs/risk-register.md`)

1. Brand name + domain availability
2. Specific reading techniques in the dropdown (domain-researcher to confirm)
3. Karmic / past-life elements yes / no / per-technique toggle
4. Localization priority: India-first vs international-first
5. Both-hand cross-reference v1 or P2
6. Disclaimer jurisdiction
7. 3D lifestyle reference imagery: user-supplied at CP2 vs domain-researcher-sourced
8. Concrete deadline
9. User accounts at v1 or anonymous v1
10. Monetization: paid tiers live at v1 or free-only v1
11. Model selection: premium (Sonnet+Opus) vs cost-optimized (Sonnet+Sonnet)
12. Privacy retention: 24h-delete-unless-opt-in vs ephemeral-only

## Top risks (early — full version in `/docs/risk-register.md` after CP1 inputs)

- **Hallucination beyond the research base** — mitigated by traceability + LLM-as-judge filter + golden eval set
- **Cultural mis-attribution** (Western pop-palmistry leaking in via base-model priors) — mitigated by tightly grounded prompts + domain-researcher gate
- **Cost runaway** — mitigated by per-user daily cap + circuit breaker + Upstash rate limits
- **Disclaimer/legal exposure** (especially health framing) — mitigated by hard `MUST NEVER` rules + output filters + jurisdiction-specific copy review
- **Image abuse** (executables, NSFW, polyglots) — mitigated by sharp normalization + content checks + signed-URL retention
- **3D performance on mid-tier mobile** — mitigated by reduced-motion + low-power fallback + Draco compression + texture compression
