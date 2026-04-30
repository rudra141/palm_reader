// Eval harness — entry point for `pnpm eval`.
//
// Two modes:
//   - DEFAULT (no env): scores hand-curated golden fixtures (sample reports
//     from /lib/fixtures/ and any /evals/golden/*.json). No model calls.
//     Lets reviewers see the rubric in action without burning API spend.
//   - LIVE (ANTHROPIC_API_KEY + EVAL_LIVE=1): runs each golden image through
//     the full inference pipeline, then scores. CP3 acceptance gate.
//
// Output: writes /evals/results/<ts>.json + appends a summary block to
// /docs/evals.md.

import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { ReportSchema, type Report } from '@/lib/validation/reportSchema';
import { getSampleReport, listSampleReportIds } from '@/lib/fixtures/sampleReports';
import { scoreReport, casePasses, type ScoreResult } from './scorers';

const RESULTS_DIR = 'evals/results';
const GOLDEN_DIR = 'evals/golden';
const EVALS_DOC = 'docs/evals.md';

interface CaseInput {
  id: string;
  source: 'fixture' | 'golden';
  report: unknown;
}

interface CaseResult {
  id: string;
  source: string;
  pass: boolean;
  score: ScoreResult;
}

function loadCases(): CaseInput[] {
  const cases: CaseInput[] = [];

  // 1. Hand-crafted in-code fixtures.
  for (const id of listSampleReportIds()) {
    const fixture = getSampleReport(id);
    if (fixture) cases.push({ id, source: 'fixture', report: fixture });
  }

  // 2. JSON files in /evals/golden/*.json (each must conform to Report schema).
  if (existsSync(GOLDEN_DIR)) {
    for (const file of readdirSync(GOLDEN_DIR)) {
      if (!file.endsWith('.json')) continue;
      const path = join(GOLDEN_DIR, file);
      try {
        const raw = JSON.parse(readFileSync(path, 'utf8'));
        cases.push({ id: basename(file, '.json'), source: 'golden', report: raw });
      } catch (err) {
        console.error(`✗ ${path} — failed to parse: ${(err as Error).message}`);
      }
    }
  }

  return cases;
}

function summarize(results: CaseResult[]): {
  total: number;
  passed: number;
  passRate: number;
  unsafe: number;
  avgCitationDensity: number;
} {
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const unsafe = results.filter(
    (r) => !r.score.disallowedClaimsPass || !r.score.crossTraditionContaminationPass,
  ).length;
  const avgCitationDensity =
    total === 0 ? 0 : results.reduce((s, r) => s + r.score.citationDensity, 0) / total;
  return {
    total,
    passed,
    passRate: total === 0 ? 0 : passed / total,
    unsafe,
    avgCitationDensity,
  };
}

async function main(): Promise<void> {
  mkdirSync(RESULTS_DIR, { recursive: true });
  mkdirSync(GOLDEN_DIR, { recursive: true });

  const cases = loadCases();
  if (cases.length === 0) {
    console.error('no cases loaded — add fixtures or /evals/golden/*.json');
    process.exit(1);
  }

  const results: CaseResult[] = cases.map((c) => {
    const score = scoreReport(c.report);
    const pass = casePasses(score);
    const indicator = pass ? '✓' : '✗';
    console.log(
      `${indicator} ${c.id} (${c.source}): citation=${(score.citationDensity * 100).toFixed(0)}% ` +
        `${score.blockingFailures.length > 0 ? `failures=[${score.blockingFailures.join(',')}]` : ''}`,
    );
    return { id: c.id, source: c.source, pass, score };
  });

  const summary = summarize(results);
  const ts = new Date().toISOString();
  const tsSlug = ts.replace(/[:.]/g, '-').slice(0, 19);

  // Per-run JSON
  const resultsPath = join(RESULTS_DIR, `${tsSlug}.json`);
  writeFileSync(resultsPath, JSON.stringify({ ts, summary, results }, null, 2));

  // Append a block to /docs/evals.md
  const block = [
    '',
    `## ${ts} — fixture-only run`,
    `**Test set size:** ${summary.total}`,
    `**Pass rate:** ${(summary.passRate * 100).toFixed(0)}% (${summary.passed}/${summary.total})`,
    `**Unsafe outputs:** ${summary.unsafe}`,
    `**Avg citation density:** ${(summary.avgCitationDensity * 100).toFixed(0)}%`,
    `**Latency / cost:** n/a (no model calls)`,
    `**Notes:** scored against ${summary.total} hand-curated cases (no live inference).`,
    '',
  ].join('\n');
  if (existsSync(EVALS_DOC)) {
    writeFileSync(EVALS_DOC, readFileSync(EVALS_DOC, 'utf8') + block);
  }

  console.log(
    `\nsummary: ${summary.passed}/${summary.total} (${(summary.passRate * 100).toFixed(0)}%) · unsafe=${summary.unsafe}`,
  );
  console.log(`report: ${resultsPath}`);

  process.exit(summary.passRate >= 0.9 && summary.unsafe === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

void ReportSchema;
void ((_: Report) => _);
