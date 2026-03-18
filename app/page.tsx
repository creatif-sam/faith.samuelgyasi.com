import { Navbar } from "@/components/organisms/Navbar";
import { HeroSection } from "@/components/organisms/HeroSection";
import { PillarsSection } from "@/components/organisms/PillarsSection";
import { ValuesSection } from "@/components/organisms/ValuesSection";
import { VisionSection } from "@/components/organisms/VisionSection";
import { WhatIDoSection } from "@/components/organisms/WhatIDoSection";
import { AboutSection } from "@/components/organisms/AboutSection";
import { TestimonialsSection } from "@/components/organisms/TestimonialsSection";
import { ConnectSection } from "@/components/organisms/ConnectSection";
import { SiteFooter } from "@/components/organisms/SiteFooter";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <PillarsSection />
      <ValuesSection />
      <VisionSection />
      <WhatIDoSection />
      <AboutSection />
      <TestimonialsSection />
      <ConnectSection />
      <SiteFooter />
    </>
  );
}

