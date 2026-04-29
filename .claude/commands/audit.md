---
description: Full quality audit for AI vision app — performance, a11y, SEO, code, AI quality, 3D performance
allowed-tools: Bash, Read, Write, Edit, MultiEdit, Grep, Glob, Task
---

Run a full quality audit in parallel using subagents. Each writes findings to `/docs/audit-[type]-[timestamp].md`. After all return, fix everything ranked by impact/effort. Re-audit until clean.

## Subagent A — Performance

- Use chrome-devtools MCP, load every route
- Measure LCP, INP, CLS, TTFB, FCP per route
- Run Lighthouse mobile + desktop
- Verify TRD budgets: LCP<2s, INP<200ms, CLS<0.1, Lighthouse≥95
- Fix patterns: explicit image dims, `next/image`, `next/font`, dynamic imports for heavy libs (especially R3F + GSAP), defer non-critical JS, preload critical

## Subagent B — Accessibility

- `@axe-core/playwright` on every page
- Keyboard nav: every interactive element reachable, focus visible, no traps
- Verify upload flow keyboard-accessible end-to-end
- Verify report page screen-reader friendly (long-form content needs proper landmarks + heading hierarchy)
- Color contrast ≥4.5:1 / ≥3:1
- Target: zero axe violations

## Subagent C — SEO

- Per page: unique title, meta description, canonical, OG image
- sitemap.xml + robots.txt correct
- Structured data (Organization, WebSite, plus app-specific: SoftwareApplication or Service)
- For report pages: noindex by default unless TRD says otherwise (privacy)

## Subagent D — Code Quality

- `pnpm typecheck` clean
- `pnpm lint` zero warnings
- `pnpm test --run` clean
- `pnpm build` zero warnings
- Cross-browser: Chromium + WebKit + Firefox at 375/768/1440

## Subagent E — AI Quality

- Run `pnpm eval` — score against `/evals/` golden set
- Verify all prompts in `/docs/prompts.md` have current eval scores
- Verify all domain claims trace to `/docs/research.md`
- Verify Zod schemas reject bad outputs as expected (run with intentionally bad fixtures)
- Verify disallowed-claim filtering (test prompts that try to elicit forbidden outputs)
- Verify prompt injection defense (test with adversarial user inputs)
- Target: ≥90% eval pass rate, 0 unsafe outputs

## Subagent F — 3D Performance

- Profile `/components/3d/Story.tsx` via Chrome DevTools MCP
- Frame-by-frame analysis at each scroll beat
- Verify 60fps on M1, 30fps on mid-tier mobile (4x CPU throttle)
- Verify 2D fallback renders correctly with prefers-reduced-motion
- Verify low-power fallback triggers on `navigator.hardwareConcurrency < 4`
- Bundle size: 3D chunk separate from initial bundle

## Subagent G — Security & Cost

- Verify rate limits (load test with autocannon)
- Verify cost tracking middleware logs every call
- Verify circuit breaker fires when budget exceeded (simulate)
- Verify image upload rejects executables, oversized files, NSFW (basic check)
- Verify EXIF stripping
- Verify image lifecycle matches TRD (deleted after retention window)
- Verify CSP headers present

## After All Subagents Return

1. Consolidate to `/docs/audit-$(date +%Y%m%d-%H%M%S).md`
2. Rank findings by impact/effort
3. Fix top-to-bottom without asking
4. Re-run audit
5. Repeat until all 7 subagents clean
6. Commit: `chore: audit pass clean`
