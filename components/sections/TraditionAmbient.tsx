'use client';

// Sticky ambient layer rendered behind the chapter scroll. Two variants —
// "indian" (lotus-petal rotational geometry) and "chinese" (8-fold compass
// rosette). Both are *generic* tradition-flavoured ornaments, not specific
// symbols (per the plan's no-fabrication rule on yantra/bagua).
//
// Renders a faintly rotating brass filigree at ~12% opacity, low enough to
// read as texture without competing with chapter text. Rotation animates
// only when prefers-reduced-motion is *not* set; static SVG otherwise.

import { useEffect, useRef } from 'react';

interface Props {
  tradition: 'indian' | 'chinese';
}

export function TraditionAmbient({ tradition }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let raf = 0;
    const start = performance.now();
    const PERIOD_MS = 220_000; // one full rotation every ~3.5 minutes

    const tick = (now: number) => {
      if (cancelled) return;
      const angle = ((now - start) / PERIOD_MS) * 360;
      if (ref.current) {
        ref.current.style.transform = `rotate(${angle.toFixed(3)}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none sticky top-0 -z-10 h-[100svh] w-full overflow-hidden"
      style={{ opacity: 0.12 }}
    >
      <svg
        ref={ref}
        viewBox="-100 -100 200 200"
        preserveAspectRatio="xMidYMid meet"
        className="absolute top-1/2 left-1/2 h-[140vmin] w-[140vmin] -translate-x-1/2 -translate-y-1/2"
        style={{ transformOrigin: 'center center', willChange: 'transform' }}
      >
        {tradition === 'indian' ? <IndianGeometry /> : <ChineseGeometry />}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Indian variant — lotus-petal rotational geometry. Twelve petals around
// a central concentric circle pair. No specific yantra invoked.
// ─────────────────────────────────────────────────────────────────────────
function IndianGeometry() {
  const petals = 12;
  const petalPath = 'M 0 -68 C 12 -50, 12 -30, 0 -10 C -12 -30, -12 -50, 0 -68 Z';
  return (
    <g
      stroke="var(--color-accent)"
      fill="none"
      strokeWidth={0.55}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle r="80" />
      <circle r="64" />
      <circle r="14" />
      <circle r="6" />
      {Array.from({ length: petals }, (_, i) => (
        <path key={i} d={petalPath} transform={`rotate(${(360 / petals) * i})`} />
      ))}
      {Array.from({ length: petals }, (_, i) => (
        <line
          key={`r-${i}`}
          x1="0"
          y1="14"
          x2="0"
          y2="64"
          transform={`rotate(${(360 / petals) * i + 360 / petals / 2})`}
          opacity="0.55"
        />
      ))}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Chinese variant — 8-fold compass rosette. Eight rays + concentric octagonal
// rings. Generic geometry; not a specific bāguà arrangement.
// ─────────────────────────────────────────────────────────────────────────
function ChineseGeometry() {
  const rays = 8;
  const octagon = (r: number) => {
    const points: string[] = [];
    for (let i = 0; i < 8; i += 1) {
      const angle = ((Math.PI * 2) / 8) * i - Math.PI / 8;
      points.push(`${(Math.cos(angle) * r).toFixed(3)},${(Math.sin(angle) * r).toFixed(3)}`);
    }
    return points.join(' ');
  };

  return (
    <g
      stroke="var(--color-accent)"
      fill="none"
      strokeWidth={0.55}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle r="80" />
      <polygon points={octagon(70)} />
      <polygon points={octagon(54)} />
      <polygon points={octagon(38)} />
      <circle r="14" />
      <circle r="6" />
      {Array.from({ length: rays }, (_, i) => (
        <line
          key={i}
          x1="0"
          y1="14"
          x2="0"
          y2="80"
          transform={`rotate(${(360 / rays) * i})`}
          opacity="0.6"
        />
      ))}
    </g>
  );
}
