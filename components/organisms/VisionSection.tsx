"use client";

import { SectionLabel } from "@/components/atoms/SectionLabel";
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

          {/* Transformation Journey */}
          <div className="vision-transformation">
            <h3 className="transformation-title">{t.transformation.title[lang]}</h3>
            <div className="transformation-stages">
              {t.transformation.stages.map((stage: any, index: number) => (
                <div key={index} className="transformation-stage" style={{ "--stage-index": index } as React.CSSProperties}>
                  <span className="stage-from">{stage.from[lang]}</span>
                  <svg className="stage-arrow" width="40" height="16" viewBox="0 0 40 16" fill="none">
                    <path d="M0 8H38M38 8L30 1M38 8L30 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="stage-to">{stage.to[lang]}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
