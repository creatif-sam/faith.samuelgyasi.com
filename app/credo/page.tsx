"use client";

import { Suspense, useEffect } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { SiteFooter } from "@/components/organisms/SiteFooter";

const css = `
.credo-pg {
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  position: relative;
}
.credo-pg::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(ellipse at 15% 50%, rgba(201,168,76,0.05) 0%, transparent 55%),
    radial-gradient(ellipse at 85% 20%, rgba(201,168,76,0.04) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}
.credo-pg > * { position: relative; z-index: 1; }

/* ── HERO ── */
.credo-hero {
  padding: 140px 8% 80px;
  border-bottom: 1px solid rgba(201,168,76,.12);
  max-width: 1100px;
  margin: 0 auto;
}
.credo-eyebrow {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  opacity: 0;
  animation: credo-rise .9s .1s ease forwards;
}
.credo-headline {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(52px, 8vw, 110px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.03em;
  color: var(--white);
  text-transform: uppercase;
  margin-bottom: 32px;
  opacity: 0;
  animation: credo-rise .9s .25s ease forwards;
}
.credo-headline em {
  font-style: italic;
  font-weight: 400;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
}
.credo-rule {
  width: 56px; height: 2px;
  background: linear-gradient(90deg, #ffde59, #ff914d);
  margin: 28px 0;
  opacity: 0;
  animation: credo-rise .9s .4s ease forwards;
}
.credo-hero-sub {
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-size: clamp(17px, 2vw, 22px);
  font-style: italic;
  color: rgba(245,243,239,.62);
  max-width: 560px;
  line-height: 1.7;
  opacity: 0;
  animation: credo-rise .9s .55s ease forwards;
}
@keyframes credo-rise {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: none; }
}

/* ── DECLARATION STRIP ── */
.credo-strip {
  background: rgba(201,168,76,.04);
  border-bottom: 1px solid rgba(201,168,76,.1);
  padding: 28px 8%;
  text-align: center;
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}
.credo-strip-dot { opacity: 0.3; }

/* ── BELIEFS LIST ── */
.credo-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 8% 120px;
}
.credo-item {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 0;
  border-bottom: 1px solid rgba(201,168,76,.1);
  padding: 64px 0;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity .7s ease, transform .7s ease;
}
.credo-item.credo-visible { opacity: 1; transform: none; }
.credo-item:first-child { padding-top: 0; }
.credo-item:last-child { border-bottom: none; }
.credo-num {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 64px;
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 1px rgba(201,168,76,.2);
  line-height: 1;
  padding-top: 8px;
  user-select: none;
}
.credo-text { padding-left: 48px; }
.credo-item-title {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(20px, 2.5vw, 32px);
  font-weight: 700;
  color: var(--white);
  line-height: 1.15;
  margin-bottom: 20px;
}
.credo-item-body {
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-size: clamp(16px, 1.7vw, 19px);
  line-height: 1.9;
  color: rgba(245,243,239,.7);
}
.credo-verse {
  margin-top: 24px;
  padding: 18px 24px;
  border-left: 3px solid rgba(201,168,76,.35);
  background: rgba(201,168,76,.04);
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-style: italic;
  font-size: 15px;
  line-height: 1.65;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── CLOSING ── */
.credo-close {
  background: rgba(201,168,76,.04);
  border-top: 1px solid rgba(201,168,76,.12);
  padding: 80px 8%;
  text-align: center;
}
.credo-close-inner { max-width: 720px; margin: 0 auto; }
.credo-close-ornament {
  font-size: 22px;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.6em;
  opacity: 0.6;
  margin-bottom: 36px;
  animation: credo-shimmer 4s ease-in-out infinite;
}
@keyframes credo-shimmer { 0%,100%{opacity:.3;} 50%{opacity:.7;} }
.credo-close-quote {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(20px, 2.8vw, 36px);
  font-style: italic;
  color: var(--white);
  line-height: 1.35;
  margin-bottom: 24px;
}
.credo-close-ref {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 48px;
}
.credo-close-sign {
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-size: 18px;
  font-style: italic;
  color: rgba(245,243,239,.42);
  line-height: 1.7;
}

@media (max-width: 768px) {
  .credo-hero { padding: 130px 6% 60px; }
  .credo-body { padding: 60px 6% 80px; }
  .credo-close { padding: 60px 6%; }
  .credo-item { grid-template-columns: 1fr; }
  .credo-num { font-size: 42px; margin-bottom: 12px; }
  .credo-text { padding-left: 0; }
}
`;

const beliefs = [
  {
    title: "I believe in the absolute authority of Scripture",
    body: "The Bible is not merely a historical document — it is the living, breathing Word of God. I read it not to confirm my opinions but to be confronted, corrected, and transformed by truth that is outside and above me. Every conviction I hold is tested against it. Where Scripture speaks, it speaks with final authority.",
    verse: "\"All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness.\" — 2 Timothy 3:16",
  },
  {
    title: "I believe in the lordship of Jesus Christ",
    body: "Not as a metaphor, not as a moral teacher, not as a spiritual concept — but as the risen Lord. Christ is not one option among many. He is the Way, the Truth, and the Life. I have staked everything on the reality of His resurrection. The shape of my life is a response to that claim.",
    verse: "\"Jesus said to him, I am the way, and the truth, and the life. No one comes to the Father except through me.\" — John 14:6",
  },
  {
    title: "I believe in the power and necessity of prayer",
    body: "Prayer is not a spiritual technique or a coping mechanism. It is the primary conversation of my life — the means by which I remain tethered to God, calibrated to His will, and sustained through every season. I do not always know what to say. But I know that God hears, and that changes everything about how I live.",
    verse: "\"Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.\" — Philippians 4:6",
  },
  {
    title: "I believe that faith without works is dead",
    body: "I am not saved by what I do — but what I believe will always produce action. Faith is not a private feeling; it is a public practice. Serving the poor, pursuing justice, caring for the marginalised, building community — these are not additions to my faith. They are its expression.",
    verse: "\"What good is it, my brothers, if someone says he has faith but does not have works? Can that faith save him?\" — James 2:14",
  },
  {
    title: "I believe in the sanctity of each human life",
    body: "Every person bears the image of God — the Imago Dei. This is not contingent on their productivity, their nationality, their achievement, or their proximity to me. It means every human being deserves to be treated with dignity, respect, and love. This conviction is the root of my commitment to serve, lead, and advocate.",
    verse: "\"So God created man in his own image, in the image of God he created him; male and female he created them.\" — Genesis 1:27",
  },
  {
    title: "I believe in the community of the Church",
    body: "The Church is not a building or a Sunday event. It is the Body of Christ — broken and beautiful, flawed and essential. I am committed to it not because it is perfect but because it is the vessel through which God has chosen to work in the world. My faith has always been shaped by community, and I belong to one.",
    verse: "\"And day by day, attending the temple together and breaking bread in their homes, they received their food with glad and generous hearts.\" — Acts 2:46",
  },
  {
    title: "I believe that suffering has redemptive meaning",
    body: "I do not celebrate suffering. But I have learned — at cost — that suffering is not the evidence of God's absence. It is often the furnace in which He does His deepest work. Every trial I have walked through has, in retrospect, been the place where I was most formed, most dependent, most certain of His presence.",
    verse: "\"And we know that for those who love God all things work together for good, for those who are called according to his purpose.\" — Romans 8:28",
  },
  {
    title: "I believe I was made for a purpose larger than myself",
    body: "I was not born to accumulate. I was born to contribute. This conviction drives everything: the scholarships I received are commissions; the gifts I carry are not for display but for deployment. I am here — in this moment, in this body, in this generation — for a reason I did not choose and will not fully understand until eternity.",
    verse: "\"For we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand, that we should walk in them.\" — Ephesians 2:10",
  },
];

export default function CredoPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("credo-visible"); }),
      { threshold: 0.07 }
    );
    document.querySelectorAll(".credo-item").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <div className="credo-pg">
        <style>{css}</style>

        {/* ── HERO ── */}
        <div className="credo-hero">
          <p className="credo-eyebrow">Samuel Kobina Gyasi · What I Believe</p>
          <h1 className="credo-headline">
            My<br /><em>Credo</em>
          </h1>
          <div className="credo-rule" />
          <p className="credo-hero-sub">
            These are the convictions by which I live. Not conclusions I have arrived at comfortably,
            but truths I have been broken into. A life is not an argument — it is a witness.
          </p>
        </div>

        {/* ── DECLARATION STRIP ── */}
        <div className="credo-strip">
          <span>I Believe</span>
          <span className="credo-strip-dot">·</span>
          <span>Je Crois</span>
          <span className="credo-strip-dot">·</span>
          <span>Ana Aaminu</span>
          <span className="credo-strip-dot">·</span>
          <span>Menim</span>
        </div>

        {/* ── BELIEFS ── */}
        <div className="credo-body">
          {beliefs.map((b, i) => (
            <div key={i} className="credo-item" style={{ transitionDelay: `${i * 0.05}s` }}>
              <div className="credo-num">0{i + 1}</div>
              <div className="credo-text">
                <h2 className="credo-item-title">{b.title}</h2>
                <p className="credo-item-body">{b.body}</p>
                <div className="credo-verse">{b.verse}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CLOSING DECLARATION ── */}
        <section className="credo-close">
          <div className="credo-close-inner">
            <div className="credo-close-ornament">◆ ◆ ◆</div>
            <p className="credo-close-quote">
              &ldquo;Therefore, since we are surrounded by so great a cloud of witnesses,
              let us lay aside every weight, and sin which clings so closely,
              and let us run with endurance the race that is set before us,
              looking to Jesus, the founder and perfecter of our faith.&rdquo;
            </p>
            <div className="credo-close-ref">Hebrews 12:1–2</div>
            <p className="credo-close-sign">
              Written and lived by Samuel Kobina Gyasi.<br />
              Scholar. Elder. Servant. Believer.<br />
              Mpohor, Ghana · Ben Guerir, Morocco
            </p>
          </div>
        </section>
      </div>
      <Suspense fallback={null}><SiteFooter /></Suspense>
    </>
  );
}
