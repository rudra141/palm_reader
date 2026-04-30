import { describe, it, expect } from 'vitest';
import { ReportSchema, REQUIRED_DISCLAIMERS } from './reportSchema';
import { getSampleReport } from '@/lib/fixtures/sampleReports';

describe('ReportSchema', () => {
  it('accepts the Indian Sāmudrika sample fixture verbatim', () => {
    const fixture = getSampleReport('sample-indian');
    expect(fixture).toBeDefined();
    expect(() => ReportSchema.parse(fixture)).not.toThrow();
  });

  it('accepts the Chinese Ma Yi sample fixture verbatim (with optional spirit section omitted)', () => {
    const fixture = getSampleReport('sample-chinese');
    expect(fixture).toBeDefined();
    expect(() => ReportSchema.parse(fixture)).not.toThrow();
    const parsed = ReportSchema.parse(fixture);
    expect(parsed.spiritual_inclinations).toBeUndefined();
  });

  it('rejects a report whose entertainment disclaimer is paraphrased', () => {
    const fixture = getSampleReport('sample-indian')!;
    const tampered = {
      ...fixture,
      disclaimers: {
        ...fixture.disclaimers,
        entertainment: 'This is just for fun.',
      },
    };
    expect(() => ReportSchema.parse(tampered)).toThrow();
  });

  it('rejects a report with an empty claim_citations array on a body section', () => {
    const fixture = getSampleReport('sample-indian')!;
    const tampered = {
      ...fixture,
      character_personality: { ...fixture.character_personality, claim_citations: [] },
    };
    expect(() => ReportSchema.parse(tampered)).toThrow();
  });

  it('locks the health-section mandatory disclaimer to the verbatim string', () => {
    const fixture = getSampleReport('sample-indian')!;
    const tampered = {
      ...fixture,
      health_indications: {
        ...fixture.health_indications,
        mandatory_disclaimer: 'See a doctor if you have concerns.',
      },
    };
    expect(() => ReportSchema.parse(tampered)).toThrow();
  });

  it('exposes the canonical disclaimer constants used by the renderer', () => {
    expect(REQUIRED_DISCLAIMERS.entertainment.length).toBeGreaterThan(0);
    expect(REQUIRED_DISCLAIMERS.not_professional_advice.length).toBeGreaterThan(0);
    expect(REQUIRED_DISCLAIMERS.health.length).toBeGreaterThan(0);
  });
});
