---
description: Diagnose a stubborn bug methodically (use /diagnose-ai for AI output bugs specifically)
argument-hint: [bug description]
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
---

Stuck on: `$ARGUMENTS`

For AI output bugs use `/diagnose-ai` instead. This command is for general code bugs.

## Steps

1. State the bug precisely in `/docs/blockers.md`:
   - Expected vs actual
   - Last working commit if known
   - Reproduction steps

2. Generate 3-5 hypotheses ranked by likelihood.

3. Smallest possible experiment per hypothesis.

4. Run experiments in order of likelihood, recording results.

5. Only after diagnosis confirmed, write the fix.

6. Add a regression test.

7. Commit: `fix: [description] (root cause: [diagnosis])`

8. Update `/docs/decisions.md` if structural learning.

## Anti-patterns

- try/catch to hide errors
- Reverting working changes by guess
- setTimeout to "fix" race conditions without understanding
- Changing test to match buggy behavior
