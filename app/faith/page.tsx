"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const css = `
/* ── DESIGN TOKENS ── */
.fdp {
  --bg:     #080807;
  --bg2:    #0e0d0b;
  --white:  #f0ece4;
  --cream:  #e8e0d0;
  --gold:   #c9a84c;
  --gold2:  #a8863a;
  --dim:    #7a7060;
  --dimmer: #3e3830;
  --line:   rgba(240,236,228,.06);
  --card:   #111009;
  min-height: 100vh;
  position: relative;
}

body.on-fdp {
  background: #080807;
  color: #f0ece4;
  font-family: 'Cormorant Garamond', serif;
}
body.on-fdp .cursor { background: #c9a84c; mix-blend-mode: normal; width: 8px; height: 8px; border-radius: 50%; }
body.on-fdp .cursor-ring { border-color: rgba(201,168,76,.35); mix-blend-mode: normal; }

/* ── AMBIENT PARTICLES ── */
.fdp-particles { position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden; }
.fdp-p {
  position:absolute;width:1px;height:1px;border-radius:50%;
  background:#c9a84c;opacity:0;
  animation:fdp-float var(--dur,20s) var(--delay,0s) linear infinite;
}
@keyframes fdp-float {
  0%   { transform:translateY(100vh) translateX(0); opacity:0; }
  10%  { opacity:var(--op,.3); }
  90%  { opacity:var(--op,.3); }
  100% { transform:translateY(-10vh) translateX(var(--drift,20px)); opacity:0; }
}

/* ── NAV ── */
.fdp nav {
  position:fixed;top:0;left:0;right:0;z-index:200;
  padding:22px 56px;
  display:flex;justify-content:space-between;align-items:center;
  background:rgba(8,8,7,.88);backdrop-filter:blur(14px);
  border-bottom:1px solid var(--line);
}
.fdp .nav-back {
  font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.22em;
  text-transform:uppercase;color:var(--dim);text-decoration:none;
  display:flex;align-items:center;gap:10px;transition:color .3s;
}
.fdp .nav-back:hover { color:var(--gold); }
.fdp .nav-back::before { content:'←';font-size:13px; }
.fdp .nav-logo {
  font-family:var(--font-playfair),'Playfair Display',serif;font-size:17px;
  color:var(--white);letter-spacing:.06em;
}
.fdp .nav-tag {
  font-family:'Space Mono',monospace;font-size:10px;
  letter-spacing:.22em;color:var(--gold);text-transform:uppercase;
}

/* ── HERO ── */
.fdp #hero {
  min-height:100vh;
  display:grid;grid-template-rows:1fr auto;
  position:relative;overflow:hidden;
  padding:0;
}
.fdp .mandala {
  position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:0;
}
.fdp .m1 { fill:none;stroke:#c9a84c;stroke-width:.6;opacity:.07;animation:fdp-spin 90s linear infinite; }
.fdp .m2 { fill:none;stroke:#c9a84c;stroke-width:.4;opacity:.05;animation:fdp-spin 70s linear infinite reverse; }
.fdp .m3 { fill:none;stroke:#c9a84c;stroke-width:.3;opacity:.04;animation:fdp-spin 50s linear infinite; }
.fdp .m-poly { fill:none;stroke:#c9a84c;stroke-width:.4;opacity:.05;animation:fdp-spin 120s linear infinite reverse; }
@keyframes fdp-spin {
  from { transform:rotate(0deg); }
  to   { transform:rotate(360deg); }
}
.fdp .hero-text {
  position:relative;z-index:2;
  display:flex;flex-direction:column;
  justify-content:flex-end;
  padding:140px 56px 60px;
}
.fdp .hero-eyebrow {
  font-family:'Space Mono',monospace;font-size:9px;
  letter-spacing:.4em;text-transform:uppercase;
  color:var(--gold);margin-bottom:24px;
  opacity:0;animation:fdp-rise .9s .2s ease forwards;
}
.fdp .hero-title {
  font-family:var(--font-playfair),'Playfair Display',serif;
  font-size:clamp(56px,9vw,130px);
  line-height:.9;color:var(--white);
  opacity:0;animation:fdp-rise .9s .4s ease forwards;
}
.fdp .hero-title em {
  font-style:italic;color:var(--gold);
  display:block;font-size:.75em;
}
.fdp .hero-subtitle {
  font-size:clamp(16px,1.8vw,22px);font-style:italic;
  color:var(--dim);max-width:560px;line-height:1.6;
  margin-top:28px;font-weight:300;
  opacity:0;animation:fdp-rise .9s .6s ease forwards;
}
.fdp .hero-verse {
  margin-top:48px;padding:28px 36px;
  border-left:2px solid var(--gold);
  max-width:640px;
  opacity:0;animation:fdp-rise .9s .8s ease forwards;
  background:rgba(201,168,76,.04);
}
.fdp .hero-verse p {
  font-family:var(--font-playfair),'Playfair Display',serif;font-size:20px;
  font-style:italic;color:var(--cream);line-height:1.55;
}
.fdp .hero-verse cite {
  display:block;margin-top:12px;
  font-family:'Space Mono',monospace;font-size:9px;
  letter-spacing:.2em;color:var(--gold);text-transform:uppercase;
  font-style:normal;
}
.fdp .hero-scroll-hint {
  position:absolute;bottom:40px;right:56px;
  font-family:'Space Mono',monospace;font-size:9px;
  letter-spacing:.3em;text-transform:uppercase;
  color:var(--dimmer);writing-mode:vertical-rl;
  display:flex;align-items:center;gap:12px;z-index:2;
  opacity:0;animation:fdp-rise .9s 1.2s ease forwards;
}
.fdp .hero-scroll-hint::after {
  content:'';width:1px;height:50px;background:var(--dimmer);
  animation:fdp-line-breathe 2.5s ease-in-out infinite;
}
@keyframes fdp-line-breathe {
  0%,100%{opacity:.3;height:40px;} 50%{opacity:.8;height:60px;}
}
@keyframes fdp-rise {
  from{opacity:0;transform:translateY(22px);}
  to{opacity:1;transform:none;}
}

/* ── SHARED SECTION ── */
.fdp .section { padding:110px 56px;position:relative;z-index:1; }
.fdp .s-label {
  font-family:'Space Mono',monospace;font-size:9px;
  letter-spacing:.35em;text-transform:uppercase;
  color:var(--gold);margin-bottom:56px;
  display:flex;align-items:center;gap:16px;
}
.fdp .s-label::before { content:'';width:36px;height:1px;background:var(--gold); }

/* ── CORE BELIEFS ── */
.fdp #beliefs { background:var(--bg2); }
.fdp .beliefs-grid {
  display:grid;grid-template-columns:1fr 1fr;gap:2px;
}
.fdp .belief-card {
  background:var(--card);
  padding:52px 48px;
  border:1px solid var(--line);
  position:relative;overflow:hidden;
  opacity:0;transform:translateY(28px);
  transition:opacity .8s ease,transform .8s ease,border-color .4s;
  cursor:none;
}
.fdp .belief-card.visible { opacity:1;transform:none; }
.fdp .belief-card:hover { border-color:rgba(201,168,76,.2); }
.fdp .belief-card::after {
  content:'';
  position:absolute;bottom:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--gold),transparent);
  opacity:0;transition:opacity .4s;
}
.fdp .belief-card:hover::after { opacity:.5; }
.fdp .bc-number {
  font-family:var(--font-playfair),'Playfair Display',serif;font-size:72px;
  color:transparent;-webkit-text-stroke:1px rgba(201,168,76,.12);
  line-height:1;margin-bottom:8px;
}
.fdp .bc-title {
  font-family:var(--font-playfair),'Playfair Display',serif;font-size:30px;
  color:var(--white);line-height:1.1;
}
.fdp .bc-body {
  font-size:16px;line-height:1.8;color:var(--dim);
  margin-top:16px;font-weight:300;
}
.fdp .bc-verse {
  margin-top:24px;
  font-family:var(--font-playfair),'Playfair Display',serif;font-size:14px;
  font-style:italic;color:var(--gold);opacity:.8;line-height:1.5;
}

/* ── SPIRITUAL JOURNEY ── */
.fdp #journey { background:var(--bg); }
.fdp .journey-layout {
  display:grid;grid-template-columns:1fr 2fr;gap:80px;align-items:start;
}
.fdp .journey-left { position:sticky;top:120px; }
.fdp .journey-headline {
  font-family:var(--font-playfair),'Playfair Display',serif;
  font-size:clamp(36px,4vw,56px);
  color:var(--white);line-height:1.05;
}
.fdp .journey-headline em { font-style:italic;color:var(--gold); }
.fdp .journey-desc {
  font-size:17px;line-height:1.8;color:var(--dim);
  margin-top:24px;font-style:italic;font-weight:300;
}
.fdp .journey-right { display:flex;flex-direction:column;gap:2px; }
.fdp .journey-entry {
  padding:40px 44px;background:var(--card);
  border:1px solid var(--line);
  border-left:3px solid transparent;
  opacity:0;transform:translateX(20px);
  transition:opacity .7s ease,transform .7s ease,border-left-color .4s,background .3s;
  cursor:none;
}
.fdp .journey-entry.visible { opacity:1;transform:none; }
.fdp .journey-entry:hover { border-left-color:var(--gold);background:#141210; }
.fdp .je-title {
  font-family:var(--font-playfair),'Playfair Display',serif;font-size:24px;
  color:var(--white);
}
.fdp .je-body {
  font-size:16px;line-height:1.75;color:var(--dim);
  margin-top:12px;font-weight:300;
}
.fdp .je-verse {
  margin-top:16px;padding:14px 20px;
  border-left:2px solid rgba(201,168,76,.3);
  font-family:var(--font-playfair),'Playfair Display',serif;font-style:italic;
  font-size:14px;color:var(--gold);opacity:.85;line-height:1.55;
}

/* ── SCRIPTURE GALLERY ── */
.fdp #scriptures { background:var(--bg2); }
.fdp .scriptures-intro {
  max-width:680px;
  font-family:var(--font-playfair),'Playfair Display',serif;font-size:22px;
  font-style:italic;color:var(--dim);line-height:1.6;
  margin-bottom:64px;
}
.fdp .scripture-mosaic {
  display:grid;
  grid-template-columns:1fr 1fr 1fr;
  grid-template-rows:auto auto;
  gap:2px;
}
.fdp .sm-wide { grid-column:span 2; }
.fdp .sm-tall { grid-row:span 2; }
.fdp .sm-card {
  background:var(--card);border:1px solid var(--line);
  padding:44px 40px;
  display:flex;flex-direction:column;justify-content:space-between;
  opacity:0;transform:scale(.97);
  transition:opacity .8s ease,transform .8s ease,border-color .4s;
  cursor:none;min-height:200px;
}
.fdp .sm-card.visible { opacity:1;transform:scale(1); }
.fdp .sm-card:hover { border-color:rgba(201,168,76,.2); }
.fdp .sm-text {
  font-family:var(--font-playfair),'Playfair Display',serif;
  font-size:clamp(16px,1.6vw,22px);
  font-style:italic;color:var(--cream);
  line-height:1.55;flex:1;
}
.fdp .sm-ref {
  font-family:'Space Mono',monospace;font-size:9px;
  letter-spacing:.2em;text-transform:uppercase;
  color:var(--gold);margin-top:20px;
}

/* ── PILLARS OF PRACTICE ── */
.fdp #practice { background:var(--bg); }
.fdp .practice-row { display:flex;flex-direction:column;gap:2px; }
.fdp .pr-item {
  display:grid;grid-template-columns:80px 1fr 1fr;
  align-items:center;gap:0;
  border:1px solid var(--line);background:var(--card);
  overflow:hidden;
  opacity:0;transform:translateX(-20px);
  transition:opacity .7s ease,transform .7s ease,border-color .3s;
  cursor:none;
}
.fdp .pr-item.visible { opacity:1;transform:none; }
.fdp .pr-item:hover { border-color:rgba(201,168,76,.2); }
.fdp .pr-num {
  padding:36px 24px;
  font-family:var(--font-playfair),'Playfair Display',serif;font-size:40px;
  color:var(--gold);opacity:.35;border-right:1px solid var(--line);
  text-align:center;line-height:1;
}
.fdp .pr-name {
  padding:36px 40px;
  font-family:var(--font-playfair),'Playfair Display',serif;font-size:26px;
  color:var(--white);border-right:1px solid var(--line);
}
.fdp .pr-desc {
  padding:36px 40px;
  font-size:15px;line-height:1.7;color:var(--dim);font-weight:300;
}

/* ── REFLECTION ── */
.fdp #reflection {
  background:var(--bg2);
  text-align:center;
  padding:120px 56px;
}
.fdp .reflection-inner { max-width:780px;margin:0 auto; }
.fdp .refl-ornament {
  font-size:32px;color:var(--gold);opacity:.4;
  margin-bottom:40px;letter-spacing:.4em;
  animation:fdp-shimmer 4s ease-in-out infinite;
}
@keyframes fdp-shimmer {
  0%,100%{opacity:.3;} 50%{opacity:.7;}
}
.fdp .refl-quote {
  font-family:var(--font-playfair),'Playfair Display',serif;
  font-size:clamp(26px,3.5vw,44px);
  font-style:italic;color:var(--white);
  line-height:1.3;
}
.fdp .refl-quote strong { font-style:normal;color:var(--gold); }
.fdp .refl-ref {
  margin-top:32px;
  font-family:'Space Mono',monospace;font-size:10px;
  letter-spacing:.3em;text-transform:uppercase;color:var(--dim);
}
.fdp .refl-body {
  margin-top:48px;font-size:18px;
  line-height:1.8;color:var(--dim);
  font-style:italic;font-weight:300;
}

/* ── CONNECT ── */
.fdp #connect {
  background:var(--white);color:var(--bg);
  padding:90px 56px;
  display:flex;justify-content:space-between;align-items:center;
  gap:60px;flex-wrap:wrap;
}
.fdp .connect-title {
  font-family:var(--font-playfair),'Playfair Display',serif;
  font-size:clamp(36px,5vw,68px);
  color:var(--bg);line-height:1.05;
}
.fdp .connect-title em { font-style:italic;color:var(--gold2); }
.fdp .connect-body {
  font-size:17px;line-height:1.7;color:#555;
  max-width:400px;margin-top:16px;font-style:italic;font-weight:300;
}
.fdp .connect-links {
  display:flex;flex-direction:column;gap:2px;min-width:280px;
}
.fdp .c-link {
  display:flex;justify-content:space-between;align-items:center;
  padding:24px 32px;background:var(--bg);color:var(--white);
  text-decoration:none;font-family:var(--font-playfair),'Playfair Display',serif;font-size:20px;
  transition:background .3s,padding-left .3s;cursor:none;
}
.fdp .c-link:hover { background:#1a1814;padding-left:42px; }
.fdp .c-link span { font-size:18px; }

/* ── FOOTER ── */
.fdp footer {
  background:var(--bg);border-top:1px solid var(--line);
  padding:28px 56px;
  display:flex;justify-content:space-between;align-items:center;
}
.fdp .f-name {
  font-family:var(--font-playfair),'Playfair Display',serif;font-size:16px;
  color:var(--white);
}
.fdp .f-copy {
  font-family:'Space Mono',monospace;font-size:9px;
  letter-spacing:.2em;color:var(--dim);text-transform:uppercase;
}
.fdp .f-link {
  font-family:'Space Mono',monospace;font-size:9px;
  letter-spacing:.2em;color:var(--gold);
  text-decoration:none;text-transform:uppercase;
}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  .fdp nav { padding:18px 24px; }
  .fdp .section,.fdp .hero-text { padding-left:24px;padding-right:24px; }
  .fdp .beliefs-grid { grid-template-columns:1fr; }
  .fdp .journey-layout { grid-template-columns:1fr; }
  .fdp .journey-left { position:static; }
  .fdp .scripture-mosaic { grid-template-columns:1fr; }
  .fdp .sm-wide,.fdp .sm-tall { grid-column:span 1;grid-row:span 1; }
  .fdp .pr-item { grid-template-columns:60px 1fr; }
  .fdp .pr-desc { display:none; }
  .fdp #connect { flex-direction:column; }
  .fdp footer { flex-direction:column;gap:12px;text-align:center;padding:24px; }
  .fdp #reflection { padding:80px 24px; }
  .fdp .hero-scroll-hint { display:none; }
}
`;

const particles = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 5.5 + 3) % 100}%`,
  dur: `${15 + (i * 3.1) % 12}s`,
  delay: `${(i * 2.3) % 10}s`,
  op: `${0.15 + (i % 4) * 0.08}`,
  drift: `${-20 + (i % 5) * 12}px`,
}));

export default function FaithPage() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("on-fdp");
    return () => document.body.classList.remove("on-fdp");
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(
      ".fdp .belief-card, .fdp .journey-entry, .fdp .sm-card, .fdp .pr-item"
    ).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fdp" ref={sectionRef}>
      <style>{css}</style>

      {/* Particles */}
      <div className="fdp-particles">
        {particles.map((p, i) => (
          <div key={i} className="fdp-p" style={{
            left: p.left, bottom: 0,
            ["--dur" as string]: p.dur,
            ["--delay" as string]: p.delay,
            ["--op" as string]: p.op,
            ["--drift" as string]: p.drift,
          }} />
        ))}
      </div>

      {/* NAV */}
      <nav>
        <Link href="/" className="nav-back">Portfolio</Link>
        <div className="nav-logo">Samuel Kobina Gyasi</div>
        <div className="nav-tag">Beliefs</div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <svg className="mandala" width="900" height="900" viewBox="-450 -450 900 900">
          <g className="m1">
            <circle r="200" /><circle r="280" /><circle r="360" />
          </g>
          <g className="m2">
            <polygon className="m-poly" points="0,-320 277,160 -277,160" />
            <polygon className="m-poly" points="0,320 -277,-160 277,-160" />
          </g>
          <g className="m3">
            <circle r="120" />
            <line x1="-360" y1="0" x2="360" y2="0" stroke="#c9a84c" strokeWidth=".3" opacity=".06" />
            <line x1="0" y1="-360" x2="0" y2="360" stroke="#c9a84c" strokeWidth=".3" opacity=".06" />
            <line x1="-255" y1="-255" x2="255" y2="255" stroke="#c9a84c" strokeWidth=".3" opacity=".04" />
            <line x1="255" y1="-255" x2="-255" y2="255" stroke="#c9a84c" strokeWidth=".3" opacity=".04" />
          </g>
        </svg>

        <div className="hero-text">
          <div className="hero-eyebrow">Faith · Belief · Conviction · Wisdom</div>
          <h1 className="hero-title">
            <em>Beliefs</em>
          </h1>
          <p className="hero-subtitle">
            A life anchored in sacred wisdom, shaped by scripture, and illuminated by an unshakeable conviction that truth is both found and lived.
          </p>
          <blockquote className="hero-verse">
            <p>&ldquo;Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.&rdquo;</p>
            <cite>Proverbs 3:5–6 · The foundation of Samuel&rsquo;s journey</cite>
          </blockquote>
        </div>
        <div className="hero-scroll-hint">Explore</div>
      </section>

      {/* CORE BELIEFS */}
      <section id="beliefs" className="section">
        <div className="s-label">Core Convictions</div>
        <div className="beliefs-grid">
          {[
            { num: "I", title: "The Living Word", body: "Samuel holds the Bible not as a historical relic but as a living, breathing guide — a lamp that illuminates every decision, relationship, and ambition. Scripture is the lens through which all of life is interpreted and understood.", verse: '"All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness." — 2 Timothy 3:16' },
            { num: "II", title: "Faith Over Fear", body: "At every crossroads — as a scholar, as a leader, as a young man far from home — Samuel's faith has been the anchor that refuses to yield to doubt or circumstance. Courage is not the absence of fear; it is faith in motion.", verse: '"For I am the Lord your God who takes hold of your right hand and says to you, \'Do not fear; I will help you.\'" — Isaiah 41:13' },
            { num: "III", title: "Purpose-Driven Existence", body: "Every talent, every scholarship, every position of leadership is understood as a stewardship — entrusted by God for a reason greater than personal gain. Samuel believes his life is a narrative being written by a hand wiser than his own.", verse: '"For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do." — Ephesians 2:10' },
            { num: "IV", title: "Transformation from Within", body: "True change — in communities, in nations, in minds — begins not with systems or strategies but with the renewal of the human spirit. Samuel believes that inward transformation is the seed of all outward revolution.", verse: '"Do not conform to the pattern of this world, but be transformed by the renewing of your mind." — Romans 12:2' },
          ].map((card) => (
            <div className="belief-card" key={card.num}>
              <div className="bc-number">{card.num}</div>
              <div className="bc-title">{card.title}</div>
              <div className="bc-body">{card.body}</div>
              <div className="bc-verse">{card.verse}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SPIRITUAL JOURNEY */}
      <section id="journey" className="section">
        <div className="s-label">The Inner Story</div>
        <div className="journey-layout">
          <div className="journey-left">
            <h2 className="journey-headline">A Pilgrim&rsquo;s<br /><em>Path</em></h2>
            <p className="journey-desc">Faith is not a destination arrived at once. It is a road walked daily — through Ghana, through Morocco, through the halls of academia and the quiet rooms of prayer.</p>
          </div>
          <div className="journey-right">
            {[
              { title: "Rooted in Ghana", body: "From the Ghana-China Friendship School to Saint John's, Samuel grew up in an environment where faith was woven into community life. The early discipline of stewardship — caring for others, showing up with integrity — was shaped by deeply held beliefs about service and honour.", verse: '"Start children off on the way they should go, and even when they are old they will not turn from it." — Proverbs 22:6' },
              { title: "Stretched Across Borders", body: "Moving from Ghana to Morocco for university required more than academic ambition — it demanded a faith resilient enough to sustain through cultural displacement and personal challenge. In Fez and then Rabat, Samuel learned that conviction does not depend on geography.", verse: '"Even though I walk through the darkest valley, I will fear no evil, for you are with me." — Psalm 23:4' },
              { title: "Scholarship as Testimony", body: "Four fully-funded scholarships — from the Government of Ghana, Golden Star Gold Mines, IBN ROCHD, and an Excellence Award — are not coincidences. Samuel views each as a tangible expression of providential favour: evidence that diligence and faith working together open doors no human hand alone could unlock.", verse: '"Commit to the Lord whatever you do, and he will establish your plans." — Proverbs 16:3' },
              { title: "Collective Intelligence as Calling", body: "The choice to study Collective Intelligence at UM6P is, for Samuel, a spiritual one. He sees the pursuit of shared knowledge, collaborative decision-making, and community empowerment as a form of sacred stewardship — using the mind God gave him to serve the world God loves.", verse: '"Love the Lord your God with all your heart and with all your soul and with all your mind." — Matthew 22:37' },
            ].map((entry) => (
              <div className="journey-entry" key={entry.title}>
                <div className="je-title">{entry.title}</div>
                <div className="je-body">{entry.body}</div>
                <div className="je-verse">{entry.verse}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCRIPTURE GALLERY */}
      <section id="scriptures" className="section">
        <div className="s-label">Words That Anchor</div>
        <p className="scriptures-intro">These are the verses Samuel returns to — in quiet mornings, in difficult seasons, in moments of decision.</p>
        <div className="scripture-mosaic">
          <div className="sm-card sm-tall">
            <div className="sm-text">&ldquo;I can do all this through him who gives me strength.&rdquo;</div>
            <div className="sm-ref">Philippians 4:13</div>
          </div>
          <div className="sm-card sm-wide">
            <div className="sm-text">&ldquo;For I know the plans I have for you, declares the Lord — plans to prosper you and not to harm you, plans to give you hope and a future.&rdquo;</div>
            <div className="sm-ref">Jeremiah 29:11</div>
          </div>
          <div className="sm-card">
            <div className="sm-text">&ldquo;Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.&rdquo;</div>
            <div className="sm-ref">Joshua 1:9</div>
          </div>
          <div className="sm-card">
            <div className="sm-text">&ldquo;The heart of man plans his way, but the Lord establishes his steps.&rdquo;</div>
            <div className="sm-ref">Proverbs 16:9</div>
          </div>
          <div className="sm-card sm-wide">
            <div className="sm-text">&ldquo;And we know that in all things God works for the good of those who love him, who have been called according to his purpose.&rdquo;</div>
            <div className="sm-ref">Romans 8:28</div>
          </div>
          <div className="sm-card">
            <div className="sm-text">&ldquo;With unveiled faces we are being transformed into his image with ever-increasing glory.&rdquo;</div>
            <div className="sm-ref">2 Corinthians 3:18</div>
          </div>
        </div>
      </section>

      {/* PILLARS OF PRACTICE */}
      <section id="practice" className="section">
        <div className="s-label">How Faith Shows Up</div>
        <div className="practice-row">
          {[
            { num: "01", name: "Daily Study of Scripture", desc: "The Bible is not reserved for Sundays. Samuel approaches scripture with the same intellectual rigour he brings to research — reading deeply, questioning carefully, and allowing the text to challenge and reshape his thinking." },
            { num: "02", name: "Prayer as Orientation", desc: "Before decisions, before difficult conversations, before new seasons — Samuel grounds himself in prayer. It is not a ritual of words but a discipline of attentiveness: positioning himself to hear before he speaks." },
            { num: "03", name: "Servant Leadership", desc: "Every position of authority Samuel has held — from Class Prefect to President of the Collective Intelligence Consortium — has been exercised with the understanding that leadership is service. The model is clear: to lead is to give, not to take." },
            { num: "04", name: "Community & Belonging", desc: "Faith, for Samuel, is never solitary. From his roots in Ghana to his community in Morocco, he has consistently sought and built spaces where people encourage one another, bear one another's burdens, and grow together." },
            { num: "05", name: "Gratitude as a Posture", desc: "Each scholarship, each opportunity, each relationship is received with gratitude — not entitlement. Samuel views his story as a gift, and generosity with time, knowledge, and encouragement is his way of passing that gift forward." },
          ].map((p) => (
            <div className="pr-item" key={p.num}>
              <div className="pr-num">{p.num}</div>
              <div className="pr-name">{p.name}</div>
              <div className="pr-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CENTRAL REFLECTION */}
      <section id="reflection">
        <div className="reflection-inner">
          <div className="refl-ornament">✦ ✦ ✦</div>
          <blockquote className="refl-quote">
            &ldquo;I am not defined by where I started,<br />
            nor limited by where I stand today.<br />
            I am being <strong>transformed</strong> —<br />
            and that is enough to move forward.&rdquo;
          </blockquote>
          <div className="refl-ref">— Samuel Kobina Gyasi</div>
          <p className="refl-body">Faith is not the elimination of questions. It is the courage to carry them forward, trusting that the One who began a good work will be faithful to complete it.</p>
        </div>
      </section>

      {/* CONNECT */}
      <section id="connect">
        <div>
          <h2 className="connect-title">Spiritual<br />Dialogue &amp;<br /><em>Connection</em></h2>
          <p className="connect-body">Samuel welcomes conversations about faith, belief, meaning, and the intersection of spirituality with leadership, intellect, and transformation.</p>
        </div>
        <div className="connect-links">
          <a href="mailto:samuel.gyasi@um6p.ma" className="c-link">Email Samuel <span>→</span></a>
          <Link href="/leadership" className="c-link">Leadership Page <span>→</span></Link>
          <Link href="/" className="c-link">Full Portfolio <span>→</span></Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="f-name">Samuel Kobina Gyasi</div>
        <div className="f-copy">Faith &amp; Beliefs · © 2026</div>
        <Link href="/" className="f-link">← Portfolio</Link>
      </footer>
    </div>
  );
}
