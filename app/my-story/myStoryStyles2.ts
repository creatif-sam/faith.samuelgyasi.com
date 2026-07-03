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

/* ── FOOTER VISIBILITY OVERRIDES ── */
.msp footer {
  position: relative;
  z-index: 10;
  background: rgba(8, 8, 7, 0.95);
  border-top: 1px solid rgba(201, 168, 76, 0.3);
}
.msp footer * {
  color: var(--white, #f0ece4) !important;
}
.msp footer .sf-brand-name,
.msp footer .sf-brand-tagline,
.msp footer .sf-nl-heading,
.msp footer .sf-nl-sub,
.msp footer .sf-col-label,
.msp footer .sf-col-link,
.msp footer .sf-copy,
.msp footer .sf-credit {
  opacity: 1 !important;
}
.msp footer .sf-nl-input {
  background: rgba(245, 243, 239, 0.08) !important;
  border-color: rgba(201, 168, 76, 0.3) !important;
  color: var(--white, #f0ece4) !important;
}
.msp footer .sf-nl-input::placeholder {
  color: rgba(245, 243, 239, 0.4) !important;
}
.msp footer .sf-nl-btn {
  background: linear-gradient(90deg, #ffde59, #ff914d) !important;
  color: #080807 !important;
}
.msp footer .sf-social-icon {
  color: var(--white, #f0ece4) !important;
  opacity: 0.8;
}
.msp footer .sf-social-icon:hover {
  opacity: 1;
}
.msp footer .sf-rule {
  background: rgba(201, 168, 76, 0.2) !important;
}

`;
