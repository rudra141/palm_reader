'use client';

// One palm-feature hotspot rendered into the AnnotatedPalm SVG overlay.
// Two visual modes:
//   - mount: concentric brass ring + center dot, soft glow on hover/focus
//   - line: soft brass band drawn along the polyline, glow on hover/focus
// Click invokes onActivate which scrolls to the feature's first chapter.

import { useState } from 'react';
import type { FeatureKind } from '@/lib/ai/citationToFeature';
import type { CircleAnchor, PolylineAnchor } from '@/lib/palm/types';
import { describeFeature, type ActiveTradition } from '@/lib/palm/featureCopy';

interface BaseProps {
  feature: FeatureKind;
  tradition: ActiveTradition;
  onActivate: (feature: FeatureKind) => void;
}

interface MountProps extends BaseProps {
  shape: 'mount';
  anchor: CircleAnchor;
}

interface LineProps extends BaseProps {
  shape: 'line';
  anchor: PolylineAnchor;
}

export type FeatureHotspotProps = MountProps | LineProps;

export function FeatureHotspot(props: FeatureHotspotProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const active = hovered || focused;
  const label = describeFeature(props.feature, props.tradition);
  const labelText = label.subtitle ? `${label.short} (${label.subtitle})` : label.short;

  const handleClick = () => props.onActivate(props.feature);
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      props.onActivate(props.feature);
    }
  };

  if (props.shape === 'mount') {
    const { cx, cy, r } = props.anchor;
    return (
      <g
        role="button"
        tabIndex={0}
        aria-label={`Read about ${labelText}`}
        onClick={handleClick}
        onKeyDown={handleKey}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ cursor: 'pointer', outline: 'none' }}
      >
        <title>{labelText}</title>
        {/* keyboard-focus halo */}
        {focused ? (
          <circle
            cx={cx}
            cy={cy}
            r={r * 1.7}
            fill="none"
            stroke="var(--color-accent-deep)"
            strokeWidth={0.003}
            strokeDasharray="0.012 0.008"
            opacity={0.9}
          />
        ) : null}
        {/* outer glow ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r * 1.4}
          fill="none"
          stroke="var(--color-accent-glow)"
          strokeWidth={0.006}
          opacity={active ? 0.9 : 0}
          style={{ transition: 'opacity 220ms ease' }}
        />
        {/* main ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={0.005}
          opacity={active ? 1 : 0.85}
        />
        {/* center dot */}
        <circle cx={cx} cy={cy} r={0.006} fill="var(--color-accent)" />
        {/* large invisible hit target */}
        <circle cx={cx} cy={cy} r={r * 1.6} fill="transparent" />
      </g>
    );
  }

  // Line-zone hotspot
  const d = props.anchor.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`Read about ${labelText}`}
      onClick={handleClick}
      onKeyDown={handleKey}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      <title>{labelText}</title>
      {/* keyboard-focus halo */}
      {focused ? (
        <path
          d={d}
          fill="none"
          stroke="var(--color-accent-deep)"
          strokeWidth={props.anchor.thickness * 2.2}
          strokeLinecap="round"
          strokeDasharray="0.012 0.008"
          opacity={0.85}
        />
      ) : null}
      {/* glow band */}
      <path
        d={d}
        fill="none"
        stroke="var(--color-accent-glow)"
        strokeWidth={props.anchor.thickness * 1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 0.85 : 0}
        style={{ transition: 'opacity 220ms ease' }}
      />
      {/* main band */}
      <path
        d={d}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={props.anchor.thickness}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={active ? 0.9 : 0.55}
      />
      {/* invisible thicker hit target */}
      <path
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth={props.anchor.thickness * 2.4}
        strokeLinecap="round"
      />
    </g>
  );
}
