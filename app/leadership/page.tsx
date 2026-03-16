"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { TestimonialsClient } from "@/components/organisms/TestimonialsClient";

const css = `
/* ── DESIGN TOKENS (scoped) ── */
.ldp {
  --bg: #0c0b09;
  --white: #f0ede8;
  --gold: #c8a84b;
  --gray: #6b6560;
  --gray-light: #a09890;
  --line: rgba(240,237,232,0.07);
  --card-bg: #141210;
  min-height: 100vh;
  position: relative;
}

/* ── BODY OVERRIDES ── */
body.on-ldp {
  background: #0c0b09;
  color: #f0ede8;
  font-family: 'Cormorant Garamond', serif;
}
body.on-ldp .cursor {
  background: #c8a84b;
  mix-blend-mode: normal;
  border-radius: 50%;
  width: 8px;
  height: 8px;
}
body.on-ldp .cursor-ring {
  border-color: rgba(200,168,75,0.4);
  mix-blend-mode: normal;
  border-radius: 50%;
  width: 32px;
  height: 32px;
}

/* ── NOISE OVERLAY ── */
.ldp-noise {
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: .03; pointer-events: none; z-index: 0;
}

/* ── NAV ── */
.ldp nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; justify-content: space-between; align-items: center;
  padding: 22px 56px;
  border-bottom: 1px solid var(--line);
  background: rgba(12,11,9,.85);
  backdrop-filter: blur(12px);
}
.ldp .nav-back {
  font-family: 'DM Mono', monospace; font-size: 11px;
  letter-spacing: .2em; text-transform: uppercase;
  color: var(--gray-light); text-decoration: none;
  display: flex; align-items: center; gap: 10px; transition: color .3s;
}
.ldp .nav-back:hover { color: var(--gold); }
.ldp .nav-back::before { content: '←'; font-size: 14px; }
.ldp .nav-title {
  font-family: 'Bebas Neue', sans-serif; font-size: 18px;
  letter-spacing: .2em; color: var(--white);
}
.ldp .nav-tag {
  font-family: 'DM Mono', monospace; font-size: 10px;
  letter-spacing: .2em; color: var(--gold); text-transform: uppercase;
}

/* ── HERO ── */
.ldp #hero {
  min-height: 100vh;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 120px 56px 80px;
  position: relative; overflow: hidden;
}
.ldp .hero-rings {
  position: absolute; top: 50%; left: 60%;
  transform: translate(-50%,-50%); pointer-events: none;
}
.ldp .hero-rings circle {
  fill: none; stroke: var(--gold); transform-origin: center;
}
.ldp .hero-rings circle:nth-child(1) { stroke-width: .5; opacity: .12; animation: ldp-ring-pulse 6s ease-in-out infinite; }
.ldp .hero-rings circle:nth-child(2) { stroke-width: .4; opacity: .08; animation: ldp-ring-pulse 6s ease-in-out infinite .8s; }
.ldp .hero-rings circle:nth-child(3) { stroke-width: .3; opacity: .05; animation: ldp-ring-pulse 6s ease-in-out infinite 1.6s; }
@keyframes ldp-ring-pulse {
  0%,100% { r: 200; opacity: .12; }
  50% { r: 240; opacity: .06; }
}
.ldp .hero-number {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(140px,18vw,240px);
  line-height: 1; color: transparent;
  -webkit-text-stroke: 1px rgba(200,168,75,.12);
  position: absolute; top: 80px; right: 40px;
  pointer-events: none; user-select: none; letter-spacing: -.02em;
}
.ldp .hero-label {
  font-family: 'DM Mono', monospace; font-size: 10px;
  letter-spacing: .35em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 20px;
  display: flex; align-items: center; gap: 14px;
  opacity: 0; animation: ldp-fade-up .8s .3s ease forwards;
}
.ldp .hero-label::before { content: ''; width: 36px; height: 1px; background: var(--gold); }
.ldp .ldp-hero-name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(64px,9vw,128px);
  line-height: .92; letter-spacing: .02em; color: var(--white);
  opacity: 0; animation: ldp-fade-up .8s .5s ease forwards;
}
.ldp .ldp-hero-name span { color: var(--gold); }
.ldp .hero-role {
  font-size: clamp(18px,2vw,24px); font-style: italic; font-weight: 300;
  color: var(--gray-light); margin-top: 20px; max-width: 600px; line-height: 1.5;
  opacity: 0; animation: ldp-fade-up .8s .7s ease forwards;
}
.ldp .hero-stats {
  display: flex; gap: 60px; margin-top: 56px;
  opacity: 0; animation: ldp-fade-up .8s .9s ease forwards;
}
.ldp .stat-num {
  font-family: 'Bebas Neue', sans-serif; font-size: 52px;
  color: var(--gold); line-height: 1; letter-spacing: .04em;
}
.ldp .stat-label {
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: .25em; text-transform: uppercase; color: var(--gray); margin-top: 4px;
}
.ldp .ldp-hero-divider {
  width: 100%; height: 1px; background: var(--line); margin-top: 56px;
  opacity: 0; animation: ldp-fade-up .8s 1.1s ease forwards;
}
@keyframes ldp-fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
}

/* ── SECTION BASE ── */
.ldp .section { padding: 100px 56px; position: relative; z-index: 1; }
.ldp .section-header {
  display: flex; align-items: center; gap: 20px; margin-bottom: 64px;
}
.ldp .section-num {
  font-family: 'Bebas Neue', sans-serif; font-size: 80px;
  color: transparent; -webkit-text-stroke: 1px rgba(200,168,75,.2); line-height: 1;
}
.ldp .section-tag {
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: .3em; text-transform: uppercase; color: var(--gold);
}
.ldp .section-title {
  font-family: 'Bebas Neue', sans-serif; font-size: clamp(32px,4vw,52px);
  letter-spacing: .05em; color: var(--white); line-height: 1;
}

/* ── TIMELINE ── */
.ldp #leadership { background: var(--bg); }
.ldp .timeline { position: relative; padding-left: 40px; }
.ldp .timeline::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0;
  width: 1px; background: var(--line);
}
.ldp .timeline-item {
  position: relative; margin-bottom: 4px;
  opacity: 0; transform: translateX(-16px);
  transition: opacity .7s ease, transform .7s ease;
}
.ldp .timeline-item.visible { opacity: 1; transform: none; }
.ldp .timeline-dot {
  position: absolute; left: -44px; top: 28px;
  width: 8px; height: 8px; border-radius: 50%;
  border: 1px solid var(--gold); background: var(--bg); transition: background .3s;
}
.ldp .timeline-item:hover .timeline-dot { background: var(--gold); }
.ldp .timeline-card {
  background: var(--card-bg); border: 1px solid var(--line);
  padding: 32px 36px; transition: border-color .3s, transform .3s; cursor: none;
}
.ldp .timeline-item:hover .timeline-card {
  border-color: rgba(200,168,75,.25); transform: translateX(6px);
}
.ldp .tl-period {
  font-family: 'DM Mono', monospace; font-size: 10px;
  letter-spacing: .2em; color: var(--gold); text-transform: uppercase; margin-bottom: 10px;
}
.ldp .tl-role {
  font-family: 'Bebas Neue', sans-serif; font-size: 28px;
  letter-spacing: .06em; color: var(--white); line-height: 1;
}
.ldp .tl-org { font-size: 16px; font-style: italic; color: var(--gray-light); margin-top: 6px; font-weight: 300; }
.ldp .tl-location {
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: .15em; color: var(--gray); text-transform: uppercase; margin-top: 4px;
}
.ldp .tl-badge {
  display: inline-block; margin-top: 14px; padding: 4px 12px;
  border: 1px solid rgba(200,168,75,.3);
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: .2em; text-transform: uppercase; color: var(--gold);
}

/* ── EXPERIENCE ── */
.ldp #experience { background: #0f0e0c; }
.ldp .exp-grid { display: flex; flex-direction: column; gap: 3px; }
.ldp .exp-card {
  background: var(--card-bg); border: 1px solid var(--line);
  padding: 40px 44px;
  display: grid; grid-template-columns: 200px 1fr; gap: 40px;
  opacity: 0; transform: translateY(20px);
  transition: opacity .7s, transform .7s, border-color .3s; cursor: none;
}
.ldp .exp-card.visible { opacity: 1; transform: none; }
.ldp .exp-card:hover { border-color: rgba(200,168,75,.2); }
.ldp .exp-period {
  font-family: 'DM Mono', monospace; font-size: 10px;
  letter-spacing: .15em; color: var(--gold); text-transform: uppercase;
  line-height: 1.7; padding-top: 4px;
}
.ldp .exp-role {
  font-family: 'Bebas Neue', sans-serif; font-size: 26px;
  letter-spacing: .06em; color: var(--white);
}
.ldp .exp-org { font-size: 16px; font-style: italic; color: var(--gray-light); margin-top: 4px; font-weight: 300; }
.ldp .exp-bullets {
  margin-top: 16px; list-style: none; display: flex; flex-direction: column; gap: 8px;
}
.ldp .exp-bullets li {
  font-size: 15px; line-height: 1.65; color: var(--gray-light); font-weight: 300;
  display: flex; gap: 12px; align-items: flex-start;
}
.ldp .exp-bullets li::before { content: '—'; color: var(--gold); opacity: .6; flex-shrink: 0; margin-top: 1px; }

/* ── EDUCATION ── */
.ldp #education { background: var(--bg); }
.ldp .edu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
.ldp .edu-card {
  background: var(--card-bg); border: 1px solid var(--line);
  padding: 40px 44px; opacity: 0; transform: translateY(20px);
  transition: opacity .7s, transform .7s, border-color .3s;
  position: relative; overflow: hidden; cursor: none;
}
.ldp .edu-card::before {
  content: ''; position: absolute; top: 0; left: 0;
  width: 3px; height: 100%; background: var(--gold); opacity: 0; transition: opacity .3s;
}
.ldp .edu-card:hover::before { opacity: 1; }
.ldp .edu-card.visible { opacity: 1; transform: none; }
.ldp .edu-degree {
  font-family: 'Bebas Neue', sans-serif; font-size: 24px;
  letter-spacing: .06em; color: var(--white); line-height: 1.1;
}
.ldp .edu-school { font-size: 15px; font-style: italic; color: var(--gold); margin-top: 8px; font-weight: 400; }
.ldp .edu-period {
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: .2em; color: var(--gray); text-transform: uppercase; margin-top: 6px;
}
.ldp .edu-location { font-size: 14px; color: var(--gray); margin-top: 4px; font-style: italic; }

/* ── AWARDS ── */
.ldp #awards { background: #0f0e0c; }
.ldp .awards-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 3px; }
.ldp .award-card {
  background: var(--card-bg); border: 1px solid var(--line);
  padding: 36px 40px; display: flex; gap: 24px; align-items: flex-start;
  opacity: 0; transform: translateY(20px);
  transition: opacity .7s, transform .7s, background .3s; cursor: none;
}
.ldp .award-card.visible { opacity: 1; transform: none; }
.ldp .award-card:hover { background: #1a1814; }
.ldp .award-icon {
  font-family: 'Bebas Neue', sans-serif; font-size: 40px;
  color: var(--gold); line-height: 1; flex-shrink: 0; opacity: .7;
}
.ldp .award-name {
  font-family: 'Bebas Neue', sans-serif; font-size: 20px;
  letter-spacing: .06em; color: var(--white); line-height: 1.1;
}
.ldp .award-desc {
  font-size: 13px; color: var(--gray-light); margin-top: 6px;
  line-height: 1.6; font-weight: 300; font-style: italic;
}

/* ── SKILLS ── */
.ldp #skills { background: var(--bg); }
.ldp .skills-layout { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3px; }
.ldp .skill-group {
  background: var(--card-bg); border: 1px solid var(--line); padding: 36px 40px;
  opacity: 0; transform: translateY(20px); transition: opacity .7s, transform .7s;
}
.ldp .skill-group.visible { opacity: 1; transform: none; }
.ldp .skill-group-title {
  font-family: 'Bebas Neue', sans-serif; font-size: 20px;
  letter-spacing: .1em; color: var(--gold); margin-bottom: 20px;
}
.ldp .skill-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.ldp .skill-list li {
  font-size: 14px; color: var(--gray-light);
  display: flex; align-items: center; gap: 10px; font-weight: 300;
}
.ldp .skill-list li::before { content: ''; width: 16px; height: 1px; background: var(--gold); opacity: .5; flex-shrink: 0; }

/* ── CERTIFICATIONS ── */
.ldp #certs { background: #0f0e0c; }
.ldp .certs-list { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
.ldp .cert-item {
  background: var(--card-bg); border: 1px solid var(--line);
  padding: 26px 32px; display: flex; justify-content: space-between; align-items: center;
  opacity: 0; transform: translateX(-16px);
  transition: opacity .6s, transform .6s, border-color .3s; cursor: none;
}
.ldp .cert-item.visible { opacity: 1; transform: none; }
.ldp .cert-item:hover { border-color: rgba(200,168,75,.25); }
.ldp .cert-name { font-size: 16px; color: var(--white); font-weight: 400; }
.ldp .cert-issuer {
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: .2em; color: var(--gold); text-transform: uppercase; margin-top: 4px;
}
.ldp .cert-status {
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: .1em; text-transform: uppercase;
  padding: 4px 10px; border: 1px solid; flex-shrink: 0;
}
.ldp .cert-status.done { color: var(--gold); border-color: rgba(200,168,75,.4); }
.ldp .cert-status.progress { color: var(--gray); border-color: var(--line); }

/* ── REFERENCES ── */
.ldp #references { background: var(--bg); }
.ldp .refs-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 3px; }
.ldp .ref-card {
  background: var(--card-bg); border: 1px solid var(--line); padding: 36px 40px;
  opacity: 0; transform: translateY(20px);
  transition: opacity .7s, transform .7s, border-color .3s; cursor: none;
}
.ldp .ref-card.visible { opacity: 1; transform: none; }
.ldp .ref-card:hover { border-color: rgba(200,168,75,.2); }
.ldp .ref-name {
  font-family: 'Bebas Neue', sans-serif; font-size: 22px;
  letter-spacing: .06em; color: var(--white);
}
.ldp .ref-role { font-size: 14px; font-style: italic; color: var(--gold); margin-top: 6px; font-weight: 300; line-height: 1.5; }
.ldp .ref-email { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--gray); margin-top: 12px; letter-spacing: .05em; }

/* ── CONTACT ── */
.ldp #contact {
  background: var(--white); color: var(--bg);
  padding: 80px 56px; display: flex; justify-content: space-between; align-items: center;
}
.ldp .contact-cta {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(40px,5vw,72px); letter-spacing: .04em; line-height: 1; color: var(--bg);
}
.ldp .contact-cta span { color: var(--gold); }
.ldp .contact-details { display: flex; flex-direction: column; gap: 16px; align-items: flex-end; }
.ldp .contact-item {
  font-family: 'DM Mono', monospace; font-size: 12px;
  letter-spacing: .15em; color: var(--bg); display: flex; align-items: center; gap: 12px;
}
.ldp .contact-item::before { content: ''; width: 20px; height: 1px; background: var(--gold); }

/* ── FOOTER ── */
.ldp footer {
  background: var(--bg); border-top: 1px solid var(--line);
  padding: 28px 56px; display: flex; justify-content: space-between; align-items: center;
}
.ldp .footer-name {
  font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: .15em; color: var(--white);
}
.ldp .footer-copy {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: .2em; color: var(--gray); text-transform: uppercase;
}
.ldp .footer-link {
  font-family: 'DM Mono', monospace; font-size: 9px;
  letter-spacing: .2em; color: var(--gold); text-transform: uppercase; text-decoration: none;
}

/* ── REVEAL ── */
.ldp .reveal { opacity: 0; transform: translateY(24px); transition: opacity .8s ease, transform .8s ease; }
.ldp .reveal.visible { opacity: 1; transform: none; }

/* ── RESPONSIVE ── */
@media(max-width:900px) {
  .ldp nav { padding: 18px 24px; }
  .ldp .section { padding: 70px 24px; }
  .ldp .exp-card { grid-template-columns: 1fr; gap: 12px; }
  .ldp .edu-grid, .ldp .awards-grid, .ldp .skills-layout, .ldp .certs-list, .ldp .refs-grid { grid-template-columns: 1fr; }
  .ldp #hero { padding: 100px 24px 60px; }
  .ldp .hero-stats { gap: 32px; flex-wrap: wrap; }
  .ldp #contact { flex-direction: column; gap: 40px; align-items: flex-start; }
  .ldp .contact-details { align-items: flex-start; }
  .ldp footer { padding: 24px; flex-direction: column; gap: 12px; }
}
`;

export default function LeadershipPage() {
  useEffect(() => {
    document.body.classList.add("on-ldp");

    const items = document.querySelectorAll(
      ".ldp .timeline-item, .ldp .exp-card, .ldp .edu-card, .ldp .award-card, .ldp .skill-group, .ldp .cert-item, .ldp .ref-card, .ldp .reveal"
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 60);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach((el) => io.observe(el));

    function animateCount(el: Element, target: number, suffix = "") {
      let start = 0;
      const dur = 1800;
      const step = dur / target;
      const timer = setInterval(() => {
        start++;
        el.textContent = start + suffix;
        if (start >= target) clearInterval(timer);
      }, step);
    }

    const statNums = document.querySelectorAll(".ldp .stat-num");
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const txt = e.target.textContent || "";
            const num = parseInt(txt);
            const suffix = txt.includes("+") ? "+" : "";
            animateCount(e.target, num, suffix);
            statObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNums.forEach((el) => statObserver.observe(el));

    return () => {
      document.body.classList.remove("on-ldp");
      io.disconnect();
      statObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Mono:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="ldp">
        <div className="ldp-noise" />

        {/* NAV */}
        <nav>
          <Link href="/" className="nav-back">Portfolio</Link>
          <div className="nav-title">Samuel Kobina Gyasi</div>
          <div className="nav-tag">Leadership</div>
        </nav>

        {/* HERO */}
        <section id="hero">
          <svg className="hero-rings" width="600" height="600" viewBox="0 0 600 600">
            <circle cx="300" cy="300" r="200" />
            <circle cx="300" cy="300" r="270" />
            <circle cx="300" cy="300" r="340" />
          </svg>
          <div className="hero-number">15</div>
          <div className="hero-label">Leadership Portfolio</div>
          <h1 className="ldp-hero-name">
            Samuel<br /><span>Kobina</span><br />Gyasi
          </h1>
          <p className="hero-role">
            Junior Program Officer · School of Collective Intelligence · UM6P · Researcher · Innovator
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">15+</div>
              <div className="stat-label">Years Leading</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">8</div>
              <div className="stat-label">Positions Held</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">4</div>
              <div className="stat-label">Scholarships</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">3</div>
              <div className="stat-label">Countries</div>
            </div>
          </div>
          <div className="ldp-hero-divider" />
        </section>

        {/* LEADERSHIP POSITIONS */}
        <section id="leadership" className="section">
          <div className="section-header reveal">
            <div className="section-num">01</div>
            <div className="section-meta">
              <div className="section-tag">Leadership Profile</div>
              <div className="section-title">Positions of Authority</div>
            </div>
          </div>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <div className="tl-period">October 2024 - October 2025</div>
                <div className="tl-role">President</div>
                <div className="tl-org">Collective Intelligence Consortium</div>
                <div className="tl-location">UM6P · Rabat, Morocco</div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <div className="tl-period">November 2024 - November 2025</div>
                <div className="tl-role">Academic Affairs Delegate</div>
                <div className="tl-org">International Students Club</div>
                <div className="tl-location">UM6P · Morocco</div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <div className="tl-period">September 2024 - August 2025</div>
                <div className="tl-role">Financial Secretary</div>
                <div className="tl-org">Ghanaian Students Association in Morocco</div>
                <div className="tl-location">Morocco</div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <div className="tl-period">December 2023 - September 2025</div>
                <div className="tl-role">School Ambassador</div>
                <div className="tl-org">School of Collective Intelligence</div>
                <div className="tl-location">UM6P · Rabat, Morocco</div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <div className="tl-period">October 2023 - September 2025</div>
                <div className="tl-role">Student Representative</div>
                <div className="tl-org">School of Collective Intelligence</div>
                <div className="tl-location">UM6P · Morocco</div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <div className="tl-period">Sep 2022 — Jun 2023</div>
                <div className="tl-role">Assistant Class Delegate</div>
                <div className="tl-org">Ecole Supérieure de Management de Commerce et d&apos;Informatique</div>
                <div className="tl-location">Fez, Morocco</div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <div className="tl-period">Feb 2016 — Feb 2017</div>
                <div className="tl-role">Dining Hall Prefect</div>
                <div className="tl-org">Saint John&apos;s School</div>
                <div className="tl-location">Sekondi-Takoradi, Ghana</div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <div className="tl-period">2009 — 2011</div>
                <div className="tl-role">Class Prefect</div>
                <div className="tl-org">Ghana-China Friendship School</div>
                <div className="tl-location">Mpohor, Western Province, Ghana</div>
              </div>
            </div>
          </div>
        </section>

        {/* WORK EXPERIENCE */}
        <section id="experience" className="section">
          <div className="section-header reveal">
            <div className="section-num">02</div>
            <div className="section-meta">
              <div className="section-tag">Professional Record</div>
              <div className="section-title">Work Experience</div>
            </div>
          </div>

          <div className="exp-grid">
            <div className="exp-card">
              <div className="exp-period">September 2025 —<br />Present</div>
              <div className="exp-content">
                <div className="exp-role">Junior Program Officer</div>
                <div className="exp-org">School of Collective Intelligence, University Mohammed VI Polytechnic · Rabat, Morocco</div>
                <ul className="exp-bullets">
                  <li>Design and coordinate programs fostering collective intelligence approaches within the School of Collective Intelligence.</li>
                  <li>Support research initiatives, stakeholder engagement, and capacity-building activities for students and faculty.</li>
                  <li>Collaborate with academic and administrative teams to advance the school&apos;s mission of transformative education.</li>
                </ul>
              </div>
            </div>

            <div className="exp-card">
              <div className="exp-period">Jul 2024 —<br />Sep 2024</div>
              <div className="exp-content">
                <div className="exp-role">Data Science Intern</div>
                <div className="exp-org">University Mohammed VI Polytechnic, College of Computing · Benguerrir, Morocco</div>
                <ul className="exp-bullets">
                  <li>Analyzed and processed Germany&apos;s weather and irradiation dataset using Python and Jupyter Notebook to derive actionable insights.</li>
                  <li>Applied advanced time series forecasting models — SARIMAX, ARIMAX, and SARIMA — to predict weather patterns and irradiation levels.</li>
                  <li>Collaborated with a co-intern to interpret results, refine methodologies, and support ongoing research initiatives.</li>
                </ul>
              </div>
            </div>

            <div className="exp-card">
              <div className="exp-period">Sep 2022 —<br />Dec 2022</div>
              <div className="exp-content">
                <div className="exp-role">Web Full Stack Developer Intern</div>
                <div className="exp-org">Octobot Consulting · Fez, Morocco</div>
              </div>
            </div>

            <div className="exp-card">
              <div className="exp-period">Sep 2021 —<br />Oct 2021</div>
              <div className="exp-content">
                <div className="exp-role">I.T Technical Support</div>
                <div className="exp-org">School of Engineering, SUP Management · Fez, Morocco</div>
              </div>
            </div>

            <div className="exp-card">
              <div className="exp-period">Jul 2017 —<br />Sep 2018</div>
              <div className="exp-content">
                <div className="exp-role">Managing Director</div>
                <div className="exp-org">Cash Washing Bay · Mpohor, Western Province, Ghana</div>
              </div>
            </div>
          </div>
        </section>

        {/* EDUCATION */}
        <section id="education" className="section">
          <div className="section-header reveal">
            <div className="section-num">03</div>
            <div className="section-meta">
              <div className="section-tag">Academic Background</div>
              <div className="section-title">Education</div>
            </div>
          </div>

          <div className="edu-grid">
            <div className="edu-card">
              <div className="edu-degree">MSc. Collective Intelligence</div>
              <div className="edu-school">University Mohammed VI Polytechnic</div>
              <div className="edu-period">Oct 2023 — September 2025 · Graduated</div>
              <div className="edu-location">Rabat, Morocco</div>
            </div>
            <div className="edu-card">
              <div className="edu-degree">Professional Bachelor in Computer Science</div>
              <div className="edu-school">Ecole Supérieure de Management de Commerce et d&apos;Informatique</div>
              <div className="edu-period">Sep 2020 — Jul 2023</div>
              <div className="edu-location">Fez, Morocco</div>
            </div>
          </div>
        </section>

        {/* AWARDS */}
        <section id="awards" className="section">
          <div className="section-header reveal">
            <div className="section-num">04</div>
            <div className="section-meta">
              <div className="section-tag">Recognition</div>
              <div className="section-title">Honours &amp; Awards</div>
            </div>
          </div>

          <div className="awards-grid">
            <div className="award-card">
              <div className="award-icon">◆</div>
              <div>
                <div className="award-name">IBN ROCHD Scholarship for Science &amp; Innovation</div>
                <div className="award-desc">Full Scholarship for Master&apos;s Level Study — Full Tuition, Accommodation &amp; Feeding</div>
              </div>
            </div>
            <div className="award-card">
              <div className="award-icon">◆</div>
              <div>
                <div className="award-name">Government of Ghana Scholarship Award</div>
                <div className="award-desc">Full Scholarship for Undergraduate Studies — Full Tuition &amp; Monthly Stipends</div>
              </div>
            </div>
            <div className="award-card">
              <div className="award-icon">◆</div>
              <div>
                <div className="award-name">Golden Star Gold Mines Scholarship</div>
                <div className="award-desc">Scholarship for Secondary School Studies — Full Tuition</div>
              </div>
            </div>
            <div className="award-card">
              <div className="award-icon">◆</div>
              <div>
                <div className="award-name">UM6P Excellence Scholarship Recipient</div>
                <div className="award-desc">Awarded on the basis of academic excellence and entrance examination results</div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="section">
          <div className="section-header reveal">
            <div className="section-num">05</div>
            <div className="section-meta">
              <div className="section-tag">Competencies</div>
              <div className="section-title">Skills &amp; Tools</div>
            </div>
          </div>

          <div className="skills-layout">
            <div className="skill-group">
              <div className="skill-group-title">Technical</div>
              <ul className="skill-list">
                <li>Python &amp; R (Data Science)</li>
                <li>Power BI · Tableau</li>
                <li>Web Development (Full Stack)</li>
                <li>Canva · Photoshop</li>
                <li>SARIMAX / ARIMAX / SARIMA</li>
                <li>Jupyter Notebook</li>
              </ul>
            </div>
            <div className="skill-group">
              <div className="skill-group-title">Professional</div>
              <ul className="skill-list">
                <li>Project Management</li>
                <li>Research Methodologies</li>
                <li>Experimental Design</li>
                <li>Data Analysis</li>
                <li>Agile Project Management</li>
                <li>Design Thinking</li>
              </ul>
            </div>
            <div className="skill-group">
              <div className="skill-group-title">Leadership Assets</div>
              <ul className="skill-list">
                <li>Public Speaking</li>
                <li>Active Listening</li>
                <li>Detail-Oriented</li>
                <li>Intellectual Curiosity</li>
                <li>Resilience &amp; Adaptability</li>
                <li>English · French</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS */}
        <section id="certs" className="section">
          <div className="section-header reveal">
            <div className="section-num">06</div>
            <div className="section-meta">
              <div className="section-tag">Continuous Learning</div>
              <div className="section-title">Certifications</div>
            </div>
          </div>

          <div className="certs-list">
            <div className="cert-item">
              <div>
                <div className="cert-name">Python for Data Science, AI &amp; Development</div>
                <div className="cert-issuer">IBM</div>
              </div>
              <div className="cert-status done">Completed</div>
            </div>
            <div className="cert-item">
              <div>
                <div className="cert-name">Data Science Methodology</div>
                <div className="cert-issuer">IBM</div>
              </div>
              <div className="cert-status done">Completed</div>
            </div>
            <div className="cert-item">
              <div>
                <div className="cert-name">Data Analysis with R</div>
                <div className="cert-issuer">IBM</div>
              </div>
              <div className="cert-status done">Completed</div>
            </div>
            <div className="cert-item">
              <div>
                <div className="cert-name">Agile Project Management</div>
                <div className="cert-issuer">HP Life</div>
              </div>
              <div className="cert-status done">Completed</div>
            </div>
            <div className="cert-item">
              <div>
                <div className="cert-name">Design Thinking</div>
                <div className="cert-issuer">HP Life</div>
              </div>
              <div className="cert-status done">Completed</div>
            </div>
            <div className="cert-item">
              <div>
                <div className="cert-name">Google Data Analytics Specialization</div>
                <div className="cert-issuer">Google</div>
              </div>
              <div className="cert-status progress">In Progress</div>
            </div>
            <div className="cert-item">
              <div>
                <div className="cert-name">Organizational Leadership Specialization</div>
                <div className="cert-issuer">Coursera</div>
              </div>
              <div className="cert-status progress">In Progress</div>
            </div>
          </div>
        </section>

        {/* REFERENCES */}
        <section id="references" className="section">
          <div className="section-header reveal">
            <div className="section-num">07</div>
            <div className="section-meta">
              <div className="section-tag">Vouched By</div>
              <div className="section-title">References</div>
            </div>
          </div>

          <div className="refs-grid">
            <div className="ref-card">
              <div className="ref-name">Dr. Lex Paulson</div>
              <div className="ref-role">Professor, School of Collective Intelligence<br />University Mohammed VI Polytechnic</div>
              <div className="ref-email">lex.paulson@um6p.ma</div>
            </div>
            <div className="ref-card">
              <div className="ref-name">Hon. John Sanie</div>
              <div className="ref-role">Deputy Minister of Energy · Member of Parliament<br />Ministry of Energy, Ghana</div>
              <div className="ref-email">johnsanie1971@gmail.com</div>
            </div>
            <div className="ref-card">
              <div className="ref-name">Mr. Mohammed Souidi</div>
              <div className="ref-role">Research Development Officer<br />School of Collective Intelligence, UM6P</div>
              <div className="ref-email">mohammed.souidi@um6p.ma</div>
            </div>
            <div className="ref-card">
              <div className="ref-name">Mr. Benard Quantson</div>
              <div className="ref-role">Former Consular of Ghana<br />Embassy of Ghana, Morocco</div>
              <div className="ref-email">ghanaconsul15@gmail.com</div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <div className="contact-left">
            <div className="contact-cta">Let&apos;s<br />Connect &amp;<br /><span>Collaborate</span></div>
          </div>
          <div className="contact-details">
            <div className="contact-item">impact@samuelgyasi.com</div>
            <div className="contact-item">+212 684 893 821</div>
            <div className="contact-item">Rabat, Morocco</div>
            <div className="contact-item">Open to Remote Work</div>
            <div className="contact-item">Junior Program Officer · School of Collective Intelligence · UM6P</div>
          </div>
        </section>

        {/* FOOTER */}
        <TestimonialsClient />
        <Suspense fallback={null}><SiteFooter /></Suspense>
      </div>
    </>
  );
}
