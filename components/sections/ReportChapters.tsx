'use client';

// ReportChapters — the chaptered scrollytelling body of the interactive
// report. Each section becomes a full-viewport ReportChapter; section keys
// are wired to DOM ids (`chapter-<sectionKey>`) so AnnotatedPalm hotspots
// can smooth-scroll into them via the ScrollProvider context.

import { ReportChapter } from '@/components/sections/ReportChapter';
import type { Report } from '@/lib/validation/reportSchema';

interface Props {
  report: Report;
}

export function ReportChapters({ report }: Props) {
  return (
    <div className="relative">
      <ReportChapter
        id="chapter-opening"
        label="Opening"
        practitionerCue="What I see."
        body={report.opening.life_essence_summary}
      >
        <p
          className="max-w-[60ch] text-base leading-[var(--leading-relaxed)] italic"
          style={{ color: 'var(--color-ink-muted)' }}
        >
          {report.opening.hand_impression}
        </p>
      </ReportChapter>

      <ReportChapter
        id="chapter-character_personality"
        label="Character"
        practitionerCue="Who you are."
        body={report.character_personality.body}
        keyObservations={report.character_personality.key_observations}
      />

      <ReportChapter
        id="chapter-mind_intellect"
        label="Mind"
        practitionerCue="How you think."
        body={report.mind_intellect.body}
      />

      <ReportChapter
        id="chapter-emotional_relationships"
        label="Heart"
        practitionerCue="How you love and connect."
        body={report.emotional_relationships.body}
      />

      <ReportChapter
        id="chapter-career_profession"
        label="Career"
        practitionerCue="Your work."
        body={report.career_profession.body}
      />

      <ReportChapter
        id="chapter-wealth_material"
        label="Wealth"
        practitionerCue="Your relationship to material life."
        body={report.wealth_material.body}
      />

      <ReportChapter
        id="chapter-health_indications"
        label="Health"
        practitionerCue="Your constitution."
        preamble={report.health_indications.mandatory_disclaimer}
        body={report.health_indications.body}
      />

      <ReportChapter
        id="chapter-life_trajectory_timing"
        label="Trajectory"
        practitionerCue="How your life unfolds."
        body={report.life_trajectory_timing.body}
      />

      {report.spiritual_inclinations ? (
        <ReportChapter
          id="chapter-spiritual_inclinations"
          label="Spirit"
          practitionerCue="Your inner orientation."
          body={report.spiritual_inclinations.body}
        />
      ) : null}

      <ReportChapter
        id="chapter-strengths_to_leverage"
        label="Strengths"
        practitionerCue="What to lean into."
        body={report.strengths_to_leverage.body}
      />

      <ReportChapter
        id="chapter-areas_to_be_mindful_of"
        label="Cautions"
        practitionerCue="What to attend to."
        body={report.areas_to_be_mindful_of.body}
      />

      <ReportChapter
        id="chapter-closing"
        label="Closing"
        practitionerCue="A parting word."
        body={report.closing.body}
      />
    </div>
  );
}
