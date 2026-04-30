// Eval scorers — pure functions over a candidate Report. No model calls.
// Backs the rubric in /docs/ai-spec.md §11.

import { ReportSchema, REQUIRED_DISCLAIMERS, type Report } from '@/lib/validation/reportSchema';
import { regexScanReport } from '@/lib/validation/filterSchema';
import { TRADITIONS } from '@/lib/ai/traditions';

export interface ScoreResult {
  schemaPass: boolean;
  disclaimerPass: boolean;
  disallowedClaimsPass: boolean;
  citationDensity: number; // 0..1 — fraction of body sections with non-empty claim_citations
  crossTraditionContaminationPass: boolean;
  vocabularyLockPass: boolean;
  completenessPass: boolean;
  blockingFailures: string[];
  notes: string[];
}

const FACTUAL_SECTIONS = [
  'opening',
  'character_personality',
  'mind_intellect',
  'emotional_relationships',
  'career_profession',
  'wealth_material',
  'health_indications',
  'life_trajectory_timing',
  'spiritual_inclinations',
  'strengths_to_leverage',
  'areas_to_be_mindful_of',
  'closing',
] as const;

export function scoreReport(rawJson: unknown): ScoreResult {
  const blockingFailures: string[] = [];
  const notes: string[] = [];

  // 1. Schema conformance
  const schemaResult = ReportSchema.safeParse(rawJson);
  if (!schemaResult.success) {
    return {
      schemaPass: false,
      disclaimerPass: false,
      disallowedClaimsPass: false,
      citationDensity: 0,
      crossTraditionContaminationPass: false,
      vocabularyLockPass: false,
      completenessPass: false,
      blockingFailures: ['schema'],
      notes: schemaResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
    };
  }
  const report: Report = schemaResult.data;

  // 2. Disclaimer presence (verbatim)
  const disclaimerPass =
    report.disclaimers.entertainment === REQUIRED_DISCLAIMERS.entertainment &&
    report.disclaimers.not_professional_advice === REQUIRED_DISCLAIMERS.not_professional_advice &&
    report.disclaimers.health === REQUIRED_DISCLAIMERS.health &&
    report.health_indications.mandatory_disclaimer === REQUIRED_DISCLAIMERS.health;
  if (!disclaimerPass) blockingFailures.push('disclaimer_presence');

  // 3. Disallowed-claim regex scan
  const regexHits = regexScanReport(report);
  const disallowedClaimsPass = regexHits.length === 0;
  if (!disallowedClaimsPass) {
    blockingFailures.push('disallowed_claims');
    notes.push(`regex hits: ${regexHits.join(', ')}`);
  }

  // 4. Citation density
  let cited = 0;
  let total = 0;
  for (const key of FACTUAL_SECTIONS) {
    const sec = (report as unknown as Record<string, unknown>)[key];
    if (!sec || typeof sec !== 'object') continue;
    total += 1;
    const cites = (sec as { claim_citations?: string[] }).claim_citations;
    if (Array.isArray(cites) && cites.length > 0) cited += 1;
  }
  const citationDensity = total === 0 ? 0 : cited / total;

  // 5. Cross-tradition contamination (heuristic)
  // Indian tradition reports must not mention Chinese-only canonical sources or characters.
  // Chinese tradition reports must not mention Sanskrit terms by name.
  const meta = TRADITIONS[report.meta.sub_style];
  const otherGlyphs =
    meta.tradition === 'indian'
      ? /[一-鿿]|麻衣|Bāguà|Wǔ Xíng|Mìng |Bīng Jiàn/i
      : /Hṛdaya|Bhāgya|Sūrya rekhā|Sāmudrika|Mount of Jupiter|Mount of Saturn|Saṃskāra|Manu-smṛti/;
  const flat = JSON.stringify(report);
  const crossTraditionContaminationPass = !otherGlyphs.test(flat);
  if (!crossTraditionContaminationPass) {
    blockingFailures.push('cross_tradition_contamination');
    notes.push('detected non-active-tradition vocabulary');
  }

  // 6. Vocabulary lock — at least one canonical term from the active tradition's glossary
  const expected =
    meta.tradition === 'indian'
      ? /Hṛdaya|Bhāgya|Sūrya|Sāmudrika|Mount of (Guru|Śani|Sūrya|Budha|Śukra|Chandra)/
      : /shén|qì|Tiān wén|Rén wén|Dì wén|Wǔ Xíng|Bāguà|Má Yī|biàn/i;
  const vocabularyLockPass = expected.test(flat);
  if (!vocabularyLockPass) {
    blockingFailures.push('vocabulary_lock');
    notes.push("active tradition's glossary terms not present");
  }

  // 7. Completeness — all required sections present with non-trivial body length
  const completenessPass = FACTUAL_SECTIONS.filter((k) => k !== 'spiritual_inclinations').every(
    (k) => {
      const sec = (report as unknown as Record<string, unknown>)[k] as
        | { body?: string; life_essence_summary?: string }
        | undefined;
      if (!sec) return false;
      const text = sec.body ?? sec.life_essence_summary ?? '';
      return text.length >= 60;
    },
  );

  return {
    schemaPass: true,
    disclaimerPass,
    disallowedClaimsPass,
    citationDensity,
    crossTraditionContaminationPass,
    vocabularyLockPass,
    completenessPass,
    blockingFailures,
    notes,
  };
}

/** A case passes overall when every blocking dimension passes AND citation density ≥ 0.7. */
export function casePasses(score: ScoreResult): boolean {
  return (
    score.schemaPass &&
    score.disclaimerPass &&
    score.disallowedClaimsPass &&
    score.crossTraditionContaminationPass &&
    score.vocabularyLockPass &&
    score.completenessPass &&
    score.citationDensity >= 0.7
  );
}
