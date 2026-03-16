"use client";

import { useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { TestimonialsClient } from "@/components/organisms/TestimonialsClient";

const css = `
/* ── DESIGN TOKENS ── */
.tdp {
  --void:    #07080a;
  --deep:    #0d0f12;
  --surface: #131619;
  --card:    #191c20;
  --ember:   #e8692a;
  --ember2:  #f0883a;
  --ember3:  rgba(232,105,42,.12);
  --white:   #f2f0ec;
  --mist:    #8a8880;
  --ghost:   rgba(242,240,236,.05);
  --line:    rgba(242,240,236,.06);
  min-height: 100vh;
  position: relative;
}

body.on-tdp {
  background: #07080a;
  color: #f2f0ec;
  font-family: 'Cormorant Garamond', serif;
}
body.on-tdp .cursor {
  background: #e8692a; width: 14px; height: 14px;
  border-radius: 50%; filter: blur(1px); mix-blend-mode: screen;
}
body.on-tdp .cursor-ring {
  border: none;
  background: radial-gradient(circle, rgba(232,105,42,.25) 0%, transparent 70%);
  width: 60px; height: 60px; border-radius: 50%; mix-blend-mode: screen;
}

/* ── EMBER GLOW ── */
.tdp::after {
  content:'';
  position:fixed; bottom:-200px; left:50%;
  transform:translateX(-50%);
  width:800px; height:400px;
  background: radial-gradient(ellipse, rgba(232,105,42,.06) 0%, transparent 70%);
  pointer-events:none; z-index:0;
  animation:tdp-ember-breathe 6s ease-in-out infinite;
}
@keyframes tdp-ember-breathe {
  0%,100%{ opacity:.6; transform:translateX(-50%) scale(1); }
  50%    { opacity:1;  transform:translateX(-50%) scale(1.15); }
}

/* ── NAV ── */
.tdp nav {
  position:fixed; top:0; left:0; right:0; z-index:200;
  height:60px;
  display:flex; justify-content:space-between; align-items:center;
  padding:0 60px;
  background:rgba(7,8,10,.9);
  backdrop-filter:blur(16px);
  border-bottom:1px solid var(--line);
}
.tdp .nav-back {
  font-family:'Space Mono',monospace; font-size:10px;
  letter-spacing:.2em; text-transform:uppercase;
  color:var(--mist); text-decoration:none;
  display:flex; align-items:center; gap:10px;
  transition:color .3s;
}
.tdp .nav-back:hover { color:var(--ember); }
.tdp .nav-back::before { content:'←'; font-size:12px; }
.tdp .nav-logo {
  font-family:var(--font-playfair),'Playfair Display',serif; font-weight:700;
  font-size:14px; letter-spacing:.1em; color:var(--white);
}
.tdp .nav-pill {
  font-family:'Space Mono',monospace; font-size:10px;
  letter-spacing:.18em; text-transform:uppercase;
  color:var(--void); background:var(--ember);
  padding:5px 14px; border-radius:2px;
}

/* ── HERO ── */
.tdp #hero {
  min-height:100vh;
  position:relative; overflow:hidden;
  display:flex; flex-direction:column; justify-content:flex-end;
  padding:110px 60px 80px;
}
.tdp .morph-bg {
  position:absolute; top:50%; left:55%;
  transform:translate(-50%,-50%);
  pointer-events:none; z-index:0;
  opacity:.7;
}
.tdp .morph-path {
  fill:none; stroke:var(--ember); stroke-width:.6;
  opacity:.08;
  animation:tdp-morph 12s ease-in-out infinite;
}
.tdp .morph-path2 {
  fill:none; stroke:var(--ember); stroke-width:.4;
  opacity:.05;
  animation:tdp-morph 18s ease-in-out infinite reverse;
}
@keyframes tdp-morph {
  0%,100% { d:path("M300,100 C400,50 500,150 480,280 C460,400 360,450 260,420 C160,390 80,310 100,200 C120,90 200,150 300,100Z"); }
  33%     { d:path("M320,80  C430,40 520,180 490,300 C460,420 340,460 230,430 C120,400 60,290 90,180 C120,70 210,120 320,80Z"); }
  66%     { d:path("M280,120 C380,60 490,130 470,270 C450,400 370,440 250,410 C130,380 70,300 100,190 C130,80 180,180 280,120Z"); }
}
.tdp #hero::before {
  content:'';
  position:absolute; inset:0;
  background:repeating-linear-gradient(
    0deg, transparent, transparent 3px,
    rgba(7,8,10,.3) 3px, rgba(7,8,10,.3) 4px
  );
  pointer-events:none; z-index:1; opacity:.4;
}
.tdp .hero-ticker {
  position:absolute; top:80px; right:60px;
  font-family:var(--font-playfair),'Playfair Display',serif; font-weight:700;
  font-size:clamp(100px,16vw,200px);
  color:transparent;
  -webkit-text-stroke:1px rgba(232,105,42,.1);
  line-height:1; pointer-events:none; user-select:none;
  z-index:2;
  animation:tdp-ticker-fade 3s ease forwards;
}
@keyframes tdp-ticker-fade { from{opacity:0} to{opacity:1} }
.tdp .hero-content { position:relative; z-index:3; }
.tdp .hero-eyebrow {
  font-family:'Space Mono',monospace; font-size:10px;
  letter-spacing:.35em; text-transform:uppercase; color:var(--ember);
  margin-bottom:24px;
  display:flex; align-items:center; gap:16px;
  opacity:0; animation:tdp-launch .8s .2s ease forwards;
}
.tdp .hero-eyebrow::before { content:''; width:40px; height:1px; background:var(--ember); }
.tdp .hero-title {
  font-family:var(--font-playfair),'Playfair Display',serif; font-weight:700;
  font-size:clamp(64px,11vw,150px);
  line-height:.88; letter-spacing:-.02em;
  color:var(--white);
  opacity:0; animation:tdp-launch .8s .35s ease forwards;
}
.tdp .hero-title .line2 {
  display:block;
  -webkit-text-stroke:1px rgba(242,240,236,.3);
  color:transparent;
  transition:color .3s,-webkit-text-stroke-color .3s;
}
.tdp .hero-title:hover .line2 {
  color:var(--ember);
  -webkit-text-stroke-color:transparent;
}
.tdp .hero-premise {
  margin-top:36px; max-width:640px;
  opacity:0; animation:tdp-launch .8s .55s ease forwards;
  display:grid; grid-template-columns:14px 1fr; gap:20px; align-items:start;
}
.tdp .hp-bar { width:2px; height:100%; background:var(--ember); opacity:.5; min-height:60px; }
.tdp .hp-text {
  font-size:clamp(17px,1.8vw,22px);
  font-style:italic; font-weight:300;
  color:rgba(242,240,236,.65); line-height:1.6;
}
.tdp .hero-stats {
  margin-top:64px;
  display:flex; gap:0;
  border:1px solid var(--line);
  opacity:0; animation:tdp-launch .8s .75s ease forwards;
  width:fit-content;
}
.tdp .hs-item { padding:24px 36px; border-right:1px solid var(--line); }
.tdp .hs-item:last-child { border-right:none; }
.tdp .hs-val {
  font-family:var(--font-playfair),'Playfair Display',serif; font-weight:700;
  font-size:40px; line-height:1; color:var(--ember);
}
.tdp .hs-label {
  font-family:'Space Mono',monospace; font-size:9px;
  letter-spacing:.2em; text-transform:uppercase; color:var(--mist); margin-top:5px;
}
@keyframes tdp-launch {
  from{opacity:0;transform:translateY(22px);}
  to{opacity:1;transform:none;}
}

/* ── SHARED SECTION ── */
.tdp .section { padding:110px 60px; position:relative; z-index:1; }
.tdp .s-eyebrow {
  font-family:'Space Mono',monospace; font-size:9px;
  letter-spacing:.35em; text-transform:uppercase; color:var(--ember);
  margin-bottom:16px; display:flex; align-items:center; gap:14px;
}
.tdp .s-eyebrow::before { content:''; width:32px; height:1px; background:var(--ember); }
.tdp .s-title {
  font-family:var(--font-playfair),'Playfair Display',serif; font-weight:700;
  font-size:clamp(36px,5vw,64px); letter-spacing:-.02em;
  color:var(--white); line-height:1; margin-bottom:64px;
}
.tdp .s-title em {
  font-family:var(--font-cormorant),'Cormorant Garamond',serif;
  font-style:italic; font-weight:300; color:var(--ember);
}

/* ── TIMELINE JOURNEY ── */
.tdp #journey { background:var(--deep); }
.tdp .journey-timeline { position:relative; padding-left:0; }
.tdp .jt-spine {
  position:absolute; left:50%; top:0; bottom:0;
  width:1px; background:var(--line); transform:translateX(-50%);
}
.tdp .jt-spine::after {
  content:''; position:absolute; top:0; left:0;
  width:100%; height:30%;
  background:linear-gradient(to bottom,var(--ember),transparent);
  animation:tdp-spine-grow 2s ease forwards;
}
@keyframes tdp-spine-grow { from{height:0} to{height:30%} }
.tdp .jt-row {
  display:grid; grid-template-columns:1fr 80px 1fr;
  gap:0; margin-bottom:2px; min-height:140px;
  opacity:0; transform:translateY(20px);
  transition:opacity .7s ease, transform .7s ease;
}
.tdp .jt-row.visible { opacity:1; transform:none; }
.tdp .jt-left {
  padding:36px 48px 36px 0; text-align:right;
  display:flex; flex-direction:column; justify-content:center;
  background:var(--card); border:1px solid var(--line); border-right:none;
}
.tdp .jt-right {
  padding:36px 0 36px 48px;
  display:flex; flex-direction:column; justify-content:center;
  background:var(--card); border:1px solid var(--line); border-left:none;
}
.tdp .jt-center {
  display:flex; align-items:center; justify-content:center;
  background:var(--deep); position:relative;
}
.tdp .jt-node {
  width:16px; height:16px; border:2px solid var(--ember);
  border-radius:50%; background:var(--deep);
  position:relative; z-index:2; flex-shrink:0; transition:background .3s;
}
.tdp .jt-row:hover .jt-node { background:var(--ember); }
.tdp .jt-blank { background:var(--deep); }
.tdp .jt-phase {
  font-family:'Space Mono',monospace; font-size:9px;
  letter-spacing:.22em; text-transform:uppercase; color:var(--ember); margin-bottom:8px;
}
.tdp .jt-heading {
  font-family:var(--font-playfair),'Playfair Display',serif; font-weight:600;
  font-size:20px; color:var(--white);
}
.tdp .jt-body {
  font-size:14px; line-height:1.7; color:var(--mist);
  margin-top:8px; font-weight:300; font-style:italic;
}

/* ── IMPACT AREAS ── */
.tdp #impact { background:var(--void); }
.tdp .impact-grid {
  display:grid; grid-template-columns:1fr 1fr; gap:2px;
  background:rgba(242,240,236,.03);
}
.tdp .impact-card {
  background:var(--card); padding:52px 48px;
  position:relative; overflow:hidden;
  opacity:0; transform:scale(.97);
  transition:opacity .7s ease,transform .7s ease,background .35s; cursor:none;
}
.tdp .impact-card.visible { opacity:1; transform:scale(1); }
.tdp .impact-card:hover { background:#1e2024; }
.tdp .impact-card::before {
  content:''; position:absolute; bottom:0; right:0;
  width:120px; height:120px;
  background:radial-gradient(circle at bottom right, rgba(232,105,42,.15), transparent 70%);
  opacity:0; transition:opacity .4s;
}
.tdp .impact-card:hover::before { opacity:1; }
.tdp .ic-number {
  font-family:var(--font-playfair),'Playfair Display',serif; font-weight:700;
  font-size:88px; line-height:1;
  color:transparent; -webkit-text-stroke:1px rgba(232,105,42,.12); margin-bottom:4px;
  transition:-webkit-text-stroke-color .4s;
}
.tdp .impact-card:hover .ic-number { -webkit-text-stroke-color:rgba(232,105,42,.25); }
.tdp .ic-title {
  font-family:var(--font-playfair),'Playfair Display',serif; font-weight:600;
  font-size:26px; color:var(--white);
}
.tdp .ic-body {
  font-size:16px; line-height:1.75; color:var(--mist);
  margin-top:14px; font-weight:300; font-style:italic;
}
.tdp .ic-tags { margin-top:24px; display:flex; flex-wrap:wrap; gap:8px; }
.tdp .ic-tags span {
  font-family:'Space Mono',monospace; font-size:9px;
  letter-spacing:.15em; text-transform:uppercase;
  padding:4px 12px; border:1px solid rgba(232,105,42,.2); color:var(--ember);
}

/* ── PRINCIPLES ── */
.tdp #principles { background:var(--deep); }
.tdp .principles-stack { display:flex; flex-direction:column; gap:2px; }
.tdp .principle-row {
  display:grid; grid-template-columns:100px 1fr 1fr;
  background:var(--card); border:1px solid var(--line); overflow:hidden;
  opacity:0; transform:translateX(-24px);
  transition:opacity .7s ease,transform .7s ease,border-color .3s; cursor:none;
}
.tdp .principle-row.visible { opacity:1; transform:none; }
.tdp .principle-row:hover { border-color:rgba(232,105,42,.3); }
.tdp .pr-num-cell {
  padding:32px 24px; border-right:1px solid var(--line);
  display:flex; align-items:center; justify-content:center;
  font-family:var(--font-playfair),'Playfair Display',serif; font-weight:700;
  font-size:36px; color:rgba(232,105,42,.25); transition:color .3s;
}
.tdp .principle-row:hover .pr-num-cell { color:var(--ember); }
.tdp .pr-principle {
  padding:32px 40px; border-right:1px solid var(--line);
  font-family:var(--font-playfair),'Playfair Display',serif; font-weight:600;
  font-size:19px; color:var(--white); display:flex; align-items:center;
}
.tdp .pr-application {
  padding:32px 40px; font-size:14px; line-height:1.7; color:var(--mist);
  font-weight:300; font-style:italic; display:flex; align-items:center;
}

/* ── STATEMENT ── */
.tdp #statement {
  background:var(--ember); padding:120px 60px;
  position:relative; overflow:hidden;
}
.tdp #statement::before {
  content:'TRANSFORM';
  position:absolute; top:50%; left:50%;
  transform:translate(-50%,-50%);
  font-family:var(--font-playfair),'Playfair Display',serif; font-weight:700;
  font-size:clamp(80px,14vw,180px);
  color:transparent; -webkit-text-stroke:1px rgba(7,8,10,.1);
  white-space:nowrap; pointer-events:none; user-select:none; letter-spacing:-.03em;
}
.tdp .statement-inner { max-width:880px; margin:0 auto; position:relative; z-index:2; }
.tdp .stmt-quote {
  font-family:var(--font-cormorant),'Cormorant Garamond',serif;
  font-size:clamp(28px,4vw,52px);
  font-weight:300; font-style:italic; color:var(--void); line-height:1.25;
}
.tdp .stmt-quote strong { font-style:normal; font-weight:700; }
.tdp .stmt-attr {
  margin-top:36px; font-family:'Space Mono',monospace; font-size:10px;
  letter-spacing:.3em; text-transform:uppercase; color:rgba(7,8,10,.5);
}
.tdp .stmt-verse {
  margin-top:48px; padding:28px 36px;
  border:1px solid rgba(7,8,10,.15); background:rgba(7,8,10,.08);
}
.tdp .sv-text {
  font-family:var(--font-cormorant),'Cormorant Garamond',serif; font-size:19px;
  font-style:italic; color:rgba(7,8,10,.8); line-height:1.55;
}
.tdp .sv-ref {
  font-family:'Space Mono',monospace; font-size:9px;
  letter-spacing:.2em; text-transform:uppercase; color:rgba(7,8,10,.45); margin-top:10px;
}

/* ── VISION FORWARD ── */
.tdp #vision { background:var(--void); padding:110px 60px; }
.tdp .vision-layout {
  display:grid; grid-template-columns:1fr 1fr; gap:2px;
}
.tdp .vision-card {
  padding:56px 52px; background:var(--card); border:1px solid var(--line);
  position:relative; overflow:hidden;
  opacity:0; transform:translateY(24px);
  transition:opacity .8s ease, transform .8s ease, border-color .4s; cursor:none;
}
.tdp .vision-card.visible { opacity:1; transform:none; }
.tdp .vision-card:hover { border-color:rgba(232,105,42,.25); }
.tdp .vision-card.featured { grid-column:span 2; background:var(--surface); padding:64px; }
.tdp .vc-eyebrow {
  font-family:'Space Mono',monospace; font-size:9px;
  letter-spacing:.3em; text-transform:uppercase; color:var(--ember); margin-bottom:20px;
}
.tdp .vc-title {
  font-family:var(--font-playfair),'Playfair Display',serif; font-weight:700;
  font-size:clamp(24px,3vw,40px); color:var(--white); line-height:1.05;
}
.tdp .vc-body {
  font-size:16px; line-height:1.75; color:var(--mist);
  margin-top:18px; font-weight:300; font-style:italic;
}
.tdp .vc-cta {
  margin-top:32px; display:inline-flex; align-items:center; gap:12px;
  font-family:'Space Mono',monospace; font-size:10px;
  letter-spacing:.2em; text-transform:uppercase; color:var(--ember);
  text-decoration:none; transition:gap .3s; cursor:none;
}
.tdp .vc-cta:hover { gap:20px; }
.tdp .vc-cta::after { content:'→'; }

/* ── CONNECT ── */
.tdp #connect {
  background:var(--deep); padding:90px 60px;
  display:flex; justify-content:space-between; align-items:center;
  gap:60px; flex-wrap:wrap;
}
.tdp .ct-title {
  font-family:var(--font-playfair),'Playfair Display',serif; font-weight:700;
  font-size:clamp(40px,6vw,80px); line-height:.9; color:var(--white);
}
.tdp .ct-title span { color:var(--ember); display:block; }
.tdp .ct-sub {
  font-size:17px; font-style:italic; font-weight:300;
  color:var(--mist); margin-top:20px; max-width:440px; line-height:1.6;
}
.tdp .ct-links { display:flex; flex-direction:column; gap:2px; min-width:300px; }
.tdp .ct-link {
  display:flex; justify-content:space-between; align-items:center;
  padding:24px 30px; background:var(--card); border:1px solid var(--line);
  color:var(--white); text-decoration:none;
  font-family:var(--font-playfair),'Playfair Display',serif; font-weight:600; font-size:17px;
  transition:background .3s, border-color .3s, padding-left .3s; cursor:none;
}
.tdp .ct-link:hover { background:var(--ember); border-color:var(--ember); color:var(--void); padding-left:42px; }
.tdp .ct-link span { font-size:16px; transition:transform .3s; }
.tdp .ct-link:hover span { transform:translateX(4px); }

/* ── FOOTER ── */
.tdp footer {
  background:var(--void); border-top:1px solid var(--line);
  padding:28px 60px; display:flex; justify-content:space-between; align-items:center;
}
.tdp .f-name {
  font-family:var(--font-playfair),'Playfair Display',serif; font-weight:600;
  font-size:13px; letter-spacing:.08em; color:var(--white);
}
.tdp .f-copy {
  font-family:'Space Mono',monospace; font-size:9px;
  letter-spacing:.2em; color:var(--mist); text-transform:uppercase;
}
.tdp .f-back {
  font-family:'Space Mono',monospace; font-size:9px;
  letter-spacing:.2em; color:var(--ember); text-decoration:none; text-transform:uppercase;
}

/* ── RESPONSIVE ── */
@media(max-width:960px){
  .tdp nav { padding:0 24px; }
  .tdp .section,.tdp #hero,.tdp #statement,.tdp #connect,.tdp footer { padding-left:24px; padding-right:24px; }
  .tdp .impact-grid { grid-template-columns:1fr; }
  .tdp .principle-row { grid-template-columns:60px 1fr; }
  .tdp .pr-application { display:none; }
  .tdp .vision-layout { grid-template-columns:1fr; }
  .tdp .vision-card.featured { grid-column:span 1; }
  .tdp #connect { flex-direction:column; }
  .tdp .jt-spine { display:none; }
  .tdp .jt-row { grid-template-columns:1fr; min-height:auto; }
  .tdp .jt-center { display:none; }
  .tdp .jt-left { text-align:left; padding:28px 28px 4px; border:1px solid var(--line); }
  .tdp .jt-right { padding:4px 28px 28px; border:1px solid var(--line); border-top:none; }
  .tdp .hero-stats { flex-direction:column; width:100%; }
  .tdp .hs-item { border-right:none; border-bottom:1px solid var(--line); }
  .tdp footer { flex-direction:column; gap:12px; text-align:center; padding:20px; }
}
`;

export default function TransformationPage() {
  useEffect(() => {
    document.body.classList.add("on-tdp");
    return () => document.body.classList.remove("on-tdp");
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(
      ".tdp .jt-row, .tdp .impact-card, .tdp .principle-row, .tdp .vision-card"
    ).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="tdp">
      <style>{css}</style>

      {/* NAV */}
      <nav>
        <Link href="/" className="nav-back">Portfolio</Link>
        <div className="nav-logo">Samuel Gyasi</div>
        <div className="nav-pill">Transformation</div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <svg className="morph-bg" width="600" height="600" viewBox="0 0 600 600">
          <path className="morph-path" d="M300,100 C400,50 500,150 480,280 C460,400 360,450 260,420 C160,390 80,310 100,200 C120,90 200,150 300,100Z" />
          <path className="morph-path2" d="M280,120 C380,60 490,130 470,270 C450,400 370,440 250,410 C130,380 70,300 100,190 C130,80 180,180 280,120Z" />
          <circle cx="300" cy="300" r="220" fill="none" stroke="#e8692a" strokeWidth=".4" opacity=".04" />
          <circle cx="300" cy="300" r="160" fill="none" stroke="#e8692a" strokeWidth=".4" opacity=".03" />
        </svg>

        <div className="hero-ticker">∞</div>

        <div className="hero-content">
          <div className="hero-eyebrow">Transformation · Change · Impact · Legacy</div>
          <h1 className="hero-title">
            Trans-<br />
            <span className="line2">formation</span>
          </h1>
          <div className="hero-premise">
            <div className="hp-bar" />
            <div className="hp-text">Not an event. Not a moment. A continuous, deliberate unfolding — of self, of community, of the future Africa deserves to inhabit.</div>
          </div>
          <div className="hero-stats">
            {[
              { val: "3", label: "Countries Crossed" },
              { val: "15+", label: "Years of Growth" },
              { val: "4", label: "Scholarships Earned" },
              { val: "8+", label: "Communities Served" },
            ].map((s) => (
              <div className="hs-item" key={s.label}>
                <div className="hs-val">{s.val}</div>
                <div className="hs-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY TIMELINE */}
      <section id="journey" className="section">
        <div className="s-eyebrow">The Arc of Becoming</div>
        <h2 className="s-title">From <em>Seed</em> to <em>Storm</em></h2>
        <div className="journey-timeline">
          <div className="jt-spine" />
          {[
            { side: "left", phase: "Origin · 2009–2011", heading: "The First Leadership Step", body: "As Class Prefect at Ghana-China Friendship School, a child from Mpohor learns that service is the highest form of power. The seed of a leader is planted." },
            { side: "right", phase: "Expansion · 2016–2017", heading: "Responsibility Scales", body: "Dining Hall Prefect at Saint John's School, then Managing Director of Cash Washing Bay — learning that transformation requires managing complexity, not avoiding it." },
            { side: "left", phase: "Crossing · 2020", heading: "Ghana to Morocco", body: "A Government of Ghana Scholarship takes Samuel across the Sahara. The discomfort of displacement becomes a forge — reshaping assumptions, expanding vision, deepening resilience." },
            { side: "right", phase: "Mastery · 2022–2023", heading: "Technical Foundation Built", body: "Professional Bachelor in Computer Science completed. Full Stack Developer internship at Octobot. The intellectual infrastructure for transformation is assembled piece by piece." },
            { side: "left", phase: "Elevation · 2023–Present", heading: "Collective Intelligence", body: "IBN ROCHD Scholarship. MSc at UM6P. School Ambassador. Student Representative. The personal transformation becomes institutional — Samuel is now building systems that will outlast him." },
            { side: "right", phase: "Presidency · 2024–Present", heading: "Leading the Consortium", body: "President, Collective Intelligence Consortium. Academic Affairs Delegate, International Students Club. Financial Secretary, Ghanaian Students Association. A vision becomes an organisation. An organisation becomes a movement." },
            { side: "left", phase: "Horizon · What Comes Next", heading: "Africa. Technology. People.", body: "The destination is not a title or a degree. It is a continent of people equipped to think, lead, and transform their own realities — with Samuel as one of the builders.", special: true },
          ].map((row, i) => (
            <div className="jt-row" key={i}>
              {row.side === "left" ? (
                <>
                  <div className="jt-left" style={row.special ? { borderColor: "rgba(232,105,42,.2)" } : undefined}>
                    <div className="jt-phase" style={row.special ? { color: "var(--mist)" } : undefined}>{row.phase}</div>
                    <div className="jt-heading" style={row.special ? { color: "var(--ember)" } : undefined}>{row.heading}</div>
                    <div className="jt-body">{row.body}</div>
                  </div>
                  <div className="jt-center">
                    <div className="jt-node" style={row.special ? { borderColor: "var(--ember)", background: "var(--ember)", boxShadow: "0 0 20px rgba(232,105,42,.5)" } : undefined} />
                  </div>
                  <div className="jt-blank" />
                </>
              ) : (
                <>
                  <div className="jt-blank" />
                  <div className="jt-center"><div className="jt-node" /></div>
                  <div className="jt-right">
                    <div className="jt-phase">{row.phase}</div>
                    <div className="jt-heading">{row.heading}</div>
                    <div className="jt-body">{row.body}</div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* IMPACT AREAS */}
      <section id="impact" className="section">
        <div className="s-eyebrow">Where Change Happens</div>
        <h2 className="s-title">Domains of <em>Impact</em></h2>
        <div className="impact-grid">
          {[
            { num: "01", title: "Community Leadership", body: "Across every institution Samuel has entered — from Ghanaian schools to Moroccan universities — he has built structures that outlast his tenure: student bodies, delegations, and clubs that carry communities forward.", tags: ["Prefect", "President", "Representative", "Delegate"] },
            { num: "02", title: "Intellectual Empowerment", body: "By mastering data science, research methodology, and collective intelligence, Samuel builds the intellectual tools others need to solve their own problems — not dependency, but capability.", tags: ["Data Science", "Research", "Teaching"] },
            { num: "03", title: "Cross-Cultural Bridge", body: "As a Ghanaian in Morocco, Samuel navigates two worlds fluently — building bridges between African and North African student communities, between traditional values and global ambitions, between past and future.", tags: ["Ghana", "Morocco", "Diaspora"] },
            { num: "04", title: "Institutional Transformation", body: "Real transformation is systemic. Samuel's work in university governance, student representation, and consortium leadership creates the conditions for lasting change — structures that carry vision far beyond a single person.", tags: ["Governance", "Systems", "Strategy"] },
          ].map((c) => (
            <div className="impact-card" key={c.num}>
              <div className="ic-number">{c.num}</div>
              <div className="ic-title">{c.title}</div>
              <div className="ic-body">{c.body}</div>
              <div className="ic-tags">{c.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRINCIPLES OF CHANGE */}
      <section id="principles" className="section">
        <div className="s-eyebrow">The Philosophy of Becoming</div>
        <h2 className="s-title">Principles of <em>Change</em></h2>
        <div className="principles-stack">
          {[
            { num: "I",   p: "Transformation begins from within",     a: "No external structure can produce lasting change unless the person at its centre has been transformed first. Samuel starts with himself — and invites others to do the same." },
            { num: "II",  p: "Discomfort is the curriculum",           a: "Every crossing — Ghana to Morocco, undergraduate to graduate, follower to leader — came with friction. That friction was not an obstacle to transformation. It was the mechanism of it." },
            { num: "III", p: "Scholarship is stewardship",             a: "Four fully-funded scholarships are not personal achievements. They are resources entrusted for a purpose larger than the recipient. Every benefit received creates an obligation to give." },
            { num: "IV",  p: "Technology must serve people",           a: "Collective Intelligence is not studied for its abstraction — it is applied to the concrete problem of how communities can make better decisions and lift more people out of ignorance and exclusion." },
            { num: "V",   p: "Legacy is the only metric that matters", a: "What structures will remain? What minds will be sharper? What communities will be stronger? These are the questions Samuel measures his work against — not titles, not applause." },
            { num: "VI",  p: "Africa's future is being written now",   a: "The decisions made today — in universities, in research labs, in student councils — become the infrastructure of tomorrow's continent. Samuel is conscious of the moment he is living in, and refuses to waste it." },
          ].map((r) => (
            <div className="principle-row" key={r.num}>
              <div className="pr-num-cell">{r.num}</div>
              <div className="pr-principle">{r.p}</div>
              <div className="pr-application">{r.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CENTRAL STATEMENT */}
      <section id="statement">
        <div className="statement-inner">
          <blockquote className="stmt-quote">
            &ldquo;I am not the finished product.<br />
            I am the <strong>work in progress</strong> —<br />
            and that is exactly where<br />
            the transformation is <strong>most alive</strong>.&rdquo;
          </blockquote>
          <div className="stmt-attr">— Samuel Kobina Gyasi</div>
          <div className="stmt-verse">
            <p className="sv-text">&ldquo;And we all, who with unveiled faces contemplate the Lord&rsquo;s glory, are being transformed into his image with ever-increasing glory, which comes from the Lord, who is the Spirit.&rdquo;</p>
            <p className="sv-ref">2 Corinthians 3:18 · The transformational anchor</p>
          </div>
        </div>
      </section>

      {/* VISION FORWARD */}
      <section id="vision" className="section">
        <div className="s-eyebrow">What Samuel Is Building Toward</div>
        <h2 className="s-title">The <em>Vision</em> Forward</h2>
        <div className="vision-layout">
          <div className="vision-card featured">
            <div className="vc-eyebrow">The Grand Mission</div>
            <div className="vc-title">An Africa where collective intelligence<br />replaces collective helplessness</div>
            <div className="vc-body">Samuel&rsquo;s graduate research in Collective Intelligence is not academic exercise — it is preparation for a life&rsquo;s work. He envisions communities across Africa equipped with the tools, the frameworks, and the leadership structures to solve their own problems, govern themselves wisely, and take their full place in the global future.</div>
          </div>
          <div className="vision-card">
            <div className="vc-eyebrow">Near-Term</div>
            <div className="vc-title">Complete the MSc. Build the Research.</div>
            <div className="vc-body">Graduate with distinction. Produce research that contributes meaningfully to collective decision-making science. Build a track record of rigour that opens every door.</div>
            <Link href="/intellectuality" className="vc-cta">Intellectuality Page</Link>
          </div>
          <div className="vision-card">
            <div className="vc-eyebrow">Mid-Term</div>
            <div className="vc-title">Lead Institutions That Matter</div>
            <div className="vc-body">Move from student leadership to institutional leadership — at the intersection of technology, governance, and community empowerment. Drive policy and practice that transforms from the inside out.</div>
            <Link href="/leadership" className="vc-cta">Leadership Page</Link>
          </div>
          <div className="vision-card">
            <div className="vc-eyebrow">Long-Term</div>
            <div className="vc-title">Build Structures That Outlast</div>
            <div className="vc-body">Organisations, frameworks, and communities that do not require Samuel to function. The truest measure of a transformational leader: the work continues and deepens long after they have stepped back.</div>
            <Link href="/faith" className="vc-cta">Faith &amp; Beliefs</Link>
          </div>
        </div>
      </section>

      {/* CONNECT */}
      <section id="connect">
        <div>
          <h2 className="ct-title">
            Ready to<br />
            <span>Transform</span><br />
            Together?
          </h2>
          <p className="ct-sub">If you are building something that matters — in technology, governance, education, or community — Samuel wants to be part of that conversation.</p>
        </div>
        <div className="ct-links">
          <a href="mailto:samuel.gyasi@um6p.ma" className="ct-link">Email Samuel <span>→</span></a>
          <Link href="/leadership" className="ct-link">Leadership <span>→</span></Link>
          <Link href="/faith" className="ct-link">Faith &amp; Beliefs <span>→</span></Link>
          <Link href="/intellectuality" className="ct-link">Intellectuality <span>→</span></Link>
          <Link href="/" className="ct-link">Full Portfolio <span>→</span></Link>
        </div>
      </section>

      {/* FOOTER */}
      <TestimonialsClient />
      <Suspense fallback={null}><SiteFooter /></Suspense>
    </div>
  );
}
