#!/usr/bin/env node
/** Screenshot the two sample report pages, full-page, at desktop + mobile. */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.URL ?? 'http://localhost:3000';
const OUT = 'docs/screenshots/cp3';
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: '375', w: 375, h: 812 },
  { name: '1440', w: 1440, h: 900 },
];

const ROUTES = ['sample-indian', 'sample-chinese'];

const browser = await chromium.launch();
for (const vp of VIEWPORTS) {
  for (const id of ROUTES) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto(`${URL}/report/${id}`, { waitUntil: 'load' });
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.evaluate(() => document.fonts?.ready).catch(() => {});
    await page.waitForTimeout(800);
    const path = `${OUT}/${id}-${vp.name}.jpg`;
    await page.screenshot({ path, fullPage: true, type: 'jpeg', quality: 86 });
    console.log(`✓ ${path}`);
    await ctx.close();
  }
}
await browser.close();
