import { SectionLabel } from "@/components/atoms/SectionLabel";
import { VerseStrip } from "@/components/molecules/VerseStrip";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";

export function VisionSection() {
  return (
    <section id="vision" className="portfolio-section vision-section">
      <div className="vision-bg-text" aria-hidden="true">TRANSFORM</div>
      <div className="section-inner">
        <SectionLabel dark>Vision &amp; Mission</SectionLabel>

        <ScrollReveal className="vision-inner">
          <p className="vision-statement">
            To build a world where people are<br />
            <strong>spiritually grounded,</strong><br />
            intellectually alive, and<br />
            <strong>transformed to lead</strong><br />
            with grace and purpose.
          </p>
          <VerseStrip />
        </ScrollReveal>
      </div>
    </section>
  );
}
