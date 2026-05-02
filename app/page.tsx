import { Hero } from '@/components/sections/Hero';
import { TraditionsSection } from '@/components/sections/TraditionsSection';
import { WhatWeRead } from '@/components/sections/WhatWeRead';
import { HowItWorks } from '@/components/sections/HowItWorks';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TraditionsSection />
      <WhatWeRead />
      <HowItWorks />
    </main>
  );
}
