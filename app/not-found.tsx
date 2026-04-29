import Link from 'next/link';

export default function NotFound() {
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
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-3xl)',
          color: 'var(--color-ink)',
          letterSpacing: 'var(--tracking-tight)',
        }}
      >
        This page isn't here.
      </h1>
      <p
        style={{
          marginTop: 'var(--space-4)',
          color: 'var(--color-ink-muted)',
          maxWidth: '40ch',
        }}
      >
        It may have moved, or never existed.
      </p>
      <Link
        href="/"
        style={{
          marginTop: 'var(--space-6)',
          color: 'var(--color-accent)',
          textDecoration: 'underline',
        }}
      >
        Take me home →
      </Link>
    </main>
  );
}
