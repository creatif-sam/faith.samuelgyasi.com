"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { heroTranslations as t } from "@/lib/i18n/hero";

export function HeroSection() {
  const { lang } = useLang();

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
            <span className="label-text">BUILDING MY FAITH · NOT BY SIGHT</span>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="hero-content-wrapper">
          <div className="hero-content">
            <div className="hero-eyebrow">
              CHRISTIAN · THINKER · SERVANT
            </div>
            
            <h1 className="hero-title">
              Samuel Kobina
              <span className="hero-title-accent">Gyasi</span>
            </h1>
            
            <p className="hero-description">
              Rooted in the Word. Walking by Faith. Living for His Glory.
            </p>
            
            <div className="hero-values-list">
              <span className="value-badge">Kingdom Influence</span>
              <span className="value-badge">Power</span>
              <span className="value-badge">Wisdom</span>
              <span className="value-badge">Pragmatism</span>
            </div>
            
            <div className="hero-actions">
              <Link href="/faith" className="hero-btn hero-btn-primary">
                Explore Faith
              </Link>
              <Link href="/blog" className="hero-btn hero-btn-secondary">
                Read Journal
              </Link>
            </div>
          </div>
          
          {/* Quick Links */}
          <nav className="hero-quick-nav">
            <Link href="/faith" className="quick-nav-item">
              <span className="qn-number">01</span>
              <span className="qn-label">Faith & Beliefs</span>
            </Link>
            <Link href="/blog" className="quick-nav-item">
              <span className="qn-number">02</span>
              <span className="qn-label">Faith Journal</span>
            </Link>
            <Link href="/my-story" className="quick-nav-item">
              <span className="qn-number">03</span>
              <span className="qn-label">My Story</span>
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
