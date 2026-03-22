"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { heroTranslations as t } from "@/lib/i18n/hero";
import { PrayerModal } from "./PrayerModal";

export function HeroSection() {
  const { lang } = useLang();
  const [showPrayerModal, setShowPrayerModal] = useState(false);

  useEffect(() => {
    const heroContent = document.querySelector('.hero-content-wrapper');
    if (heroContent) {
      setTimeout(() => heroContent.classList.add('hero-visible'), 100);
    }
  }, []);

  return (
    <section id="hero" className="hero-clean">
      <div className="hero-container">
        {/* Image Section */}
        <div className="hero-image-section">
          <div className="hero-image-frame">
            <img 
              src="/photo-hero.png" 
              alt="Samuel Kobina Gyasi" 
              className="hero-image"
            />
          </div>
          <div className="hero-image-label">
            <span className="label-line"></span>
            <span className="label-text">{t.imageLabel[lang]}</span>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="hero-content-wrapper">
          <div className="hero-content">
            <div className="hero-eyebrow">
              {t.eyebrow[lang]}
            </div>
            
            <h1 className="hero-title">
              {t.firstName[lang]}
              <span className="hero-title-accent">{t.lastName[lang]}</span>
            </h1>
            
            <p className="hero-description">
              {t.description[lang]}
            </p>
            
            <div className="hero-values-list">
              <span className="value-badge">{t.values.influence[lang]}</span>
              <span className="value-badge">{t.values.power[lang]}</span>
              <span className="value-badge">{t.values.wisdom[lang]}</span>
              <span className="value-badge">{t.values.pragmatism[lang]}</span>
            </div>
            
            <div className="hero-actions">
              <Link href="/faith" className="hero-btn hero-btn-primary">
                {t.ctaFaith[lang]}
              </Link>
              <Link href="/blog" className="hero-btn hero-btn-secondary">
                {t.ctaJournal[lang]}
              </Link>
              <button 
                onClick={() => setShowPrayerModal(true)}
                className="hero-btn hero-btn-tertiary"
              >
                {lang === "en" ? "Submit a Prayer" : "Soumettre une Prière"}
              </button>
            </div>
          </div>
          
          {/* Quick Links */}
          <nav className="hero-quick-nav">
            <Link href="/faith" className="quick-nav-item">
              <span className="qn-number">{t.quickNav.faith.number[lang]}</span>
              <span className="qn-label">{t.quickNav.faith.label[lang]}</span>
            </Link>
            <Link href="/blog" className="quick-nav-item">
              <span className="qn-number">{t.quickNav.journal.number[lang]}</span>
              <span className="qn-label">{t.quickNav.journal.label[lang]}</span>
            </Link>
            <Link href="/my-story" className="quick-nav-item">
              <span className="qn-number">{t.quickNav.story.number[lang]}</span>
              <span className="qn-label">{t.quickNav.story.label[lang]}</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Prayer Modal */}
      {showPrayerModal && (
        <PrayerModal 
          onClose={() => setShowPrayerModal(false)}
          lang={lang}
        />
      )}
    </section>
  );
}
