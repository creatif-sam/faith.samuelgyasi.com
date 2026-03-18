import { SectionLabel } from "@/components/atoms/SectionLabel";
import { VerseStrip } from "@/components/molecules/VerseStrip";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";

export function VisionSection() {
  return (
    <section id="vision" className="portfolio-section vision-section">
      <div className="vision-bg-text" aria-hidden="true">FAITHFUL</div>
      <div className="section-inner">
        <SectionLabel dark>Vision &amp; Calling</SectionLabel>

        <ScrollReveal className="vision-inner">
          <p className="vision-statement">
            To live a life fully surrendered —<br />
            <strong>rooted in the Word,</strong><br />
            sustained by prayer, and<br />
            <strong>walking in the purpose</strong><br />
            God has written for me.
          </p>
          <VerseStrip />
        </ScrollReveal>
      </div>
    </section>
  );
}
