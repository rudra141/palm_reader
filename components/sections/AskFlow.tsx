'use client';

// AskFlow — the /ask state machine. Three steps:
//   1) collect minimal client context (gender + dominant hand + photo + tradition + sub-style)
//   2) upload photo → /api/upload, then run /api/quick-vision to get a free-text palm description
//   3) hand off to ChatPanel in direct-context mode so the user can ask anything
//
// Compared to /upload + /report:
//   - skips the heavy reasoning pass (no 12-section report)
//   - no DB persistence — vision lives in React state
//   - faster to first chat answer (~3-5s upload+vision vs ~20-30s full pipeline)
//   - refresh = lost (acceptable for a quick consultation)

import { useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ChatPanel } from '@/components/sections/ChatPanel';
import { SUB_STYLE_IDS, type SubStyleId } from '@/lib/validation/inputSchemas';
import { TRADITIONS } from '@/lib/ai/traditions';
import type { DirectChatContext } from '@/lib/validation/chatSchema';

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

const INDIAN_STYLES = SUB_STYLE_IDS.filter((id) => id.startsWith('INDIAN.'));
const CHINESE_STYLES = SUB_STYLE_IDS.filter((id) => id.startsWith('CHINESE.'));

type Status =
  | { kind: 'idle' }
  | { kind: 'uploading' }
  | { kind: 'reading' }
  | { kind: 'ready'; context: DirectChatContext; previewUrl: string }
  | { kind: 'invalid'; reason: string }
  | { kind: 'error'; message: string };

const inputClass =
  'mt-[var(--space-2)] block w-full rounded-[var(--radius-md)] border bg-transparent px-[var(--space-4)] py-[var(--space-3)] text-base outline-none transition-colors focus:border-[var(--color-ink)]';
const inputStyle = { borderColor: 'var(--color-border)', color: 'var(--color-ink)' } as const;
const labelClass =
  'block font-[var(--font-body)] text-sm tracking-[var(--tracking-wide)] uppercase';
const labelStyle = { color: 'var(--color-ink-muted)' } as const;

export function AskFlow() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tradition, setTradition] = useState<'indian' | 'chinese'>('indian');
  const [subStyle, setSubStyle] = useState<SubStyleId>('INDIAN.SAMUDRIKA_COMPREHENSIVE');
  const [dominantHand, setDominantHand] = useState<'left' | 'right'>('right');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'' | 'male' | 'female' | 'nonbinary' | 'prefer_not_to_say'>(
    '',
  );
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const onTraditionChange = (next: 'indian' | 'chinese') => {
    setTradition(next);
    setSubStyle(next === 'indian' ? 'INDIAN.SAMUDRIKA_COMPREHENSIVE' : 'CHINESE.WU_XING');
  };

  const onFileChosen = (chosen: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (!chosen) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    if (!ACCEPTED.includes(chosen.type)) {
      setStatus({ kind: 'error', message: 'Use a JPEG, PNG, or WebP image.' });
      return;
    }
    if (chosen.size > MAX_BYTES) {
      setStatus({ kind: 'error', message: 'Image is larger than 10 MB.' });
      return;
    }
    setFile(chosen);
    setPreviewUrl(URL.createObjectURL(chosen));
    setStatus({ kind: 'idle' });
  };

  async function startConsultation(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setStatus({ kind: 'error', message: 'Please attach a palm photograph.' });
      return;
    }
    try {
      setStatus({ kind: 'uploading' });
      const fd = new FormData();
      fd.append('file', file);
      const upRes = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!upRes.ok) {
        const detail = (await upRes.json().catch(() => ({}))) as {
          error?: string;
          detail?: string;
        };
        throw new Error(detail.detail || detail.error || `upload_failed_${upRes.status}`);
      }
      const upJson = (await upRes.json()) as { blobUrl: string };

      setStatus({ kind: 'reading' });
      const visRes = await fetch('/api/quick-vision', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ blobUrl: upJson.blobUrl }),
      });
      if (visRes.status === 422) {
        const j = (await visRes.json()) as { reason: string };
        setStatus({ kind: 'invalid', reason: j.reason });
        return;
      }
      if (!visRes.ok) {
        const detail = (await visRes.json().catch(() => ({}))) as {
          error?: string;
          detail?: string;
        };
        throw new Error(detail.detail || detail.error || `vision_failed_${visRes.status}`);
      }
      const visJson = (await visRes.json()) as { description: string };

      const context: DirectChatContext = {
        visionDescription: visJson.description,
        tradition,
        subStyle,
        clientContext: {
          dominantHand,
          ...(name.trim() ? { name: name.trim() } : {}),
          ...(gender ? { gender } : {}),
        },
      };
      setStatus({ kind: 'ready', context, previewUrl: upJson.blobUrl });
    } catch (err) {
      setStatus({ kind: 'error', message: (err as Error).message });
    }
  }

  // ── Step 3: ready — render palm photo + ChatPanel
  if (status.kind === 'ready') {
    const traditionMeta = TRADITIONS[subStyle];
    return (
      <Container size="md">
        <figure
          className="relative mx-auto mt-[var(--space-7)] w-full max-w-[36rem] overflow-hidden rounded-[var(--radius-lg)] border"
          style={{
            borderColor: 'var(--color-border)',
            aspectRatio: '1 / 1',
            background: 'var(--color-surface-inset)',
          }}
        >
          <Image
            src={status.previewUrl}
            alt="Your palm photograph"
            fill
            sizes="(max-width: 768px) 100vw, 36rem"
            unoptimized
            className="object-contain"
            priority
            style={{ filter: 'sepia(0.18) contrast(1.04) saturate(0.95)' }}
          />
        </figure>
        <p
          className="mt-[var(--space-3)] text-center text-xs"
          style={{ color: 'var(--color-ink-faint)' }}
        >
          Reading in <em>{traditionMeta.subStyleLabel}</em>. Ask freely.
        </p>
        <div className="-mx-[var(--space-5)] sm:mx-0">
          <ChatPanel directContext={status.context} bare />
        </div>
      </Container>
    );
  }

  const styles = tradition === 'indian' ? INDIAN_STYLES : CHINESE_STYLES;
  const isWorking = status.kind === 'uploading' || status.kind === 'reading';

  return (
    <Container size="md">
      <form
        onSubmit={startConsultation}
        noValidate
        className="mt-[var(--space-7)] flex flex-col gap-[var(--space-6)]"
      >
        {/* Photo */}
        <div
          className="rounded-[var(--radius-lg)] border p-[var(--space-6)]"
          style={{
            borderColor: 'var(--color-border)',
            background: 'var(--color-surface-raised)',
          }}
        >
          <h2 className="text-2xl font-[var(--font-display)]">1. Your palm</h2>
          <p
            className="mt-[var(--space-2)] text-sm leading-[var(--leading-relaxed)]"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            Even daylight, fingers spread, lines visible. JPEG / PNG / WebP, ≤10 MB.
          </p>
          <div className="mt-[var(--space-5)] flex flex-col gap-[var(--space-4)] sm:flex-row sm:items-start">
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED.join(',')}
              aria-label="Choose a palm photograph to upload"
              className="sr-only"
              onChange={(e) => onFileChosen(e.target.files?.[0] ?? null)}
            />
            <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
              {file ? 'Choose a different photo' : 'Choose a photo'}
            </Button>
            {previewUrl ? (
              <div className="flex flex-col gap-[var(--space-2)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Selected palm preview"
                  className="max-h-40 w-auto rounded-[var(--radius-md)] border"
                  style={{ borderColor: 'var(--color-border)' }}
                />
                <span className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
                  {file?.name} · {((file?.size ?? 0) / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Tradition */}
        <div
          className="rounded-[var(--radius-lg)] border p-[var(--space-6)]"
          style={{
            borderColor: 'var(--color-border)',
            background: 'var(--color-surface-raised)',
          }}
        >
          <h2 className="text-2xl font-[var(--font-display)]">2. Tradition</h2>
          <div className="mt-[var(--space-4)] grid grid-cols-2 gap-[var(--space-3)]">
            {(['indian', 'chinese'] as const).map((t) => {
              const active = tradition === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onTraditionChange(t)}
                  aria-pressed={active}
                  className="rounded-[var(--radius-md)] border p-[var(--space-3)] text-left text-sm transition-colors"
                  style={{
                    borderColor: active ? 'var(--color-ink)' : 'var(--color-border)',
                    background: active ? 'var(--color-surface-inset)' : 'transparent',
                    color: 'var(--color-ink)',
                  }}
                >
                  {t === 'indian' ? 'Hasta Sāmudrika' : 'Mian Xiang'}
                </button>
              );
            })}
          </div>
          <label className="mt-[var(--space-4)] block">
            <span className={labelClass} style={labelStyle}>
              Sub-style
            </span>
            <select
              value={subStyle}
              onChange={(e) => setSubStyle(e.target.value as SubStyleId)}
              className={inputClass}
              style={inputStyle}
            >
              {styles.map((id) => (
                <option key={id} value={id}>
                  {TRADITIONS[id].subStyleLabel}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Personal context */}
        <div
          className="rounded-[var(--radius-lg)] border p-[var(--space-6)]"
          style={{
            borderColor: 'var(--color-border)',
            background: 'var(--color-surface-raised)',
          }}
        >
          <h2 className="text-2xl font-[var(--font-display)]">3. Tell me a little</h2>
          <p
            className="mt-[var(--space-2)] text-sm leading-[var(--leading-relaxed)]"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            Helps the answers feel addressed to you. Only dominant hand is required.
          </p>
          <div className="mt-[var(--space-4)] grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2">
            <label className="block">
              <span className={labelClass} style={labelStyle}>
                Dominant hand
              </span>
              <select
                required
                value={dominantHand}
                onChange={(e) => setDominantHand(e.target.value as 'left' | 'right')}
                className={inputClass}
                style={inputStyle}
              >
                <option value="right">Right</option>
                <option value="left">Left</option>
              </select>
            </label>
            <label className="block">
              <span className={labelClass} style={labelStyle}>
                Gender <span className="tracking-normal lowercase">(optional)</span>
              </span>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as typeof gender)}
                className={inputClass}
                style={inputStyle}
              >
                <option value="">—</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="nonbinary">Non-binary</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass} style={labelStyle}>
                Name <span className="tracking-normal lowercase">(optional)</span>
              </span>
              <input
                type="text"
                value={name}
                maxLength={80}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col items-start gap-[var(--space-3)]">
          <Button type="submit" size="lg" disabled={isWorking || !file}>
            {status.kind === 'uploading'
              ? 'Uploading…'
              : status.kind === 'reading'
                ? 'Reading the hand…'
                : 'Open the consultation'}
          </Button>
          {status.kind === 'invalid' ? (
            <p role="alert" className="text-sm" style={{ color: 'var(--color-accent-deep)' }}>
              That photo doesn&rsquo;t clearly show a palm — {status.reason}. Try another.
            </p>
          ) : null}
          {status.kind === 'error' ? (
            <p role="alert" className="text-sm" style={{ color: 'var(--color-accent-deep)' }}>
              {status.message}
            </p>
          ) : null}
          <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
            No report is generated. The conversation lives only in this browser tab — refresh to
            start over.
          </p>
        </div>
      </form>
    </Container>
  );
}
