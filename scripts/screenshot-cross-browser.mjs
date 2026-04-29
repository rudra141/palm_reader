#!/usr/bin/env node
/**
 * Cross-browser visual capture for CP2.
 * Renders / and /design-system in chromium, webkit, firefox at 3 viewports
 * each. Saves to docs/screenshots/cp2/<browser>-<route>-<viewport>.jpg.
 */
import { chromium, webkit, firefox } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.URL ?? 'http://localhost:3000';
const OUT = 'docs/screenshots/cp2';
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: '375', w: 375, h: 812 },
  { name: '768', w: 768, h: 1024 },
  { name: '1440', w: 1440, h: 900 },
];

const ROUTES = [
  { slug: 'home', path: '/' },
  { slug: 'design-system', path: '/design-system' },
];

const BROWSERS = [
  { name: 'chromium', launcher: chromium },
  { name: 'webkit', launcher: webkit },
  { name: 'firefox', launcher: firefox },
];

for (const browser of BROWSERS) {
  const b = await browser.launcher.launch();
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      const ctx = await b.newContext({
        viewport: { width: vp.w, height: vp.h },
        deviceScaleFactor: 2,
        reducedMotion: 'no-preference',
      });
      const page = await ctx.newPage();
      try {
        await page.goto(`${URL}${route.path}`, { waitUntil: 'load' });
        await page.waitForLoadState('networkidle').catch(() => {});
        await page.evaluate(() => document.fonts?.ready).catch(() => {});
        await page.waitForTimeout(1500);
        const path = `${OUT}/${browser.name}-${route.slug}-${vp.name}.jpg`;
        await page.screenshot({ path, fullPage: false, type: 'jpeg', quality: 85 });
        console.log(`✓ ${path}`);
      } catch (err) {
        console.error(`✗ ${browser.name} ${route.slug} ${vp.name}: ${err.message}`);
      }
      await ctx.close();
    }
  }
  await b.close();
}
