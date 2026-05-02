'use client';

// AnnotatedPalm — top-of-report hero. The user's actual palm photo with a
// brass-gold SVG overlay marking the mounts and line zones the report
// references. Tapping a feature invokes onSelectFeature(featureKind) which
// the parent (InteractiveReport) wires to a smooth-scroll into the matching
// chapter.
//
// Visual model:
//   - Square aspect ratio (object-contain) so the SVG viewBox 0..1 maps
//     directly to the rendered photo's bounds.
//   - Soft sepia vignette via CSS gradient overlay.
//   - Hotspots only render for features the *report* actually cites
//     (intersection of buildFeatureIndex(report).features and the
//     mount/line catalogue).

import Image from 'next/image';
import { useMemo } from 'react';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { FeatureHotspot } from '@/components/sections/FeatureHotspot';
import { buildFeatureIndex, type FeatureKind } from '@/lib/ai/citationToFeature';
import type { ActiveTradition } from '@/lib/palm/featureCopy';
import type { PalmAnchors, MountKind, LineKind, CircleAnchor } from '@/lib/palm/types';
import type { Report } from '@/lib/validation/reportSchema';

interface Props {
  report: Report;
  imageUrl: string;
  anchors: PalmAnchors | null;
  tradition: ActiveTradition;
  onSelectFeature: (feature: FeatureKind) => void;
}

const MOUNT_FEATURE_KEYS: Record<MountKind, string> = {
  jupiter: 'mount:jupiter',
  saturn: 'mount:saturn',
  sun: 'mount:sun',
  mercury: 'mount:mercury',
  venus: 'mount:venus',
  moon: 'mount:moon',
  'mars-upper': 'mount:mars-upper',
  'mars-lower': 'mount:mars-lower',
};

const LINE_FEATURE_KEYS: Record<LineKind, string> = {
  heart: 'line:heart',
  head: 'line:head',
  life: 'line:life',
};

function featureKey(f: FeatureKind): string {
  if (f.kind === 'whole-hand') return 'whole-hand';
  return `${f.kind}:${f.id}`;
}

export function AnnotatedPalm({ report, imageUrl, anchors, tradition, onSelectFeature }: Props) {
  const cited = useMemo(() => {
    const index = buildFeatureIndex(report);
    const set = new Set<string>();
    for (const f of index.features) set.add(featureKey(f));
    return set;
  }, [report]);

  const mountHotspots = useMemo<
    { key: string; mountKind: MountKind; anchor: CircleAnchor }[]
  >(() => {
    if (!anchors) return [];
    const out: { key: string; mountKind: MountKind; anchor: CircleAnchor }[] = [];
    for (const [mountKind, anchor] of Object.entries(anchors.mounts) as [
      MountKind,
      CircleAnchor,
    ][]) {
      const key = MOUNT_FEATURE_KEYS[mountKind];
      if (cited.has(key)) out.push({ key, mountKind, anchor });
    }
    return out;
  }, [anchors, cited]);

  const lineHotspots = useMemo(() => {
    if (!anchors) return [];
    const out: { key: string; lineKind: LineKind; anchor: (typeof anchors.lines)[LineKind] }[] = [];
    for (const lineKind of ['heart', 'head', 'life'] as const) {
      const key = LINE_FEATURE_KEYS[lineKind];
      if (cited.has(key)) {
        out.push({ key, lineKind, anchor: anchors.lines[lineKind] });
      }
    }
    return out;
  }, [anchors, cited]);

  return (
    <section className="pt-[var(--space-4)] pb-[var(--space-7)]">
      <Container size="md">
        <header className="mx-auto max-w-[44ch] text-center">
          <Eyebrow>Your hand</Eyebrow>
          <h2
            className="mt-[var(--space-3)] leading-[var(--leading-tight)] font-[var(--font-display)]"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
          >
            Tap a marker to begin.
          </h2>
          <p
            className="mt-[var(--space-3)] text-sm leading-[var(--leading-relaxed)]"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            Mounts located by image landmarks. Lines indicated by zone, not traced.
          </p>
        </header>

        <figure
          className="relative mx-auto mt-[var(--space-6)] w-full max-w-[44rem] overflow-hidden rounded-[var(--radius-lg)] border"
          style={{
            borderColor: 'var(--color-border)',
            aspectRatio: '1 / 1',
            background: 'var(--color-surface-inset)',
          }}
        >
          <Image
            src={imageUrl}
            alt="Your palm photograph"
            fill
            sizes="(max-width: 768px) 100vw, 44rem"
            unoptimized
            className="object-contain motion-safe:[animation:kenburns_22s_ease-in-out_infinite_alternate]"
            priority
            style={{ filter: 'sepia(0.18) contrast(1.04) saturate(0.95)' }}
          />

          {/* Soft vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 55%, rgba(28,24,22,0.18) 100%)',
            }}
          />

          {anchors ? (
            <svg
              viewBox="0 0 1 1"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              style={{
                opacity: 1,
                transition: 'opacity 600ms ease-out',
              }}
              aria-label="Palm feature overlay"
            >
              {lineHotspots.map(({ key, lineKind, anchor }) => (
                <FeatureHotspot
                  key={key}
                  shape="line"
                  feature={{ kind: 'line', id: lineKind }}
                  tradition={tradition}
                  anchor={anchor}
                  onActivate={onSelectFeature}
                />
              ))}
              {mountHotspots.map(({ key, mountKind, anchor }) => (
                <FeatureHotspot
                  key={key}
                  shape="mount"
                  feature={{ kind: 'mount', id: mountKind }}
                  tradition={tradition}
                  anchor={anchor}
                  onActivate={onSelectFeature}
                />
              ))}
            </svg>
          ) : null}
        </figure>

        <p
          className="mt-[var(--space-4)] text-center text-xs"
          style={{ color: 'var(--color-ink-faint)' }}
        >
          {anchors === null
            ? 'Locating palm landmarks…'
            : `${Object.keys(anchors.mounts).length} mounts and 3 line zones detected.`}
        </p>
      </Container>
    </section>
  );
}
