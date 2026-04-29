# Scroll Story — 3D Cinematic Narrative

> The 3D scroll experience that opens the product. Lives in `/components/3d/Story.tsx`. Each beat is also defined as a 2D fallback panel for reduced-motion + low-power.
>
> **Reference imagery for Beats 3-N is delivered by the user at CP2** (per Q7 decision). Until then, this file defines the **structural beats**, the **camera language**, the **tone targets**, and the **fallback layout**. Concrete frame references are slotted in at CP2.
>
> **Total scroll length:** ~3 viewport heights. Anything longer feels endless.

---

## Pacing intent

| Beat                       | Scroll range  | Intent                                                                                   |
| -------------------------- | ------------- | ---------------------------------------------------------------------------------------- |
| 1 — Hero hand close-up     | 0vh → 1.0vh   | **Hook.** Stop the scroll. The hero moment.                                              |
| 2 — Portal zoom            | 1.0vh → 1.8vh | **Transition.** Camera enters the hand through the major lines as if through a portal.   |
| 3 — Aspirational lifestyle | 1.8vh → 2.6vh | **Build.** Editorial lifestyle frames. Master-practitioner's vision of a fulfilled life. |
| 4 — Convert                | 2.6vh → 3.0vh | **Resolve.** The portal closes back onto the hand; CTA emerges.                          |

If a beat doesn't earn its scroll-length, cut it. If a beat is doing too much, split it. Total never grows past 3vh.

---

## Beat 1 — Hero hand close-up (built in CP2)

### Intent

A single hand, sculptural, dramatically lit. The kind of close-up Apple uses for product film, but the product is a hand. Lines glow subtly — gold filament under translucent skin. The hero moment.

### Scene state

- Single Draco-compressed hand glTF (≤2MB)
- Subdivision-surface smooth, but not over-smoothed (skin retains believable micro-detail via normal map)
- Skin material: subsurface-scattering shader (gentle), warm flesh tone
- Major lines (Heart, Head, Life) carry a custom glow shader — emissive gold along the line geometry, falling off in a soft halo
- Background: deep neutral (charcoal-cream gradient on light theme; near-black on dark theme), no distractions
- Vignette in post-processing — gentle

### Camera

- Fixed perspective, slight tilt (~3-5° rotation around y-axis)
- Field of view 30° (cinematic, not phone-camera-wide)
- Position: just above the palm, looking slightly down
- No camera movement during Beat 1's scroll range — the hand is _still_. Movement comes in Beat 2.
- ~95% of the frame is hand + ambient negative space

### Lighting

- Key light: warm, off-axis (45° from camera right, slightly above)
- Fill light: cool, very low intensity, opposite side
- Rim light: faint, behind the hand to separate it from background
- Line glow: emissive material, not a separate light — the lines themselves emit

### UI overlay

- H1 text positioned in negative space to the left of the hand (mobile: above the hand)
- H1 typography: `--font-display`, `--text-5xl` (desktop) / `--text-4xl` (mobile), `--tracking-tight`, `--leading-tight`
- Text content: see `/docs/content-plan.md` landing.hero.h1
- Sub-headline: `--font-body`, `--text-md`, `--color-ink-muted`
- CTA button below the sub-headline (link to `/upload`)

### Performance budget

- Frame time ≤ 16ms (60fps target on M1, 30fps min on mid-tier mobile at 4× CPU throttle)
- GPU memory delta ≤ 50MB
- Mesh poly count ≤ 80k
- Texture budget ≤ 8MB total (KTX2/Basis where supported)
- The line-glow shader is the heaviest piece — keep instancing simple, no post-process bloom (vignette only)

### Reduced-motion / low-power fallback

- Static high-quality still of Beat 1 composition (rendered once, served as `next/image`-optimized JPEG/WebP)
- Same text overlay
- Same CTA
- No animation; no scroll-tied changes
- Total: identical narrative content, no motion

### Built in

**CP2 deliverable.** Beat 1 only at CP2; Beats 2–4 follow in Phase 7.

---

## Beat 2 — Portal zoom (Phase 7)

### Intent

The camera enters the hand through the major lines, as if the lines are a portal into another world. Not literal — abstract. The lines deepen into channels of light; the camera slips between them.

### Scene state

- Same hand model, but now the camera moves along a Bezier path
- Lines remain glowing; intensity ramps up as camera approaches
- Skin material fades to translucent / dissolves at portal entry
- Background transitions from neutral to a deeper warm-gold haze (the "inside the lines" space)
- Subtle particles (gold motes) float past the camera, sparse, never busy

### Camera

- Bezier path from Beat 1 position into the major line crossing point (Heart/Head intersection or wherever the model's geometry suggests)
- Tied to scroll progress with `gsap.ScrollTrigger` `scrub: true`
- At end of Beat 2, camera is "inside" — black/gold abstract space

### Lighting

- Lighting fades on approach; lines remain self-emissive
- Background light shifts to warm-gold ambient

### UI overlay

- Optional: brand single-line statement appears at mid-Beat-2, fades in/out: e.g., _"From the original texts."_
- No CTA in Beat 2

### Performance budget

- Frame time ≤ 16ms — Beat 2 is the heaviest because of camera path animation; lines must stay performant
- GPU memory delta ≤ 30MB additional (cumulative ≤ 80MB)

### Reduced-motion / low-power fallback

- Static panel: a still showing the line geometry up close (same gold-glow tone), with the brand statement laid over it
- No camera motion

---

## Beat 3 — Aspirational lifestyle (Phase 7, gated on user-supplied frames at CP2)

### Intent

The "what a life lived in awareness of these readings could look like" beat. **Reference imagery delivered by user at CP2.** Brand interpretation: a master practitioner's vision of a fulfilled life — premium, editorial, cinematic; closer to luxury film than stock lifestyle.

### Structure (independent of specific frames)

This beat may be built as:

- **Option A** — a sequence of 3-4 cinematic stills (still images, treated like scrubbed video), with the camera "passing over" each one as scroll progresses
- **Option B** — actual short video clips (KTX2 / VP9 encoded, decoded in WebGL plane), if frame rate budget allows
- **Option C** — environmental 3D scenes (a study at dusk, a quiet morning routine, a moment of stillness) constructed in R3F with simple geometry + photographic textures

Decision deferred to CP2 once user delivers reference frames. The likely default is **Option A** (still-image sequence) for performance + control.

### Camera

- Smooth camera dolly across each frame, tied to scroll
- Each frame ~0.2-0.3vh of scroll length

### UI overlay

- Each frame paired with a single line of poetic copy (one short sentence)
- Copy candidates (brand-interpretation; user can refine):
  - _"A morning that doesn't rush you."_
  - _"Decisions made with conviction."_
  - _"A relationship to your work that is yours."_
- Type in `--font-display`, `--text-3xl`, `--leading-snug`, `--tracking-tight`

### Performance budget

- Frame time ≤ 16ms
- If using image sequence: pre-load + decode-on-demand; never block the frame
- If using video: total combined size ≤ 4MB; loop-friendly encoding

### Reduced-motion / low-power fallback

- 3-4 static panels stacked vertically, each with the still + copy; user scrolls naturally without scrub-tied motion
- Identical narrative content; no scrubbing

---

## Beat 4 — Convert (Phase 7)

### Intent

The portal closes; the camera retreats from the hand; the hand is composed against the same neutral background as Beat 1, but now centered with the conversion CTA prominent. The motion is a return — it tells the user _the hand is yours, ready when you are._

### Scene state

- Camera reverses out of the abstract gold space back into the Beat-1 composition
- Lines glow more intensely briefly, then settle to Beat-1 baseline
- Background returns to Beat-1 neutral

### Camera

- Reverse Bezier path from inside back out to hero composition
- Tied to scroll, scrub-true

### UI overlay

- H2: large, kinetic, restrained ("Ready when you are.")
- Body: short
- CTA button — primary, prominent, anchored center
- Final scroll-anchored text: small disclaimer line at footer of the beat ("This site offers readings for entertainment and reflection.")

### Performance budget

- Frame time ≤ 16ms
- GPU memory peak does not increase past Beat 1 baseline

### Reduced-motion / low-power fallback

- Static composition matching Beat 1 still
- Same H2 + body + CTA + disclaimer

---

## Implementation notes

### Tech

- `gsap` + `ScrollTrigger` — drives scroll progress as a normalized 0-1 value per beat
- `useScroll()` from drei — finer-grained scene state changes
- All mutable scene values held in `useRef`, not React state. GSAP ticks update refs.
- Camera controlled via a single `useRef<THREE.PerspectiveCamera>` updated per frame inside `useFrame`
- Lenis smooth scroll wraps the whole thing; configured to not break `scrollTo` or anchor jumps
- All 3D code in `/components/3d/`. Lazy-loaded via `next/dynamic({ ssr: false })`. Suspense fallback shows the Beat-1 still.

### Bundling

- `three` + `@react-three/fiber` + `@react-three/drei` + `gsap` together form the heaviest chunk; isolate this in a `dynamic` import on the landing page only — not loaded on `/upload`, `/report`, etc.
- Geometry: glTF with Draco. Compressed to ≤2MB.
- Textures: KTX2 / Basis with WebGL fallback to JPEG/WebP for older browsers.
- Total 3D assets ≤ 8MB combined.

### Detecting low-power

```ts
const isLowPower =
  navigator.hardwareConcurrency < 4 ||
  !window.WebGLRenderingContext ||
  // Optional: prefer-reduced-data
  navigator.connection?.saveData === true;
```

### Detecting reduced-motion

```ts
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

If either is true, render `<ScrollFallback />` instead of `<Story />`.

### Fallback layout structure

```jsx
<ScrollFallback>
  <PanelBeat1 /> // hero still + H1 + sub + CTA
  <PanelBeat2 /> // close-up of line geometry + brand statement
  <PanelBeat3 /> // 3-4 lifestyle stills (one per panel) with copy
  <PanelBeat4 /> // hero still + H2 + CTA
</ScrollFallback>
```

Each panel is a regular HTML+CSS section, mobile-first, tokens only, no animation tied to scroll. Reads as a normal long-scroll page.

---

## What gets built when

| Phase             | Deliverable                                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phase 3** (CP2) | Beat 1 fully built: 3D scene + UI overlay + reduced-motion fallback panel. Beats 2-4 are placeholder text+still panels in fallback structure only. |
| **CP2 review**    | User delivers reference video/frames for Beats 3-N.                                                                                                |
| **Phase 7**       | Beats 2, 3, 4 fully built. Each with its 2D fallback. Profiled across breakpoints + low-power.                                                     |
| **Phase 10/12**   | Profiled at every beat with chrome-devtools MCP. Cross-browser tested in WebKit (likely failure surface).                                          |

---

## What this scroll story is NOT

- It is not a tutorial. The user does not need to understand palmistry to scroll through it.
- It is not infinite. Three viewport heights, end.
- It is not autoplaying. The user controls the pace.
- It is not generic "mystical" imagery. The 3D quality is the differentiator. Static stock-image flourishes are forbidden.
- It is not the product. The product is the reading. The scroll story is the doorway.
