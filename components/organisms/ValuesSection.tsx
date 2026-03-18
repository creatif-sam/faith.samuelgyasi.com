"use client";

import { useEffect, useRef } from "react";

const values = [
  {
    letter: "F",
    word: "Faith",
    number: "01",
    body:
      "Not a feeling but a decision — to trust God with every chapter of life. Faith is the foundation on which Samuel stands: confident in what is not yet seen, anchored in what God has already promised.",
    glyph: "◆",
  },
  {
    letter: "G",
    word: "Grace",
    number: "02",
    body:
      "Everything good in Samuel's life is unearned gift. He receives grace daily and strives to extend it generously — in forgiveness, in patience, in the refusal to reduce any person to their worst moment.",
    glyph: "✦",
  },
  {
    letter: "W",
    word: "The Word",
    number: "03",
    body:
      "Scripture is not a rule book — it is a living encounter with God. Samuel reads, meditates on, and lives by the Bible, believing that the Word of God is the surest light in every kind of darkness.",
    glyph: "◎",
  },
];

export function ValuesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vs-card--visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    cardsRef.current.forEach((card) => { if (card) obs.observe(card); });
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="values" className="values-section">
      <style>{`
        /* ── VALUES SECTION ── */
        .values-section {
          position: relative;
          padding: 120px 50px;
          background: var(--black);
          overflow: hidden;
        }

        /* Decorative grid lines */
        .values-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,.04) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
        }

        /* Ambient orb */
        .values-section::after {
          content: '';
          position: absolute;
          top: -120px; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(201,168,76,.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .values-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
        }

        .values-header {
          text-align: center;
          margin-bottom: 80px;
          opacity: 0;
          transform: translateY(30px);
          animation: vs-rise 0.8s 0.1s ease forwards;
        }

        .values-eyebrow {
          font-family: var(--font-space-mono), 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }

        .values-eyebrow::before,
        .values-eyebrow::after {
          content: '';
          width: 40px; height: 1px;
          background: var(--gold);
          opacity: 0.4;
        }

        .values-title {
          font-family: var(--font-playfair), 'Playfair Display', serif;
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 700;
          color: var(--white);
          line-height: 1.05;
        }

        .values-title em {
          font-style: italic;
          color: var(--gold);
        }

        .values-sub {
          margin-top: 18px;
          font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
          font-size: clamp(16px, 1.8vw, 20px);
          color: var(--gray-mid);
          font-style: italic;
        }

        /* ── Cards grid ── */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }

        .vs-card {
          position: relative;
          padding: 56px 40px 48px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(201,168,76,0.1);
          overflow: hidden;
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.7s ease, transform 0.7s ease,
                      background 0.4s, border-color 0.4s;
          cursor: default;
        }

        /* staggered entrance */
        .vs-card:nth-child(1) { transition-delay: 0.15s; }
        .vs-card:nth-child(2) { transition-delay: 0.3s; }
        .vs-card:nth-child(3) { transition-delay: 0.45s; }

        .vs-card--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .vs-card:hover {
          background: rgba(201,168,76,0.05);
          border-color: rgba(201,168,76,0.35);
        }

        /* animated corner accent on hover */
        .vs-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 0; height: 2px;
          background: var(--gold);
          transition: width 0.5s ease;
        }
        .vs-card:hover::before { width: 100%; }

        /* glowing bottom line */
        .vs-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          transition: width 0.6s 0.1s ease;
        }
        .vs-card:hover::after { width: 100%; }

        /* Big "E" letter in background */
        .vs-card-bg-letter {
          position: absolute;
          top: -20px; right: -10px;
          font-family: var(--font-playfair), 'Playfair Display', serif;
          font-size: 180px;
          font-weight: 900;
          color: rgba(201,168,76,0.04);
          line-height: 1;
          pointer-events: none;
          transition: color 0.4s, transform 0.5s;
          user-select: none;
        }
        .vs-card:hover .vs-card-bg-letter {
          color: rgba(201,168,76,0.08);
          transform: scale(1.05) translateY(-8px);
        }

        .vs-card-num {
          font-family: var(--font-space-mono), 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.25em;
          color: var(--gold);
          opacity: 0.6;
          margin-bottom: 24px;
        }

        .vs-card-glyph {
          font-size: 22px;
          color: var(--gold);
          opacity: 0.5;
          display: block;
          margin-bottom: 20px;
          transition: opacity 0.3s, transform 0.4s;
        }
        .vs-card:hover .vs-card-glyph {
          opacity: 1;
          transform: rotate(90deg);
        }

        .vs-card-word {
          font-family: var(--font-playfair), 'Playfair Display', serif;
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 700;
          line-height: 1;
          color: var(--white);
          margin-bottom: 18px;
          position: relative;
        }

        /* underline sweep on word */
        .vs-card-word::after {
          content: '';
          display: block;
          width: 24px; height: 1px;
          background: var(--gold);
          margin-top: 10px;
          transition: width 0.4s ease;
        }
        .vs-card:hover .vs-card-word::after { width: 100%; }

        .vs-card-body {
          font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
          font-size: clamp(15px, 1.4vw, 17px);
          line-height: 1.7;
          color: var(--gray-mid);
          font-style: italic;
          transition: color 0.3s;
        }
        .vs-card:hover .vs-card-body { color: var(--accent); }

        /* ── "3 E's" accent strip ── */
        .values-trio-strip {
          display: flex;
          justify-content: center;
          gap: 0;
          margin-top: 64px;
          opacity: 0;
          animation: vs-rise 0.8s 0.7s ease forwards;
        }

        .vts-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 40px;
          position: relative;
        }

        .vts-item + .vts-item::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          height: 36px; width: 1px;
          background: rgba(201,168,76,0.25);
        }

        .vts-big {
          font-family: var(--font-playfair), 'Playfair Display', serif;
          font-size: clamp(40px, 5vw, 64px);
          font-weight: 900;
          color: var(--gold);
          line-height: 1;
          animation: vs-pulse 3s ease-in-out infinite;
        }
        .vts-item:nth-child(2) .vts-big { animation-delay: 0.4s; }
        .vts-item:nth-child(3) .vts-big { animation-delay: 0.8s; }

        .vts-label {
          font-family: var(--font-space-mono), 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--gray-mid);
          margin-top: 6px;
        }

        @keyframes vs-rise {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes vs-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.06); }
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .values-grid {
            grid-template-columns: 1fr;
            gap: 1px;
          }
          .values-section { padding: 80px 24px; }
          .vs-card { padding: 40px 28px; }
          .vts-item { padding: 0 24px; }
        }

        @media (max-width: 520px) {
          .values-trio-strip { flex-direction: column; align-items: center; gap: 24px; }
          .vts-item + .vts-item::before { display: none; }
        }
      `}</style>

      <div className="values-inner">
        <header className="values-header">
          <p className="values-eyebrow">Core Values</p>
          <h2 className="values-title">Faith, Grace &amp; <em>The Word</em></h2>
          <p className="values-sub">Three pillars that anchor every step of this walk with God.</p>
        </header>

        <div className="values-grid">
          {values.map((v, i) => (
            <div
              key={v.word}
              className="vs-card"
              ref={(el) => { cardsRef.current[i] = el; }}
            >
              <span className="vs-card-bg-letter">{v.letter}</span>
              <p className="vs-card-num">{v.number}</p>
              <span className="vs-card-glyph">{v.glyph}</span>
              <h3 className="vs-card-word">{v.word}</h3>
              <p className="vs-card-body">{v.body}</p>
            </div>
          ))}
        </div>

        {/* Animated trio footer */}
        <div className="values-trio-strip">
          {values.map((v) => (
            <div key={v.word} className="vts-item">
              <span className="vts-big">{v.letter}</span>
              <span className="vts-label">{v.word}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
