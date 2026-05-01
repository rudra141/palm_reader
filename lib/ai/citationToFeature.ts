// Citation → palm-feature mapping. Used by the interactive report to drive
// hotspot rendering and click-to-section navigation.
//
// Authoring scope: the ~50 most common citation tails used by the active
// sub-styles. AI may emit novel SECTION_REFs over time; unknown IDs return
// null and the caller (FeatureHotspot, ReportChapters) gracefully drops them.
//
// Section linkage is derived at runtime from each Report's actual
// claim_citations, so this file owns only the citation → feature mapping.

import type { Report } from '@/lib/validation/reportSchema';

export type MountId =
  | 'jupiter'
  | 'saturn'
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'moon'
  | 'mars-upper'
  | 'mars-lower';

export type LineId = 'heart' | 'head' | 'life' | 'fate' | 'sun' | 'marriage';

export type MarkerId =
  | 'matsya' // fish
  | 'shankha' // conch
  | 'trishula' // trident
  | 'padma' // lotus
  | 'dhvaja' // flag
  | 'yav' // barley / island at thumb base
  | 'mystic-cross'
  | 'temple';

export type FingerId = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';

/** Chinese palace identifiers (Ma Yi / Bagua palmistry). */
export type PalaceId = 'qian' | 'kun' | 'kan' | 'li' | 'zhen' | 'xun' | 'gen' | 'dui' | 'marriage';

export type FeatureKind =
  | { kind: 'mount'; id: MountId }
  | { kind: 'line'; id: LineId }
  | { kind: 'marker'; id: MarkerId }
  | { kind: 'finger'; id: FingerId }
  | { kind: 'palace'; id: PalaceId }
  | { kind: 'whole-hand' };

export type SectionKey =
  | 'opening'
  | 'character_personality'
  | 'mind_intellect'
  | 'emotional_relationships'
  | 'career_profession'
  | 'wealth_material'
  | 'health_indications'
  | 'life_trajectory_timing'
  | 'spiritual_inclinations'
  | 'strengths_to_leverage'
  | 'areas_to_be_mindful_of'
  | 'closing';

const ALL_SECTIONS: SectionKey[] = [
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
];

// ─────────────────────────────────────────────────────────────────────────
// Mapping tables. Keyed by citation suffix (the SECTION_REF tail).
// Same suffix can map differently per tradition where Sanskrit/Chinese
// vocabulary collides — split tables, fall through.
// ─────────────────────────────────────────────────────────────────────────

const INDIAN_MAP: Record<string, FeatureKind | null> = {
  // mounts
  MOUNT_GURU: { kind: 'mount', id: 'jupiter' },
  MOUNT_SHANI: { kind: 'mount', id: 'saturn' },
  MOUNT_SURYA: { kind: 'mount', id: 'sun' },
  MOUNT_BUDHA: { kind: 'mount', id: 'mercury' },
  MOUNT_SHUKRA: { kind: 'mount', id: 'venus' },
  MOUNT_CHANDRA: { kind: 'mount', id: 'moon' },
  MOUNT_MANGAL_UPPER: { kind: 'mount', id: 'mars-upper' },
  MOUNT_MANGAL_LOWER: { kind: 'mount', id: 'mars-lower' },

  // lines (Sanskrit names)
  LINE_HRDAYA: { kind: 'line', id: 'heart' },
  LINE_MASTISHKA: { kind: 'line', id: 'head' },
  LINE_AYU: { kind: 'line', id: 'life' },
  LINE_AYU_CHAIN: { kind: 'line', id: 'life' },
  LINE_BHAGYA: { kind: 'line', id: 'fate' },
  LINE_BHAGYA_LATE: { kind: 'line', id: 'fate' },
  LINE_BHAGYA_MATERIAL: { kind: 'line', id: 'fate' },
  LINE_SURYA: { kind: 'line', id: 'sun' },
  LINE_VIVAHA: { kind: 'line', id: 'marriage' },

  // markers
  CHIHN_MATSYA: { kind: 'marker', id: 'matsya' },
  CHIHN_SHANKHA: { kind: 'marker', id: 'shankha' },
  CHIHN_TRISHULA: { kind: 'marker', id: 'trishula' },
  CHIHN_PADMA: { kind: 'marker', id: 'padma' },
  CHIHN_DHVAJA: { kind: 'marker', id: 'dhvaja' },
  CHIHN_YAV: { kind: 'marker', id: 'yav' },
  MARKER_MYSTIC_CROSS: { kind: 'marker', id: 'mystic-cross' },
  CHIHN_TEMPLE: { kind: 'marker', id: 'temple' },

  // fingers + structural
  JUPITER_KNOT: { kind: 'finger', id: 'index' },
  HAND_AS_WHOLE: { kind: 'whole-hand' },
  HAND_TEXTURE: { kind: 'whole-hand' },

  // doctrinal / synthesis — no spatial feature
  HEAD_LIFE_SEPARATION: null,
  TRAJECTORY_LINE_CROSSINGS: null,
  SAMSKARA_DOCTRINE: null,
  STRENGTHS_SYNTHESIS: null,
  CAUTIONS_SYNTHESIS: null,
  CLOSING_FRAME: null,
};

const CHINESE_MAP: Record<string, FeatureKind | null> = {
  // The classical three lines (San Cai)
  LINE_TIAN: { kind: 'line', id: 'heart' }, // Heaven ≈ heart line zone
  LINE_REN: { kind: 'line', id: 'head' }, // Human ≈ head line zone
  LINE_DI: { kind: 'line', id: 'life' }, // Earth ≈ life line zone

  // Wu Xing hand types — full-hand observation
  WUXING_WOOD: { kind: 'whole-hand' },
  WUXING_FIRE: { kind: 'whole-hand' },
  WUXING_EARTH: { kind: 'whole-hand' },
  WUXING_METAL: { kind: 'whole-hand' },
  WUXING_WATER: { kind: 'whole-hand' },

  // Bagua palaces
  PALACE_QIAN: { kind: 'palace', id: 'qian' },
  PALACE_KUN: { kind: 'palace', id: 'kun' },
  PALACE_KAN: { kind: 'palace', id: 'kan' },
  PALACE_LI: { kind: 'palace', id: 'li' },
  PALACE_ZHEN: { kind: 'palace', id: 'zhen' },
  PALACE_XUN: { kind: 'palace', id: 'xun' },
  PALACE_GEN: { kind: 'palace', id: 'gen' },
  PALACE_DUI: { kind: 'palace', id: 'dui' },
  MARRIAGE_PALACE: { kind: 'palace', id: 'marriage' },

  // doctrinal / observational concepts — no spatial feature
  THREE_LINES: null,
  SHEN_AND_BONE: null,
  SHEN_OBSERVATION: null,
  BING_JIAN_EYE: null,
  BING_JIAN_STRUCTURE: null,
  HEART_AS_ROOT: null,
  PRACTICAL_MIND: null,
  BLOOD_QI: null,
  QI_CONFIGURATION: null,
  WEALTH_QI: null,
  PERIODS_OF_LIFE: null,
  BIAN_DOCTRINE: null,
  CAUTIONS_BIAN: null,
  STRENGTHS_SYNTHESIS: null,
  CLOSING_FRAME: null,
};

/**
 * Resolve a citation ID (e.g. `INDIAN.SAMUDRIKA_COMPREHENSIVE.MOUNT_GURU`) to
 * its visual feature, or `null` for doctrinal / synthesis citations that have
 * no spatial anchor on the palm.
 */
export function citationToFeature(citationId: string): FeatureKind | null {
  const parts = citationId.split('.');
  if (parts.length < 2) return null;
  const tradition = parts[0];
  const tail = parts[parts.length - 1];
  if (!tail) return null;

  if (tradition === 'INDIAN') {
    return tail in INDIAN_MAP ? (INDIAN_MAP[tail] ?? null) : null;
  }
  if (tradition === 'CHINESE') {
    return tail in CHINESE_MAP ? (CHINESE_MAP[tail] ?? null) : null;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────
// Reverse / forward indices over a given Report. Both are pure utilities —
// the caller (InteractiveReport) memoises them once per render.
// ─────────────────────────────────────────────────────────────────────────

const SECTION_CITATION_KEYS: Record<SectionKey, (r: Report) => string[]> = {
  opening: (r) => r.opening.claim_citations,
  character_personality: (r) => r.character_personality.claim_citations,
  mind_intellect: (r) => r.mind_intellect.claim_citations,
  emotional_relationships: (r) => r.emotional_relationships.claim_citations,
  career_profession: (r) => r.career_profession.claim_citations,
  wealth_material: (r) => r.wealth_material.claim_citations,
  health_indications: (r) => r.health_indications.claim_citations,
  life_trajectory_timing: (r) => r.life_trajectory_timing.claim_citations,
  spiritual_inclinations: (r) => r.spiritual_inclinations?.claim_citations ?? [],
  strengths_to_leverage: (r) => r.strengths_to_leverage.claim_citations,
  areas_to_be_mindful_of: (r) => r.areas_to_be_mindful_of.claim_citations,
  closing: (r) => r.closing.claim_citations,
};

export interface UnmappedCitation {
  citationId: string;
  section: SectionKey;
}

export interface ReportFeatureIndex {
  /** Distinct features cited anywhere in the report, in stable section order. */
  features: FeatureKind[];
  /** For each section, the (de-duped) features it cites. */
  perSection: Record<SectionKey, FeatureKind[]>;
  /** Reverse: for a given feature, which sections cite it (in document order). */
  sectionsForFeature: (feature: FeatureKind) => SectionKey[];
  /** Citations that exist on the report but didn't map — for telemetry. */
  unmapped: UnmappedCitation[];
}

function featureKey(f: FeatureKind): string {
  if (f.kind === 'whole-hand') return 'whole-hand';
  return `${f.kind}:${f.id}`;
}

export function buildFeatureIndex(report: Report): ReportFeatureIndex {
  const seenFeatureKeys = new Set<string>();
  const features: FeatureKind[] = [];
  const perSection = Object.fromEntries(
    ALL_SECTIONS.map((k) => [k, [] as FeatureKind[]]),
  ) as Record<SectionKey, FeatureKind[]>;
  const unmapped: UnmappedCitation[] = [];

  for (const section of ALL_SECTIONS) {
    const seenInSection = new Set<string>();
    const citations = SECTION_CITATION_KEYS[section](report);
    for (const citation of citations) {
      const feature = citationToFeature(citation);
      if (feature === null) {
        // Don't track doctrinal-null citations — those are intentionally
        // unmapped, not telemetry signal. We only record citations whose
        // tail is unrecognised.
        const isKnownNull = isKnownDoctrinalCitation(citation);
        if (!isKnownNull) unmapped.push({ citationId: citation, section });
        continue;
      }
      const key = featureKey(feature);
      if (!seenInSection.has(key)) {
        seenInSection.add(key);
        perSection[section].push(feature);
      }
      if (!seenFeatureKeys.has(key)) {
        seenFeatureKeys.add(key);
        features.push(feature);
      }
    }
  }

  const sectionsForFeature = (feature: FeatureKind): SectionKey[] => {
    const target = featureKey(feature);
    return ALL_SECTIONS.filter((section) =>
      perSection[section].some((f) => featureKey(f) === target),
    );
  };

  return { features, perSection, sectionsForFeature, unmapped };
}

function isKnownDoctrinalCitation(id: string): boolean {
  const tail = id.split('.').pop();
  if (!tail) return false;
  return (
    (tail in INDIAN_MAP && INDIAN_MAP[tail] === null) ||
    (tail in CHINESE_MAP && CHINESE_MAP[tail] === null)
  );
}

// Test-only export.
export const __INTERNAL = { INDIAN_MAP, CHINESE_MAP, ALL_SECTIONS, featureKey };
