"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { heroTranslations as t } from "@/lib/i18n/hero";

export function HeroSection() {
  const { lang } = useLang();

  useEffect(() => {
    const items = document.querySelectorAll('.hero-nav-item');
    items.forEach((item, i) => {
      setTimeout(() => {
        item.classList.add('hero-nav-item--visible');
      }, i * 150);
    });
  }, []);

  return (
    <section id="hero" className="hero-split">
      {/* Left Panel - Info */}
      <div className="hero-split-left">
        <div className="hero-split-content">
          <div className="hero-eyebrow">
            CHRISTIAN · THINKER · SERVANT<br/>
            ROOTED IN THE WORD
          </div>
          
          <h1 className="hero-title">
            Samuel<br/>
            <span className="hero-title-accent">Gyasi</span>
          </h1>
          
          <p className="hero-subtitle">
            Rooted in the Word,<br/>
            Walking by Faith,<br/>
            Living for His Glory.
          </p>
          
          <div className="hero-actions">
            <Link href="/faith" className="hero-btn hero-btn-primary">
              EXPLORE FAITH
            </Link>
            <Link href="/blog" className="hero-btn hero-btn-secondary">
              READ JOURNAL
            </Link>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Image & Navigation */}
      <div className="hero-split-right">
        <div className="hero-image-container">
          <img 
            src="/photo-hero.png" 
            alt="Samuel Kobina Gyasi" 
            className="hero-main-image"
          />
          
          <div className="hero-image-caption">
            BUILDING MY FAITH · NOT BY SIGHT
          </div>
        </div>
        
        <nav className="hero-nav">
          <Link href="/faith" className="hero-nav-item">
            <span className="hero-nav-number">01</span>
            <span className="hero-nav-text">Faith & Beliefs</span>
          </Link>
          <Link href="/blog" className="hero-nav-item">
            <span className="hero-nav-number">02</span>
            <span className="hero-nav-text">Faith Journal</span>
          </Link>
          <Link href="/my-story" className="hero-nav-item">
            <span className="hero-nav-number">03</span>
            <span className="hero-nav-text">My Story</span>
          </Link>
        </nav>
        
        {/* Kingdom Values */}
        <div className="hero-values-vertical">
          <span className="hero-value-label">Kingdom Influence</span>
          <span className="hero-value-label">Power</span>
          <span className="hero-value-label">Wisdom</span>
          <span className="hero-value-label">Pragmatism</span>
        </div>
      </div>
    </section>
  );
}
