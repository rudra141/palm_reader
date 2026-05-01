'use client';

import Image from 'next/image';
import { useHandLandmarks } from '@/hooks/useHandLandmarks';

interface Props {
  imageUrl: string;
}

const STATUS_COPY: Record<ReturnType<typeof useHandLandmarks>['status'], string> = {
  idle: 'Idle',
  'loading-model': 'Loading MediaPipe model…',
  detecting: 'Detecting hand…',
  ready: 'Hand detected',
  'no-hand': 'No hand detected',
  failed: 'Detection failed',
};

export function LandmarksDebugClient({ imageUrl }: Props) {
  const { status, keypoints, anchors, error } = useHandLandmarks(imageUrl);

  return (
    <div>
      <div
        className="mb-[var(--space-4)] rounded-md border px-[var(--space-3)] py-[var(--space-2)] text-sm"
        style={{
          borderColor: 'var(--color-border)',
          color: status === 'failed' ? 'var(--color-accent-deep)' : 'var(--color-ink)',
        }}
      >
        <strong>Status:</strong> {STATUS_COPY[status]}
        {error ? (
          <>
            {' '}
            &mdash; <code>{error}</code>
          </>
        ) : null}
        {anchors ? (
          <>
            {' '}
            &mdash; handedness: <code>{anchors.handedness}</code>, confidence:{' '}
            <code>{anchors.confidence.toFixed(2)}</code>
          </>
        ) : null}
      </div>

      <div
        className="relative mx-auto w-full overflow-hidden rounded-md border"
        style={{ borderColor: 'var(--color-border)', aspectRatio: '1 / 1' }}
      >
        <Image
          src={imageUrl}
          alt="Palm photograph used for landmark debugging"
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          unoptimized
          className="object-contain"
          priority
        />

        {keypoints && anchors ? (
          <svg
            viewBox="0 0 1 1"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden
          >
            {/* Line zones (soft brass bands) */}
            {(['heart', 'head', 'life'] as const).map((kind) => {
              const line = anchors.lines[kind];
              const d = line.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
              return (
                <path
                  key={kind}
                  d={d}
                  fill="none"
                  stroke="var(--color-accent-glow)"
                  strokeWidth={line.thickness}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.55}
                />
              );
            })}

            {/* Mounts (concentric brass rings) */}
            {Object.entries(anchors.mounts).map(([id, m]) => (
              <g key={id}>
                <circle
                  cx={m.cx}
                  cy={m.cy}
                  r={m.r}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth={0.004}
                  opacity={0.85}
                />
                <circle cx={m.cx} cy={m.cy} r={0.005} fill="var(--color-accent)" />
              </g>
            ))}

            {/* Raw keypoints (small dots) */}
            {keypoints.map((k, i) => (
              <circle
                key={i}
                cx={k.x}
                cy={k.y}
                r={0.005}
                fill="var(--color-accent-deep)"
                opacity={0.7}
              />
            ))}
          </svg>
        ) : null}
      </div>

      {anchors ? (
        <details className="mt-[var(--space-4)]">
          <summary className="cursor-pointer text-sm" style={{ color: 'var(--color-ink-muted)' }}>
            Inspect anchors JSON
          </summary>
          <pre
            className="mt-[var(--space-2)] max-h-[28rem] overflow-auto rounded-md p-[var(--space-3)] text-xs"
            style={{
              background: 'var(--color-surface-inset)',
              color: 'var(--color-ink-muted)',
            }}
          >
            {JSON.stringify(anchors, null, 2)}
          </pre>
        </details>
      ) : null}
    </div>
  );
}
