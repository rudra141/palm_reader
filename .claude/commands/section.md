---
description: Build a section component end-to-end (impl + tests + design-system entry)
argument-hint: [SectionName] e.g. UploadFlow, SampleReport, Disclaimer
allowed-tools: Bash, Read, Write, Edit, MultiEdit, Grep, Glob, Task
---

Build the section component named `$ARGUMENTS` following ALL project rules.

## Steps

1. Read `/docs/design-system.md` (tokens, motion), `/docs/prd.md` (content), `/docs/ai-spec.md` (if section displays AI output, must respect tone + disclaimer rules), `/components/ui/` (existing primitives).

2. Plan via plan mode if section will exceed 3 files or pull new deps.

3. Spawn 3 parallel subagents:

   **Subagent A — Implementation**
   - Create `/components/sections/$ARGUMENTS.tsx`
   - Compose from `/components/ui/`
   - Mobile-first 375 → 768 → 1024 → 1440
   - Tokens only
   - Semantic HTML
   - Keyboard accessible, ARIA correct
   - Strict TS prop interface, exported

   **Subagent B — Tests**
   - Vitest + Testing Library: `/components/sections/$ARGUMENTS.test.tsx`
   - Cover render, prop variations, keyboard, ARIA
   - Playwright visual snapshot at 375 / 768 / 1440

   **Subagent C — Design System Entry**
   - Add live example to `/app/design-system/page.tsx` under "Sections"
   - Show all prop variants

4. If section displays AI output (e.g., SampleReport, ResultCard):
   - Render against fixtures from `/evals/golden/` so design-system route shows real-style content
   - Include the disclaimer per `/docs/ai-spec.md`

5. Verify hooks pass (auto-format, lint, typecheck, tests).

6. Commit: `feat(sections): add $ARGUMENTS section`
