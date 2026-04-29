// Eval harness — entry point for `pnpm eval`.
// Loads /evals/golden/* test cases, runs them through the inference pipeline,
// scores against the rubric in /docs/ai-spec.md §11, appends summary to
// /docs/evals.md.
//
// Real implementation lands in Phase 4 (CP3) once the inference pipeline exists.

async function main(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('eval harness — placeholder (implemented at CP3)');
  // eslint-disable-next-line no-console
  console.log('expected golden cases: ≥10 across active sub-styles');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
