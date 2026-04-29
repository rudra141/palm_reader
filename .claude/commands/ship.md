---
description: Pre-deploy launch checklist for AI vision app — verify and fix every item
allowed-tools: Bash, Read, Write, Edit, MultiEdit, Grep, Glob, Task
---

Pre-deploy checklist. Verify each item. Fix what fails. Report PASS/FAIL, fix all FAILs, re-run.

## Quality

- [ ] `/audit` clean (all 7 subagents)
- [ ] `/eval-suite` ≥90% pass rate, 0 unsafe outputs
- [ ] `pnpm build` zero errors, zero warnings
- [ ] `pnpm typecheck` clean
- [ ] `pnpm lint` clean
- [ ] `pnpm test --run` clean
- [ ] Bundle size within TRD budget (run `pnpm analyze`)
- [ ] Lighthouse ≥95 all categories on every page

## Pages & Errors

- [ ] 404 + 500 styled
- [ ] Loading states for slow routes
- [ ] Inference loading state with progress indication

## AI-Specific

- [ ] Disclaimer visible on every results page
- [ ] Privacy policy explicitly addresses image handling + AI processing
- [ ] Terms include limitation of liability for AI outputs
- [ ] All prompts in `/docs/prompts.md` have current eval scores logged
- [ ] All domain claims trace to `/docs/research.md`
- [ ] Image retention policy implemented and tested
- [ ] EXIF stripping verified
- [ ] Prompt injection defense tested with adversarial inputs
- [ ] Rate limits load-tested
- [ ] Cost circuit breaker tested (simulate runaway)
- [ ] Sentry captures inference errors with full context (without logging user images)
- [ ] Cost monitoring dashboard accessible to admin

## 3D Story

- [ ] Profiled at every scroll beat — 60fps M1, 30fps mid-tier mobile
- [ ] All beats have reduced-motion fallback
- [ ] All beats have low-power fallback
- [ ] 3D bundle code-split, not in initial JS
- [ ] Models Draco-compressed, total <8MB

## Assets

- [ ] Favicons full set, manifest.json
- [ ] OG images per page (default + page-specific, including dynamic OG for report pages if PRD allows)
- [ ] Theme color meta

## SEO

- [ ] robots.txt + sitemap.xml
- [ ] Per-page metadata
- [ ] Structured data
- [ ] Report pages: noindex per privacy default (unless TRD overrides)

## Environment

- [ ] All env vars in `.env.example` documented
- [ ] No secrets in repo (audit `git log -p`)
- [ ] CSP headers configured
- [ ] Security headers configured
- [ ] `next.config.ts` redirects + image domains correct

## Monitoring

- [ ] Sentry initialized, test error captured
- [ ] Analytics installed, test event fired
- [ ] Cost tracking dashboard live
- [ ] Eval results dashboard live (or accessible via `/docs/evals.md`)
- [ ] Alerts configured: cost spike, error spike, latency spike

## Legal

- [ ] Privacy Policy
- [ ] Terms of Service (with AI-output limitation of liability)
- [ ] Cookie consent if needed
- [ ] Disclaimer text reviewed against `/docs/ai-spec.md` rules

## Forms & Flows

- [ ] Upload flow tested E2E (success, failure, oversized, wrong format, network error)
- [ ] Report rendering tested with multiple report fixtures
- [ ] All forms have loading + error + success states
- [ ] Inference timeout handled gracefully

## Cross-Browser

- [ ] Playwright passes Chromium + WebKit + Firefox
- [ ] Manual smoke on real iOS Safari
- [ ] Manual smoke on real Android Chrome
- [ ] 3D scene works in WebKit (often the breaker)

## Pre-Push

- [ ] All commits Conventional
- [ ] Branch up to date
- [ ] `/docs/progress.md` reflects state
- [ ] `/docs/decisions.md` complete
- [ ] `/docs/prompts.md` has current versions tagged

## Output

Markdown table PASS/FAIL per item. Fix all FAILs. Re-verify. Repeat until 100% PASS. Then prompt for human approval before deployment.
