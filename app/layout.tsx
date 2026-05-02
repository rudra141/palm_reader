import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { SiteHeader } from '@/components/sections/SiteHeader';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display-loaded',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body-loaded',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Praxa — palm readings from the original texts',
    template: '%s · Praxa',
  },
  description:
    'A premium AI palm reading rooted in authentic Indian (Sāmudrika Śāstra) and Chinese (Mian Xiang) classical sources. One practitioner. Two traditions. No theatre.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    title: 'Praxa',
    description: 'Palm readings from the original texts.',
    siteName: 'Praxa',
    images: [{ url: '/scroll-story/story-poster.jpg', width: 1280, height: 720 }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f4' },
    { media: '(prefers-color-scheme: dark)', color: '#12100e' },
  ],
  width: 'device-width',
  initialScale: 1,
};

// Brand-tuned Clerk appearance. Pulls from our locked design tokens so the
// hosted sign-in / sign-up flow matches Aesop/Hermès restraint instead of
// Clerk's default purple. Light theme by default; dark surfaces honored
// where present.
const clerkAppearance = {
  variables: {
    colorPrimary: '#a77c36',
    colorBackground: '#faf8f4',
    colorInputBackground: '#fcfaf6',
    colorInputText: '#1c1816',
    colorText: '#1c1816',
    colorTextSecondary: '#4e4640',
    fontFamily: 'var(--font-body-loaded), system-ui, sans-serif',
    fontFamilyButtons: 'var(--font-body-loaded), system-ui, sans-serif',
    borderRadius: '0.5rem',
  },
  elements: {
    formButtonPrimary:
      'bg-[var(--color-ink)] hover:bg-[var(--color-accent-deep)] text-[var(--color-ink-on-accent)] tracking-[var(--tracking-wide)]',
    card: 'shadow-none border border-[var(--color-border)] bg-[var(--color-surface-raised)]',
    headerTitle: 'font-[var(--font-display)]',
    socialButtonsBlockButton: 'border border-[var(--color-border)]',
  },
};

// Detect a real Clerk key so the build doesn't fail when only the
// `.env.example` placeholder is present. Pattern: real Clerk publishable
// keys start with `pk_test_` or `pk_live_` and are >= 40 chars; the
// placeholder is `pk_test_xxxxxxxxxxxxxxxx`.
function clerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return false;
  if (/^pk_(test|live)_x+$/i.test(key)) return false;
  return key.length > 30;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tree = (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );

  return clerkConfigured() ? (
    <ClerkProvider appearance={clerkAppearance}>{tree}</ClerkProvider>
  ) : (
    tree
  );
}
