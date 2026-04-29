---
description: Safely update a prompt — version it, eval it, only promote if scores improve
argument-hint: [prompt-id] [reason]
allowed-tools: Bash, Read, Write, Edit, MultiEdit, Grep, Glob
---

Update prompt `$ARGUMENTS` safely. Never overwrite a prompt without versioning + eval.

## Process

1. Read current version of the prompt from `/docs/prompts.md` (find by ID).
2. Note its current eval scores from `/docs/evals.md`.
3. Bump version (e.g., `v1.2.0` → `v1.3.0`-draft) and write new draft below the current version in `/docs/prompts.md`. Do NOT delete or modify the previous version.
4. Implement the change in the new draft.
5. Update `/lib/ai/prompts.ts` to reference the new draft version (keep old version exported as well for rollback).
6. Run `pnpm eval` against the new version.
7. Compare scores vs previous version per `/docs/evals.md`.
8. Decision:
   - **All dimensions improved or held** → promote: mark new version as current in `/docs/prompts.md`, update `lib/ai/prompts.ts` default export, commit `feat(ai): promote $ARGUMENTS to v[X.Y.Z] — [reason]`
   - **Any dimension regressed** → keep old version current, document new draft as "experiment failed" in `/docs/evals.md` with score comparison, commit `chore(ai): experiment $ARGUMENTS v[X.Y.Z]-draft regressed on [dimension]`
   - **Mixed (some up, some down)** → flag for human review in `/docs/blockers.md` with full score diff

## Never

- Edit a prompt in place
- Promote without running evals
- Delete a previous version (rollback safety)
- Skip updating `/docs/evals.md` with the score comparison
