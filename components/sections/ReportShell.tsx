'use client';

// ReportShell — chooses between InteractiveReport and StaticReport based on
// motion / power preferences + photo availability + landmark detection
// outcome. Also handles the print-mode swap so window.print() always shows
// the static layout regardless of which variant rendered on screen.

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { StaticReport } from '@/components/sections/StaticReport';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLowPower } from '@/hooks/useLowPower';
import { useHandLandmarks } from '@/hooks/useHandLandmarks';
import type { Report } from '@/lib/validation/reportSchema';

// Lazy-load the interactive variant: GSAP/Lenis/MediaPipe glue should not
// bloat the static-fallback path's First Load.
const InteractiveReport = dynamic(
  () => import('@/components/sections/InteractiveReport').then((m) => m.InteractiveReport),
  { ssr: false },
);

interface Props {
  report: Report;
  clientName?: string;
  readingId: string;
  blobImageUrl: string | null;
}

export function ReportShell({ report, clientName, readingId, blobImageUrl }: Props) {
  const reducedMotion = useReducedMotion();
  const lowPower = useLowPower();
  const [imageBroken, setImageBroken] = useState(false);

  // Pre-flight the photo URL so we don't even ask MediaPipe if it 404s
  // (handles retention-deleted blobs and cold-cache cases).
  useEffect(() => {
    if (!blobImageUrl) return;
    let cancelled = false;
    fetch(blobImageUrl, { method: 'HEAD' })
      .then((r) => {
        if (!cancelled && !r.ok) setImageBroken(true);
      })
      .catch(() => {
        if (!cancelled) setImageBroken(true);
      });
    return () => {
      cancelled = true;
    };
  }, [blobImageUrl]);

  const wantsInteractive = !reducedMotion && !lowPower && !!blobImageUrl && !imageBroken;

  const landmarks = useHandLandmarks(wantsInteractive ? blobImageUrl : null);

  const interactiveAvailable =
    wantsInteractive && landmarks.status !== 'failed' && landmarks.status !== 'no-hand';

  // Print mode policy: when InteractiveReport is the on-screen variant we
  // render a static print clone too so window.print() always shows the
  // clean text-scroll. When StaticReport is already the on-screen variant,
  // we render it once (it's already print-friendly) — avoids doubling DOM
  // weight on fallback routes (a measurable Lighthouse perf cost).
  if (!interactiveAvailable || !blobImageUrl) {
    return <StaticReport report={report} clientName={clientName} readingId={readingId} />;
  }

  return (
    <>
      <div className="print:hidden">
        <InteractiveReport
          report={report}
          clientName={clientName}
          readingId={readingId}
          imageUrl={blobImageUrl}
          anchors={landmarks.anchors}
        />
      </div>
      <div className="hidden print:block">
        <StaticReport report={report} clientName={clientName} readingId={readingId} />
      </div>
    </>
  );
}
