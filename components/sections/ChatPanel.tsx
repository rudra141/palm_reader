'use client';

// ChatPanel — appears beneath every reading. The reader can ask follow-up
// questions; the assistant streams answers in the warmed-up master voice
// defined by the chat_companion prompt. State is session-only at v1
// (refresh = fresh conversation); persistence is a v1.1 task.

import { useChat, type Message } from 'ai/react';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

interface Props {
  readingId: string;
  /** Suggested-question chips. Tradition-aware copy lives in the parent. */
  suggestions?: string[];
}

const DEFAULT_SUGGESTIONS = [
  'What should I lean into right now?',
  'What about my career path?',
  'Tell me something cool about my hand.',
  'Where am I most likely to be challenged?',
];

export function ChatPanel({ readingId, suggestions = DEFAULT_SUGGESTIONS }: Props) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append, stop } =
    useChat({
      api: '/api/ask',
      body: { readingId },
      onError: (err) => {
        console.error('[ChatPanel] error:', err);
      },
    });

  const threadRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll the thread to the latest token as it streams.
  useEffect(() => {
    if (!threadRef.current) return;
    threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages]);

  const handleSuggestion = (q: string) => {
    if (isLoading) return;
    void append({ role: 'user', content: q });
  };

  return (
    <section className="py-[var(--space-8)]" aria-label="Continue the reading">
      <Container size="md">
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
            The reading you just finished stays open. Follow-ups are answered in the same tradition,
            grounded in what was visible in your hand.
          </p>
        </header>

        {messages.length === 0 ? (
          <div className="mt-[var(--space-6)] flex flex-wrap gap-[var(--space-3)]">
            {suggestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSuggestion(q)}
                disabled={isLoading}
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
          {messages.map((m: Message) => (
            <article
              key={m.id}
              className="rounded-[var(--radius-md)] px-[var(--space-5)] py-[var(--space-4)]"
              style={{
                background:
                  m.role === 'user' ? 'var(--color-surface-inset)' : 'var(--color-surface-raised)',
                borderLeft: m.role === 'assistant' ? '2px solid var(--color-accent)' : 'none',
                color: 'var(--color-ink)',
              }}
            >
              <div
                className="text-xs tracking-[var(--tracking-wide)] uppercase"
                style={{ color: 'var(--color-ink-faint)' }}
              >
                {m.role === 'user' ? 'You' : 'Reading'}
              </div>
              <div className="mt-[var(--space-2)] text-base leading-[var(--leading-relaxed)] whitespace-pre-wrap">
                {m.content}
              </div>
            </article>
          ))}
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
          onSubmit={handleSubmit}
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
              onChange={handleInputChange}
              maxLength={2000}
              rows={2}
              placeholder="What does the hand say about…"
              disabled={isLoading}
              className="mt-[var(--space-2)] block w-full resize-none rounded-[var(--radius-md)] border bg-transparent px-[var(--space-4)] py-[var(--space-3)] text-base transition-colors outline-none focus:border-[var(--color-ink)]"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-ink)',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim().length > 0) {
                    handleSubmit(e as unknown as React.FormEvent);
                  }
                }
              }}
            />
          </label>
          {isLoading ? (
            <Button type="button" variant="secondary" onClick={stop}>
              Stop
            </Button>
          ) : (
            <Button type="submit" disabled={input.trim().length === 0}>
              Ask
            </Button>
          )}
        </form>

        <p className="mt-[var(--space-3)] text-xs" style={{ color: 'var(--color-ink-faint)' }}>
          Reflective conversation, not advice. Refresh to clear and start over.
        </p>
      </Container>
    </section>
  );
}
