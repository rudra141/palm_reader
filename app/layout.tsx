import type { Metadata, Viewport } from 'next';
import './globals.css';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
