// WhatWeRead — homepage feature catalogue. Communicates *what the AI looks
// at* before generating a reading. Calibrates expectations and signals
// rigor: 8 mounts, 6 lines, dozens of markers — not "vibes".

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

interface FeatureRow {
  group: string;
  count: string;
  examples: string;
}

const FEATURES: FeatureRow[] = [
  {
    group: 'Mounts',
    count: 'eight regions',
    examples:
      'Jupiter (Guru), Saturn (Śani), Sun (Sūrya), Mercury (Budha), Venus (Śukra), Moon (Chandra), Mars active, Mars passive.',
  },
  {
    group: 'Major lines',
    count: 'six lines',
    examples:
      'Heart (Hṛdaya), Head (Mastiṣka), Life (Āyu), Fate (Bhāgya), Sun (Sūrya), Mercury — clarity, origin, termination, breaks, chains.',
  },
  {
    group: 'Auspicious markers',
    count: 'eight named cihna',
    examples:
      'Fish (matsya), conch (śaṅkha), trident (triśūla), lotus (padma), flag (dhvaja), barley (yav), temple, mystic cross.',
  },
  {
    group: 'Hand structure',
    count: 'shape, fingers, knots',
    examples:
      'Earth/Water/Fire/Air typology, finger length and tip shape, knots, skin texture, palm-to-finger ratio.',
  },
];

export function WhatWeRead() {
  return (
    <section
      id="what-we-read"
      className="relative py-[var(--space-9)]"
      style={{ background: 'var(--color-surface-inset)' }}
    >
      <Container size="lg">
        <header className="mx-auto max-w-[44ch] text-center">
          <Eyebrow>What we observe</Eyebrow>
          <h2
            className="mt-[var(--space-3)] leading-[var(--leading-tight)] font-[var(--font-display)]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Sixty-four features. One hand at a time.
          </h2>
          <p
            className="mt-[var(--space-4)] text-base leading-[var(--leading-relaxed)]"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            Before any reading is generated, your photograph is examined for the same things a
            traditional practitioner would name. No interpretation precedes observation.
          </p>
        </header>

        <ul className="mt-[var(--space-8)] grid grid-cols-1 gap-[var(--space-5)] sm:grid-cols-2">
          {FEATURES.map((f) => (
            <li
              key={f.group}
              className="rounded-[var(--radius-lg)] border p-[var(--space-6)]"
              style={{
                borderColor: 'var(--color-border)',
                background: 'var(--color-surface)',
              }}
            >
              <div className="flex items-baseline justify-between gap-[var(--space-3)]">
                <h3
                  className="font-[var(--font-display)]"
                  style={{ fontSize: 'clamp(1.25rem, 2vw, 1.625rem)' }}
                >
                  {f.group}
                </h3>
                <span
                  className="text-xs tracking-[var(--tracking-wide)] uppercase"
                  style={{ color: 'var(--color-accent-deep)' }}
                >
                  {f.count}
                </span>
              </div>
              <p
                className="mt-[var(--space-3)] text-sm leading-[var(--leading-relaxed)]"
                style={{ color: 'var(--color-ink-muted)' }}
              >
                {f.examples}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
