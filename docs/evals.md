# AI Evals Log

Append every eval run here. Newest at top.

Format:

```
## YYYY-MM-DD HH:MM — [trigger: e.g., "v1.2.0 promotion candidate"]
**Prompt versions:** [list with IDs and versions]
**Models:** [vision: X, llm: Y]
**Test set size:** N
**Pass rate:** X% (Y/Z)
**Unsafe outputs:** N
**Tone score:** X/5
**Latency:** P50 Xs / P95 Ys
**Cost:** avg $X
**Regressions vs previous:** [list]
**New failures:** [list]
**Decision:** [promoted / rejected / flagged for review]
```

---

## 2026-04-29T19:19:15.250Z — fixture-only run

**Test set size:** 2
**Pass rate:** 100% (2/2)
**Unsafe outputs:** 0
**Avg citation density:** 100%
**Latency / cost:** n/a (no model calls)
**Notes:** scored against 2 hand-curated cases (no live inference).

## 2026-04-30T04:29:09.617Z — fixture-only run
**Test set size:** 2
**Pass rate:** 100% (2/2)
**Unsafe outputs:** 0
**Avg citation density:** 100%
**Latency / cost:** n/a (no model calls)
**Notes:** scored against 2 hand-curated cases (no live inference).
