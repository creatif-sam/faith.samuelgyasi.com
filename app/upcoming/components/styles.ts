export const upcomingStyles = `
.up-pg {
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  position: relative;
}
.up-pg::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(ellipse at 20% 40%, rgba(201,168,76,.04) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 10%, rgba(201,168,76,.03) 0%, transparent 55%);
  pointer-events: none;
  z-index: 0;
}
.up-pg > * { position: relative; z-index: 1; }

/* ── HERO ── */
.up-hero {
  padding: 140px 8% 80px;
  border-bottom: 1px solid rgba(201,168,76,.12);
  max-width: 1100px;
  margin: 0 auto;
}
.up-eyebrow {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 10px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  opacity: 0;
  animation: up-rise .8s .1s ease forwards;
}
.up-headline {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: clamp(52px,8vw,110px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: #0a0a0a;
  -webkit-text-stroke: 1px rgba(201,168,76,.3);
  margin-bottom: 32px;
  opacity: 0;
  animation: up-rise .9s .2s ease forwards;
}
.up-headline em {
  font-style: italic;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  -webkit-text-stroke: 0;
}
.up-rule {
  width: 80px;
  height: 1px;
  background: var(--gold-gradient);
  margin-bottom: 22px;
  opacity: 0;
  animation: up-rise .9s .35s ease forwards;
}
.up-sub {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 16px;
  line-height: 1.7;
  font-weight: 300;
  color: rgba(245,243,239,.5);
  max-width: 670px;
  opacity: 0;
  animation: up-rise .9s .5s ease forwards;
}

@keyframes up-rise {
  to { opacity: 1; transform: translateY(0); }
  from { opacity: 0; transform: translateY(10px); }
}

/* ── BODY ── */
.up-body {
  padding: 80px 8% 100px;
  max-width: 1440px;
  margin: 0 auto;
}
.up-section {
  margin-bottom: 100px;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity .85s ease, transform .85s ease;
  will-change: opacity, transform;
}
.up-section.up-visible { opacity: 1; transform: translateY(0); }
.up-section--past { margin-bottom: 0; }

.up-section-label {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 9px;
  letter-spacing: .28em;
  text-transform: uppercase;
  color: rgba(201,168,76,.5);
  margin-bottom: 10px;
}
.up-section-title {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: clamp(32px,4.5vw,56px);
  font-weight: 800;
  color: var(--white);
  margin-bottom: 42px;
}
.up-section-title--past { color: rgba(245,243,239,.28); }

/* ── EMPTY STATE ── */
.up-coming-soon {
  background: rgba(201,168,76,.025);
  border: 1px solid rgba(201,168,76,.08);
  border-radius: 12px;
  padding: 60px 30px;
  text-align: center;
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 15px;
  font-weight: 300;
  color: rgba(245,243,239,.3);
}
.up-coming-soon-icon {
  font-size: 24px;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

/* ── CARDS ── */
.up-cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: clamp(18px, 2.2vw, 32px);
}
.up-cards--past {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: clamp(14px, 1.8vw, 24px);
}
.up-card {
  background: rgba(245,243,239,.015);
  border: 1px solid rgba(201,168,76,.08);
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  transition: border-color .3s, transform .3s, opacity .8s ease;
  opacity: 0;
  will-change: opacity, transform;
  cursor: default;
}
.up-card.up-visible { opacity: 1; }
.up-card:hover { border-color: rgba(201,168,76,.2); transform: translateY(-4px); }
.up-card--past { opacity: .35; }
.up-card--past:hover { opacity: .65; }

.up-card-flyer {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background: rgba(245,243,239,.02);
  overflow: hidden;
}
.up-card-flyer-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .45s ease;
}
.up-card:hover .up-card-flyer-img { transform: scale(1.04); }

.up-card-past-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(10,10,10,.75);
  backdrop-filter: blur(8px);
  color: rgba(245,243,239,.5);
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 9px;
  letter-spacing: .22em;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(201,168,76,.15);
  z-index: 1;
}
.up-card-past-badge--inline {
  position: relative;
  top: 0;
  right: 0;
  display: inline-block;
  margin-bottom: 0;
}

.up-card-body-wrap { padding: 22px 24px 26px; }
.up-card-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.up-card-date {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: .02em;
  color: rgba(245,243,239,.4);
}
.up-card-format {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 8px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .25em;
  padding: 5px 10px;
  border-radius: 6px;
  background: rgba(201,168,76,.08);
  color: rgba(201,168,76,.65);
}
.up-card-format--online { background: rgba(22,163,74,.12); color: rgba(134,239,172,.75); }
.up-card-format--in-person { background: rgba(59,130,246,.12); color: rgba(96,165,250,.75); }
.up-card-format--both { background: rgba(168,85,247,.12); color: rgba(192,132,252,.75); }

.up-card-tag {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 9px;
  letter-spacing: .24em;
  text-transform: uppercase;
  color: rgba(201,168,76,.58);
  margin-bottom: 10px;
}
.up-card-title {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: clamp(18px, 1.4vw, 22px);
  font-weight: 700;
  color: var(--white);
  margin-bottom: 12px;
  line-height: 1.35;
}
.up-card-desc {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: rgba(245,243,239,.45);
  line-height: 1.6;
  margin-bottom: 12px;
}
.up-card-location {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: rgba(245,243,239,.32);
  margin-bottom: 8px;
}
.up-card-host {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 11px;
  font-weight: 300;
  color: rgba(245,243,239,.32);
  margin-bottom: 18px;
}
.up-card-host-link {
  color: rgba(201,168,76,.6);
  text-decoration: underline;
  transition: color .2s;
}
.up-card-host-link:hover { color: rgba(201,168,76,.85); }

.up-card-actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}
.up-btn {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: .28em;
  font-weight: 600;
  padding: 11px 18px;
  border-radius: 8px;
  transition: all .3s;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
}
.up-btn--gold {
  background: var(--gold-gradient);
  color: #0a0a0a;
  border: 1px solid transparent;
}
.up-btn--gold:hover { box-shadow: 0 4px 18px rgba(201,168,76,.3); transform: translateY(-2px); }
.up-btn--outline {
  background: transparent;
  border: 1px solid rgba(201,168,76,.25);
  color: rgba(201,168,76,.8);
}
.up-btn--outline:hover { border-color: rgba(201,168,76,.5); background: rgba(201,168,76,.04); }
.up-btn--ghost {
  background: transparent;
  border: 1px solid rgba(245,243,239,.08);
  color: rgba(245,243,239,.45);
  display: inline-flex;
  align-items: center;
}
.up-btn--ghost:hover { border-color: rgba(245,243,239,.15); color: rgba(245,243,239,.7); }
.up-btn--rec {
  margin-top: 12px;
  width: 100%;
  background: rgba(201,168,76,.02);
  border: 1px solid rgba(201,168,76,.1);
  color: rgba(201,168,76,.5);
  padding: 10px;
  font-size: 9px;
}
.up-btn--rec:hover { background: rgba(201,168,76,.05); border-color: rgba(201,168,76,.2); color: rgba(201,168,76,.75); }

/* ── COUNTDOWN ── */
.up-countdown {
  background: rgba(201,168,76,.04);
  border: 1px solid rgba(201,168,76,.12);
  border-radius: 8px;
  padding: 14px 16px;
  margin-top: 14px;
  margin-bottom: 14px;
}
.up-countdown-label {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 8px;
  letter-spacing: .24em;
  text-transform: uppercase;
  color: rgba(201,168,76,.5);
  margin-bottom: 8px;
}
.up-countdown-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.up-countdown-unit {
  text-align: center;
}
.up-countdown-value {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 24px;
  font-weight: 700;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 4px;
}
.up-countdown-name {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 9px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: rgba(245,243,239,.35);
}

/* ── NOTIFY ── */
.up-notify {
  background: var(--black);
  border-top: 1px solid rgba(201,168,76,.12);
  padding: 80px 8%;
}
.up-notify-inner {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}
.up-notify-eyebrow {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 9px;
  letter-spacing: .32em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}
.up-notify-h {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: clamp(28px, 4vw, 46px);
  font-weight: 800;
  color: var(--white);
  margin-bottom: 16px;
}
.up-notify-sub {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.7;
  color: rgba(245,243,239,.45);
  margin-bottom: 28px;
}
.up-notify-btn {
  display: inline-block;
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .3em;
  font-weight: 600;
  padding: 15px 32px;
  border-radius: 10px;
  background: var(--gold-gradient);
  color: #0a0a0a;
  text-decoration: none;
  transition: all .3s;
}
.up-notify-btn:hover { box-shadow: 0 6px 24px rgba(201,168,76,.35); transform: translateY(-3px); }

/* ── MODAL ── */
.up-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10,10,10,.85);
  backdrop-filter: blur(8px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: up-fade-in .25s ease;
}
@keyframes up-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.up-modal {
  background: #111;
  border: 1px solid rgba(201,168,76,.18);
  border-radius: 16px;
  width: 100%;
  max-width: 540px;
  box-shadow: 0 20px 60px rgba(0,0,0,.4);
  animation: up-scale-in .3s ease;
  max-height: 90vh;
  overflow-y: auto;
}
.up-modal--sm { max-width: 460px; }
@keyframes up-scale-in {
  from { transform: scale(.92); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.up-modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 28px 28px 0;
}
.up-modal-eyebrow {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 8px;
  letter-spacing: .28em;
  text-transform: uppercase;
  color: rgba(201,168,76,.5);
  margin-bottom: 8px;
}
.up-modal-title {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: var(--white);
  line-height: 1.3;
}
.up-modal-close {
  background: rgba(245,243,239,.05);
  border: 1px solid rgba(245,243,239,.08);
  color: rgba(245,243,239,.5);
  font-size: 18px;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  transition: all .2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.up-modal-close:hover { background: rgba(245,243,239,.1); color: rgba(245,243,239,.85); }
.up-modal-sub {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: rgba(245,243,239,.4);
  line-height: 1.6;
  padding: 10px 28px 0;
}
.up-modal-form { padding: 18px 28px 28px; display: flex; flex-direction: column; gap: 4px; }
.up-form-label {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 8px; letter-spacing: .2em; text-transform: uppercase;
  color: rgba(245,243,239,.35); margin-top: 12px; margin-bottom: 4px;
}
.up-form-optional { font-size: 7px; color: rgba(245,243,239,.2); text-transform: none; letter-spacing: 0; }
.up-form-input, .up-form-textarea {
  background: rgba(245,243,239,.04); border: 1px solid rgba(245,243,239,.1);
  color: var(--white);
  font-family: var(--font-poppins),'Poppins',sans-serif; font-size: 14px;
  padding: 11px 16px; width: 100%; outline: none; transition: border-color .25s; box-sizing: border-box;
}
.up-form-input:focus, .up-form-textarea:focus { border-color: rgba(201,168,76,.4); }
.up-form-textarea { resize: vertical; }
.up-modal-form .up-btn--gold { margin-top: 20px; width: 100%; padding: 13px; font-size: 9px; }
.up-modal-done {
  display: flex; flex-direction: column; align-items: center;
  padding: 48px 28px; text-align: center; gap: 12px;
}
.up-modal-done-icon {
  font-size: 28px; background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 8px;
}
.up-modal-done-h { font-family: var(--font-poppins),'Poppins',sans-serif; font-size: 24px; font-weight: 700; color: var(--white); }
.up-modal-done-sub { font-family: var(--font-poppins),'Poppins',sans-serif; font-size: 15px; font-weight: 300; color: rgba(245,243,239,.45); line-height: 1.6; }
.up-modal-done .up-btn--gold { margin-top: 16px; }

@media(max-width:900px) {
  .up-cards { grid-template-columns: 1fr 1fr; }
  .up-cards--past { grid-template-columns: 1fr 1fr; }
}
@media(max-width:600px) {
  .up-hero { padding: 130px 6% 60px; }
  .up-body { padding: 0 6% 80px; }
  .up-notify { padding: 60px 6%; }
  .up-cards, .up-cards--past { grid-template-columns: 1fr; }
  .up-modal-head { padding: 20px 20px 0; }
  .up-modal-form { padding: 16px 20px 24px; }
  .up-modal-sub { padding: 10px 20px 0; }
}
`;
