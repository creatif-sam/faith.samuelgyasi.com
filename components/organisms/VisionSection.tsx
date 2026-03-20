"use client";

import { SectionLabel } from "@/components/atoms/SectionLabel";
import { VerseStrip } from "@/components/molecules/VerseStrip";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { useLang } from "@/lib/i18n";
import { visionTranslations as t } from "@/lib/i18n/vision";

export function VisionSection() {
  const { lang } = useLang();

  return (
    <section id="vision" className="portfolio-section vision-section">
      <div className="vision-bg-text" aria-hidden="true">{t.bgText[lang]}</div>
      <div className="section-inner">
        <SectionLabel dark>{t.label[lang]}</SectionLabel>

        <ScrollReveal className="vision-inner">
          <p className="vision-statement">
            {t.statement.line1[lang]}<br />
            <strong>{t.statement.line2[lang]}</strong><br />
            {t.statement.line3[lang]}<br />
            <strong>{t.statement.line4[lang]}</strong><br />
            {t.statement.line5[lang]}
          </p>
          <VerseStrip />
        </ScrollReveal>
      </div>
    </section>
  );
}
