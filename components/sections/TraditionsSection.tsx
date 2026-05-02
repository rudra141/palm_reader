// TraditionsSection — minimalist homepage pillar. Two cards. Native name,
// one-line cue, sub-style chips, CTA. Nothing more. Long-form prose lives
// inside the report, not on the marketing surface.

import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { GlowingEdgeCard } from '@/components/ui/GlowingEdgeCard';
import { buttonStyles } from '@/components/ui/Button';

interface TraditionEntry {
  tradition: 'indian' | 'chinese';
  nameNative: string;
  englishName: string;
  cue: string;
  substyles: string[];
  cta: string;
}

const TRADITIONS: TraditionEntry[] = [
  {
    tradition: 'indian',
    nameNative: 'Hasta Sāmudrika',
    englishName: 'Indian palmistry',
    cue: 'The hand as one chapter in the wider book of the body.',
    substyles: ['Comprehensive Sāmudrika', 'Hasta-Rekhā', 'Mount-based · planetary'],
    cta: 'Begin an Indian reading',
  },
  {
    tradition: 'chinese',
    nameNative: 'Mian Xiang · Xiāng',
    englishName: 'Chinese palmistry',
    cue: 'Heaven, Human, Earth — the three lines that frame everything.',
    substyles: [
      'Five Elements (Wu Xing 五行)',
      'Classical Ma Yi (麻衣)',
      'Eight Trigrams (Bāguà 八卦)',
    ],
    cta: 'Begin a Chinese reading',
  },
];

export function TraditionsSection() {
  return (
    <section
      id="traditions"
      className="relative py-[var(--space-9)]"
      style={{ background: 'var(--color-surface)' }}
    >
      <Container size="lg">
        <header className="mx-auto max-w-[36ch] text-center">
          <Eyebrow>Two traditions</Eyebrow>
          <h2
            className="mt-[var(--space-3)] leading-[var(--leading-tight)] font-[var(--font-display)]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Choose the lens.
          </h2>
        </header>

        <div className="mt-[var(--space-8)] grid grid-cols-1 gap-[var(--space-6)] lg:grid-cols-2">
          {TRADITIONS.map((t) => (
            <GlowingEdgeCard
              key={t.tradition}
              mode="dark"
              className="h-full"
              disableIntro={t.tradition === 'chinese'}
            >
              <div
                className="flex h-full flex-col p-[var(--space-7)]"
                style={{ color: 'var(--fg)' }}
              >
                <Eyebrow>{t.englishName}</Eyebrow>
                <h3
                  className="mt-[var(--space-2)] font-[var(--font-display)] italic"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)' }}
                >
                  {t.nameNative}
                </h3>
                <p
                  className="mt-[var(--space-4)] max-w-[28ch] text-base leading-[var(--leading-relaxed)]"
                  style={{ color: 'var(--color-ink-muted)' }}
                >
                  {t.cue}
                </p>

                <ul className="mt-[var(--space-5)] flex flex-wrap gap-[var(--space-2)]">
                  {t.substyles.map((label) => (
                    <li
                      key={label}
                      className="rounded-[var(--radius-pill)] border px-[var(--space-3)] py-[var(--space-1)] text-xs tracking-[var(--tracking-wide)]"
                      style={{
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-ink-muted)',
                      }}
                    >
                      {label}
                    </li>
                  ))}
                </ul>

                <div className="mt-[var(--space-7)] flex-1" aria-hidden />
                <Link
                  href={{ pathname: '/upload', query: { tradition: t.tradition } }}
                  className={buttonStyles({
                    variant: 'primary',
                    size: 'md',
                    className: 'self-start',
                  })}
                >
                  {t.cta}
                </Link>
              </div>
            </GlowingEdgeCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
