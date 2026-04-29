# Design System

> Tokens, components, motion + 3D principles. Locked at CP1; tokens may evolve in CP2 with brand-name and reference-imagery context.

---

## Philosophy

- **Restraint over flourish.** Aesop / Hermès / early Apple film. Negative space is content.
- **Type-first.** Most of the experience is reading. Typography carries the brand.
- **Motion that earns its weight.** No animation that's purely decorative. Every motion serves narrative or feedback.
- **Mobile-first geometry.** Layouts are designed at 375 first, then promoted to 768 / 1024 / 1440.
- **Tokens only.** No hard-coded colors, sizes, or spacings in component code. Ever.

## Token system

All tokens live in `/app/globals.css` as CSS custom properties on `:root`. Tailwind theme reads from these via `theme.extend.colors = { ink: 'var(--color-ink)' }` etc. Nothing is duplicated.

### Color (Light theme — default)

```css
:root {
  /* Surface */
  --color-bg: 250 248 244; /* warm cream / unbleached paper */
  --color-bg-elevated: 252 250 246; /* slightly lighter cards */
  --color-bg-inset: 246 243 237; /* subtle inset, e.g., quote blocks */

  /* Ink (text) */
  --color-ink: 28 24 22; /* near-black, warm-leaning */
  --color-ink-muted: 78 70 64;
  --color-ink-faint: 105 97 90; /* WCAG AA 4.5:1 against --color-bg */
  --color-ink-on-accent: 250 248 244;

  /* Accent — single, deliberate */
  --color-accent: 167 124 54; /* burnished gold / brass */
  --color-accent-deep: 121 86 30;
  --color-accent-glow: 222 191 130;

  /* Lines (3D scene line-glow) */
  --color-line-glow: 222 191 130; /* warm gold; matches accent-glow */

  /* Semantic */
  --color-success: 76 116 79;
  --color-error: 162 58 49;
  --color-warning: 176 128 53;

  /* Border */
  --color-border: 226 220 210;
  --color-border-strong: 200 192 180;
}
```

### Color (Dark theme — opt-in)

Triggered by `prefers-color-scheme: dark` and `[data-theme=dark]` class.

```css
[data-theme='dark'] {
  --color-bg: 18 16 14;
  --color-bg-elevated: 24 22 19;
  --color-bg-inset: 14 12 10;

  --color-ink: 240 234 225;
  --color-ink-muted: 178 170 161;
  --color-ink-faint: 122 114 105;
  --color-ink-on-accent: 18 16 14;

  --color-accent: 199 158 84;
  --color-accent-deep: 167 124 54;
  --color-accent-glow: 222 191 130;

  --color-border: 48 42 36;
  --color-border-strong: 70 62 54;
}
```

Usage in CSS: `color: rgb(var(--color-ink));`. Tailwind: `text-ink` → `theme.colors.ink: 'rgb(var(--color-ink) / <alpha-value>)'`.

### Typography

Two typefaces. No more.

```css
:root {
  --font-display: 'Cormorant Garamond', 'Hoefler Text', Georgia, serif;
  --font-body: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  /* Optional Devanagari pairing for Hindi v1.1: 'Tiro Devanagari Sanskrit' */
  /* Optional Chinese pairing: 'Source Han Serif' / 'Noto Serif CJK SC' */
}
```

- `--font-display` for headings, hero, callouts, opening lines of report sections
- `--font-body` for body text, UI, navigation, microcopy

### Type scale (mobile-first; promoted at breakpoints)

```css
:root {
  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-md: 1.125rem; /* 18px — body comfort target on mobile */
  --text-lg: 1.25rem; /* 20px */
  --text-xl: 1.5rem; /* 24px */
  --text-2xl: 1.875rem; /* 30px */
  --text-3xl: 2.5rem; /* 40px */
  --text-4xl: 3.5rem; /* 56px — H1 mobile */
  --text-5xl: 5rem; /* 80px — H1 desktop hero */
  --text-6xl: 7rem; /* 112px — kinetic display */

  /* Line height paired to scale */
  --leading-tight: 1.05;
  --leading-snug: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.65; /* report body */
  --leading-loose: 1.85;
}

@media (min-width: 768px) {
  :root {
    --text-4xl: 4.5rem;
    --text-5xl: 6rem;
    --text-6xl: 9rem;
  }
}
```

### Letter spacing

```css
--tracking-tight: -0.02em; /* display headings */
--tracking-normal: 0em;
--tracking-wide: 0.04em; /* small caps, labels */
--tracking-extra-wide: 0.12em; /* eyebrows, footer micro-copy */
```

### Spacing (8-point system)

```css
--space-0: 0;
--space-1: 0.25rem; /* 4 */
--space-2: 0.5rem; /* 8 */
--space-3: 0.75rem; /* 12 */
--space-4: 1rem; /* 16 */
--space-5: 1.5rem; /* 24 */
--space-6: 2rem; /* 32 */
--space-7: 3rem; /* 48 */
--space-8: 4rem; /* 64 */
--space-9: 6rem; /* 96 */
--space-10: 8rem; /* 128 */
--space-11: 12rem; /* 192 */
```

### Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 16px;
--radius-pill: 999px;
```

### Elevation (kept minimal)

```css
--shadow-soft: 0 1px 2px rgb(28 24 22 / 0.04), 0 4px 16px rgb(28 24 22 / 0.04);
--shadow-medium: 0 2px 4px rgb(28 24 22 / 0.06), 0 12px 32px rgb(28 24 22 / 0.08);
--shadow-glow-accent: 0 0 32px rgb(222 191 130 / 0.4); /* 3D-scene-tied; sparing use */
```

### Z-index

```css
--z-base: 0;
--z-canvas: 10;
--z-overlay: 20;
--z-nav: 30;
--z-modal: 40;
--z-toast: 50;
```

### Motion

```css
--duration-fast: 150ms;
--duration-base: 250ms;
--duration-slow: 400ms;
--duration-luxe: 800ms; /* hero transitions */

--ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* expo-ish */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-luxe: cubic-bezier(0.22, 1, 0.36, 1); /* signature easing for the brand */
```

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-base: 0ms;
    --duration-slow: 0ms;
    --duration-luxe: 0ms;
  }
}
```

All motion utilities respect this. The 3D scene swaps to its 2D fallback automatically (see `/docs/scroll-story.md`).

## Components

### Primitives (`/components/ui/`)

Owned + extended:

- `Button` — variants: `primary`, `secondary`, `ghost`, `link`. Sizes: `sm`, `md`, `lg`. Full keyboard + focus-visible.
- `Input` — text, email, date. Label always associated. Error slot.
- `Select` — Radix-based; for the tradition + sub-style dropdown
- `Checkbox` — Radix-based; mandatory disclaimer checkbox + retention opt-in
- `Dialog` — Radix-based; for delete confirmation, share modal
- `Toast` — for the microcopy library
- `Card` — basic surface, optional inset variant
- `Tooltip` — Radix-based; tradition descriptions
- `Badge` — for "Coming soon" two-hand stub
- `Spinner` — used inside loading states

Each primitive has:

- Strict typed prop interface, exported
- Mobile-first design at 375
- Tokens only
- Keyboard parity (Tab, Shift+Tab, Enter, Esc as relevant)
- Focus-visible ring (gold 2px outline, 2px offset)
- Vitest test covering render, variants, keyboard
- Lives in `/app/design-system` as a live example

### Sections (`/components/sections/`)

Composed from primitives. Rendered in `/app/design-system` as live examples paired with their props.

- `Navbar`
- `Footer`
- `Hero` (wraps the 3D canvas, has its own 2D fallback)
- `HowItWorks` (3-step explainer)
- `MethodologyTeaser` (3-card preview with anchor link)
- `Cta` (final scroll-beat-paired conversion)
- `UploadStepPhoto`, `UploadStepDetails`, `UploadStepTradition`, `UploadStepConfirm`
- `LoadingInference` (progressive-feedback strings)
- `ReportHeader`, `ReportSection`, `ReportDisclaimers`, `ReportActions`
- `Disclaimer` (block component used in report + standalone page)
- `MethodologyPrinciple` (used 3x on /methodology)
- `EmptyState`, `ErrorState`

### 3D scene (`/components/3d/`)

- `Story.tsx` — master scroll story scene. Lazy-loaded via `next/dynamic({ ssr: false })`. Wrapped in `<Suspense>` with `LoadingScrollStory` fallback.
- `Hand.tsx` — the hero hand model (Draco-compressed glTF; ≤2MB)
- `LinesGlowMaterial.tsx` — custom shader material for the line-glow effect
- `Beat1Hero.tsx`, `Beat2Portal.tsx`, `Beat3Aspiration.tsx`, `Beat4Convert.tsx` — beat-specific scene state functions
- `ScrollFallback.tsx` — 2D narrative panels for reduced-motion + low-power
- `useLowPowerMode.ts` — hook detecting `navigator.hardwareConcurrency < 4` or WebGL unavailable

## Motion principles

1. **Scroll-driven over auto-playing.** The user controls the pace. Auto-playing motion is reserved for tiny micro-interactions (button hover, focus reveal).
2. **Easing is signature.** `--ease-luxe` is used for any motion of consequence — section reveals, image fades, hero animations. Default `--ease-out` for UI feedback.
3. **One thing at a time.** Don't fade and slide and scale simultaneously unless choreographed. Pick one or two complementary properties.
4. **Animate `transform` and `opacity` only.** Never animate `top`, `left`, `width`, `height`, `margin`. Use `transform: translate()` and `transform: scale()`.
5. **Respect prefers-reduced-motion.** All motion pegged to `--duration-*` tokens which collapse to 0 under reduced-motion. Layouts must look correct as static.
6. **Anchor scroll, don't hijack.** Lenis is configured to not break native anchor jumps. Browser back / forward / page-up / page-down still work as expected.

## 3D scene principles

(Detailed in `/docs/scroll-story.md`. Summarized here.)

1. **Lazy load.** 3D code is in a separate chunk, loaded only after the page is interactive.
2. **Suspense fallback.** Meaningful loader (a still frame matching Beat 1 composition).
3. **Reduced-motion fallback.** Static panel layout that narrates the same beats.
4. **Low-power fallback.** Same as reduced-motion when `navigator.hardwareConcurrency < 4` or WebGL fails.
5. **Performance budget per beat.** ≤16ms frame time (60fps target), ≤50MB GPU memory delta per beat.
6. **Compression.** Draco for geometry; KTX2/Basis for textures where supported.
7. **No layout shift.** Canvas reserves its dimensions; `<Suspense>` fallback occupies the same box.
8. **Camera and material changes via refs.** No React state per frame. GSAP ticks update `useRef` mutables.

## Accessibility baseline

- WCAG 2.2 AA: contrast ≥ 4.5 for body text, ≥ 3 for UI / large text
- Single H1 per page; heading hierarchy strict
- All interactive elements keyboard-reachable; focus-visible always visible
- Form errors programmatically associated with inputs
- Long-form report content uses `<main>`, `<article>`, `<section>` landmarks
- Decorative 3D content `aria-hidden`; meaningful 3D content has text alternative below the canvas
- `prefers-reduced-motion` honored everywhere
- Live regions (`role="status"`, `aria-live="polite"`) on inference loading + upload progress

## Visual references

- Apple product film aesthetic — for the 3D quality (camera, lighting, restraint)
- Aesop website typography — for type scale, restraint, line height
- Hermès editorial — for negative space discipline
- Traditional Indian temple geometry — for _subtle_ visual motifs in dividers / accents (not literal carved-stone textures; reference the underlying geometry — radial symmetry, lotus-derivative proportions, restrained gold leaf only on accent)

## Forbidden visual choices

- Crystal balls, tarot cards, third-eye glyphs, generic "mystical" imagery
- Bollywood-poster colors, neon
- Gradient text on display headings (one-color-only)
- Stock photo people in lifestyle imagery (Beats 3-N when reference frames arrive should be cinematic, original or curated, never stock)
- Glass-morphism, heavy blur effects (cheap)
- Animated backgrounds that loop endlessly
- Dark patterns (forced opt-ins, hidden close buttons, manipulative copy)

## Design tokens — naming convention

- Color: `--color-{role}` (`--color-bg`, `--color-ink`, `--color-accent`)
- Type: `--font-{role}`, `--text-{size}`, `--leading-{semantic}`, `--tracking-{semantic}`
- Space: `--space-{step}` (8-point ladder)
- Radius: `--radius-{size}`
- Shadow: `--shadow-{role}`
- Motion: `--duration-{semantic}`, `--ease-{semantic}`

If a token doesn't exist for what you need, propose it in `/docs/decisions.md` first.
