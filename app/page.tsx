// Landing — placeholder. Real implementation lands in Phase 3 (CP2).
// The cinematic 3D scroll story, the upload CTA, and the conversion beats are
// all built from /docs/scroll-story.md when reference frames arrive at CP2.

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-7)',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          letterSpacing: 'var(--tracking-extra-wide)',
          textTransform: 'uppercase',
          color: 'var(--color-ink-faint)',
          marginBottom: 'var(--space-5)',
        }}
      >
        Praxa
      </p>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-4xl)',
          letterSpacing: 'var(--tracking-tight)',
          lineHeight: 'var(--leading-tight)',
          color: 'var(--color-ink)',
          maxWidth: '40ch',
        }}
      >
        A reading from the original texts.
      </h1>
      <p
        style={{
          marginTop: 'var(--space-5)',
          fontSize: 'var(--text-md)',
          color: 'var(--color-ink-muted)',
          maxWidth: '50ch',
          lineHeight: 'var(--leading-relaxed)',
        }}
      >
        Indian and Chinese palmistry, read by an AI grounded in the classical sources — not the
        pop-culture residue. Scaffolding in progress.
      </p>
    </main>
  );
}
