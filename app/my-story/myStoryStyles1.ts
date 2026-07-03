export const myStoryStyles1 = `

.msp {
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}
.msp::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/mystorybackground.jpg');
  background-size: cover;
  background-position: center top;
  background-attachment: fixed;
  opacity: 0.96;
  background-color: rgba(0, 0, 0, 0.96);
  background-blend-mode: multiply;
  pointer-events: none;
  z-index: 0;
}
.msp > * { position: relative; z-index: 1; }

.msp-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
.msp-particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,.3) 0%, transparent 70%);
  animation: msp-float linear infinite;
}
@keyframes msp-float {
  0%   { transform: translateY(0) scale(1);   opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: .5; }
  100% { transform: translateY(-110px) scale(1.25); opacity: 0; }
}
.msp-hero-glow {
  position: absolute;
  top: 50%; left: -80px;
  transform: translateY(-50%);
  width: 440px; height: 440px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,.07) 0%, transparent 70%);
  pointer-events: none;
  animation: msp-glow-pulse 7s ease-in-out infinite;
}
@keyframes msp-glow-pulse {
  0%,100% { transform: translateY(-50%) scale(1);    opacity: .6; }
  50%      { transform: translateY(-50%) scale(1.18); opacity: 1; }
}
.msp-hero {
  position: relative;
  padding: 140px 8% 90px;
  border-bottom: 1px solid rgba(201,168,76,.18);
  max-width: 1100px;
  margin: 0 auto;
  overflow: hidden;
}
.msp-hero-eyebrow {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 10px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  animation: msp-rise .8s .15s ease both;
}
.msp-hero-headline {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(52px,8vw,108px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  margin-bottom: 30px;
  animation: msp-rise .85s .28s ease both;
  position: relative;
}
.msp-hero-headline::after {
  content: '';
  display: block;
  width: 0;
  height: 2px;
  background: var(--gold-gradient);
  margin-top: 10px;
  animation: msp-underline 1.2s .9s ease forwards;
}
@keyframes msp-underline { to { width: 80px; } }
.msp-hl-gold {
  display: block;
  font-style: italic;
  font-weight: 400;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.msp-hero-rule {
  width: 56px; height: 2px;
  background: var(--gold-gradient);
  margin: 20px 0 28px;
  animation: msp-rise .8s .44s ease both;
}
.msp-hero-sub {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: clamp(17px, 2vw, 21px);
  font-style: italic;
  color: rgba(245,243,239,.65);
  max-width: 560px;
  line-height: 1.7;
  animation: msp-rise .8s .58s ease both;
}
@keyframes msp-rise {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: none; }
}

/* ── PHOTO MOSAIC ── */
.msp-mosaic {
  width: 100%;
  padding: 100px 8% 0;
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.msp-mosaic-label {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 9px; letter-spacing: .32em; text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  margin-bottom: 18px;
  opacity: 0; animation: msp-rise .7s .05s ease both;
}
.msp-mosaic-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 240px 240px;
  gap: 10px;
  border-radius: 10px;
  overflow: hidden;
}
.msp-photo {
  overflow: hidden;
  position: relative;
  opacity: 0;
  transform: scale(0.97) translateY(14px);
  animation: msp-photo-in .85s ease both;
}
@keyframes msp-photo-in {
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.msp-photo img {
  width: 100%; height: 100%; 
  object-fit: cover;
  object-position: top center;
  transition: transform .7s ease;
  display: block;
}
.msp-photo:hover img { transform: scale(1.07); }
.msp-photo::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(160deg, transparent 55%, rgba(0,0,0,.35));
  pointer-events: none;
}
/* Layouting: p1 large left (row 1+2, col 1+2), p2 top col3, p3 top col4, p4 bottom col3, p5 bottom col4 */
.msp-photo--1 { grid-column: 1 / 3; grid-row: 1 / 3; animation-delay: .1s; }
.msp-photo--2 { grid-column: 3; grid-row: 1;    animation-delay: .22s; }
.msp-photo--3 { grid-column: 4; grid-row: 1;    animation-delay: .34s; }
.msp-photo--4 { grid-column: 3; grid-row: 2;    animation-delay: .46s; }
.msp-photo--5 { grid-column: 4; grid-row: 2;    animation-delay: .58s; }

@media (max-width: 768px) {
  .msp-mosaic { padding: 90px 6% 0; }
  .msp-mosaic-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 180px 120px 120px;
  }
  .msp-photo--1 { grid-column: 1 / 3; grid-row: 1; }
  .msp-photo--2 { grid-column: 1; grid-row: 2; }
  .msp-photo--3 { grid-column: 2; grid-row: 2; }
  .msp-photo--4 { grid-column: 1; grid-row: 3; }
  .msp-photo--5 { grid-column: 2; grid-row: 3; }
}
.msp-section {
  padding: 80px 8% 100px;
  max-width: 1100px;
  margin: 0 auto;
}

/* ── PUBLIC NARRATIVE ── */
.msp-narrative {
  padding: 72px 8%;
  max-width: 1100px;
  margin: 0 auto;
  border-bottom: 1px solid rgba(201,168,76,.12);
}
.msp-narrative-eyebrow {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 9px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
}
.msp-narrative-heading {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(22px, 3vw, 36px);
  font-weight: 700;
  color: var(--white);
  line-height: 1.2;
  margin-bottom: 24px;
}
.msp-narrative-lead {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: clamp(17px, 1.9vw, 20px);
  font-style: italic;
  color: rgba(245,243,239,.72);
  line-height: 1.75;
  max-width: 780px;
  margin-bottom: 48px;
}
.msp-three-acts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-top: 16px;
}
.msp-act {
  border-top: 2px solid rgba(201,168,76,.45);
  padding-top: 20px;
}
.msp-act-num {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 9px;
  letter-spacing: 0.28em;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}
.msp-act-title {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(16px, 1.8vw, 20px);
  font-weight: 700;
  color: var(--white);
  margin-bottom: 10px;
}
.msp-act-body {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 15px;
  font-style: italic;
  line-height: 1.8;
  color: rgba(245,243,239,.6);
}
@media (max-width: 768px) {
  .msp-narrative { padding: 56px 6%; }
  .msp-three-acts { grid-template-columns: 1fr; gap: 24px; }
}

.msp-timeline {
  position: relative;
  padding-left: 0;
}
.msp-timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 16px;
  bottom: 16px;
  width: 1px;
  background: rgba(201,168,76,.25);
}
.msp-item {
  display: flex;
  gap: 0;
  margin-bottom: 64px;
  position: relative;
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
.msp-item.msp-visible { opacity: 1; transform: none; }
.msp-dot-col {
  position: relative;
  flex-shrink: 0;
  width: 44px;
  padding-top: 4px;
}
.msp-dot {
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--black);
  border: 2px solid rgba(201,168,76,.55);
  position: relative; z-index: 2;
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
}
.msp-item:hover .msp-dot {
  background: linear-gradient(135deg,#ffde59,#ff914d);
  border-color: #ffde59;
  box-shadow: 0 0 14px rgba(201,168,76,.5);
}
.msp-text {
  padding-left: 24px;
  flex: 1;
}
.msp-item-head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 14px;
}
.msp-year {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #c9a84c;
  flex-shrink: 0;
  background: rgba(201,168,76,.12);
  border: 1px solid rgba(201,168,76,.3);
  padding: 4px 12px;
  border-radius: 4px;
  display: inline-block;
  align-self: flex-start;
  margin-top: 2px;
}
.msp-title {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(18px, 2.2vw, 24px);
  font-weight: 700;
  color: var(--white);
  line-height: 1.2;
}
.msp-body {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 17px;
  line-height: 1.88;
  color: rgba(245,243,239,.75);
}
:root:not(.dark) .msp {
  background: #ffffff;
  color: #1a1816;
  --white: #1a1816;
  --black: #ffffff;
  --gold-gradient: linear-gradient(90deg, #B8860B, #D4700A);
}
:root:not(.dark) .msp::before { opacity: 0.08; }
:root:not(.dark) .msp-year {
  background: rgba(184,134,11,.12);
  border-color: rgba(184,134,11,.4);
  color: #B8860B;
}
:root:not(.dark) .msp-dot { background: #ffffff; border-color: rgba(184,134,11,.55); }
`;
