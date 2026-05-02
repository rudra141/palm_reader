// Static text-scroll report — extracted from app/report/[id]/page.tsx as the
// fallback variant for reduced-motion / low-power / missing-photo / no-hand
// detection paths. Visually identical to the pre-CP4 layout.

import { Container } from '@/components/ui/Container';
import { ReportHeader } from '@/components/sections/ReportHeader';
import { ReportSection } from '@/components/sections/ReportSection';
import { ReportDisclaimers } from '@/components/sections/ReportDisclaimers';
import { ReportActions } from '@/components/sections/ReportActions';
import { ChatPanel } from '@/components/sections/ChatPanel';
import type { Report } from '@/lib/validation/reportSchema';

export interface StaticReportProps {
  report: Report;
  clientName?: string;
  readingId: string;
}

export function StaticReport({ report, clientName, readingId }: StaticReportProps) {
  return (
    <main className="py-[var(--space-9)]">
      <Container size="md">
        <ReportHeader report={report} clientName={clientName} />

        <ReportSection
          label="Opening"
          practitionerCue="What I see."
          body={report.opening.life_essence_summary}
        >
          <p
            className="mt-[var(--space-4)] max-w-[64ch] text-base leading-[var(--leading-relaxed)] italic"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            {report.opening.hand_impression}
          </p>
        </ReportSection>

        <ReportSection
          label="Character"
          practitionerCue="Who you are."
          body={report.character_personality.body}
          keyObservations={report.character_personality.key_observations}
        />

        <ReportSection
          label="Mind"
          practitionerCue="How you think."
          body={report.mind_intellect.body}
        />

        <ReportSection
          label="Heart"
          practitionerCue="How you love and connect."
          body={report.emotional_relationships.body}
        />

        <ReportSection
          label="Career"
          practitionerCue="Your work."
          body={report.career_profession.body}
        />

        <ReportSection
          label="Wealth"
          practitionerCue="Your relationship to material life."
          body={report.wealth_material.body}
        />

        <ReportSection
          label="Health"
          practitionerCue="Your constitution."
          preamble={report.health_indications.mandatory_disclaimer}
          body={report.health_indications.body}
        />

        <ReportSection
          label="Trajectory"
          practitionerCue="How your life unfolds."
          body={report.life_trajectory_timing.body}
        />

        {report.spiritual_inclinations ? (
          <ReportSection
            label="Spirit"
            practitionerCue="Your inner orientation."
            body={report.spiritual_inclinations.body}
          />
        ) : null}

        <ReportSection
          label="Strengths"
          practitionerCue="What to lean into."
          body={report.strengths_to_leverage.body}
        />

        <ReportSection
          label="Cautions"
          practitionerCue="What to attend to."
          body={report.areas_to_be_mindful_of.body}
        />

        <ReportSection
          label="Closing"
          practitionerCue="A parting word."
          body={report.closing.body}
        />

        <ReportActions readingId={readingId} />

        <ChatPanel readingId={readingId} />

        <ReportDisclaimers report={report} />
      </Container>
    </main>
  );
}
