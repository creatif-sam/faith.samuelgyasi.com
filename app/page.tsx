import { Navbar }         from "@/components/organisms/Navbar";
import { HeroSection }    from "@/components/organisms/HeroSection";
import { AboutSection }   from "@/components/organisms/AboutSection";
import { PillarsSection } from "@/components/organisms/PillarsSection";
import { VisionSection }  from "@/components/organisms/VisionSection";
import { ConnectSection } from "@/components/organisms/ConnectSection";
import { SiteFooter }     from "@/components/organisms/SiteFooter";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PillarsSection />
      <VisionSection />
      <ConnectSection />
      <SiteFooter />
    </>
  );
}


