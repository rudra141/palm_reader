import { describe, expect, it } from 'vitest';
import { deriveAnchors } from './deriveAnchors';
import type { RawLandmark } from './types';

// Synthetic palm-up right hand. Wrist at bottom-center (0.5, 0.95), fingers
// extended upward. Thumb on the left (radial side). Coordinates in 0..1.
function syntheticHand(): RawLandmark[] {
  return [
    { x: 0.5, y: 0.95 }, // 0  WRIST
    { x: 0.4, y: 0.85 }, // 1  THUMB_CMC
    { x: 0.32, y: 0.75 }, // 2 THUMB_MCP
    { x: 0.27, y: 0.66 }, // 3 THUMB_IP
    { x: 0.22, y: 0.58 }, // 4 THUMB_TIP

    { x: 0.4, y: 0.5 }, // 5  INDEX_MCP
    { x: 0.4, y: 0.4 }, // 6  INDEX_PIP
    { x: 0.4, y: 0.32 }, // 7 INDEX_DIP
    { x: 0.4, y: 0.25 }, // 8 INDEX_TIP

    { x: 0.5, y: 0.48 }, // 9  MIDDLE_MCP
    { x: 0.5, y: 0.36 }, // 10 MIDDLE_PIP
    { x: 0.5, y: 0.28 }, // 11 MIDDLE_DIP
    { x: 0.5, y: 0.2 }, // 12  MIDDLE_TIP

    { x: 0.6, y: 0.5 }, // 13  RING_MCP
    { x: 0.6, y: 0.4 }, // 14  RING_PIP
    { x: 0.6, y: 0.32 }, // 15 RING_DIP
    { x: 0.6, y: 0.25 }, // 16 RING_TIP

    { x: 0.7, y: 0.55 }, // 17 PINKY_MCP
    { x: 0.7, y: 0.45 }, // 18 PINKY_PIP
    { x: 0.7, y: 0.38 }, // 19 PINKY_DIP
    { x: 0.7, y: 0.32 }, // 20 PINKY_TIP
  ];
}

describe('deriveAnchors', () => {
  it('throws when given the wrong number of landmarks', () => {
    expect(() => deriveAnchors([])).toThrow(/21 landmarks/);
    expect(() => deriveAnchors(syntheticHand().slice(0, 10))).toThrow(/21 landmarks/);
  });

  it('returns 8 mounts, 3 lines, and 5 finger tips', () => {
    const a = deriveAnchors(syntheticHand(), 'Right', 0.92);
    expect(Object.keys(a.mounts).sort()).toEqual([
      'jupiter',
      'mars-lower',
      'mars-upper',
      'mercury',
      'moon',
      'saturn',
      'sun',
      'venus',
    ]);
    expect(Object.keys(a.lines).sort()).toEqual(['head', 'heart', 'life']);
    expect(Object.keys(a.fingerTips).sort()).toEqual(['index', 'middle', 'pinky', 'ring', 'thumb']);
    expect(a.handedness).toBe('Right');
    expect(a.confidence).toBeCloseTo(0.92, 5);
  });

  it('places finger mounts just below the corresponding finger MCP', () => {
    const a = deriveAnchors(syntheticHand());
    // Index MCP is at (0.4, 0.5). Jupiter mount should be ~25% from MCP toward
    // wrist (0.5, 0.95): cx ≈ 0.4 + (0.5-0.4)*0.25 = 0.425, cy ≈ 0.5 + (0.95-0.5)*0.25 = 0.6125.
    expect(a.mounts.jupiter.cx).toBeCloseTo(0.425, 3);
    expect(a.mounts.jupiter.cy).toBeCloseTo(0.6125, 3);
    expect(a.mounts.saturn.cx).toBeCloseTo(0.5, 3); // middle finger column
    expect(a.mounts.sun.cx).toBeCloseTo(0.575, 3);
    expect(a.mounts.mercury.cx).toBeCloseTo(0.65, 3); // pinky column
  });

  it('places Venus near the thumb base, larger than finger mounts', () => {
    const a = deriveAnchors(syntheticHand());
    // Centroid of (0.5, 0.95), (0.4, 0.85), (0.32, 0.75) = (~0.407, 0.85)
    expect(a.mounts.venus.cx).toBeCloseTo(0.407, 2);
    expect(a.mounts.venus.cy).toBeCloseTo(0.85, 2);
    expect(a.mounts.venus.r).toBeGreaterThan(a.mounts.jupiter.r);
  });

  it('places Moon on the opposite side of the palm from Venus', () => {
    const a = deriveAnchors(syntheticHand());
    // Venus is on the radial (thumb) side at cx ~0.4. Moon should be on
    // the ulnar (pinky) side — cx > midline (0.5).
    expect(a.mounts.venus.cx).toBeLessThan(0.5);
    expect(a.mounts.moon.cx).toBeGreaterThan(0.5);
  });

  it('heart line zone sits above the head line zone (lower y values)', () => {
    const a = deriveAnchors(syntheticHand());
    const heartMidY = a.lines.heart.points[1]!.y;
    const headMidY = a.lines.head.points[1]!.y;
    expect(heartMidY).toBeLessThan(headMidY); // heart higher up the palm
  });

  it('life line zone arcs near the thumb base — its midpoint is on the radial side', () => {
    const a = deriveAnchors(syntheticHand());
    const lifeMidX = a.lines.life.points[1]!.x;
    expect(lifeMidX).toBeLessThan(0.5); // radial (thumb) side
  });

  it('finger tips match landmarks 4/8/12/16/20', () => {
    const lm = syntheticHand();
    const a = deriveAnchors(lm);
    expect(a.fingerTips.thumb).toEqual({ x: lm[4]!.x, y: lm[4]!.y });
    expect(a.fingerTips.index).toEqual({ x: lm[8]!.x, y: lm[8]!.y });
    expect(a.fingerTips.middle).toEqual({ x: lm[12]!.x, y: lm[12]!.y });
    expect(a.fingerTips.ring).toEqual({ x: lm[16]!.x, y: lm[16]!.y });
    expect(a.fingerTips.pinky).toEqual({ x: lm[20]!.x, y: lm[20]!.y });
  });

  it('all mount centers stay within the 0..1 frame', () => {
    const a = deriveAnchors(syntheticHand());
    for (const m of Object.values(a.mounts)) {
      expect(m.cx).toBeGreaterThanOrEqual(0);
      expect(m.cx).toBeLessThanOrEqual(1);
      expect(m.cy).toBeGreaterThanOrEqual(0);
      expect(m.cy).toBeLessThanOrEqual(1);
    }
  });
});
