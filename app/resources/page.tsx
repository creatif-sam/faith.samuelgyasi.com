"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { useLang } from "@/lib/i18n";

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
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: clamp(16px, 1.8vw, 20px);
  font-weight: 300;
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
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 300;
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

export default function ResourcesPage() {
  const { lang } = useLang();

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
          <p className="lib-eyebrow">
            {lang === "en" ? "Samuel Kobina Gyasi · Reading Life" : "Samuel Kobina Gyasi · Vie de Lecteur"}
          </p>
          <h1 className="lib-headline">
            {lang === "en" ? <>The<br /><em>Resources</em></> : <>Les<br /><em>Ressources</em></>}
          </h1>
          <div className="lib-rule" />
          <p className="lib-sub">
            {lang === "en"
              ? "Books have been the companions of my formation — the voices of thinkers, believers, and leaders who shaped how I see the world. Here I share what I have written and what I have learned."
              : "Les livres ont been les compagnons de ma formation — les voix de penseurs, de croyants et de leaders qui ont façonné ma vision du monde. Ici je partage ce que j'ai écrit et ce que j'ai appris."}
          </p>
        </div>

        {/* ── SECTIONS ── */}
        <div className="lib-sections">
          <Link href="/resources/ebooks" className="lib-section-card" style={{ transitionDelay: "0s" }}>
            <div className="lib-card-num">01</div>
            <h2 className="lib-card-title">{lang === "en" ? "eBooks" : "Livres Numériques"}</h2>
            <p className="lib-card-body">
              {lang === "en"
                ? "Writing is how I think out loud. This section gathers the essays, reflections, and short books I have written — on faith, leadership, collective intelligence, and the examined life."
                : "L'écriture est ma façon de penser à voix haute. Cette section rassemble les essais, réflexions et courts livres que j'ai écrits — sur la foi, le leadership, l'intelligence collective et la vie examinée."}
            </p>
            <span className="lib-card-cta">{lang === "en" ? "Browse eBooks →" : "Parcourir les Livres →"}</span>
          </Link>

          <Link href="/resources/reviews" className="lib-section-card" style={{ transitionDelay: "0.08s" }}>
            <div className="lib-card-num">02</div>
            <h2 className="lib-card-title">{lang === "en" ? "Book Reviews" : "Critiques de Livres"}</h2>
            <p className="lib-card-body">
              {lang === "en"
                ? "Every significant book I have read has left a mark. Here I share honest reflections on the books that have challenged, shaped, and deepened my thinking across theology, leadership, and human flourishing."
                : "Chaque livre significatif que j'ai lu a laissé une empreinte. Ici je partage des réflexions honnêtes sur les livres qui ont remis en question, façonné et approfondi ma pensée en théologie, leadership et épanouissement humain."}
            </p>
            <span className="lib-card-cta">{lang === "en" ? "Browse Reviews →" : "Parcourir les Critiques →"}</span>
          </Link>
        </div>

        {/* ── QUOTE ── */}
        <div className="lib-quote-strip">
          <blockquote>
            &ldquo;{lang === "en" ? "Not all readers are leaders, but all leaders are readers." : "Tous les lecteurs ne sont pas des leaders, mais tous les leaders sont des lecteurs."}&rdquo;
          </blockquote>
          <cite>— Harry S. Truman</cite>
        </div>
      </div>
      <Suspense fallback={null}><SiteFooter /></Suspense>
    </>
  );
}
