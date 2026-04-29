'use client';

import dynamic from 'next/dynamic';

/**
 * Client island that owns the dynamic import of Story (ssr: false is only
 * permitted from a client component in Next 15+).
 */
const Story = dynamic(() => import('./Story').then((m) => m.Story), {
  ssr: false,
  loading: () => (
    // Reserve the same vertical space the Story will occupy so there's no CLS.
    <div aria-hidden style={{ height: '300vh' }} className="bg-[var(--color-bg)]" />
  ),
});

export function StoryLoader() {
  return <Story />;
}
