// Geometry types shared between MediaPipe Hands integration (useHandLandmarks)
// and the SVG overlay (AnnotatedPalm + FeatureHotspot). All coordinates are
// normalized 0..1 relative to the rendered image (NOT the source image).

export type MountKind =
  | 'jupiter'
  | 'saturn'
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'moon'
  | 'mars-upper'
  | 'mars-lower';

export type FingerKind = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';

export type LineKind = 'heart' | 'head' | 'life';

export interface Point2D {
  x: number;
  y: number;
}

/** A circle anchor — used for mount hotspots. */
export interface CircleAnchor {
  cx: number;
  cy: number;
  r: number;
}

/** A polyline anchor — used for line-zone bands. */
export interface PolylineAnchor {
  /** Two or more points along the band's centerline. */
  points: Point2D[];
  /** Visual band thickness, normalized 0..1 (~0.04 = 4% of image height). */
  thickness: number;
}

export interface PalmAnchors {
  mounts: Record<MountKind, CircleAnchor>;
  lines: Record<LineKind, PolylineAnchor>;
  fingerTips: Record<FingerKind, Point2D>;
  /** "Left" / "Right" / "Unknown" — handedness MediaPipe reported. */
  handedness: 'Left' | 'Right' | 'Unknown';
  /** 0..1 — MediaPipe's confidence on the detection. */
  confidence: number;
}

/**
 * One MediaPipe `NormalizedLandmark`. We only consume x,y from the 21 hand
 * keypoints — z (depth) is irrelevant for 2D overlays.
 */
export interface RawLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}
