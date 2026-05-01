// Research RAG — loads /docs/research.md once and slices the active sub-style's
// section out for injection into the unified prompt. The traditions registry
// (lib/ai/traditions.ts) provides the curated extract; this loader provides
// the full sub-style passage for richer grounding.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { SubStyleId } from '@/lib/validation/inputSchemas';

const SUBSTYLE_HEADER: Record<SubStyleId, RegExp> = {
  'INDIAN.SAMUDRIKA_COMPREHENSIVE': /^### 1\.1 Sub-style:/m,
  'INDIAN.HASTA_REKHA': /^### 1\.2 Sub-style:/m,
  'INDIAN.MOUNT_PLANETARY': /^### 1\.3 Sub-style:/m,
  'CHINESE.WU_XING': /^### 2\.1 Sub-style:/m,
  'CHINESE.MA_YI_CLASSICAL': /^### 2\.2 Sub-style:/m,
  'CHINESE.BAGUA_PALMISTRY': /^### 2\.3 Sub-style:/m,
};

let _doc: string | null = null;

function loadDoc(): string {
  if (_doc) return _doc;
  const path = join(process.cwd(), 'docs', 'research.md');
  _doc = readFileSync(path, 'utf8');
  return _doc;
}

const _cache = new Map<SubStyleId, string>();

/**
 * Returns the raw Markdown section for the active sub-style, ending at the
 * next `---` divider or the next `### N.M Sub-style:` header — whichever
 * comes first. The block is cached after first load.
 */
export function getResearchBlock(subStyleId: SubStyleId): string {
  const cached = _cache.get(subStyleId);
  if (cached) return cached;

  const doc = loadDoc();
  const headerRe = SUBSTYLE_HEADER[subStyleId];
  const start = doc.search(headerRe);
  if (start < 0) {
    _cache.set(subStyleId, '');
    return '';
  }

  // Find end: next `### N.M Sub-style:` or first `---` divider after start.
  const after = doc.slice(start);
  const nextSubstyle = after.slice(1).search(/^### \d+\.\d+ Sub-style:/m);
  const nextDivider = after.search(/^---\s*$/m);
  const candidates = [nextSubstyle, nextDivider].filter((n) => n > 0);
  const end = candidates.length > 0 ? Math.min(...candidates) : after.length;
  const block = after.slice(0, end).trim();

  _cache.set(subStyleId, block);
  return block;
}
