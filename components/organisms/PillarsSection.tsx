"use client";

import { SectionLabel } from "@/components/atoms/SectionLabel";
import { PillarCard } from "@/components/molecules/PillarCard";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { useLang } from "@/lib/i18n";
import { pillarsTranslations as t } from "@/lib/i18n/pillars";

export function PillarsSection() {
  const { lang } = useLang();

  return (
    <section id="pillars" className="portfolio-section pillars-section">
      <div className="section-inner">
        <SectionLabel>{t.label[lang]}</SectionLabel>

        <ScrollReveal className="pillars-header">
          <h2 className="pillars-title">{t.title[lang]}</h2>
          <p className="pillars-sub">
            {t.subtitle[lang]}
          </p>
        </ScrollReveal>

        <div className="pillars-grid">
          {t.pillars.map((pillar, index) => (
            <ScrollReveal key={index}>
              <PillarCard
                icon={pillar.icon}
                name={pillar.name[lang]}
                href={pillar.href}
                description={pillar.description[lang]}
                verse={pillar.verse[lang]}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
