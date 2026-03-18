"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { TestimonialsClient } from "@/components/organisms/TestimonialsClient";
import type { Lang } from "./translations";

/* ── Atomic / Molecular components ── */
import { FaithParticles }  from "./atoms/FaithParticles";
import { FaithNav }        from "./molecules/FaithNav";
import { FaithHero }       from "./molecules/FaithHero";
import { FaithBeliefs }    from "./molecules/FaithBeliefs";
import { FaithJourney }    from "./molecules/FaithJourney";
import { FaithScriptures } from "./molecules/FaithScriptures";
import { FaithPractice }   from "./molecules/FaithPractice";
import { FaithReflection } from "./molecules/FaithReflection";
import { FaithBlogStrip }  from "./molecules/FaithBlogStrip";
import { FaithConnect }    from "./molecules/FaithConnect";

const css = `
/* ── DESIGN TOKENS ── */
.fdp {
  --bg:     #080807;
  --bg2:    #0e0d0b;
  --white:  #f0ece4;
  --cream:  #e8e0d0;
  --gold:   #c9a84c;
  --gold2:  #a8863a;
  --gold-grad: linear-gradient(90deg,#ffde59,#ff914d);
  --dim:    #7a7060;
  --dimmer: #3e3830;
  --line:   rgba(240,236,228,.06);
  --card:   #111009;
  min-height: 100vh;
  position: relative;
}

/* ── LANG TOGGLE ── */
.fdp-lang-toggle {
  background: transparent;
  border: 1px solid rgba(255,222,89,0.3);
  border-radius: 4px;
  padding: 4px 10px;
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: .16em;
  color: var(--dim);
  cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  transition: border-color .25s, color .25s;
}
.fdp-lang-toggle:hover { border-color: #ffde59; color: #ffde59; }
.fdp-lang-toggle .active {
  background: linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}
.fdp-lang-toggle .sep { opacity: .35; }

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
  background:linear-gradient(90deg,#ffde59,#ff914d);opacity:0;
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
  background:rgba(6,6,5,.96);backdrop-filter:blur(18px);
  -webkit-backdrop-filter:blur(18px);
  border-bottom:1px solid rgba(255,222,89,.08);
}
.fdp .nav-back {
  font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.22em;
  text-transform:uppercase;color:var(--dim);text-decoration:none;
  display:flex;align-items:center;gap:10px;transition:color .3s;
}
.fdp .nav-back:hover { color:#ffde59; }
.fdp .nav-back::before { content:'←';font-size:13px; }
.fdp .nav-logo {
  font-family:var(--font-playfair),'Playfair Display',serif;font-size:17px;
  color:var(--white);letter-spacing:.06em;
}
.fdp .nav-tag {
  font-family:'Space Mono',monospace;font-size:10px;
  letter-spacing:.22em;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
  text-transform:uppercase;
}

/* ── NAV LINKS ── */
.fdp .nav-links {
  display:flex;align-items:center;gap:28px;
}
.fdp .nav-link {
  font-family:'Space Mono',monospace;font-size:9px;
  letter-spacing:.2em;text-transform:uppercase;
  color:var(--dim);text-decoration:none;
  transition:color .25s;
  position:relative;
  padding-bottom:2px;
}
.fdp .nav-link::after {
  content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  transform:scaleX(0);transform-origin:left;
  transition:transform .3s ease;
}
.fdp .nav-link:hover { color:#ffde59; }
.fdp .nav-link:hover::after { transform:scaleX(1); }
.fdp .nav-link--active {
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
.fdp .nav-link--active::after { transform:scaleX(1); }

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
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
  margin-bottom:24px;
  opacity:0;animation:fdp-rise .9s .2s ease forwards;
}
.fdp .hero-title {
  font-family:var(--font-playfair),'Playfair Display',serif;
  font-size:clamp(56px,9vw,130px);
  line-height:.9;color:var(--white);
  opacity:0;animation:fdp-rise .9s .4s ease forwards;
}
.fdp .hero-title em {
  font-style:italic;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
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
  border-left:3px solid transparent;
  border-image:linear-gradient(180deg,#ffde59,#ff914d) 1;
  max-width:640px;
  opacity:0;animation:fdp-rise .9s .8s ease forwards;
  background:rgba(255,222,89,.04);
}
.fdp .hero-verse p {
  font-family:var(--font-playfair),'Playfair Display',serif;font-size:20px;
  font-style:italic;color:var(--cream);line-height:1.55;
}
.fdp .hero-verse cite {
  display:block;margin-top:12px;
  font-family:'Space Mono',monospace;font-size:9px;
  letter-spacing:.2em;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
  text-transform:uppercase;
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

/* ── CREED DECLARATION STRIP ── */
.fdp .fdp-creed-strip {
  background:var(--bg2);
  padding:40px 56px;
  border-top:1px solid var(--line);
  border-bottom:1px solid var(--line);
  overflow:hidden;
}
.fdp .fcs-inner {
  display:flex;justify-content:center;align-items:center;
  gap:36px;flex-wrap:wrap;
  font-family:'Space Mono',monospace;font-size:9px;
  letter-spacing:.35em;text-transform:uppercase;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
.fdp .fcs-dot { opacity:.3; }
@media(max-width:600px){
  .fdp .fdp-creed-strip { padding:28px 24px; }
  .fdp .fcs-inner { gap:18px;font-size:8px; }
}

/* ── SHARED SECTION ── */
.fdp .section { padding:120px 56px;position:relative;z-index:1; }
.fdp .s-label {
  font-family:'Space Mono',monospace;font-size:9px;
  letter-spacing:.35em;text-transform:uppercase;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
  margin-bottom:56px;
  display:flex;align-items:center;gap:16px;
}
.fdp .s-label::before { content:'';width:36px;height:1px;background:linear-gradient(90deg,#ffde59,#ff914d); }

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
.fdp .belief-card:hover { border-color:rgba(255,222,89,.2); }
.fdp .belief-card::after {
  content:'';
  position:absolute;bottom:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,#ffde59,#ff914d,transparent);
  opacity:0;transition:opacity .4s;
}
.fdp .belief-card:hover::after { opacity:.5; }
.fdp .bc-number {
  font-family:var(--font-playfair),'Playfair Display',serif;font-size:80px;
  color:transparent;-webkit-text-stroke:1px rgba(201,168,76,.2);
  line-height:1;margin-bottom:8px;
}
.fdp .bc-title {
  font-family:var(--font-playfair),'Playfair Display',serif;font-size:32px;
  color:var(--white);line-height:1.1;margin-top:4px;
}
.fdp .bc-body {
  font-size:16px;line-height:1.8;color:var(--dim);
  margin-top:16px;font-weight:300;
}
.fdp .bc-verse {
  margin-top:24px;
  font-family:var(--font-playfair),'Playfair Display',serif;font-size:14px;
  font-style:italic;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
  opacity:.9;line-height:1.5;
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
.fdp .journey-headline em { font-style:italic;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
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
.fdp .journey-entry:hover { border-left-color:#ffde59;background:#141210; }
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
  border-left:2px solid rgba(255,222,89,.3);
  font-family:var(--font-playfair),'Playfair Display',serif;font-style:italic;
  font-size:14px;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
  opacity:.85;line-height:1.55;
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
.fdp .sm-card:hover { border-color:rgba(255,222,89,.2); }
.fdp .sm-text {
  font-family:var(--font-playfair),'Playfair Display',serif;
  font-size:clamp(16px,1.6vw,22px);
  font-style:italic;color:var(--cream);
  line-height:1.55;flex:1;
}
.fdp .sm-ref {
  font-family:'Space Mono',monospace;font-size:9px;
  letter-spacing:.2em;text-transform:uppercase;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
  margin-top:20px;
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
.fdp .pr-item:hover { border-color:rgba(255,222,89,.2); }
.fdp .pr-num {
  padding:36px 24px;
  font-family:var(--font-playfair),'Playfair Display',serif;font-size:40px;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
  opacity:.4;border-right:1px solid var(--line);
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
  padding:140px 56px;
}
.fdp .reflection-inner { max-width:780px;margin:0 auto; }
.fdp .refl-ornament {
  font-size:32px;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
  opacity:.6;
  margin-bottom:40px;letter-spacing:.4em;
  animation:fdp-shimmer 4s ease-in-out infinite;
}
@keyframes fdp-shimmer {
  0%,100%{opacity:.3;} 50%{opacity:.7;}
}
.fdp .refl-quote {
  font-family:var(--font-playfair),'Playfair Display',serif;
  font-size:clamp(28px,3.8vw,50px);
  font-style:italic;color:var(--white);
  line-height:1.25;
}
.fdp .refl-quote strong {
  font-style:normal;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
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
.fdp .connect-title em {
  font-style:italic;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
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

/* ── RESPONSIVE ── */
/* ── BLOG STRIP ── */
.fdp .blog-strip {
  background:var(--bg2);
  padding:80px 56px;
  text-align:center;
  display:flex; flex-direction:column; align-items:center; gap:20px;
  position:relative; z-index:1;
  border-top:1px solid var(--line);
}
.fdp .bs-eyebrow {
  font-family:'Space Mono',monospace; font-size:9px;
  letter-spacing:.35em; text-transform:uppercase;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
  display:flex; align-items:center; gap:16px;
}
.fdp .bs-eyebrow::before,.fdp .bs-eyebrow::after {
  content:''; width:36px; height:1px;
  background:linear-gradient(90deg,#ffde59,#ff914d);
}
.fdp .bs-title {
  font-family:var(--font-playfair),'Playfair Display',serif;
  font-size:clamp(30px,4vw,52px); color:var(--white); line-height:1.05;
}
.fdp .bs-title em { font-style:italic;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
.fdp .bs-sub {
  font-size:17px; font-style:italic; color:var(--dim);
  max-width:480px; line-height:1.6;
}
.fdp .bs-btns {
  display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-top:8px;
}
.fdp .bs-btn {
  font-family:'Space Mono',monospace; font-size:10px;
  letter-spacing:.22em; text-transform:uppercase;
  padding:14px 32px;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  color:#0a0a0a;
  text-decoration:none; transition:opacity .25s;
  cursor:none;
}
.fdp .bs-btn:hover { opacity:.8; }
.fdp .bs-btn.ghost {
  background:transparent; color:#ffde59; border:1px solid #ffde59;
}
.fdp .bs-btn.ghost:hover { background:linear-gradient(90deg,#ffde59,#ff914d); color:#0a0a0a; border-color:transparent; }

@media(max-width:900px){
  .fdp nav { padding:18px 24px; }
  .fdp .nav-links { display:none; }
  .fdp .section,.fdp .hero-text { padding-left:24px;padding-right:24px; }
  .fdp .beliefs-grid { grid-template-columns:1fr; }
  .fdp .journey-layout { grid-template-columns:1fr; }
  .fdp .journey-left { position:static; }
  .fdp .scripture-mosaic { grid-template-columns:1fr; }
  .fdp .sm-wide,.fdp .sm-tall { grid-column:span 1;grid-row:span 1; }
  .fdp .pr-item { grid-template-columns:60px 1fr; }
  .fdp .pr-desc { display:none; }
  .fdp #connect { flex-direction:column; }
  .fdp #reflection { padding:80px 24px; }
  .fdp .hero-scroll-hint { display:none; }
  .fdp .blog-strip { padding:60px 24px; }
}
`;

export default function FaithPage() {
  const [lang, setLang] = useState<Lang>("en");
  const sectionRef = useRef<HTMLDivElement>(null);
  const toggleLang = () => setLang((l) => (l === "en" ? "fr" : "en"));

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
  }, [lang]);

  return (
    <div className="fdp" ref={sectionRef}>
      <style>{css}</style>

      {/* ── Ambient particles ── */}
      <FaithParticles />

      {/* ── Navigation ── */}
      <FaithNav lang={lang} onToggleLang={toggleLang} />

      {/* ── Hero ── */}
      <FaithHero lang={lang} />

      {/* ── Creed Declaration Strip ── */}
      <div className="fdp-creed-strip">
        <div className="fcs-inner">
          <span>Rooted in the Word</span>
          <span className="fcs-dot">·</span>
          <span>Shaped by Prayer</span>
          <span className="fcs-dot">·</span>
          <span>Called to Serve</span>
          <span className="fcs-dot">·</span>
          <span>Living by Grace</span>
        </div>
      </div>

      {/* ── Core Beliefs ── */}
      <FaithBeliefs lang={lang} />

      {/* ── Spiritual Journey ── */}
      <FaithJourney lang={lang} />

      {/* ── Scripture Gallery ── */}
      <FaithScriptures lang={lang} />

      {/* ── Pillars of Practice ── */}
      <FaithPractice lang={lang} />

      {/* ── Central Reflection ── */}
      <FaithReflection lang={lang} />

      {/* ── Blog Strip ── */}
      <FaithBlogStrip lang={lang} />

      {/* ── Connect ── */}
      <FaithConnect lang={lang} />

      {/* ── Testimonials & Footer ── */}
      <TestimonialsClient />
      <Suspense fallback={null}><SiteFooter /></Suspense>
    </div>
  );
}
