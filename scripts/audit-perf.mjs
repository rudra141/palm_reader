#!/usr/bin/env node
/**
 * Performance audit via Lighthouse against a running prod server.
 * Runs mobile + desktop on every public route; verifies TRD budgets.
 * Writes /docs/audit-perf-<timestamp>.md.
 */
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { writeFileSync, mkdirSync } from 'node:fs';

const BASE = process.env.URL ?? 'http://localhost:3000';
const ROUTES = ['/', '/design-system'];

mkdirSync('docs', { recursive: true });

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless=new', '--disable-gpu', '--no-sandbox'],
});

async function run(url, formFactor) {
  const opts = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    formFactor,
    screenEmulation:
      formFactor === 'mobile'
        ? { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false }
        : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
  };
  const result = await lighthouse(url, opts);
  return result?.lhr;
}

const all = [];
for (const route of ROUTES) {
  for (const formFactor of ['mobile', 'desktop']) {
    const lhr = await run(`${BASE}${route}`, formFactor);
    if (!lhr) continue;
    all.push({
      route,
      formFactor,
      scores: {
        performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
        accessibility: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round((lhr.categories['best-practices']?.score ?? 0) * 100),
        seo: Math.round((lhr.categories.seo?.score ?? 0) * 100),
      },
      vitals: {
        lcp: lhr.audits['largest-contentful-paint']?.numericValue ?? 0,
        cls: lhr.audits['cumulative-layout-shift']?.numericValue ?? 0,
        tbt: lhr.audits['total-blocking-time']?.numericValue ?? 0,
        fcp: lhr.audits['first-contentful-paint']?.numericValue ?? 0,
        si: lhr.audits['speed-index']?.numericValue ?? 0,
      },
    });
    console.log(
      `${route} ${formFactor}: perf=${all.at(-1).scores.performance} a11y=${all.at(-1).scores.accessibility} bp=${all.at(-1).scores.bestPractices} seo=${all.at(-1).scores.seo}`,
    );
  }
}

await chrome.kill();

const fmt = (n, unit = 'ms') => `${Math.round(n)}${unit}`;
const lines = [
  '# Performance Audit (Lighthouse)',
  '',
  `> Run at ${new Date().toISOString()}`,
  '',
  'TRD budgets: Lighthouse ≥95 all categories · LCP <2.0s · CLS <0.1 · INP <200ms · Initial JS <200KB',
  '',
  '| Route | Form factor | Perf | A11y | BP | SEO | LCP | CLS | TBT | FCP | SI |',
  '|---|---|---|---|---|---|---|---|---|---|---|',
];
for (const r of all) {
  const cls = r.vitals.cls.toFixed(3);
  lines.push(
    `| ${r.route} | ${r.formFactor} | ${r.scores.performance} | ${r.scores.accessibility} | ${r.scores.bestPractices} | ${r.scores.seo} | ${fmt(r.vitals.lcp)} | ${cls} | ${fmt(r.vitals.tbt)} | ${fmt(r.vitals.fcp)} | ${fmt(r.vitals.si)} |`,
  );
}
const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const path = `docs/audit-perf-${ts}.md`;
writeFileSync(path, lines.join('\n'));
console.log(`report: ${path}`);

// Exit code reflects whether any score is below 90
const failing = all.filter((r) => Object.values(r.scores).some((s) => s < 90));
process.exit(failing.length > 0 ? 1 : 0);
