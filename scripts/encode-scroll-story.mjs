#!/usr/bin/env node
/**
 * Re-encode the source scroll-story video into all-intra 720p + 480p MP4s,
 * remove the Veo watermark, and emit a poster JPG.
 *
 * Usage:
 *   node scripts/encode-scroll-story.mjs <source.mp4>
 *
 * Outputs into /public/scroll-story/.
 *
 * Why all-intra: every frame is a self-decodable I-frame, so `video.currentTime = X`
 * is frame-perfect on every browser including Safari. Pair with the scroll-tied
 * scrubber in /components/3d/Story.tsx. See /docs/decisions.md for the full
 * rationale.
 */

import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = join(ROOT, 'public', 'scroll-story');

// Watermark crop coords for Veo logo (lower-right corner of 1280x720 source)
const DELOGO = 'delogo=x=1150:y=645:w=128:h=70';

const source = process.argv[2];
if (!source) {
  console.error('usage: node scripts/encode-scroll-story.mjs <source.mp4>');
  process.exit(1);
}
if (!existsSync(source)) {
  console.error(`source not found: ${source}`);
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

function run(args) {
  console.log(`> ffmpeg ${args.join(' ')}`);
  const result = spawnSync(ffmpegPath, args, { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

// 720p all-intra
run([
  '-y',
  '-i',
  source,
  '-vf',
  DELOGO,
  '-c:v',
  'libx264',
  '-profile:v',
  'high',
  '-level:v',
  '4.0',
  '-pix_fmt',
  'yuv420p',
  '-preset',
  'slow',
  '-crf',
  '23',
  '-g',
  '1',
  '-keyint_min',
  '1',
  '-sc_threshold',
  '0',
  '-bf',
  '0',
  '-movflags',
  '+faststart',
  '-an',
  join(OUT, 'story-720p.mp4'),
]);

// 480p mobile all-intra
run([
  '-y',
  '-i',
  source,
  '-vf',
  `${DELOGO},scale=854:480:flags=lanczos`,
  '-c:v',
  'libx264',
  '-profile:v',
  'high',
  '-level:v',
  '4.0',
  '-pix_fmt',
  'yuv420p',
  '-preset',
  'slow',
  '-crf',
  '24',
  '-g',
  '1',
  '-keyint_min',
  '1',
  '-sc_threshold',
  '0',
  '-bf',
  '0',
  '-movflags',
  '+faststart',
  '-an',
  join(OUT, 'story-480p.mp4'),
]);

// Poster
run([
  '-y',
  '-i',
  source,
  '-vf',
  DELOGO,
  '-frames:v',
  '1',
  '-q:v',
  '3',
  join(OUT, 'story-poster.jpg'),
]);

console.log(`done. outputs in ${OUT}`);
