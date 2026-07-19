export const blogStyles = `

.fdp {
  --bg:#080807; --bg2:#0e0d0b; --white:#f0ece4; --cream:#e8e0d0;
  --gold:#c9a84c; --dim:#7a7060; --dimmer:#3e3830;
  --line:rgba(240,236,228,.06); --card:#111009; min-height:100vh;
  animation: fadeIn 0.6s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
body.on-fdp { background:#080807; color:#f0ece4; font-family:'Poppins', sans-serif; }
.fb-container { max-width:1400px; margin:0 auto; padding:104px 56px 0; }
.fb-header { padding:32px 56px 56px; border-bottom:1px solid var(--line); animation: slideUp 0.8s ease-out; }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.fb-eyebrow { font-family:'Poppins', sans-serif; font-size:9px; letter-spacing:.4em; text-transform:uppercase; background:linear-gradient(90deg,#546cfa,#546cfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:24px; display:flex; align-items:center; gap:16px; animation: fadeIn 0.8s ease-out 0.2s both; }
.fb-eyebrow::before { content:''; width:36px; height:1px; background:linear-gradient(90deg,#546cfa,#546cfa); animation: growWidth 0.8s ease-out 0.4s both; }
@keyframes growWidth {
  from { width: 0; }
  to { width: 36px; }
}
.fb-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(52px,8vw,110px); line-height:.9; color:var(--white); margin:0 0 28px; animation: slideUp 0.8s ease-out 0.3s both; }
.fb-title em { font-style:italic; display:block; font-size:.8em; background:linear-gradient(90deg,#546cfa,#546cfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation: shimmer 3s ease-in-out infinite; }
@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
.fb-subtitle { font-family:var(--font-poppins),'Poppins',sans-serif; font-size:clamp(15px,1.6vw,18px); color:var(--dim); max-width:560px; line-height:1.7; font-weight:300; animation: fadeIn 0.8s ease-out 0.5s both; }
.fb-search-container { padding: 32px 56px 20px; background:var(--bg); border-bottom:1px solid var(--line); animation: slideUp 0.6s ease-out 0.6s both; }
.fb-search-wrapper { position: relative; max-width: 600px; margin: 0 auto; }
.fb-search-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: var(--dim); pointer-events: none; }
.fb-search-input { width: 100%; padding: 14px 48px 14px 48px; background: rgba(245,243,239,.04); border: 1px solid var(--line); border-radius: 8px; color: var(--white); font-family: var(--font-poppins),'Poppins',sans-serif; font-size: 15px; outline: none; transition: all 0.3s ease; }
.fb-search-input::placeholder { color: var(--dimmer); }
.fb-search-input:focus { background: rgba(245,243,239,.06); border-color: rgba(201,168,76,.4); box-shadow: 0 0 0 3px rgba(201,168,76,.1); }
.fb-search-clear { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: var(--dim); font-size: 24px; cursor: pointer; padding: 4px 8px; line-height: 1; transition: color 0.2s ease; }
.fb-search-clear:hover { color: var(--gold); }
.fb-search-results { text-align: center; margin-top: 12px; font-family: var(--font-poppins), 'Poppins', sans-serif; font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); }
.fb-filters { padding:24px 56px; display:flex; gap:10px; flex-wrap:wrap; background:var(--bg2); border-bottom:1px solid var(--line); position:sticky; top:65px; z-index:100; transition: all 0.3s ease; }
.fb-filter { font-family:'Poppins', sans-serif; font-size:9px; letter-spacing:.2em; text-transform:uppercase; padding:10px 20px; background:transparent; border:1px solid var(--line); color:var(--dim); cursor:pointer; transition:all .3s ease; border-radius: 4px; position: relative; overflow: hidden; }
.fb-filter::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg,#546cfa,#546cfa); opacity: 0; transition: opacity 0.3s ease; z-index: -1; }
.fb-filter:hover { border-color:rgba(255,222,89,.5); color:var(--gold); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255,222,89,0.2); }
.fb-filter--active { background:linear-gradient(90deg,#546cfa,#546cfa); color:#080807; border-color:transparent; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,222,89,0.3); }
.fb-filter--active::before { opacity: 1; }
.fb-filter-count { opacity: .55; margin-left: 6px; }
.fb-filter--active .fb-filter-count { opacity: .7; }
.fb-layout-with-sidebar { display: flex; gap: 32px; padding: 0 56px 40px; align-items: flex-start; }
.fb-main-content { flex: 1; min-width: 0; order: 2; }
.blog-sidebar { flex: 0 0 260px; order: 1; }
.series-sidebar { flex: 0 0 260px; order: 3; }
@media (max-width: 1280px) {
  .blog-sidebar, .series-sidebar { flex-basis: 230px; }
}
.fb-content { padding:0; }
.fb-empty { font-family:var(--font-poppins), 'Poppins', sans-serif; font-size:20px; font-style:italic; color:var(--dim); padding:80px 56px; text-align:center; }
.fb-featured { display:block; padding:72px 0 56px; border-bottom:1px solid var(--line); text-decoration:none; color:inherit; transition:all .4s ease; animation: fadeInScale 0.8s ease-out 0.6s both; }
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.fb-featured:hover { opacity:.95; transform: translateY(-4px); }
.fb-featured-tag { font-family:'Poppins', sans-serif; font-size:9px; letter-spacing:.3em; text-transform:uppercase; background:linear-gradient(90deg,#546cfa,#546cfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:20px; display: inline-block; padding: 4px 0; }
.fb-featured-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(28px,4vw,52px); color:var(--white); line-height:1.1; margin-bottom:20px; max-width:820px; transition: color 0.3s ease; }
.fb-featured:hover .fb-featured-title { color: #546cfa; }
.fb-featured-excerpt { font-family:var(--font-poppins),'Poppins',sans-serif; font-size:clamp(14px,1.4vw,16px); color:var(--dim); line-height:1.75; max-width:680px; font-weight:300; margin-bottom:24px; }
.fb-meta { font-family:'Poppins', sans-serif; font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:var(--dimmer); display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
.fb-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:24px; padding-top:48px; }
.fb-card { background:var(--card); border:1px solid var(--line); padding:40px 36px; text-decoration:none; color:var(--white); display:flex; flex-direction:column; gap:12px; transition:all .4s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 6px; position: relative; overflow: hidden; }
.fb-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg,#546cfa,#546cfa); transform: scaleX(0); transition: transform 0.4s ease; transform-origin: left; }
.fb-card:hover { border-color:rgba(201,168,76,.5); transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
.fb-card:hover::before { transform: scaleX(1); }
.fb-card-tag { font-family:'Poppins', sans-serif; font-size:9px; letter-spacing:.3em; text-transform:uppercase; color:var(--gold); transition: color 0.3s ease; }
.fb-card:hover .fb-card-tag { color: #546cfa; }
.fb-card-title { font-family:var(--font-poppins),'Poppins',sans-serif; font-size:clamp(16px,1.6vw,19px); font-weight:600; color:var(--white); line-height:1.3; flex:1; transition: color 0.3s ease; }
.fb-card:hover .fb-card-title { color: #e8e0d0; }
.fb-card-excerpt { font-family:var(--font-poppins),'Poppins',sans-serif; font-size:13px; color:var(--dim); line-height:1.7; font-weight:300; }
.fb-pg-footer { padding:48px 56px; border-top:1px solid var(--line); display:flex; justify-content:space-between; align-items:center; background:var(--bg2); }
.fb-footer-link { font-family:'Poppins', sans-serif; font-size:10px; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); text-decoration:none; transition:all .3s ease; }
.fb-footer-link:hover { opacity:.8; transform: translateX(4px); }
.fb-footer-copy { font-family:'Poppins', sans-serif; font-size:9px; color:var(--dimmer); letter-spacing:.1em; }
.fb-featured-cover { margin-bottom:32px; overflow:hidden; border-radius: 6px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); position: relative; height:420px; }
.fb-featured-cover-img { object-fit:cover; transition:transform .6s ease; }
.fb-featured:hover .fb-featured-cover-img { transform:scale(1.05); }
.fb-card-cover { overflow:hidden; margin:-40px -36px 20px; border-radius: 6px 6px 0 0; position: relative; height:200px; }
.fb-yt-play { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:52px; height:52px; background:rgba(255,255,255,.92); border-radius:50%; display:flex; align-items:center; justify-content:center; color:#0a0a0a; pointer-events:none; opacity:0; transition:opacity .3s; z-index:1; }
.fb-featured-cover:hover .fb-yt-play,
.fb-card:hover .fb-yt-play { opacity:1; }
.fb-card-cover-img { object-fit:cover; transition:transform .6s ease; }
.fb-card:hover .fb-card-cover-img { transform:scale(1.08); }

/* Cover placeholder — used when a post has no featured image */
.fb-cover-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,rgba(255,222,89,.1),rgba(255,145,77,.05)); position:relative; overflow:hidden; }
.fb-cover-placeholder::before { content:''; position:absolute; inset:0; background-image:radial-gradient(circle at 20% 20%, rgba(255,222,89,.12) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,145,77,.1) 0%, transparent 45%); }
.fb-cover-placeholder svg { position:relative; opacity:.35; color:var(--gold); }
:root:not(.dark) .fb-cover-placeholder { background:linear-gradient(135deg,rgba(184,134,11,.08),rgba(212,112,10,.04)); }

/* Series badge — shown on cards for posts that belong to a series */
.fb-series-badge { font-family:'Poppins', sans-serif; font-size:8px; letter-spacing:.15em; text-transform:uppercase; color:var(--dimmer); display:inline-flex; align-items:center; gap:6px; margin-top:-4px; }
:root:not(.dark) .fb-series-badge { color:#8a7f6e; }
@media(max-width:1080px){
  .fb-layout-with-sidebar { flex-direction: column; }
  .blog-sidebar, .series-sidebar { flex-basis: auto; width: 100%; order: initial; }
  .fb-main-content { order: initial; }
}
@media(max-width:900px){
  .fb-container { padding:88px 24px 0; }
  .fb-header { padding:24px 24px 40px; }
  .fb-search-container { padding: 24px; }
  .fb-filters { padding:20px 24px; top:61px; gap: 8px; }
  .fb-layout-with-sidebar { flex-direction: column; padding: 0 24px 60px; gap: 32px; }
  .fb-main-content { width: 100%; }
  .fb-grid { grid-template-columns:1fr; gap: 20px; }
  .fb-pg-footer { padding:36px 24px; flex-direction:column; gap:16px; text-align:center; }
  .fb-card { padding: 32px 24px; }
  .fb-card-cover { margin: -32px -24px 16px; }
  .fb-featured-cover { height: 240px; }
}

/* ── LIGHT MODE ── */
:root:not(.dark) body.on-fdp { background: #ffffff; color: #1a1816; }
:root:not(.dark) .fdp {
  --bg: #ffffff; --bg2: #f5f3ef; --white: #1a1816; --cream: #2a2520;
  --gold: #546cfa; --dim: #4a4640; --dimmer: #7a7060;
  --line: rgba(10,10,10,.1); --card: #f5f3ef;
}
:root:not(.dark) .fb-title { color: #0a0a0a; }
:root:not(.dark) .fb-title em {
  background: linear-gradient(90deg, #546cfa, #D4700A);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
:root:not(.dark) .fb-eyebrow {
  background: linear-gradient(90deg, #546cfa, #D4700A);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
:root:not(.dark) .fb-eyebrow::before { background: linear-gradient(90deg, #546cfa, #D4700A); }
:root:not(.dark) .fb-subtitle { color: #4a4640; }
:root:not(.dark) .fb-search-container { background: #ffffff; border-bottom-color: rgba(10,10,10,.1); }
:root:not(.dark) .fb-search-input {
  background: rgba(10,10,10,.03); border-color: rgba(10,10,10,.18); color: #1a1816;
}
:root:not(.dark) .fb-search-input::placeholder { color: #9a9080; }
:root:not(.dark) .fb-search-input:focus { border-color: rgba(184,134,11,.5); box-shadow: 0 0 0 3px rgba(184,134,11,.1); }
:root:not(.dark) .fb-search-results { color: #546cfa; }
:root:not(.dark) .fb-filters { background: #f5f3ef; border-bottom-color: rgba(10,10,10,.1); }
:root:not(.dark) .fb-filter { border-color: rgba(10,10,10,.18); color: #4a4640; }
:root:not(.dark) .fb-filter:hover { border-color: rgba(184,134,11,.5); color: #546cfa; box-shadow: 0 4px 12px rgba(184,134,11,.12); }
:root:not(.dark) .fb-filter--active { background: linear-gradient(90deg, #546cfa, #D4700A); color: #ffffff; border-color: transparent; }
:root:not(.dark) .fb-featured-tag {
  background: linear-gradient(90deg, #546cfa, #D4700A);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
:root:not(.dark) .fb-featured-title { color: #0a0a0a; }
:root:not(.dark) .fb-featured:hover .fb-featured-title { color: #546cfa; }
:root:not(.dark) .fb-featured-excerpt { color: #4a4640; }
:root:not(.dark) .fb-meta { color: #7a7060; }
:root:not(.dark) .fb-card { background: #f5f3ef; border-color: rgba(10,10,10,.12); color: #1a1816; }
:root:not(.dark) .fb-card:hover { border-color: rgba(184,134,11,.45); box-shadow: 0 20px 40px rgba(0,0,0,.1); }
:root:not(.dark) .fb-card-tag { color: #546cfa; }
:root:not(.dark) .fb-card:hover .fb-card-tag { color: #8A6200; }
:root:not(.dark) .fb-card-title { color: #0a0a0a; }
:root:not(.dark) .fb-card:hover .fb-card-title { color: #1a1816; }
:root:not(.dark) .fb-card-excerpt { color: #4a4640; }
:root:not(.dark) .fb-empty { color: #6a6058; }
:root:not(.dark) .fb-pg-footer { background: #f5f3ef; border-top-color: rgba(10,10,10,.1); }
:root:not(.dark) .fb-footer-link { color: #546cfa; }
:root:not(.dark) .fb-footer-copy { color: #7a7060; }
:root:not(.dark) .fb-series-back { color: #546cfa; border-color: rgba(184,134,11,.35); }
:root:not(.dark) .fb-series-back:hover { background: rgba(184,134,11,.08); }

/* Request button */
.fb-request-btn {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: rgba(255, 222, 89, 0.08);
  color: var(--gold);
  border: 1px solid rgba(255, 222, 89, 0.2);
  border-radius: 8px;
  padding: 12px 24px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.fb-request-btn:hover {
  background: rgba(255, 222, 89, 0.15);
  border-color: rgba(255, 222, 89, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 222, 89, 0.2);
}
:root:not(.dark) .fb-request-btn {
  background: rgba(184,134,11,.08);
  color: #546cfa;
  border-color: rgba(184,134,11,.2);
}
:root:not(.dark) .fb-request-btn:hover {
  background: rgba(184,134,11,.15);
  border-color: rgba(184,134,11,.4);
}

/* Load more */
.fb-load-more {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: transparent;
  color: var(--gold);
  border: 1px solid rgba(255, 222, 89, 0.3);
  border-radius: 8px;
  padding: 14px 40px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.fb-load-more:hover {
  background: rgba(255, 222, 89, 0.08);
  border-color: rgba(255, 222, 89, 0.5);
  transform: translateY(-2px);
}
:root:not(.dark) .fb-load-more {
  color: #546cfa;
  border-color: rgba(184,134,11,.3);
}
:root:not(.dark) .fb-load-more:hover {
  background: rgba(184,134,11,.08);
  border-color: rgba(184,134,11,.5);
}

`;
