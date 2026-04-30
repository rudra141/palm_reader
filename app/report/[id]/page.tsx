import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { Container } from '@/components/ui/Container';
import { ReportHeader } from '@/components/sections/ReportHeader';
import { ReportSection } from '@/components/sections/ReportSection';
import { ReportDisclaimers } from '@/components/sections/ReportDisclaimers';
import { ReportActions } from '@/components/sections/ReportActions';
import { getSampleReport } from '@/lib/fixtures/sampleReports';
import { ReportSchema, type Report } from '@/lib/validation/reportSchema';
import { db, schema } from '@/lib/db';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Your reading',
  // Per /docs/sitemap.md: report pages are noindex by default (privacy).
  robots: { index: false, follow: false },
};

async function loadReport(id: string): Promise<{ report: Report; clientName?: string } | null> {
  // Fixture short-circuit (CP3 review path).
  if (id.startsWith('sample-')) {
    const fixture = getSampleReport(id);
    if (!fixture) return null;
    return { report: fixture };
  }

  if (!process.env.DATABASE_URL) {
    return null;
  }

  const rows = await db()
    .select({
      reportJson: schema.readings.reportJson,
      contextJson: schema.readings.contextJson,
    })
    .from(schema.readings)
    .where(eq(schema.readings.id, id))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  const parsed = ReportSchema.safeParse(row.reportJson);
  if (!parsed.success) return null;

  const ctx = row.contextJson as { name?: string } | null;
  return { report: parsed.data, clientName: ctx?.name };
}

export default async function ReportPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadReport(id);
  if (!data) notFound();

  const { report, clientName } = data;

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

        <ReportActions readingId={id} />

        <ReportDisclaimers report={report} />
      </Container>
    </main>
  );
}
