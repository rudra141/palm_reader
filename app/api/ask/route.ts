// POST /api/ask — streaming chat companion. Loads the persisted reading,
// composes the chat prompt with vision + report + tradition + research RAG,
// streams a Llama 3.3 70B answer token-by-token. Tries Groq first, falls
// through to OpenRouter on rate-limit / provider error.

import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { streamText } from 'ai';
import { AskRequestSchema } from '@/lib/validation/inputSchemas';
import { ReportSchema, type Report } from '@/lib/validation/reportSchema';
import { chooseChatProvider, hasLiveAi, type ChatProviderChoice } from '@/lib/ai/client';
import { composeChatPrompt, PROMPT_IDS } from '@/lib/ai/prompts';
import { getTradition } from '@/lib/ai/traditions';
import { checkRateLimit, LIMIT_CHAT_PER_IP_HOUR, LIMIT_CHAT_PER_IP_DAY } from '@/lib/rate-limit';
import { hashIp, getIpFromHeaders } from '@/lib/utils/ipHash';
import { getSampleReport } from '@/lib/fixtures/sampleReports';
import { db, schema } from '@/lib/db';
import type { SubStyleId } from '@/lib/validation/inputSchemas';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface ResolvedReading {
  report: Report;
  visionDescription: string;
}

async function loadReadingForChat(id: string): Promise<ResolvedReading | null> {
  // Fixture short-circuit so the chat works on the sample reports too.
  if (id.startsWith('sample-')) {
    const fixture = getSampleReport(id);
    if (!fixture) return null;
    return {
      report: fixture,
      visionDescription: '(no vision observation — fixture report)',
    };
  }

  if (!process.env.DATABASE_URL) return null;
  const rows = await db()
    .select({
      reportJson: schema.readings.reportJson,
      visionObservationJson: schema.readings.visionObservationJson,
    })
    .from(schema.readings)
    .where(eq(schema.readings.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) return null;

  const parsed = ReportSchema.safeParse(row.reportJson);
  if (!parsed.success) return null;

  const vision = row.visionObservationJson as { description?: string } | null;
  const visionDescription =
    vision?.description ?? '(no vision observation persisted for this reading)';

  return { report: parsed.data, visionDescription };
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
    return NextResponse.json(
      { error: 'invalid_input', issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const input = parsed.data;

  // Rate-limit (per IP). Bypassed in dev by lib/rate-limit.
  const ipHash = hashIp(getIpFromHeaders(req.headers));
  const [hour, day] = await Promise.all([
    checkRateLimit(LIMIT_CHAT_PER_IP_HOUR, ipHash),
    checkRateLimit(LIMIT_CHAT_PER_IP_DAY, ipHash),
  ]);
  if (!hour.success || !day.success) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  // Load report + vision so the model has everything it needs to answer.
  const data = await loadReadingForChat(input.readingId);
  if (!data) {
    return NextResponse.json({ error: 'reading_not_found' }, { status: 404 });
  }

  const subStyleId = data.report.meta.sub_style as SubStyleId;
  const meta = getTradition(subStyleId);
  const { system } = composeChatPrompt({
    meta,
    subStyleId,
    visionDescription: data.visionDescription,
    report: data.report,
  });

  // Provider chain — Groq first, OpenRouter on fall-through.
  const skip: ChatProviderChoice['providerId'][] = [];
  let provider = chooseChatProvider(skip);
  if (!provider) {
    return NextResponse.json({ error: 'no_chat_provider_configured' }, { status: 503 });
  }

  try {
    const result = await streamText({
      model: provider.model,
      system,
      messages: input.messages,
      temperature: 0.7,
      maxTokens: 800,
    });
    return result.toDataStreamResponse({
      headers: {
        'X-Chat-Provider': provider.providerId,
        'X-Chat-Prompt-Version': PROMPT_IDS.chat_companion.version,
      },
    });
  } catch (err) {
    // Provider failed — try the next one if available.
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
      const result = await streamText({
        model: provider.model,
        system,
        messages: input.messages,
        temperature: 0.7,
        maxTokens: 800,
      });
      return result.toDataStreamResponse({
        headers: {
          'X-Chat-Provider': provider.providerId,
          'X-Chat-Provider-Fallback': 'true',
          'X-Chat-Prompt-Version': PROMPT_IDS.chat_companion.version,
        },
      });
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
