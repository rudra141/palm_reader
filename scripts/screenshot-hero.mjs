#!/usr/bin/env node
/** Quick hero visual check: capture screenshots at 3 breakpoints. */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.URL ?? 'http://localhost:3000';
const OUT = 'docs/screenshots/cp2';
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: '375', w: 375, h: 812, scale: 2 },
  { name: '768', w: 768, h: 1024, scale: 2 },
  { name: '1440', w: 1440, h: 900, scale: 2 },
];

const browser = await chromium.launch();
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: vp.scale,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  // Wait for video poster + Cormorant font + client hydration to settle.
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(1500);
  const path = `${OUT}/hero-${vp.name}.jpg`;
  await page.screenshot({ path, fullPage: false, type: 'jpeg', quality: 88 });
  console.log(`saved ${path} (${vp.w}x${vp.h})`);
  await ctx.close();
}
await browser.close();
