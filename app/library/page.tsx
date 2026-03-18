"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/organisms/SiteFooter";

const css = `
.lib-pg {
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  position: relative;
}
.lib-pg::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('/mystorybackground.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  opacity: 0.04;
  pointer-events: none;
  z-index: 0;
}
.lib-pg > * { position: relative; z-index: 1; }

/* ── HERO ── */
.lib-hero {
  padding: 140px 8% 72px;
  border-bottom: 1px solid rgba(201,168,76,.12);
  max-width: 1100px;
  margin: 0 auto;
}
.lib-eyebrow {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  opacity: 0;
  animation: lib-rise .9s .1s ease forwards;
}
.lib-headline {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(48px, 7.5vw, 100px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.03em;
  color: var(--white);
  text-transform: uppercase;
  margin-bottom: 28px;
  opacity: 0;
  animation: lib-rise .9s .25s ease forwards;
}
.lib-headline em {
  font-style: italic;
  font-weight: 400;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
}
.lib-rule {
  width: 56px; height: 2px;
  background: linear-gradient(90deg, #ffde59, #ff914d);
  margin: 24px 0;
  opacity: 0;
  animation: lib-rise .9s .4s ease forwards;
}
.lib-sub {
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-size: clamp(16px, 1.8vw, 20px);
  font-style: italic;
  color: rgba(245,243,239,.62);
  max-width: 540px;
  line-height: 1.7;
  opacity: 0;
  animation: lib-rise .9s .5s ease forwards;
}
@keyframes lib-rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}

/* ── SECTION CARDS ── */
.lib-sections {
  max-width: 1100px;
  margin: 0 auto;
  padding: 64px 8% 100px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
}
.lib-section-card {
  background: rgba(14,13,11,.9);
  border: 1px solid rgba(201,168,76,.08);
  padding: 56px 48px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: border-color .3s, background .3s;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity .7s ease, transform .7s ease, border-color .3s, background .3s;
}
.lib-section-card.lib-visible { opacity: 1; transform: none; }
.lib-section-card:hover { border-color: rgba(201,168,76,.25); background: rgba(20,18,14,.95); }
.lib-card-icon {
  font-size: 32px;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
.lib-card-num {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.lib-card-title {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(26px, 3vw, 40px);
  font-weight: 700;
  color: var(--white);
  line-height: 1.1;
}
.lib-card-body {
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-size: 17px;
  font-style: italic;
  color: rgba(245,243,239,.6);
  line-height: 1.75;
}
.lib-card-cta {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(201,168,76,.12);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ── QUOTE STRIP ── */
.lib-quote-strip {
  background: rgba(201,168,76,.04);
  border-top: 1px solid rgba(201,168,76,.1);
  border-bottom: 1px solid rgba(201,168,76,.1);
  padding: 56px 8%;
  text-align: center;
}
.lib-quote-strip blockquote {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(20px, 2.5vw, 30px);
  font-style: italic;
  color: var(--white);
  line-height: 1.4;
  max-width: 700px;
  margin: 0 auto 20px;
}
.lib-quote-strip cite {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-style: normal;
  display: block;
}

@media (max-width: 768px) {
  .lib-hero { padding: 130px 6% 56px; }
  .lib-sections { grid-template-columns: 1fr; padding: 48px 6% 72px; }
}
`;

export default function LibraryPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("lib-visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".lib-section-card").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="lib-pg">
        <style>{css}</style>

        {/* ── HERO ── */}
        <div className="lib-hero">
          <p className="lib-eyebrow">Samuel Kobina Gyasi · Reading Life</p>
          <h1 className="lib-headline">
            The<br /><em>Library</em>
          </h1>
          <div className="lib-rule" />
          <p className="lib-sub">
            Books have been the companions of my formation — the voices of thinkers, believers,
            and leaders who shaped how I see the world. Here I share what I have written and what I have learned.
          </p>
        </div>

        {/* ── SECTIONS ── */}
        <div className="lib-sections">
          <Link href="/library/ebooks" className="lib-section-card" style={{ transitionDelay: "0s" }}>
            <div className="lib-card-num">01</div>
            <h2 className="lib-card-title">eBooks</h2>
            <p className="lib-card-body">
              Writing is how I think out loud. This section gathers the essays, reflections, and short books
              I have written — on faith, leadership, collective intelligence, and the examined life.
            </p>
            <span className="lib-card-cta">Browse eBooks →</span>
          </Link>

          <Link href="/library/reviews" className="lib-section-card" style={{ transitionDelay: "0.08s" }}>
            <div className="lib-card-num">02</div>
            <h2 className="lib-card-title">Book Reviews</h2>
            <p className="lib-card-body">
              Every significant book I have read has left a mark. Here I share honest reflections on the books
              that have challenged, shaped, and deepened my thinking across theology, leadership, and human flourishing.
            </p>
            <span className="lib-card-cta">Browse Reviews →</span>
          </Link>
        </div>

        {/* ── QUOTE ── */}
        <div className="lib-quote-strip">
          <blockquote>
            &ldquo;Not all readers are leaders, but all leaders are readers.&rdquo;
          </blockquote>
          <cite>— Harry S. Truman</cite>
        </div>
      </div>
      <Suspense fallback={null}><SiteFooter /></Suspense>
    </>
  );
}
