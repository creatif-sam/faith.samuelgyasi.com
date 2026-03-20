"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { heroTranslations as t } from "@/lib/i18n/hero";

export function HeroSection() {
  const { lang } = useLang();

  const heroPillars = [
    { labelKey: "faith"   as const, href: "/faith", description: "Explore the values, beliefs, and principles that guide my journey and purpose." },
    { labelKey: "journal" as const, href: "/blog", description: "Leading pioneering studies that push the boundaries of innovation and knowledge." },
    { labelKey: "story"   as const, href: "/my-story", description: "Bridging research to drive innovation and real-world progress." },
  ];

  useEffect(() => {
    const cards = document.querySelectorAll('.hero-card-modern');
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add('hero-card-visible');
      }, i * 150);
    });
  }, []);

  return (
    <section id="hero" className="hero-modern">
      <div className="hero-modern-container">
        {/* Left side - Large heading */}
        <div className="hero-modern-left">
          <h1 className="hero-modern-heading">
            <span className="hero-modern-heading-line">Driven by</span>
            <span className="hero-modern-heading-emphasis">Purpose</span>
          </h1>
          <p className="hero-modern-tagline">
            {t.tagline[lang]}
          </p>
        </div>

        {/* Right side - Cards */}
        <div className="hero-modern-right">
          {heroPillars.map((pillar, idx) => (
            <Link 
              key={pillar.href} 
              href={pillar.href} 
              className="hero-card-modern"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="hero-card-label">{t.pillars[pillar.labelKey][lang].toUpperCase()}</div>
              <h3 className="hero-card-title">{t.pillars[pillar.labelKey][lang]}</h3>
              <p className="hero-card-description">{pillar.description}</p>
              <div className="hero-card-button">
                <span>Learn More</span>
                <ArrowRight className="hero-card-arrow" size={20} strokeWidth={2} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
