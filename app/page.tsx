import { HeroSection } from "@/components/organisms/HeroSection";
import { PillarsSection } from "@/components/organisms/PillarsSection";
import { ValuesSection } from "@/components/organisms/ValuesSection";
import { VisionSection } from "@/components/organisms/VisionSection";
import { WhatIDoSection } from "@/components/organisms/WhatIDoSection";
import { LatestBlogsSection } from "@/components/organisms/LatestBlogsSection";
import { TestimonialsSection } from "@/components/organisms/TestimonialsSection";
import { ConnectSection } from "@/components/organisms/ConnectSection";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { HeroModern } from "@/components/hero";

export default function Home() {
  return (
    <>
      <HeroModern />
      <PillarsSection />
      <ValuesSection />
      <VisionSection />
      <WhatIDoSection />
      <LatestBlogsSection />
      <TestimonialsSection />
      <ConnectSection />
      <SiteFooter />
    </>
  );
}

