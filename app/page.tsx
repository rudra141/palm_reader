import { Hero } from '@/components/sections/Hero';
import { TraditionsSection } from '@/components/sections/TraditionsSection';
import { AskTeaser } from '@/components/sections/AskTeaser';

// Minimalist home page:
//   1. Hero (cinematic intro + primary CTA)
//   2. Two glowing tradition pillars (long-form reading flow → /upload)
//   3. Ask teaser (direct-chat alternative → /ask)
// WhatWeRead + HowItWorks are deliberately excluded; they belong on a future
// /methodology page where long-form prose earns its place.
export default function HomePage() {
  return (
    <main>
      <Hero />
      <TraditionsSection />
      <AskTeaser />
    </main>
  );
}
