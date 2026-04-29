---
description: Diagnose a bad AI output methodically — input vs prompt vs model vs parser
argument-hint: [report ID or test case name]
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
---

You're diagnosing a bad AI output: `$ARGUMENTS`

Don't patch the prompt blindly. Diagnose first.

## Diagnostic ladder (run in order)

1. **Input quality check**
   - Was the input image valid? Resolution, lighting, framing
   - If image: re-run vision pass and inspect raw vision output JSON
   - If vision JSON is wrong → bug is upstream (vision prompt or model choice)
   - If vision JSON is correct → continue to step 2

2. **Prompt assembly check**
   - Print the exact prompt sent to the LLM (system + user)
   - Verify no template variables left unfilled
   - Verify no user input was concatenated into system prompt
   - Verify research base context attached as expected

3. **Model behavior check**
   - Run the same prompt 3 more times with temp=0
   - If outputs vary wildly → temp config wrong
   - If outputs consistently bad → prompt is the bug
   - If outputs consistently good → original was a transient miss; add to flake-tracking

4. **Parser check**
   - If output looked correct but report renders wrong → Zod schema or rendering bug
   - Print raw model output, run through Zod, inspect parse errors
   - Check for null/undefined paths in the renderer

5. **Domain accuracy check**
   - Does the bad claim trace to `/docs/research.md`?
   - If yes → research source itself may be wrong, flag for human review
   - If no → AI hallucinated; tighten the system prompt's grounding instructions

6. **Disclaimer/safety check**
   - If the output crossed a forbidden line (medical claim, etc.) → guardrail failed
   - Check the output filter logic
   - Add this case to `/evals/golden/regressions/`

## Output

Write findings to `/docs/blockers.md`:

```
## YYYY-MM-DD — AI diagnosis: $ARGUMENTS
**Symptom:** ...
**Diagnosis:** [step N revealed: ...]
**Root cause:** ...
**Fix:** [exact change]
**Regression test added:** [path]
```

Then implement the fix, re-run `/eval-suite`, verify pass rate didn't regress, commit.
