// Derive PalmAnchors from MediaPipe Hands' 21 keypoints. Pure function so it
// can be unit-tested against synthetic landmark inputs without loading
// MediaPipe. The output is normalized 0..1 relative to the rendered image;
// the SVG overlay scales it up via viewBox.
//
// Keypoint indices (MediaPipe convention):
//   0  WRIST
//   1  THUMB_CMC      2  THUMB_MCP      3  THUMB_IP       4  THUMB_TIP
//   5  INDEX_MCP      6  INDEX_PIP      7  INDEX_DIP      8  INDEX_TIP
//   9  MIDDLE_MCP    10  MIDDLE_PIP    11  MIDDLE_DIP    12  MIDDLE_TIP
//  13  RING_MCP      14  RING_PIP      15  RING_DIP      16  RING_TIP
//  17  PINKY_MCP     18  PINKY_PIP     19  PINKY_DIP     20  PINKY_TIP
//
// Mount placement is heuristic — palm lines aren't keypoints. Mounts land
// just below each finger's MCP, pulled toward the wrist by ~25%. Line zones
// are soft bands, not precise traces (see UI copy in AnnotatedPalm).

import type {
  CircleAnchor,
  FingerKind,
  LineKind,
  MountKind,
  PalmAnchors,
  Point2D,
  PolylineAnchor,
  RawLandmark,
} from './types';

const REQUIRED_LANDMARKS = 21;

const MOUNT_RADIUS = 0.045; // 4.5% of image min-edge — fits comfortably below MCPs

function midpoint(a: Point2D, b: Point2D, t: number): Point2D {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function centroid(points: Point2D[]): Point2D {
  const n = points.length;
  return {
    x: points.reduce((sum, p) => sum + p.x, 0) / n,
    y: points.reduce((sum, p) => sum + p.y, 0) / n,
  };
}

function reflectAcrossAxis(p: Point2D, axisFrom: Point2D, axisTo: Point2D): Point2D {
  const dx = axisTo.x - axisFrom.x;
  const dy = axisTo.y - axisFrom.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return p;
  // Project p onto axis line, then reflect.
  const t = ((p.x - axisFrom.x) * dx + (p.y - axisFrom.y) * dy) / len2;
  const proj: Point2D = { x: axisFrom.x + dx * t, y: axisFrom.y + dy * t };
  return { x: 2 * proj.x - p.x, y: 2 * proj.y - p.y };
}

function clamp01(p: Point2D): Point2D {
  return { x: Math.max(0, Math.min(1, p.x)), y: Math.max(0, Math.min(1, p.y)) };
}

/**
 * Convert a MediaPipe `landmarks` array (length 21) + a handedness label into
 * normalized PalmAnchors. Throws if the input is missing or malformed.
 */
export function deriveAnchors(
  landmarks: RawLandmark[],
  handedness: 'Left' | 'Right' | 'Unknown' = 'Unknown',
  confidence = 1,
): PalmAnchors {
  if (!Array.isArray(landmarks) || landmarks.length !== REQUIRED_LANDMARKS) {
    throw new Error(
      `deriveAnchors: expected ${REQUIRED_LANDMARKS} landmarks, got ${landmarks?.length ?? 0}`,
    );
  }

  const lm = (i: number): Point2D => {
    const l = landmarks[i];
    if (!l) throw new Error(`deriveAnchors: landmark ${i} missing`);
    return { x: l.x, y: l.y };
  };

  const wrist = lm(0);
  const thumbCMC = lm(1);
  const thumbMCP = lm(2);
  const indexMCP = lm(5);
  const middleMCP = lm(9);
  const ringMCP = lm(13);
  const pinkyMCP = lm(17);

  // Palm midline runs from wrist → middle MCP. Used for mirror reflection
  // when locating Mount of Moon (opposite Venus across the palm).
  const midlineFrom = wrist;
  const midlineTo = middleMCP;

  // Mounts ───────────────────────────────────────────────────────────────
  // Each finger-mount sits just below its MCP, pulled ~25% toward the wrist.
  const mountFromMCP = (mcp: Point2D): CircleAnchor => {
    const center = midpoint(mcp, wrist, 0.25);
    return { cx: center.x, cy: center.y, r: MOUNT_RADIUS };
  };

  const jupiter = mountFromMCP(indexMCP);
  const saturn = mountFromMCP(middleMCP);
  const sun = mountFromMCP(ringMCP);
  const mercury = mountFromMCP(pinkyMCP);

  // Venus is the thumb pad — centroid of wrist + thumb base joints.
  const venusCenter = centroid([wrist, thumbCMC, thumbMCP]);
  const venus: CircleAnchor = {
    cx: venusCenter.x,
    cy: venusCenter.y,
    r: MOUNT_RADIUS * 1.4, // larger than finger mounts
  };

  // Moon is the percussion (pinky) edge — mirror Venus across the midline.
  const moonReflected = reflectAcrossAxis(venusCenter, midlineFrom, midlineTo);
  const moonClamped = clamp01(moonReflected);
  const moon: CircleAnchor = {
    cx: moonClamped.x,
    cy: moonClamped.y,
    r: MOUNT_RADIUS * 1.2,
  };

  // Mars upper / lower sit between the percussion edge and the finger row.
  const mercuryCenter: Point2D = { x: mercury.cx, y: mercury.cy };
  const jupiterCenter: Point2D = { x: jupiter.cx, y: jupiter.cy };
  const marsUpperCenter = midpoint(moonClamped, mercuryCenter, 0.4);
  const marsUpper: CircleAnchor = {
    cx: marsUpperCenter.x,
    cy: marsUpperCenter.y,
    r: MOUNT_RADIUS,
  };
  const marsLowerCenter = midpoint(venusCenter, jupiterCenter, 0.4);
  const marsLower: CircleAnchor = {
    cx: marsLowerCenter.x,
    cy: marsLowerCenter.y,
    r: MOUNT_RADIUS,
  };

  // Line zones ───────────────────────────────────────────────────────────
  // Heart-line zone runs across the palm just below the finger MCPs,
  // curving from below pinky-MCP to below index-MCP. We sample 3 points.
  const heartZone: PolylineAnchor = {
    points: [
      midpoint(pinkyMCP, wrist, 0.18),
      midpoint(middleMCP, wrist, 0.2),
      midpoint(indexMCP, wrist, 0.22),
    ],
    thickness: 0.045,
  };

  // Head-line zone sits below heart, slightly deeper toward wrist.
  const headZone: PolylineAnchor = {
    points: [
      midpoint(pinkyMCP, wrist, 0.32),
      midpoint(middleMCP, wrist, 0.36),
      midpoint(indexMCP, wrist, 0.34),
    ],
    thickness: 0.04,
  };

  // Life-line zone arcs around the Venus mount. Sample 3 points: between
  // index/thumb (top), curving down past Venus, terminating near wrist.
  const lifeZone: PolylineAnchor = {
    points: [
      midpoint(indexMCP, thumbMCP, 0.45),
      midpoint(thumbMCP, wrist, 0.55),
      midpoint(thumbCMC, wrist, 0.85),
    ],
    thickness: 0.04,
  };

  // Finger tips ──────────────────────────────────────────────────────────
  const fingerTips: Record<FingerKind, Point2D> = {
    thumb: lm(4),
    index: lm(8),
    middle: lm(12),
    ring: lm(16),
    pinky: lm(20),
  };

  const mounts: Record<MountKind, CircleAnchor> = {
    jupiter,
    saturn,
    sun,
    mercury,
    venus,
    moon,
    'mars-upper': marsUpper,
    'mars-lower': marsLower,
  };

  const lines: Record<LineKind, PolylineAnchor> = {
    heart: heartZone,
    head: headZone,
    life: lifeZone,
  };

  return { mounts, lines, fingerTips, handedness, confidence };
}
