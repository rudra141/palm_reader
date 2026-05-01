// Debug page — visualize MediaPipe HandLandmarker output + derived anchors
// over a chosen image. Env-gated so it never ships to production.
//
// Usage in dev:  NEXT_PUBLIC_ENABLE_DEBUG=1 pnpm dev
// Then visit:    http://localhost:3000/debug/landmarks?img=<encoded-blob-url>
//
// Without ?img=, falls back to a hardcoded sample palm photo committed under
// /public/debug-samples/ (add one yourself or paste any reachable URL).

import { notFound } from 'next/navigation';
import { LandmarksDebugClient } from './LandmarksDebugClient';

interface PageProps {
  searchParams: Promise<{ img?: string }>;
}

const FALLBACK_IMG = '/debug-samples/palm.jpg';

export default async function LandmarksDebugPage({ searchParams }: PageProps) {
  if (process.env.NEXT_PUBLIC_ENABLE_DEBUG !== '1') notFound();

  const params = await searchParams;
  const imageUrl = params.img ?? FALLBACK_IMG;

  return (
    <main className="min-h-screen bg-[var(--color-surface)] py-[var(--space-9)]">
      <div className="mx-auto w-full max-w-[56rem] px-[var(--space-6)]">
        <h1 className="text-3xl font-[var(--font-display)]" style={{ color: 'var(--color-ink)' }}>
          Hand landmarks debug
        </h1>
        <p className="mt-[var(--space-3)] text-sm" style={{ color: 'var(--color-ink-muted)' }}>
          Image:&nbsp;<code>{imageUrl}</code>
        </p>
        <p className="mt-[var(--space-1)] text-sm" style={{ color: 'var(--color-ink-muted)' }}>
          Pass <code>?img=&lt;url&gt;</code> to visualize a different photo.
        </p>

        <div className="mt-[var(--space-6)]">
          <LandmarksDebugClient imageUrl={imageUrl} />
        </div>
      </div>
    </main>
  );
}
