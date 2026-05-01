#!/usr/bin/env node
/**
 * Accessibility audit via @axe-core/playwright.
 * Scans every public route at desktop viewport; reports WCAG 2.2 AA violations.
 * Writes /docs/audit-a11y-<timestamp>.md.
 */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync, mkdirSync } from 'node:fs';

const BASE = process.env.URL ?? 'http://localhost:3000';
const ROUTES = [
  '/',
  '/design-system',
  '/upload',
  '/report/sample-indian',
  '/report/sample-chinese',
];

mkdirSync('docs', { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'no-preference',
});
const page = await ctx.newPage();

const all = [];
for (const route of ROUTES) {
  const url = `${BASE}${route}`;
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(800);

  const builder = new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag22a',
    'wcag22aa',
    'best-practice',
  ]);
  const result = await builder.analyze();

  all.push({ route, violations: result.violations });
  console.log(`${route}: ${result.violations.length} violations`);
}

await browser.close();

// Compose markdown report
const lines = ['# Accessibility Audit\n', `> Run at ${new Date().toISOString()}\n`];
for (const r of all) {
  lines.push(`## ${r.route} — ${r.violations.length} violations\n`);
  if (r.violations.length === 0) {
    lines.push('No violations detected.\n');
    continue;
  }
  for (const v of r.violations) {
    lines.push(`### [${v.impact}] ${v.id} — ${v.help}`);
    lines.push(`${v.description}`);
    lines.push(`Help: ${v.helpUrl}`);
    for (const node of v.nodes.slice(0, 5)) {
      lines.push(`- \`${node.target.join(' ')}\``);
      if (node.failureSummary) {
        lines.push(`  - ${node.failureSummary.split('\n').join(' ')}`);
      }
    }
    lines.push('');
  }
}
const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const path = `docs/audit-a11y-${ts}.md`;
writeFileSync(path, lines.join('\n'));
console.log(`report: ${path}`);

// Exit code reflects whether any critical or serious violations exist
const blocking = all
  .flatMap((r) => r.violations)
  .filter((v) => ['critical', 'serious'].includes(v.impact ?? ''));
process.exit(blocking.length > 0 ? 1 : 0);
