'use client';

// InteractiveReport — orchestrates the A+B walkthrough:
//   A. AnnotatedPalm hero with click-driven hotspots
//   B. ReportChapters chaptered scrollytelling
//   - TraditionAmbient sticky background
//   - ReportHeader / ReportActions / ReportDisclaimers reused for top + tail
//
// Owns the ScrollProvider so Lenis + ScrollTrigger only mount when this
// variant renders (not the static fallback). Hotspot clicks bridge into
// chapter scroll via the provider's useScrollTo() context.

import { useCallback, useMemo } from 'react';
import { Container } from '@/components/ui/Container';
import { ReportHeader } from '@/components/sections/ReportHeader';
import { ReportActions } from '@/components/sections/ReportActions';
import { ReportDisclaimers } from '@/components/sections/ReportDisclaimers';
import { ChatPanel } from '@/components/sections/ChatPanel';
import { AnnotatedPalm } from '@/components/sections/AnnotatedPalm';
import { ReportChapters } from '@/components/sections/ReportChapters';
import { TraditionAmbient } from '@/components/sections/TraditionAmbient';
import { ScrollProvider, useScrollTo } from '@/components/providers/ScrollProvider';
import { buildFeatureIndex, type FeatureKind } from '@/lib/ai/citationToFeature';
import type { ActiveTradition } from '@/lib/palm/featureCopy';
import type { PalmAnchors } from '@/lib/palm/types';
import type { Report } from '@/lib/validation/reportSchema';

interface Props {
  report: Report;
  clientName?: string;
  readingId: string;
  imageUrl: string;
  anchors: PalmAnchors | null;
}

export function InteractiveReport(props: Props) {
  return (
    <ScrollProvider>
      <InteractiveReportInner {...props} />
    </ScrollProvider>
  );
}

function InteractiveReportInner({ report, clientName, readingId, imageUrl, anchors }: Props) {
  const { scrollTo } = useScrollTo();
  const tradition = report.meta.tradition as ActiveTradition;

  const featureIndex = useMemo(() => buildFeatureIndex(report), [report]);

  const onSelectFeature = useCallback(
    (feature: FeatureKind) => {
      const sections = featureIndex.sectionsForFeature(feature);
      const target = sections[0];
      if (!target) return;
      scrollTo(`#chapter-${target}`, { offset: -64 });
    },
    [featureIndex, scrollTo],
  );

  return (
    <main className="relative">
      <TraditionAmbient tradition={tradition} />

      <header className="pt-[var(--space-7)] pb-[var(--space-5)]">
        <Container size="md">
          <ReportHeader report={report} clientName={clientName} />
        </Container>
      </header>

      <AnnotatedPalm
        report={report}
        imageUrl={imageUrl}
        anchors={anchors}
        tradition={tradition}
        onSelectFeature={onSelectFeature}
      />

      <ReportChapters report={report} />

      <ChatPanel readingId={readingId} />

      <footer className="py-[var(--space-9)]">
        <Container size="md">
          <ReportActions readingId={readingId} />
          <ReportDisclaimers report={report} />
        </Container>
      </footer>
    </main>
  );
}
