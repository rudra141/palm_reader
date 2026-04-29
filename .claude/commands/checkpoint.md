---
description: Pre-checkpoint verification and summary for human review
argument-hint: [1|2|3|4|5]
allowed-tools: Bash, Read, Write, Edit, MultiEdit, Grep, Glob
---

Prepare for Checkpoint $ARGUMENTS. Do all of the following before requesting human review.

## All Checkpoints

1. Run `/audit` — must return clean
2. Update `/docs/progress.md`
3. Update `/docs/decisions.md`
4. Verify `/docs/blockers.md` resolved or flagged

## Checkpoint-Specific

### CP1 — Discovery complete

- Verify all docs exist: brief, prd, trd, ai-spec, sitemap, content-plan, design-system, scroll-story, research, prompts, risk-register
- Verify `/CLAUDE.md` Mission + Stack updated
- Generate summary: total pages, total scroll beats, AI models chosen, top 3 risks, estimated cost-per-inference
- Output: "CP1 ready. Review /docs/. Reply 'go' to proceed."

### CP2 — Design system + 3D POC

- Verify `/app/design-system/page.tsx` renders all tokens + components
- Verify `/components/3d/Story.tsx` proof-of-concept (first scroll beat) renders
- Take Playwright screenshots at 375 / 768 / 1440 to `/docs/screenshots/cp2/`
- Output: "CP2 ready. Visit /design-system. Reply 'go'."

### CP3 — AI inference end-to-end

- Verify upload → inference → report flow works on at least 5 real test images
- Run `/eval-suite` — pass rate ≥90%
- Save 5 example reports to `/docs/sample-reports/cp3/` for human review
- Compute estimated cost per inference based on actual logs
- Output: "CP3 ready. Review sample reports + eval results. Reply 'go'."

### CP4 — Pre-deploy

- Run `/ship` — every item PASS
- All scroll beats implemented and profiled
- Deploy to Vercel preview
- Take Playwright screenshots of every page
- Output preview URL + Lighthouse summary + eval summary + cost projection
- Output: "CP4 ready. Review preview: [URL]. Reply 'go' to deploy production."

### CP5 — Post-deploy

- Smoke test production via Playwright (full upload → report flow)
- Verify Sentry receives events
- Verify analytics receives events
- Verify cost tracking working in production
- Run PageSpeed Insights on production
- Output: "CP5 ready. Production live: [URL]. Verified end-to-end. Reply 'go' for handoff phase."

## After Output

Stop and wait. Do not proceed without explicit "go".
