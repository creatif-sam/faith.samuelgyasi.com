export const faithStyles2 = `

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
