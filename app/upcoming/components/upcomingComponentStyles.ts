export const upcomingComponentStyles = `

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

/* ── HERO RESERVE BUTTON ── */
.up-hero-actions {
  margin-top: 44px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  opacity: 0;
  animation: up-rise .9s .65s ease forwards;
}
.up-hero-reserve-btn {
  font-size: 11px !important;
  padding: 14px 32px !important;
  border-radius: 50px !important;
  letter-spacing: .22em !important;
  box-shadow: 0 0 0 1px rgba(201,168,76,.2), 0 8px 32px rgba(201,168,76,.18);
  transition: box-shadow .3s, transform .3s !important;
}
.up-hero-reserve-btn:hover {
  box-shadow: 0 0 0 1px rgba(201,168,76,.4), 0 12px 40px rgba(201,168,76,.3) !important;
  transform: translateY(-3px) !important;
}
.up-hero-reserve-hint {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 10px;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: rgba(201,168,76,.38);
}

/* ── RESERVE MODAL ── */
.up-reserve-modal {
  background: #0f0f0f;
  border: 1px solid rgba(201,168,76,.2);
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  padding: 36px 36px 40px;
  box-shadow: 0 24px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(201,168,76,.08);
  animation: up-scale-in .3s ease;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
.up-reserve-modal .up-modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
}
.up-reserve-head { margin-bottom: 28px; }
.up-reserve-eyebrow {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 9px; letter-spacing: .32em; text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  margin-bottom: 10px;
}
.up-reserve-title {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 28px; font-weight: 800;
  color: var(--white); margin-bottom: 8px; line-height: 1.2;
}
.up-reserve-sub {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 13px; font-weight: 300;
  color: rgba(245,243,239,.4); line-height: 1.6;
}
.up-reserve-types {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 28px;
}
.up-reserve-type-pill {
  display: flex; align-items: center; gap: 9px;
  background: rgba(245,243,239,.03);
  border: 1px solid rgba(245,243,239,.08);
  border-radius: 12px;
  padding: 12px 16px;
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 12px; font-weight: 500;
  color: rgba(245,243,239,.5);
  cursor: pointer;
  transition: all .22s;
  text-align: left;
}
.up-reserve-type-pill:hover { border-color: rgba(201,168,76,.25); color: rgba(245,243,239,.8); }
.up-reserve-type-pill--active {
  background: rgba(201,168,76,.08);
  border-color: rgba(201,168,76,.4);
  color: rgba(245,243,239,.95);
  box-shadow: 0 0 0 3px rgba(201,168,76,.07);
}
.up-reserve-pill-icon { font-size: 16px; line-height: 1; }
.up-reserve-form { display: flex; flex-direction: column; gap: 16px; }
.up-reserve-field { display: flex; flex-direction: column; gap: 6px; }
.up-reserve-label {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
  color: rgba(245,243,239,.35);
}
.up-reserve-optional { text-transform: none; letter-spacing: 0; font-size: 8px; color: rgba(245,243,239,.2); }
.up-reserve-required { color: rgba(201,168,76,.7); }
.up-reserve-input, .up-reserve-textarea {
  background: rgba(245,243,239,.04);
  border: 1px solid rgba(245,243,239,.1);
  border-radius: 10px;
  color: var(--white);
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 14px;
  padding: 12px 16px;
  outline: none;
  transition: border-color .25s;
  width: 100%;
  box-sizing: border-box;
}
.up-reserve-input::placeholder, .up-reserve-textarea::placeholder { color: rgba(245,243,239,.22); }
.up-reserve-input:focus, .up-reserve-textarea:focus { border-color: rgba(201,168,76,.4); }
.up-reserve-textarea { resize: vertical; }
.up-reserve-err {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 11px; color: #e05252;
}
.up-reserve-submit {
  width: 100% !important;
  padding: 14px !important;
  font-size: 10px !important;
  letter-spacing: .22em !important;
  border-radius: 10px !important;
  margin-top: 4px;
}
@media(max-width:600px) {
  .up-reserve-modal { padding: 28px 22px 32px; }
  .up-reserve-types { grid-template-columns: 1fr 1fr; gap: 8px; }
  .up-hero-actions { align-items: center; }
}

/* ── LIGHT MODE ── */
:root:not(.dark) .up-pg {
  background: #ffffff;
  color: #1a1816;
  --gold-gradient: linear-gradient(90deg, #B8860B, #D4700A);
}
:root:not(.dark) .up-headline { color: #0a0a0a; -webkit-text-stroke: 1px rgba(184,134,11,.2); }
:root:not(.dark) .up-sub { color: #4a4640; }
:root:not(.dark) .up-section-label { color: rgba(184,134,11,.75); }
:root:not(.dark) .up-section-title { color: #1a1816; }
:root:not(.dark) .up-section-title--past { color: rgba(10,10,10,.3); }
:root:not(.dark) .up-card { background: #f5f3ef; border-color: rgba(10,10,10,.1); }
:root:not(.dark) .up-card:hover { border-color: rgba(184,134,11,.4); box-shadow: 0 8px 32px rgba(0,0,0,.1); }
:root:not(.dark) .up-card-date { color: rgba(10,10,10,.45); }
:root:not(.dark) .up-card-title { color: #1a1816; }
:root:not(.dark) .up-card-tag { color: #B8860B; }
:root:not(.dark) .up-card-desc { color: #4a4640; }
:root:not(.dark) .up-card-location { color: #6a6058; }
:root:not(.dark) .up-card-host { color: #6a6058; }
:root:not(.dark) .up-card-host-link { color: #B8860B; }
:root:not(.dark) .up-card-past-badge { background: rgba(245,243,239,.9); color: #6a6058; border-color: rgba(10,10,10,.15); }
:root:not(.dark) .up-coming-soon { background: rgba(184,134,11,.04); border-color: rgba(184,134,11,.15); color: #6a6058; }
:root:not(.dark) .up-countdown { background: rgba(184,134,11,.05); border-color: rgba(184,134,11,.18); }
:root:not(.dark) .up-countdown-label { color: #B8860B; }
:root:not(.dark) .up-countdown-name { color: rgba(10,10,10,.45); }
:root:not(.dark) .up-btn--outline { border-color: rgba(184,134,11,.4); color: #B8860B; }
:root:not(.dark) .up-btn--ghost { border-color: rgba(10,10,10,.15); color: #6a6058; }
:root:not(.dark) .up-notify { background: #f5f3ef; border-top-color: rgba(10,10,10,.1); }
:root:not(.dark) .up-notify-h { color: #1a1816; }
:root:not(.dark) .up-notify-sub { color: #4a4640; }
:root:not(.dark) .up-hero-reserve-hint { color: rgba(184,134,11,.55); }
:root:not(.dark) .up-reserve-modal { background: #f5f3ef; border-color: rgba(184,134,11,.2); }
:root:not(.dark) .up-reserve-title { color: #1a1816; }
:root:not(.dark) .up-reserve-sub { color: #4a4640; }
:root:not(.dark) .up-reserve-type-pill { background: rgba(10,10,10,.03); border-color: rgba(10,10,10,.12); color: #4a4640; }
:root:not(.dark) .up-reserve-type-pill--active { background: rgba(184,134,11,.08); border-color: rgba(184,134,11,.4); color: #1a1816; }
:root:not(.dark) .up-reserve-label { color: rgba(10,10,10,.5); }
:root:not(.dark) .up-reserve-input, :root:not(.dark) .up-reserve-textarea { background: #ffffff; border-color: rgba(10,10,10,.18); color: #1a1816; }
:root:not(.dark) .up-reserve-input::placeholder, :root:not(.dark) .up-reserve-textarea::placeholder { color: #9a9080; }
:root:not(.dark) .up-modal { background: #f5f3ef; border-color: rgba(10,10,10,.12); }
:root:not(.dark) .up-modal-title { color: #1a1816; }
:root:not(.dark) .up-modal-sub { color: #4a4640; }
:root:not(.dark) .up-form-label { color: rgba(10,10,10,.5); }
:root:not(.dark) .up-form-input, :root:not(.dark) .up-form-textarea { background: #ffffff; border-color: rgba(10,10,10,.18); color: #1a1816; }
:root:not(.dark) .up-modal-close { background: rgba(10,10,10,.05); border-color: rgba(10,10,10,.15); color: #4a4640; }
:root:not(.dark) .up-modal-done-h { color: #1a1816; }
:root:not(.dark) .up-modal-done-sub { color: #4a4640; }

/* ── LANG TOGGLE ── */
.up-lang-toggle {
  background: transparent;
  border: 1px solid rgba(201,168,76,.25);
  border-radius: 4px;
  padding: 4px 10px;
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 10px;
  letter-spacing: .16em;
  color: rgba(201,168,76,.5);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  transition: border-color .25s, color .25s;
  margin-bottom: 32px;
  opacity: 0;
  animation: up-rise .8s .05s ease forwards;
}
.up-lang-toggle:hover { border-color: rgba(201,168,76,.6); color: rgba(201,168,76,.8); }
.up-lang-toggle .active {
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}
.up-lang-toggle .sep { opacity: .35; }
:root:not(.dark) .up-lang-toggle { border-color: rgba(184,134,11,.3); color: rgba(184,134,11,.6); }
:root:not(.dark) .up-lang-toggle:hover { border-color: rgba(184,134,11,.6); }

`;
