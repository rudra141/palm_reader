// TraditionsSection — homepage addition. Two pillar cards (Indian +
// Chinese) so a visitor can pick a tradition before they upload. Sub-style
// chips link straight into /upload?subStyle=... (the form will read the
// query param at v1.1; for now it just deep-links the tradition).

import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Card } from '@/components/ui/Card';
import { buttonStyles } from '@/components/ui/Button';

interface SubStyleEntry {
  id: string;
  label: string;
  blurb: string;
}

interface TraditionEntry {
  tradition: 'indian' | 'chinese';
  nameNative: string;
  englishName: string;
  description: string;
  substyles: SubStyleEntry[];
  cta: string;
}

const TRADITIONS: TraditionEntry[] = [
  {
    tradition: 'indian',
    nameNative: 'Hasta Sāmudrika',
    englishName: 'Indian palmistry',
    description:
      'A six-century-deep tradition rooted in Varāhamihira and the Sāmudrika compendia. Reads the hand as one chapter in a wider book — the body, the breath, the bearing — and finds in each line both inheritance and intent.',
    substyles: [
      {
        id: 'INDIAN.SAMUDRIKA_COMPREHENSIVE',
        label: 'Comprehensive Sāmudrika',
        blurb: 'The widest aperture — observes the entire hand, weighed against whole-body signs.',
      },
      {
        id: 'INDIAN.HASTA_REKHA',
        label: 'Hasta-Rekhā · line-focused',
        blurb: 'Lines first. Sanskrit nomenclature, Jaina-lineage transmission of the rekhā.',
      },
      {
        id: 'INDIAN.MOUNT_PLANETARY',
        label: 'Mount-based · planetary',
        blurb: 'Reads the nine grahaparvata as a planetary chart in miniature.',
      },
    ],
    cta: 'Begin an Indian reading',
  },
  {
    tradition: 'chinese',
    nameNative: 'Mian Xiang · Xiāng',
    englishName: 'Chinese palmistry',
    description:
      'Heir to Ma Yi and the classical xiàng treatises. The hand is one register of qì, read alongside the face and the bones. Three lines—Heaven, Human, Earth—frame everything that follows.',
    substyles: [
      {
        id: 'CHINESE.WU_XING',
        label: 'Five Elements (Wu Xing 五行)',
        blurb: 'Hand-shape governs everything — Wood, Fire, Earth, Metal, Water as lens and frame.',
      },
      {
        id: 'CHINESE.MA_YI_CLASSICAL',
        label: 'Classical Ma Yi (麻衣)',
        blurb: 'The lineage text — broad mìng themes, qì configuration, Heart as the root.',
      },
      {
        id: 'CHINESE.BAGUA_PALMISTRY',
        label: 'Eight Trigrams (Bāguà 八卦)',
        blurb: 'Eight palaces mapped onto the palm. A diagrammatic read; structurally precise.',
      },
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
        <header className="mx-auto max-w-[44ch] text-center">
          <Eyebrow>Two traditions, never blended</Eyebrow>
          <h2
            className="mt-[var(--space-3)] leading-[var(--leading-tight)] font-[var(--font-display)]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Choose the lens. The hand stays the same.
          </h2>
          <p
            className="mt-[var(--space-4)] text-base leading-[var(--leading-relaxed)]"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            Indian Sāmudrika and Chinese Xiāng share an instinct — that the body archives the life
            it has lived — and disagree on almost every detail of how. We honor both, separately.
          </p>
        </header>

        <div className="mt-[var(--space-8)] grid grid-cols-1 gap-[var(--space-6)] lg:grid-cols-2">
          {TRADITIONS.map((t) => (
            <Card key={t.tradition} className="flex flex-col p-[var(--space-7)]">
              <Eyebrow>{t.englishName}</Eyebrow>
              <h3
                className="mt-[var(--space-2)] font-[var(--font-display)] italic"
                style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2rem)' }}
              >
                {t.nameNative}
              </h3>
              <p
                className="mt-[var(--space-4)] text-base leading-[var(--leading-relaxed)]"
                style={{ color: 'var(--color-ink-muted)' }}
              >
                {t.description}
              </p>

              <ul className="mt-[var(--space-5)] flex flex-col gap-[var(--space-3)]">
                {t.substyles.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-[var(--radius-md)] border-l-2 py-[var(--space-1)] pl-[var(--space-4)]"
                    style={{ borderColor: 'var(--color-accent)' }}
                  >
                    <div
                      className="text-sm font-[var(--font-body)] tracking-[var(--tracking-wide)] uppercase"
                      style={{ color: 'var(--color-ink)' }}
                    >
                      {s.label}
                    </div>
                    <div
                      className="mt-[var(--space-1)] text-sm leading-[var(--leading-relaxed)]"
                      style={{ color: 'var(--color-ink-muted)' }}
                    >
                      {s.blurb}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-[var(--space-6)] flex-1" aria-hidden />
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
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
