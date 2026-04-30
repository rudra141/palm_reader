'use client';

import { useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SUB_STYLE_IDS, type SubStyleId } from '@/lib/validation/inputSchemas';
import { TRADITIONS } from '@/lib/ai/traditions';

type Status =
  | { kind: 'idle' }
  | { kind: 'uploading' }
  | { kind: 'analyzing' }
  | { kind: 'error'; message: string };

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

const INDIAN_STYLES = SUB_STYLE_IDS.filter((id) => id.startsWith('INDIAN.'));
const CHINESE_STYLES = SUB_STYLE_IDS.filter((id) => id.startsWith('CHINESE.'));

const fieldLabel =
  'block font-[var(--font-body)] text-sm tracking-[var(--tracking-wide)] uppercase';
const fieldLabelStyle = { color: 'var(--color-ink-muted)' } as const;

const inputClass =
  'mt-[var(--space-2)] block w-full rounded-[var(--radius-md)] border bg-transparent px-[var(--space-4)] py-[var(--space-3)] text-base outline-none transition-colors focus:border-[var(--color-ink)]';
const inputStyle = {
  borderColor: 'var(--color-border)',
  color: 'var(--color-ink)',
} as const;

export function UploadForm() {
  const router = useRouter();
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
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [retentionOptIn, setRetentionOptIn] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
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

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus({ kind: 'error', message: 'Please attach a palm photograph.' });
      return;
    }
    if (!disclaimerAccepted) {
      setStatus({ kind: 'error', message: 'Acknowledge the reflection-not-prophecy disclaimer.' });
      return;
    }

    try {
      setStatus({ kind: 'uploading' });
      const fd = new FormData();
      fd.append('file', file);
      const upload = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!upload.ok) {
        const detail = (await upload.json().catch(() => ({}))) as {
          error?: string;
          detail?: string;
        };
        throw new Error(detail.detail || detail.error || `upload_failed_${upload.status}`);
      }
      const { imageId, blobUrl } = (await upload.json()) as {
        imageId: string;
        blobUrl: string;
      };

      setStatus({ kind: 'analyzing' });
      const analyze = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          imageId,
          blobUrl,
          tradition,
          subStyle,
          clientContext: {
            dominantHand,
            ...(name.trim() ? { name: name.trim() } : {}),
            ...(gender ? { gender } : {}),
            ...(dateOfBirth ? { dateOfBirth } : {}),
          },
          disclaimerAccepted: true,
          retentionOptIn,
          turnstileToken:
            (typeof window !== 'undefined' &&
              (window as unknown as { __turnstileToken?: string }).__turnstileToken) ||
            'dev-bypass',
        }),
      });
      if (!analyze.ok) {
        const detail = (await analyze.json().catch(() => ({}))) as {
          error?: string;
          detail?: string;
        };
        throw new Error(detail.detail || detail.error || `analyze_failed_${analyze.status}`);
      }
      const { redirectTo } = (await analyze.json()) as { redirectTo: string };
      router.push(redirectTo);
    } catch (err) {
      setStatus({ kind: 'error', message: (err as Error).message });
    }
  };

  const isWorking = status.kind === 'uploading' || status.kind === 'analyzing';
  const styles = tradition === 'indian' ? INDIAN_STYLES : CHINESE_STYLES;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-[var(--space-7)]">
      {/* Step 1 — Photo */}
      <Card className="p-[var(--space-6)]">
        <h2 className="text-2xl font-[var(--font-display)]">1. Photograph</h2>
        <p
          className="mt-[var(--space-2)] text-sm leading-[var(--leading-relaxed)]"
          style={{ color: 'var(--color-ink-muted)' }}
        >
          Even daylight. Palm flat. Lines visible. Up to 10 MB · JPEG, PNG, or WebP.
        </p>
        <div className="mt-[var(--space-5)] flex flex-col gap-[var(--space-4)] sm:flex-row sm:items-start">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED.join(',')}
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
                alt="Selected palm photograph preview"
                className="max-h-48 w-auto rounded-[var(--radius-md)] border"
                style={{ borderColor: 'var(--color-border)' }}
              />
              <span className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
                {file?.name} · {((file?.size ?? 0) / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          ) : null}
        </div>
      </Card>

      {/* Step 2 — About you */}
      <Card className="p-[var(--space-6)]">
        <h2 className="text-2xl font-[var(--font-display)]">2. About you</h2>
        <p
          className="mt-[var(--space-2)] text-sm leading-[var(--leading-relaxed)]"
          style={{ color: 'var(--color-ink-muted)' }}
        >
          Only dominant hand is required. Other fields refine the reading.
        </p>

        <div className="mt-[var(--space-5)] grid grid-cols-1 gap-[var(--space-5)] sm:grid-cols-2">
          <label className="block">
            <span className={fieldLabel} style={fieldLabelStyle}>
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
            <span className={fieldLabel} style={fieldLabelStyle}>
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

          <label className="block">
            <span className={fieldLabel} style={fieldLabelStyle}>
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

          <label className="block">
            <span className={fieldLabel} style={fieldLabelStyle}>
              Date of birth <span className="tracking-normal lowercase">(optional, 16+)</span>
            </span>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </label>
        </div>
      </Card>

      {/* Step 3 — Tradition */}
      <Card className="p-[var(--space-6)]">
        <h2 className="text-2xl font-[var(--font-display)]">3. Tradition</h2>
        <p
          className="mt-[var(--space-2)] text-sm leading-[var(--leading-relaxed)]"
          style={{ color: 'var(--color-ink-muted)' }}
        >
          Each tradition cites its own classical sources. Never blended.
        </p>

        <div className="mt-[var(--space-5)] grid grid-cols-1 gap-[var(--space-3)] sm:grid-cols-2">
          {(['indian', 'chinese'] as const).map((t) => {
            const active = tradition === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => onTraditionChange(t)}
                className="flex flex-col items-start gap-[var(--space-1)] rounded-[var(--radius-md)] border p-[var(--space-4)] text-left transition-colors"
                style={{
                  borderColor: active ? 'var(--color-ink)' : 'var(--color-border)',
                  background: active ? 'var(--color-surface-raised)' : 'transparent',
                }}
                aria-pressed={active}
              >
                <span className="text-lg font-[var(--font-display)]">
                  {t === 'indian' ? 'Indian — Hasta Sāmudrika' : 'Chinese — Mian Xiang / Xiāng'}
                </span>
                <span className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
                  {t === 'indian'
                    ? 'Vedic and Jaina-lineage palm science.'
                    : 'Five-elements and classical physiognomy.'}
                </span>
              </button>
            );
          })}
        </div>

        <label className="mt-[var(--space-5)] block">
          <span className={fieldLabel} style={fieldLabelStyle}>
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
          <span
            className="mt-[var(--space-2)] block text-sm leading-[var(--leading-relaxed)]"
            style={{ color: 'var(--color-ink-muted)' }}
          >
            {TRADITIONS[subStyle].scope}
          </span>
        </label>
      </Card>

      {/* Step 4 — Consent */}
      <Card className="p-[var(--space-6)]">
        <h2 className="text-2xl font-[var(--font-display)]">4. Consent</h2>
        <ul
          className="mt-[var(--space-3)] list-disc space-y-[var(--space-2)] pl-[var(--space-5)] text-sm leading-[var(--leading-relaxed)]"
          style={{ color: 'var(--color-ink-muted)' }}
        >
          <li>This reading is reflection, not prophecy.</li>
          <li>It is not medical, legal, or financial advice.</li>
          <li>Your photo is deleted within 24 hours unless you opt to retain.</li>
          <li>We never train models on your image.</li>
        </ul>

        <label className="mt-[var(--space-5)] flex items-start gap-[var(--space-3)]">
          <input
            type="checkbox"
            checked={disclaimerAccepted}
            onChange={(e) => setDisclaimerAccepted(e.target.checked)}
            className="mt-1 h-4 w-4"
          />
          <span className="text-sm leading-[var(--leading-relaxed)]">
            I understand this reading is reflective and not professional advice.
          </span>
        </label>

        <label className="mt-[var(--space-3)] flex items-start gap-[var(--space-3)]">
          <input
            type="checkbox"
            checked={retentionOptIn}
            onChange={(e) => setRetentionOptIn(e.target.checked)}
            className="mt-1 h-4 w-4"
          />
          <span className="text-sm leading-[var(--leading-relaxed)]">
            Keep my photo on file so I can revisit this reading. (Optional. You can delete any
            time.)
          </span>
        </label>
      </Card>

      <div className="flex flex-col items-start gap-[var(--space-4)]">
        <Button type="submit" size="lg" disabled={isWorking}>
          {status.kind === 'uploading'
            ? 'Uploading…'
            : status.kind === 'analyzing'
              ? 'Reading your palm…'
              : 'Begin reading'}
        </Button>

        {status.kind === 'analyzing' ? (
          <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
            This typically takes 12–30 seconds. Please don&rsquo;t close the tab.
          </p>
        ) : null}
        {status.kind === 'error' ? (
          <p role="alert" className="text-sm" style={{ color: 'var(--color-accent-deep)' }}>
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
