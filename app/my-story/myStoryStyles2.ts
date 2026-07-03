export const myStoryStyles2 = `
:root:not(.dark) .msp-timeline::before { background: rgba(184,134,11,.25); }
:root:not(.dark) .msp-narrative { border-bottom-color: rgba(184,134,11,.15); }
:root:not(.dark) .msp-act { border-top-color: rgba(184,134,11,.45); }
:root:not(.dark) .msp-now { background: rgba(184,134,11,.03); border-color: rgba(184,134,11,.15); }
:root:not(.dark) .msp-now-card { border-top-color: rgba(184,134,11,.5); }
:root:not(.dark) .msp-hero { border-bottom-color: rgba(184,134,11,.2); }
:root:not(.dark) .msp-hero-headline,
:root:not(.dark) .msp-title,
:root:not(.dark) .msp-narrative-heading,
:root:not(.dark) .msp-now-card-title,
:root:not(.dark) .msp-act-title,
:root:not(.dark) .msp-now-heading { color: #1a1816; }
:root:not(.dark) .msp-body,
:root:not(.dark) .msp-act-body,
:root:not(.dark) .msp-now-card-body { color: rgba(26,24,22,.8); }
:root:not(.dark) .msp-hero-sub,
:root:not(.dark) .msp-narrative-lead { color: rgba(26,24,22,.7); }
:root:not(.dark) .msp-pullquote { color: rgba(26,24,22,.9); background: rgba(184,134,11,.05); border-left-color: rgba(184,134,11,.5); }
.msp-body p + p { margin-top: 14px; }
.msp-pullquote {
  margin: 22px 0 4px;
  padding: 18px 24px;
  border-left: 3px solid rgba(201,168,76,.5);
  background: rgba(201,168,76,.05);
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-style: italic;
  font-size: 17px;
  line-height: 1.7;
  color: var(--white);
}
.msp-now {
  background: rgba(201,168,76,.04);
  border-top: 1px solid rgba(201,168,76,.18);
  border-bottom: 1px solid rgba(201,168,76,.18);
  padding: 72px 8%;
}
.msp-now-inner { max-width: 1100px; margin: 0 auto; }
.msp-now-label {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 9px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}
.msp-now-heading {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(28px, 4vw, 52px);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--white);
  margin-bottom: 48px;
}
.msp-now-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 36px;
}
.msp-now-card {
  border-top: 2px solid rgba(201,168,76,.6);
  padding-top: 22px;
  opacity: 0;
  transform: translateY(14px);
  transition: opacity .6s ease, transform .6s ease;
}
.msp-now-card.msp-visible { opacity: 1; transform: none; }
.msp-now-num {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 9px;
  letter-spacing: 0.28em;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}
.msp-now-card-title {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 12px;
  line-height: 1.3;
  min-height: 2.6em;
}
.msp-now-card-body {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 15px;
  font-style: italic;
  line-height: 1.8;
  color: rgba(245,243,239,.6);
}
@media (max-width: 768px) {
  .msp-hero { padding: 130px 6% 60px; }
  .msp-section { padding: 60px 6% 80px; }
  .msp-now { padding: 60px 6%; }
  .msp-now-grid { grid-template-columns: 1fr; gap: 32px; }
  .msp-now-card-title { min-height: auto; }
  .msp-hero-glow { display: none; }
}

/* ── EXTENDED STORY (DB-driven content) ── */
.msp-db-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 100px 8% 80px;
  border-top: 1px solid rgba(201,168,76,.18);
}
.msp-db-eyebrow {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 10px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
}
.msp-db-title {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 900;
  line-height: 1.1;
  color: var(--white);
  margin-bottom: 32px;
}
.msp-db-body {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: clamp(15px, 1.8vw, 18px);
  line-height: 1.75;
  color: rgba(245,243,239,.72);
  max-width: 840px;
  white-space: pre-wrap;
}
.msp-db-body--with-gallery { margin-bottom: 60px; }
.msp-db-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 40px;
}
.msp-db-gallery-item {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(201,168,76,.2);
  background: rgba(0,0,0,.3);
}
.msp-db-gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
:root:not(.dark) .msp-db-title { color: #1a1816; }
:root:not(.dark) .msp-db-body { color: rgba(26,24,22,.75); }
`;
