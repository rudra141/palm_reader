import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, buttonStyles } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Design System',
  robots: { index: false, follow: false },
};

const COLOR_TOKENS = [
  'bg',
  'bg-elevated',
  'bg-inset',
  'ink',
  'ink-muted',
  'ink-faint',
  'ink-on-accent',
  'accent',
  'accent-deep',
  'accent-glow',
  'border',
  'border-strong',
];

const TYPE_SAMPLES = [
  { token: 'text-6xl', label: '7rem / display kinetic' },
  { token: 'text-5xl', label: '5rem / hero H1 desktop' },
  { token: 'text-4xl', label: '3.5rem / H1 mobile' },
  { token: 'text-3xl', label: '2.5rem / H2' },
  { token: 'text-2xl', label: '1.875rem / H3' },
  { token: 'text-xl', label: '1.5rem / H4' },
  { token: 'text-lg', label: '1.25rem / H5' },
  { token: 'text-md', label: '1.125rem / body comfort' },
  { token: 'text-base', label: '1rem / body' },
  { token: 'text-sm', label: '0.875rem / micro' },
  { token: 'text-xs', label: '0.75rem / eyebrow' },
];

const SPACE_TOKENS = [
  { token: 'space-1', val: '0.25rem' },
  { token: 'space-2', val: '0.5rem' },
  { token: 'space-3', val: '0.75rem' },
  { token: 'space-4', val: '1rem' },
  { token: 'space-5', val: '1.5rem' },
  { token: 'space-6', val: '2rem' },
  { token: 'space-7', val: '3rem' },
  { token: 'space-8', val: '4rem' },
  { token: 'space-9', val: '6rem' },
  { token: 'space-10', val: '8rem' },
];

export default function DesignSystemPage() {
  return (
    <main className="py-[var(--space-9)]">
      <Container size="lg">
        <Eyebrow>Praxa · internal</Eyebrow>
        <h1
          className="mt-[var(--space-3)] text-4xl leading-[var(--leading-tight)] font-[var(--font-display)] tracking-[var(--tracking-tight)]"
          style={{ color: 'var(--color-ink)' }}
        >
          Design system.
        </h1>
        <p className="text-md mt-[var(--space-4)] max-w-[60ch] text-[var(--color-ink-muted)]">
          Live token gallery and primitive showcase. Every token traces to{' '}
          <Link className="underline" href="/">
            /docs/design-system.md
          </Link>
          . Components only consume tokens.
        </p>

        {/* Color */}
        <Section title="Color">
          <div className="grid grid-cols-2 gap-[var(--space-4)] md:grid-cols-4 lg:grid-cols-6">
            {COLOR_TOKENS.map((t) => (
              <Card key={t} variant="inset" className="p-[var(--space-3)]">
                <div
                  className="h-16 w-full rounded-[var(--radius-md)] border border-[var(--color-border)]"
                  style={{ background: `var(--color-${t})` }}
                />
                <p className="mt-[var(--space-2)] text-xs font-[var(--font-body)] tracking-[var(--tracking-wide)] text-[var(--color-ink-muted)]">
                  --color-{t}
                </p>
              </Card>
            ))}
          </div>
        </Section>

        {/* Type */}
        <Section title="Type scale">
          <div className="space-y-[var(--space-4)]">
            {TYPE_SAMPLES.map(({ token, label }) => (
              <div
                key={token}
                className="border-b border-[var(--color-border)] pb-[var(--space-3)]"
              >
                <Eyebrow>--{token}</Eyebrow>
                <p
                  className="font-[var(--font-display)] tracking-[var(--tracking-tight)]"
                  style={{
                    fontSize: `var(--${token})`,
                    lineHeight: 'var(--leading-tight)',
                    color: 'var(--color-ink)',
                  }}
                >
                  A reading from the original texts.
                </p>
                <p className="mt-[var(--space-1)] text-xs text-[var(--color-ink-faint)]">{label}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Spacing */}
        <Section title="Spacing (8-pt scale)">
          <div className="space-y-[var(--space-2)]">
            {SPACE_TOKENS.map(({ token, val }) => (
              <div key={token} className="flex items-center gap-[var(--space-4)]">
                <code className="w-32 text-xs text-[var(--color-ink-muted)]">--{token}</code>
                <div
                  className="h-[var(--space-2)] rounded-[var(--radius-sm)] bg-[var(--color-accent)]"
                  style={{ width: `var(--${token})` }}
                />
                <span className="text-xs text-[var(--color-ink-faint)]">{val}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Button">
          <div className="flex flex-wrap items-center gap-[var(--space-4)]">
            <Button variant="primary" size="sm">
              Begin reading
            </Button>
            <Button variant="primary" size="md">
              Begin reading
            </Button>
            <Button variant="primary" size="lg">
              Begin reading
            </Button>
            <Button variant="secondary">Methodology</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="link">Read more →</Button>
            <Link href="/upload" className={buttonStyles({ variant: 'primary', size: 'md' })}>
              Link as button
            </Link>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        {/* Cards */}
        <Section title="Card">
          <div className="grid grid-cols-1 gap-[var(--space-5)] md:grid-cols-2">
            <Card variant="surface">
              <Eyebrow>From the source</Eyebrow>
              <p className="mt-[var(--space-3)] text-2xl leading-[var(--leading-snug)] font-[var(--font-display)] text-[var(--color-ink)]">
                Every claim traces back to a primary classical text.
              </p>
              <p className="mt-[var(--space-3)] text-[var(--color-ink-muted)]">
                We don&apos;t blend traditions. We don&apos;t repackage Western pop-palmistry as
                Indian.
              </p>
            </Card>
            <Card variant="inset">
              <Eyebrow>A practitioner&apos;s voice</Eyebrow>
              <p className="mt-[var(--space-3)] text-2xl leading-[var(--leading-snug)] font-[var(--font-display)] text-[var(--color-ink)]">
                Decisive. Confident. Twenty years of study in every sentence.
              </p>
            </Card>
          </div>
        </Section>

        {/* Eyebrows */}
        <Section title="Eyebrow">
          <div className="space-y-[var(--space-2)]">
            <Eyebrow>Praxa</Eyebrow>
            <Eyebrow>Methodology · 4 min read</Eyebrow>
            <Eyebrow>Indian tradition</Eyebrow>
          </div>
        </Section>

        {/* Disclaimers reference */}
        <Section title="Mandatory disclaimers (verbatim, /docs/ai-spec.md §6)">
          <Card variant="inset">
            <p className="text-[var(--color-ink-muted)]">
              This reading is offered for entertainment and reflection. It is one
              practitioner&apos;s view through one tradition, not a verdict on your life.
            </p>
            <p className="mt-[var(--space-3)] text-[var(--color-ink-muted)]">
              Nothing here is medical, legal, financial, or professional advice. For decisions that
              matter, consult someone qualified in that domain.
            </p>
          </Card>
        </Section>
      </Container>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-[var(--space-9)]">
      <h2
        className="mb-[var(--space-5)] text-2xl font-[var(--font-display)] tracking-[var(--tracking-tight)]"
        style={{ color: 'var(--color-ink)' }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
