export const credoStyles = `

.credo-pg {
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  position: relative;
}
.credo-pg::before {
  content: '';
  position: absolute;
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
  font-family: var(--font-poppins), 'Poppins', sans-serif;
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
  font-family: var(--font-poppins), 'Poppins', sans-serif;
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
  font-family: var(--font-poppins), 'Poppins', sans-serif;
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
  font-family: var(--font-poppins), 'Poppins', sans-serif;
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
  font-family: var(--font-poppins), 'Poppins', sans-serif;
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
  font-family: var(--font-poppins), 'Poppins', sans-serif;
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

/* ── LIGHT THEME ── */
.light .credo-hero-sub {
  color: #4a4640;
}
.light .credo-item-title {
  color: #1a1816;
}
.light .credo-item-body {
  color: #4a4640;
}
.light .credo-close-quote {
  color: #1a1816;
}
.light .credo-close-sign {
  color: #7a7060;
}
.light .credo-num {
  -webkit-text-stroke: 1px rgba(184,134,11,.45);
}

`;
