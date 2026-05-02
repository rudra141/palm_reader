// POST /api/ask — chat companion. v2 returns a structured
// `{ answer, detail }` JSON object so the UI can render a terse default
// answer with a "More detail" expansion. Generated via `generateObject`
// against the chat_companion v2 prompt.
//
// Two input modes:
//   - { readingId, messages } — looks up persisted vision + report from
//     the DB (used by ChatPanel below /report/[id]).
//   - { direct: { visionDescription, tradition, subStyle, clientContext },
//       messages } — used by the /ask quick-consultation surface. No DB
//     read; everything needed for the prompt comes inline.
//
// Provider chain: Groq (Llama 3.3 70B) primary, OpenRouter fallback.

import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { generateObject } from 'ai';
import { AskRequestSchema } from '@/lib/validation/inputSchemas';
import { ReportSchema, type Report } from '@/lib/validation/reportSchema';
import { ChatAnswerSchema } from '@/lib/validation/chatSchema';
import { chooseChatProvider, hasLiveAi, type ChatProviderChoice } from '@/lib/ai/client';
import { composeChatPrompt, PROMPT_IDS } from '@/lib/ai/prompts';
import { getTradition } from '@/lib/ai/traditions';
import { checkRateLimit, LIMIT_CHAT_PER_IP_HOUR, LIMIT_CHAT_PER_IP_DAY } from '@/lib/rate-limit';
import { hashIp, getIpFromHeaders } from '@/lib/utils/ipHash';
import { getSampleReport } from '@/lib/fixtures/sampleReports';
import { db, schema } from '@/lib/db';
import type { SubStyleId, ClientContext } from '@/lib/validation/inputSchemas';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface ResolvedContext {
  subStyleId: SubStyleId;
  visionDescription: string;
  report: Report | null;
  clientContext: ClientContext | null;
}

async function resolveReportMode(readingId: string): Promise<ResolvedContext | null> {
  if (readingId.startsWith('sample-')) {
    const fixture = getSampleReport(readingId);
    if (!fixture) return null;
    return {
      subStyleId: fixture.meta.sub_style as SubStyleId,
      visionDescription: '(no vision observation — fixture report)',
      report: fixture,
      clientContext: null,
    };
  }
  if (!process.env.DATABASE_URL) return null;
  const rows = await db()
    .select({
      reportJson: schema.readings.reportJson,
      visionObservationJson: schema.readings.visionObservationJson,
      contextJson: schema.readings.contextJson,
      subStyle: schema.readings.subStyle,
    })
    .from(schema.readings)
    .where(eq(schema.readings.id, readingId))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  const parsed = ReportSchema.safeParse(row.reportJson);
  if (!parsed.success) return null;
  const vision = row.visionObservationJson as { description?: string } | null;
  return {
    subStyleId: row.subStyle as SubStyleId,
    visionDescription: vision?.description ?? '(no vision observation persisted for this reading)',
    report: parsed.data,
    clientContext: (row.contextJson as ClientContext) ?? null,
  };
}

export async function POST(req: Request) {
  if (!hasLiveAi()) {
    return NextResponse.json(
      {
        error: 'ai_unconfigured',
        detail: 'GROQ_API_KEY or OPENROUTER_API_KEY is required for chat.',
      },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = AskRequestSchema.safeParse(body);
  if (!parsed.success) {
    console.error('[ask] invalid_input', JSON.stringify(parsed.error.issues, null, 2));
    return NextResponse.json(
      { error: 'invalid_input', issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const input = parsed.data;

  const ipHash = hashIp(getIpFromHeaders(req.headers));
  const [hour, day] = await Promise.all([
    checkRateLimit(LIMIT_CHAT_PER_IP_HOUR, ipHash),
    checkRateLimit(LIMIT_CHAT_PER_IP_DAY, ipHash),
  ]);
  if (!hour.success || !day.success) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  // Resolve the prompt context — either by DB lookup (report mode) or
  // straight from the request body (direct mode).
  let ctx: ResolvedContext | null = null;
  if (input.readingId) {
    ctx = await resolveReportMode(input.readingId);
    if (!ctx) {
      return NextResponse.json({ error: 'reading_not_found' }, { status: 404 });
    }
  } else if (input.direct) {
    ctx = {
      subStyleId: input.direct.subStyle,
      visionDescription: input.direct.visionDescription,
      report: null,
      clientContext: input.direct.clientContext,
    };
  } else {
    // Should be unreachable given the schema refine, but a defensive guard.
    return NextResponse.json(
      { error: 'invalid_input', detail: 'missing context' },
      { status: 400 },
    );
  }

  const meta = getTradition(ctx.subStyleId);
  const { system } = composeChatPrompt({
    meta,
    subStyleId: ctx.subStyleId,
    visionDescription: ctx.visionDescription,
    report: ctx.report,
    clientContext: ctx.clientContext,
  });

  const skip: ChatProviderChoice['providerId'][] = [];
  let provider = chooseChatProvider(skip);
  if (!provider) {
    return NextResponse.json({ error: 'no_chat_provider_configured' }, { status: 503 });
  }

  async function callOnce(p: ChatProviderChoice) {
    return generateObject({
      model: p.model,
      schema: ChatAnswerSchema,
      system,
      messages: input.messages,
      temperature: 0.7,
      maxTokens: 900,
    });
  }

  try {
    const result = await callOnce(provider);
    return NextResponse.json(
      {
        answer: result.object.answer,
        detail: result.object.detail,
        provider: provider.providerId,
        promptVersion: PROMPT_IDS.chat_companion.version,
      },
      {
        headers: {
          'X-Chat-Provider': provider.providerId,
          'X-Chat-Prompt-Version': PROMPT_IDS.chat_companion.version,
        },
      },
    );
  } catch (err) {
    console.warn(`[ask] ${provider.providerId} failed:`, (err as Error).message);
    skip.push(provider.providerId);
    provider = chooseChatProvider(skip);
    if (!provider) {
      return NextResponse.json(
        {
          error: 'all_chat_providers_failed',
          detail: (err as Error).message,
        },
        { status: 503 },
      );
    }
    try {
      const result = await callOnce(provider);
      return NextResponse.json(
        {
          answer: result.object.answer,
          detail: result.object.detail,
          provider: provider.providerId,
          providerFallback: true,
          promptVersion: PROMPT_IDS.chat_companion.version,
        },
        {
          headers: {
            'X-Chat-Provider': provider.providerId,
            'X-Chat-Provider-Fallback': 'true',
          },
        },
      );
    } catch (err2) {
      return NextResponse.json(
        {
          error: 'all_chat_providers_failed',
          detail: (err2 as Error).message,
        },
        { status: 503 },
      );
    }
  }
}
