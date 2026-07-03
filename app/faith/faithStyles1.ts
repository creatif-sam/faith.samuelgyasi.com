export const faithStyles1 = `

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
  font-family: 'Poppins', sans-serif;
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
  font-family: 'Poppins', sans-serif;
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
  font-family:'Poppins', sans-serif;font-size:10px;letter-spacing:.22em;
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
  font-family:'Poppins', sans-serif;font-size:10px;
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
  font-family:'Poppins', sans-serif;font-size:9px;
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
  font-family:'Poppins', sans-serif;font-size:9px;
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
  font-family:'Poppins', sans-serif;font-size:9px;
  letter-spacing:.2em;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
  text-transform:uppercase;
  font-style:normal;
}
.fdp .hero-scroll-hint {
  position:absolute;bottom:40px;right:56px;
  font-family:'Poppins', sans-serif;font-size:9px;
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
  font-family:'Poppins', sans-serif;font-size:9px;
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
  font-family:'Poppins', sans-serif;font-size:9px;
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
  font-family:'Poppins', sans-serif;font-size:9px;
  letter-spacing:.2em;text-transform:uppercase;
  background:linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
  margin-top:20px;
}
`;
