# Sitemap — IA + URL structure

> Locked at CP1.

---

## URL tree

```
/                                  Landing — cinematic 3D scroll story + CTA
/upload                            Multi-step upload + context entry
/report/[id]                       Generated report (Server Component)
/share/[token]                     Read-only shared report (noindex)
/dashboard                         Saved-readings list (auth required)

/about                             Brand story, methodology overview
/methodology                       Detailed traditions + sub-styles + grounding philosophy
/disclaimer                        Standalone disclaimer page
/privacy                           Privacy policy (image lifecycle explicit)
/terms                             Terms of service
/contact                           Contact form + email

/sign-in                           Clerk-hosted (or modal)
/sign-up                           Clerk-hosted (or modal)

/design-system                     Internal route (env-gated; not public)

/api/upload                        POST: image ingest
/api/analyze                       POST: orchestrate inference pipeline
/api/report/[id]                   GET: fetch saved report
/api/share/[token]                 GET: fetch shared report (token-gated)
/api/reading/[id]/delete           POST: hard-delete a reading + image
/api/admin/costs                   GET: cost dashboard (admin role)

/_404                              Custom 404
/_500                              Custom 500
```

## Locales

- `[locale]` segment optional in URLs at v1; default `en`.
- v1 ships `en` only.
- v1.1+: `hi` (Hindi); URLs become `/hi/upload` etc.
- Routing config in `/middleware.ts` handles locale negotiation via `Accept-Language` header for first visit, then cookie persistence.

## Page metadata defaults

| Route            | Title pattern                                                      | Indexable        | OG image             |
| ---------------- | ------------------------------------------------------------------ | ---------------- | -------------------- |
| `/`              | "[Brand] — Authentic palm readings, drawn from the original texts" | yes              | hero hand still      |
| `/upload`        | "Begin your reading — [Brand]"                                     | yes              | upload-themed        |
| `/report/[id]`   | "Your reading — [Brand]"                                           | **no** (privacy) | brand default        |
| `/share/[token]` | "A reading from [Brand]"                                           | **no**           | per-share dynamic OG |
| `/dashboard`     | "Your readings — [Brand]"                                          | **no** (auth)    | brand default        |
| `/about`         | "About [Brand]"                                                    | yes              | brand portrait       |
| `/methodology`   | "Methodology — how the readings are grounded"                      | yes              | brand portrait       |
| `/disclaimer`    | "Disclaimer — [Brand]"                                             | yes              | brand default        |
| `/privacy`       | "Privacy — [Brand]"                                                | yes              | brand default        |
| `/terms`         | "Terms — [Brand]"                                                  | yes              | brand default        |
| `/contact`       | "Contact — [Brand]"                                                | yes              | brand default        |

## Navigation IA

### Header (sticky on scroll, transparent until scrolled)

- Logo (link to `/`)
- "Methodology" (link to `/methodology`)
- "About" (link to `/about`)
- "Begin reading" (CTA, link to `/upload`) — primary
- "Sign in" (link to `/sign-in`) — secondary, hidden when authed
- Avatar dropdown (dashboard, sign out) — when authed

### Footer

- Brand block (logo, single-line tagline)
- Column 1: Methodology, About, Disclaimer
- Column 2: Privacy, Terms, Contact
- Column 3: Indian tradition link, Chinese tradition link (anchor links into `/methodology`)
- Bottom row: copyright, "Made with care in India" (if branding allows), tiny legal line

### Mobile drawer (hamburger)

- Same items as header, vertically; CTA pinned at bottom

## Routing notes

- `/upload` is a multi-step **client component** (state per step, but each step is a small RSC island where possible)
- `/report/[id]` is a **Server Component** that fetches from DB; client islands for share/PDF actions only
- `/share/[token]` validates the token server-side, then renders read-only RSC
- `/dashboard` is RSC fetching the authed user's readings
- `/api/analyze` runs in Node runtime (sharp + AI SDK); `/api/upload` in Node runtime (sharp)
- `/api/report/[id]` runs at the edge (read-only DB fetch)

## Robots / sitemap

- `robots.txt` allows public pages; disallows `/report/`, `/share/`, `/dashboard`, `/api/`, `/admin/`, `/design-system`
- `sitemap.xml` lists `/`, `/upload`, `/about`, `/methodology`, `/disclaimer`, `/privacy`, `/terms`, `/contact`
