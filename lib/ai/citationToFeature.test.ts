import { describe, expect, it } from 'vitest';
import {
  citationToFeature,
  buildFeatureIndex,
  __INTERNAL,
  type FeatureKind,
} from './citationToFeature';
import { getSampleReport } from '@/lib/fixtures/sampleReports';

describe('citationToFeature', () => {
  it('maps known Indian mount/line/marker tails', () => {
    expect(citationToFeature('INDIAN.SAMUDRIKA_COMPREHENSIVE.MOUNT_GURU')).toEqual({
      kind: 'mount',
      id: 'jupiter',
    });
    expect(citationToFeature('INDIAN.HASTA_REKHA.LINE_HRDAYA')).toEqual({
      kind: 'line',
      id: 'heart',
    });
    expect(citationToFeature('INDIAN.SAMUDRIKA_COMPREHENSIVE.CHIHN_MATSYA')).toEqual({
      kind: 'marker',
      id: 'matsya',
    });
  });

  it('maps Chinese San Cai lines to their corresponding palm-line zones', () => {
    expect(citationToFeature('CHINESE.MA_YI_CLASSICAL.LINE_TIAN')).toEqual({
      kind: 'line',
      id: 'heart',
    });
    expect(citationToFeature('CHINESE.MA_YI_CLASSICAL.LINE_REN')).toEqual({
      kind: 'line',
      id: 'head',
    });
    expect(citationToFeature('CHINESE.BAGUA_PALMISTRY.PALACE_QIAN')).toEqual({
      kind: 'palace',
      id: 'qian',
    });
  });

  it('returns null for doctrinal / synthesis citations', () => {
    expect(citationToFeature('INDIAN.SAMUDRIKA_COMPREHENSIVE.SAMSKARA_DOCTRINE')).toBeNull();
    expect(citationToFeature('INDIAN.SAMUDRIKA_COMPREHENSIVE.STRENGTHS_SYNTHESIS')).toBeNull();
    expect(citationToFeature('CHINESE.MA_YI_CLASSICAL.BIAN_DOCTRINE')).toBeNull();
    expect(citationToFeature('CHINESE.MA_YI_CLASSICAL.QI_CONFIGURATION')).toBeNull();
  });

  it('returns null for unknown traditions or malformed IDs', () => {
    expect(citationToFeature('FRINGE.WHATEVER.MOUNT_GURU')).toBeNull();
    expect(citationToFeature('not-an-id')).toBeNull();
    expect(citationToFeature('')).toBeNull();
  });

  it('every citation in sample-indian fixture is mapped or consciously null', () => {
    const report = getSampleReport('sample-indian')!;
    const allCitations = collectAllCitations(report);
    const undecided: string[] = [];
    for (const c of allCitations) {
      const feature = citationToFeature(c);
      if (feature === null) {
        const tail = c.split('.').pop() ?? '';
        if (!(tail in __INTERNAL.INDIAN_MAP)) undecided.push(c);
      }
    }
    expect(undecided).toEqual([]);
  });

  it('every citation in sample-chinese fixture is mapped or consciously null', () => {
    const report = getSampleReport('sample-chinese')!;
    const allCitations = collectAllCitations(report);
    const undecided: string[] = [];
    for (const c of allCitations) {
      const feature = citationToFeature(c);
      if (feature === null) {
        const tail = c.split('.').pop() ?? '';
        if (!(tail in __INTERNAL.CHINESE_MAP)) undecided.push(c);
      }
    }
    expect(undecided).toEqual([]);
  });
});

describe('buildFeatureIndex', () => {
  it('produces a non-empty feature list for sample-indian', () => {
    const report = getSampleReport('sample-indian')!;
    const index = buildFeatureIndex(report);
    expect(index.features.length).toBeGreaterThanOrEqual(5);
    expect(index.unmapped).toEqual([]);
  });

  it('reverse lookup: MOUNT_GURU sections include a section that cites it', () => {
    const report = getSampleReport('sample-indian')!;
    const index = buildFeatureIndex(report);
    const guru: FeatureKind = { kind: 'mount', id: 'jupiter' };
    const sections = index.sectionsForFeature(guru);
    expect(sections.length).toBeGreaterThan(0);
    // Confirm at least one of those sections actually contains MOUNT_GURU.
    const someSection = sections[0]!;
    const inSection = index.perSection[someSection];
    expect(inSection.some((f) => f.kind === 'mount' && f.id === 'jupiter')).toBe(true);
  });

  it('produces a non-empty feature list for sample-chinese', () => {
    const report = getSampleReport('sample-chinese')!;
    const index = buildFeatureIndex(report);
    expect(index.features.length).toBeGreaterThanOrEqual(2);
    expect(index.unmapped).toEqual([]);
  });
});

function collectAllCitations(report: ReturnType<typeof getSampleReport>): string[] {
  if (!report) return [];
  const out: string[] = [];
  out.push(...report.opening.claim_citations);
  out.push(...report.character_personality.claim_citations);
  out.push(...report.mind_intellect.claim_citations);
  out.push(...report.emotional_relationships.claim_citations);
  out.push(...report.career_profession.claim_citations);
  out.push(...report.wealth_material.claim_citations);
  out.push(...report.health_indications.claim_citations);
  out.push(...report.life_trajectory_timing.claim_citations);
  if (report.spiritual_inclinations) out.push(...report.spiritual_inclinations.claim_citations);
  out.push(...report.strengths_to_leverage.claim_citations);
  out.push(...report.areas_to_be_mindful_of.claim_citations);
  out.push(...report.closing.claim_citations);
  return out;
}
