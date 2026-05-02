import { Hero } from '@/components/sections/Hero';
import { TraditionsSection } from '@/components/sections/TraditionsSection';

// Minimalist home page: hero → two glowing tradition pillars → done.
// WhatWeRead + HowItWorks are kept in components/sections/ for a future
// /methodology page; deliberately excluded here so the marketing surface
// reads like the brand it represents (Aesop / Hermès restraint).
export default function HomePage() {
  return (
    <main>
      <Hero />
      <TraditionsSection />
    </main>
  );
}
