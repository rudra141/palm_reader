'use client';

// ChatPanel — companion chat surface used both below /report/[id] and on
// the /ask quick-consultation page.
//
// Two modes:
//   - report mode (`readingId`): server reads vision + report from DB.
//   - direct mode (`directContext`): everything the prompt needs ships with
//     each request, no DB read.
//
// v2 voice (chat_companion v2.0.0) returns structured `{ answer, detail }`.
// The panel renders `answer` immediately and tucks `detail` behind a
// per-message "More detail" toggle. Sessions are ephemeral — refreshing the
// page clears the thread.

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import type { DirectChatContext } from '@/lib/validation/chatSchema';

interface BaseProps {
  /** When true, omit the section header (caller already framed it). */
  bare?: boolean;
  /** Suggested-question chips. Tradition-aware copy lives in the parent. */
  suggestions?: string[];
}

interface ReportModeProps extends BaseProps {
  readingId: string;
  directContext?: never;
}

interface DirectModeProps extends BaseProps {
  readingId?: never;
  directContext: DirectChatContext;
}

export type ChatPanelProps = ReportModeProps | DirectModeProps;

interface UserTurn {
  id: string;
  role: 'user';
  content: string;
}

interface AssistantTurn {
  id: string;
  role: 'assistant';
  answer: string;
  detail: string;
}

type Turn = UserTurn | AssistantTurn;

const DEFAULT_SUGGESTIONS = [
  'What should I lean into right now?',
  'What about my career?',
  'Tell me something cool about my hand.',
  'Where am I likely to be challenged?',
];

function newId() {
  return Math.random().toString(36).slice(2);
}

export function ChatPanel(props: ChatPanelProps) {
  const { suggestions = DEFAULT_SUGGESTIONS, bare = false } = props;
  const [thread, setThread] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!threadRef.current) return;
    threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [thread, busy]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    const userTurn: UserTurn = { id: newId(), role: 'user', content: text };
    const next = [...thread, userTurn];
    setThread(next);
    setInput('');
    setBusy(true);
    setError(null);

    try {
      const messages = next.map((t) =>
        t.role === 'user'
          ? { role: 'user' as const, content: t.content }
          : { role: 'assistant' as const, content: t.answer },
      );
      const body: Record<string, unknown> = { messages };
      if ('readingId' in props && props.readingId) body.readingId = props.readingId;
      if ('directContext' in props && props.directContext) body.direct = props.directContext;

      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const detail = (await res.json().catch(() => ({}))) as { error?: string; detail?: string };
        throw new Error(detail.detail || detail.error || `chat_failed_${res.status}`);
      }
      const json = (await res.json()) as { answer: string; detail: string };
      const a: AssistantTurn = {
        id: newId(),
        role: 'assistant',
        answer: json.answer,
        detail: json.detail,
      };
      setThread((t) => [...t, a]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  return (
    <section className="py-[var(--space-8)]" aria-label="Continue the reading">
      <Container size="md">
        {!bare ? (
          <header className="max-w-[44ch]">
            <Eyebrow>Continue the reading</Eyebrow>
            <h2
              className="mt-[var(--space-3)] leading-[var(--leading-tight)] font-[var(--font-display)] italic"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
            >
              Ask anything.
            </h2>
            <p
              className="mt-[var(--space-3)] text-sm leading-[var(--leading-relaxed)]"
              style={{ color: 'var(--color-ink-muted)' }}
            >
              Short, direct answers. Tap <em>More detail</em> on any reply to see the full reasoning
              with traditional vocabulary and citations.
            </p>
          </header>
        ) : null}

        {thread.length === 0 ? (
          <div className="mt-[var(--space-6)] flex flex-wrap gap-[var(--space-3)]">
            {suggestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => void send(q)}
                disabled={busy}
                className="rounded-[var(--radius-pill)] border px-[var(--space-4)] py-[var(--space-2)] text-sm transition-colors disabled:opacity-50"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-ink)',
                  background: 'var(--color-surface-raised)',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        ) : null}

        <div
          ref={threadRef}
          aria-live="polite"
          className="mt-[var(--space-6)] flex flex-col gap-[var(--space-4)]"
        >
          {thread.map((t) =>
            t.role === 'user' ? (
              <article
                key={t.id}
                className="rounded-[var(--radius-md)] px-[var(--space-5)] py-[var(--space-4)]"
                style={{
                  background: 'var(--color-surface-inset)',
                  color: 'var(--color-ink)',
                }}
              >
                <div
                  className="text-xs tracking-[var(--tracking-wide)] uppercase"
                  style={{ color: 'var(--color-ink-faint)' }}
                >
                  You
                </div>
                <div className="mt-[var(--space-2)] text-base leading-[var(--leading-relaxed)] whitespace-pre-wrap">
                  {t.content}
                </div>
              </article>
            ) : (
              <article
                key={t.id}
                className="rounded-[var(--radius-md)] px-[var(--space-5)] py-[var(--space-4)]"
                style={{
                  background: 'var(--color-surface-raised)',
                  borderLeft: '2px solid var(--color-accent)',
                  color: 'var(--color-ink)',
                }}
              >
                <div
                  className="text-xs tracking-[var(--tracking-wide)] uppercase"
                  style={{ color: 'var(--color-ink-faint)' }}
                >
                  Reading
                </div>
                <div className="mt-[var(--space-2)] text-base leading-[var(--leading-relaxed)] whitespace-pre-wrap">
                  {t.answer}
                </div>
                {t.detail ? (
                  <div className="mt-[var(--space-3)]">
                    <button
                      type="button"
                      onClick={() => setOpenDetail((cur) => (cur === t.id ? null : t.id))}
                      className="text-xs tracking-[var(--tracking-wide)] uppercase underline-offset-[6px] hover:underline"
                      style={{ color: 'var(--color-accent-deep)' }}
                      aria-expanded={openDetail === t.id}
                    >
                      {openDetail === t.id ? 'Hide detail' : 'More detail'}
                    </button>
                    {openDetail === t.id ? (
                      <div
                        className="mt-[var(--space-3)] border-t pt-[var(--space-3)] text-sm leading-[var(--leading-relaxed)]"
                        style={{
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-ink-muted)',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {t.detail}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ),
          )}
          {busy ? (
            <div
              className="rounded-[var(--radius-md)] px-[var(--space-5)] py-[var(--space-4)] text-sm italic"
              style={{
                background: 'var(--color-surface-raised)',
                color: 'var(--color-ink-muted)',
              }}
            >
              Reading the hand…
            </div>
          ) : null}
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-[var(--space-4)] text-sm"
            style={{ color: 'var(--color-accent-deep)' }}
          >
            High demand right now. Try again in a moment.
          </p>
        ) : null}

        <form
          onSubmit={onSubmit}
          className="mt-[var(--space-6)] flex flex-col gap-[var(--space-3)] sm:flex-row sm:items-end"
        >
          <label className="block flex-1">
            <span
              className="block text-sm font-[var(--font-body)] tracking-[var(--tracking-wide)] uppercase"
              style={{ color: 'var(--color-ink-muted)' }}
            >
              Your question
            </span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={2000}
              rows={2}
              placeholder="What does the hand say about…"
              disabled={busy}
              className="mt-[var(--space-2)] block w-full resize-none rounded-[var(--radius-md)] border bg-transparent px-[var(--space-4)] py-[var(--space-3)] text-base transition-colors outline-none focus:border-[var(--color-ink)]"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-ink)',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
            />
          </label>
          <Button type="submit" disabled={busy || input.trim().length === 0}>
            Ask
          </Button>
        </form>

        <p className="mt-[var(--space-3)] text-xs" style={{ color: 'var(--color-ink-faint)' }}>
          Reflective conversation, not advice. Refresh to clear and start over.
        </p>
      </Container>
    </section>
  );
}
