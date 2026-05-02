'use client';

// GlowingEdgeCard — pointer-tracking colored border + glow.
//
// Layered architecture:
//   1. .glowing-card-mesh-border — rainbow mesh gradient, masked by a conic
//      gradient that follows the pointer. Creates the colored *border* slice.
//   2. .glowing-card-mesh-bg — same rainbow mesh, masked by radial + conic
//      gradients to spill subtly into the card body.
//   3. .glowing-card-glow — soft halo OUTSIDE the card body, also masked
//      directionally so it only blooms in the pointer's quadrant.
//
// JS responsibilities (kept lean):
//   - On pointermove: compute pointer x/y%, angle from card center, and
//     closeness-to-edge. Push them into CSS variables that the layers read.
//   - On mount: play a one-shot intro animation that sweeps the angle and
//     fades the glow in/out so the user sees the effect once before
//     interacting.
//
// Adapted from the reference implementation provided by the user. Tuned
// minimally for this codebase: uses the project's `cn` helper, drops the
// fixed 600x600 dimensions so the card flexes inside any grid (callers
// override with className), and reuses the project's CSS-variable
// vocabulary where possible.

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

export interface GlowingEdgeCardProps extends HTMLAttributes<HTMLDivElement> {
  mode?: 'dark' | 'light';
  /** Disable the one-shot intro animation. */
  disableIntro?: boolean;
  children?: ReactNode;
}

const round = (value: number, precision = 3) => parseFloat(value.toFixed(precision));
const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);

function angleFromPointer(dx: number, dy: number) {
  if (dx === 0 && dy === 0) return 0;
  const radians = Math.atan2(dy, dx);
  let degrees = radians * (180 / Math.PI) + 90;
  if (degrees < 0) degrees += 360;
  return degrees;
}

function closenessToEdge(rect: DOMRect, x: number, y: number) {
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const dx = x - cx;
  const dy = y - cy;
  let kx = Infinity;
  let ky = Infinity;
  if (dx !== 0) kx = cx / Math.abs(dx);
  if (dy !== 0) ky = cy / Math.abs(dy);
  return clamp(1 / Math.min(kx, ky), 0, 1);
}

export function GlowingEdgeCard({
  mode = 'dark',
  disableIntro = false,
  className,
  children,
  ...rest
}: GlowingEdgeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const perx = clamp((100 / rect.width) * px);
    const pery = clamp((100 / rect.height) * py);
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const angle = angleFromPointer(px - cx, py - cy);
    const edge = closenessToEdge(rect, px, py);

    card.style.setProperty('--pointer-x', `${round(perx)}%`);
    card.style.setProperty('--pointer-y', `${round(pery)}%`);
    card.style.setProperty('--pointer-deg', `${round(angle)}deg`);
    card.style.setProperty('--pointer-d', `${round(edge * 100)}`);

    if (isAnimating) {
      setIsAnimating(false);
      card.classList.remove('animating');
    }
  };

  // One-shot intro: sweep the angle from 110° → 465° while ramping the glow
  // up then back down. Lets the user see the effect once before they move.
  useEffect(() => {
    if (disableIntro) return;
    const card = cardRef.current;
    if (!card) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const start = performance.now();
    const angleStart = 110;
    const angleEnd = 465;
    let raf = 0;
    setIsAnimating(true);
    card.classList.add('animating');
    card.style.setProperty('--pointer-deg', `${angleStart}deg`);

    const tick = (now: number) => {
      if (!card.classList.contains('animating')) return;
      const elapsed = now - start;

      // Phase 1 — glow up
      if (elapsed > 500 && elapsed < 1000) {
        const t = (elapsed - 500) / 500;
        const ease = 1 - Math.pow(1 - t, 3);
        card.style.setProperty('--pointer-d', `${ease * 100}`);
      }
      // Phase 2 — first half of the angle sweep
      if (elapsed > 500 && elapsed < 2000) {
        const t = (elapsed - 500) / 1500;
        const ease = t * t * t;
        const d = (angleEnd - angleStart) * (ease * 0.5) + angleStart;
        card.style.setProperty('--pointer-deg', `${d}deg`);
      }
      // Phase 3 — second half of the angle sweep
      if (elapsed >= 2000 && elapsed < 4250) {
        const t = (elapsed - 2000) / 2250;
        const ease = 1 - Math.pow(1 - t, 3);
        const d = (angleEnd - angleStart) * (0.5 + ease * 0.5) + angleStart;
        card.style.setProperty('--pointer-deg', `${d}deg`);
      }
      // Phase 4 — glow down
      if (elapsed > 3000 && elapsed < 4500) {
        const t = (elapsed - 3000) / 1500;
        const ease = t * t * t;
        card.style.setProperty('--pointer-d', `${(1 - ease) * 100}`);
      }

      if (elapsed < 4500) {
        raf = requestAnimationFrame(tick);
      } else {
        setIsAnimating(false);
        card.classList.remove('animating');
      }
    };

    const startTimer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, 500);

    return () => {
      window.clearTimeout(startTimer);
      cancelAnimationFrame(raf);
      card.classList.remove('animating');
    };
  }, [disableIntro]);

  // Per-mode theme variables. Carried as inline style + custom CSS vars; the
  // mesh/glow layers below read them.
  const styleVars: CSSProperties = {
    // Pointer state (live-updated by handlePointerMove)
    '--pointer-x': '50%',
    '--pointer-y': '50%',
    '--pointer-deg': '45deg',
    '--pointer-d': '0',
    // Sensitivities — higher = effect kicks in only nearer the edge
    '--glow-sens': '30',
    '--color-sens': 'calc(var(--glow-sens) + 20)',
    // Theme variables
    '--card-bg':
      mode === 'light'
        ? 'linear-gradient(8deg, color-mix(in hsl, hsl(260, 25%, 95%), #000 2.5%) 75%, hsl(260, 25%, 95%) 75.5%)'
        : 'linear-gradient(8deg, #1a1a1a 75%, color-mix(in hsl, #1a1a1a, white 2.5%) 75.5%)',
    '--blend': mode === 'light' ? 'darken' : 'soft-light',
    '--glow-blend': mode === 'light' ? 'luminosity' : 'plus-lighter',
    '--glow-color': mode === 'light' ? '280deg 90% 95%' : '40deg 80% 80%',
    '--glow-boost': mode === 'light' ? '15%' : '0%',
    '--fg': mode === 'light' ? 'black' : 'white',
  } as CSSProperties;

  return (
    <div
      ref={cardRef}
      className={cn(
        'group relative flex flex-col rounded-[1.768em] transition-colors duration-300',
        mode === 'light' ? 'light-mode' : 'dark-mode',
        isAnimating && 'animating',
        className,
      )}
      onPointerMove={handlePointerMove}
      style={styleVars}
      {...rest}
    >
      {/* Inline style block — scoped via .group: pseudo-state on the
          parent so multiple instances on the same page don't bleed.
          Class names are intentionally specific to the card layers. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .glowing-card-mesh-border {
              position: absolute;
              inset: 0;
              border-radius: inherit;
              z-index: 0;
              border: 1px solid transparent;
              background:
                linear-gradient(var(--card-bg) 0 100%) padding-box,
                linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box,
                radial-gradient(at 80% 55%, hsla(268,100%,76%,1) 0px, transparent 50%) border-box,
                radial-gradient(at 69% 34%, hsla(349,100%,74%,1) 0px, transparent 50%) border-box,
                radial-gradient(at 8% 6%, hsla(136,100%,78%,1) 0px, transparent 50%) border-box,
                radial-gradient(at 41% 38%, hsla(192,100%,64%,1) 0px, transparent 50%) border-box,
                radial-gradient(at 86% 85%, hsla(186,100%,74%,1) 0px, transparent 50%) border-box,
                radial-gradient(at 82% 18%, hsla(52,100%,65%,1) 0px, transparent 50%) border-box,
                radial-gradient(at 51% 4%, hsla(12,100%,72%,1) 0px, transparent 50%) border-box,
                linear-gradient(#c299ff 0 100%) border-box;
              opacity: calc((var(--pointer-d) - var(--color-sens)) / (100 - var(--color-sens)));
              -webkit-mask-image: conic-gradient(from var(--pointer-deg) at center, black 25%, transparent 40%, transparent 60%, black 75%);
              mask-image: conic-gradient(from var(--pointer-deg) at center, black 25%, transparent 40%, transparent 60%, black 75%);
              transition: opacity 0.25s ease-out;
              pointer-events: none;
            }
            .glowing-card-mesh-bg {
              position: absolute;
              inset: 0;
              border-radius: inherit;
              z-index: 0;
              border: 1px solid transparent;
              background:
                radial-gradient(at 80% 55%, hsla(268,100%,76%,1) 0px, transparent 50%) padding-box,
                radial-gradient(at 69% 34%, hsla(349,100%,74%,1) 0px, transparent 50%) padding-box,
                radial-gradient(at 8% 6%, hsla(136,100%,78%,1) 0px, transparent 50%) padding-box,
                radial-gradient(at 41% 38%, hsla(192,100%,64%,1) 0px, transparent 50%) padding-box,
                radial-gradient(at 86% 85%, hsla(186,100%,74%,1) 0px, transparent 50%) padding-box,
                radial-gradient(at 82% 18%, hsla(52,100%,65%,1) 0px, transparent 50%) padding-box,
                radial-gradient(at 51% 4%, hsla(12,100%,72%,1) 0px, transparent 50%) padding-box,
                linear-gradient(#c299ff 0 100%) padding-box;
              -webkit-mask-image:
                linear-gradient(to bottom, black, black),
                radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%),
                radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%),
                radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%),
                radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%),
                radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%),
                conic-gradient(from var(--pointer-deg) at center, transparent 5%, black 15%, black 85%, transparent 95%);
              mask-image:
                linear-gradient(to bottom, black, black),
                radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%),
                radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%),
                radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%),
                radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%),
                radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%),
                conic-gradient(from var(--pointer-deg) at center, transparent 5%, black 15%, black 85%, transparent 95%);
              -webkit-mask-composite: source-out;
              mask-composite: subtract, add, add, add, add, add, add;
              opacity: calc((var(--pointer-d) - var(--color-sens)) / (100 - var(--color-sens)));
              mix-blend-mode: var(--blend);
              transition: opacity 0.25s ease-out;
              pointer-events: none;
            }
            .glowing-card-glow {
              position: absolute;
              inset: -40px;
              pointer-events: none;
              z-index: 1;
              -webkit-mask-image: conic-gradient(from var(--pointer-deg) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%);
              mask-image: conic-gradient(from var(--pointer-deg) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%);
              opacity: calc((var(--pointer-d) - var(--glow-sens)) / (100 - var(--glow-sens)));
              mix-blend-mode: var(--glow-blend);
              transition: opacity 0.25s ease-out;
              border-radius: inherit;
            }
            .glowing-card-glow::before {
              content: "";
              position: absolute;
              inset: 40px;
              border-radius: inherit;
              box-shadow:
                inset 0 0 0 1px hsl(var(--glow-color) / 100%),
                inset 0 0 1px 0 hsl(var(--glow-color) / calc(var(--glow-boost) + 60%)),
                inset 0 0 3px 0 hsl(var(--glow-color) / calc(var(--glow-boost) + 50%)),
                inset 0 0 6px 0 hsl(var(--glow-color) / calc(var(--glow-boost) + 40%)),
                inset 0 0 15px 0 hsl(var(--glow-color) / calc(var(--glow-boost) + 30%)),
                inset 0 0 25px 2px hsl(var(--glow-color) / calc(var(--glow-boost) + 20%)),
                inset 0 0 50px 2px hsl(var(--glow-color) / calc(var(--glow-boost) + 10%)),
                0 0 1px 0 hsl(var(--glow-color) / calc(var(--glow-boost) + 60%)),
                0 0 3px 0 hsl(var(--glow-color) / calc(var(--glow-boost) + 50%)),
                0 0 6px 0 hsl(var(--glow-color) / calc(var(--glow-boost) + 40%)),
                0 0 15px 0 hsl(var(--glow-color) / calc(var(--glow-boost) + 30%)),
                0 0 25px 2px hsl(var(--glow-color) / calc(var(--glow-boost) + 20%)),
                0 0 50px 2px hsl(var(--glow-color) / calc(var(--glow-boost) + 10%));
            }
            .group:not(:hover):not(.animating) .glowing-card-mesh-border,
            .group:not(:hover):not(.animating) .glowing-card-mesh-bg,
            .group:not(:hover):not(.animating) .glowing-card-glow {
              opacity: 0 !important;
              transition: opacity 0.75s ease-in-out;
            }
          `,
        }}
      />

      <div className="glowing-card-mesh-border" aria-hidden />
      <div className="glowing-card-mesh-bg" aria-hidden />
      <div className="glowing-card-glow" aria-hidden />

      <div
        className="relative z-10 h-full w-full overflow-hidden rounded-[inherit] border border-white/15"
        style={{
          background: 'var(--card-bg)',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {children}
      </div>
    </div>
  );
}
