---
description: Run the AI evaluation suite against the golden test set
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
---

Run the full AI eval suite. This validates that current prompts + models produce outputs matching expected characteristics on a fixed set of test inputs.

## Steps

1. Verify `/evals/` exists with golden test set:
   - At least 10 representative test inputs (images for vision apps)
   - Each with metadata: expected categories, expected disclaimers, expected refusals, tone score, factuality score
2. Run `pnpm eval` which:
   - Loads test inputs from `/evals/golden/`
   - Runs the full inference pipeline on each
   - Scores each output via:
     - Schema conformance (Zod parse rate)
     - Disallowed-claim detection (regex + LLM-as-judge)
     - Disclaimer presence (regex)
     - Domain-citation traceability (every factual claim traced to /docs/research.md)
     - Tone match (LLM-as-judge against /docs/ai-spec.md tone definition)
     - Latency
     - Cost per inference
3. Output JSON report to `/evals/results/[timestamp].json`
4. Append summary to `/docs/evals.md`:
   - Overall pass rate
   - Per-dimension scores
   - Regressions vs. previous run (flag any)
   - Cost trend
5. If pass rate <90%, fail loudly and list top 5 failures
6. If any unsafe output detected, fail loudly regardless of pass rate

## Adding new test cases

When a real-world failure is observed, add it to `/evals/golden/` as a regression test before fixing. This prevents the same failure from returning silently.

## Prompt change protocol

If this command runs after a prompt change in `/docs/prompts.md`:

1. Compare scores vs previous version
2. If regression on any dimension, flag in `/docs/evals.md` and require human review
3. If improvement, mark new version as current in `/docs/prompts.md`
