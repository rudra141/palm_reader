---
description: Implement one beat of the 3D scroll story per /docs/scroll-story.md
argument-hint: [beat-number] e.g. 1, 2, 3
allowed-tools: Bash, Read, Write, Edit, MultiEdit, Grep, Glob
---

Implement scroll beat `$ARGUMENTS` from `/docs/scroll-story.md`.

## Steps

1. Read `/docs/scroll-story.md` — find the beat spec (scroll range, scene state, camera, lighting, UI overlay)
2. Read `/components/3d/Story.tsx` — current state of the scene
3. Plan the changes (plan mode)
4. Implement:
   - Camera path tied to `useScroll()` from Drei or GSAP ScrollTrigger
   - Lighting transitions
   - Material/uniform changes
   - Any UI overlay (HTML over canvas) using Drei's `Html` component or absolute-positioned div with scroll-tied opacity
5. **Reduced-motion fallback**:
   - If user prefers-reduced-motion, this beat must render as a static HTML+CSS panel (image + text) instead
   - Build the fallback in the same component, conditional on `useReducedMotion()` hook
6. **Low-power fallback**:
   - If `navigator.hardwareConcurrency < 4` or WebGL unavailable, fall back to the same static panel
7. Test:
   - Profile via Chrome DevTools MCP at this beat — must hit 60fps M1, 30fps mid-tier mobile
   - Playwright snapshot at the scroll position
   - Verify reduced-motion fallback renders correctly
8. Commit: `feat(3d): scroll beat $ARGUMENTS — [description]`

## Performance budget

- Beat-specific GPU memory increase ≤ 50MB
- Beat-specific JS bundle increase ≤ 0 (everything should be in the lazy-loaded 3D chunk already)
- Frame time budget: 16ms (60fps target)
