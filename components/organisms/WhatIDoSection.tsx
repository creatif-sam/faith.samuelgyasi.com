"use client";

import { SectionLabel } from "@/components/atoms/SectionLabel";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { useLang } from "@/lib/i18n";
import { whatidoTranslations as t } from "@/lib/i18n/whatido";

export function WhatIDoSection() {
  const { lang } = useLang();

  return (
    <section id="what-i-do" className="portfolio-section what-i-do-section">
      <div className="section-inner">
        <SectionLabel>{t.label[lang]}</SectionLabel>

        <ScrollReveal className="wid-header">
          <h2 className="wid-title">{t.title.line1[lang]}<br /><em>{t.title.line2[lang]}</em></h2>
          <p className="wid-sub">
            {t.subtitle[lang]}
          </p>
        </ScrollReveal>

        <div className="wid-grid">
          {t.roles.map((role, i) => (
            <ScrollReveal key={role.num} delay={`${i * 0.1}s`}>
              <div className="wid-card">
                <div className="wid-card-num">{role.num}</div>
                <h3 className="wid-card-title">{role.title[lang]}</h3>
                <div className="wid-card-org">{role.org[lang]}</div>
                <p className="wid-card-body">{role.description[lang]}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
