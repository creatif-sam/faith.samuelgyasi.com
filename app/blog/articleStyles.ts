export const articleCss = `
/* ── DARK MODE (default) ── */
.fdp {
  --bg:#080807; --bg2:#0e0d0b; --white:#f0ece4; --cream:#e8e0d0;
  --gold:#c9a84c; --dim:#7a7060; --dimmer:#3e3830;
  --line:rgba(240,236,228,.06); --card:#111009; min-height:100vh;
}
html.dark body.on-article { background:#080807; color:#f0ece4; font-family:'Poppins', sans-serif; }

/* ── LIGHT MODE ── */
html.light .fdp {
  --bg:#faf9f7; --bg2:#f0ece4; --white:#1a1814; --cream:#2a2420;
  --gold:#9a6d10; --dim:#5a5048; --dimmer:#9a9080;
  --line:rgba(26,24,20,.1); --card:#ede8e0;
}
html.light body.on-article { background:#faf9f7; color:#1a1814; font-family:'Poppins', sans-serif; }
html.light .fdp-article-nav { background:rgba(250,249,247,.96); border-bottom:1px solid rgba(0,0,0,.08); }
html.light .nav-back { color:var(--dim); }
html.light .nav-back:hover { color:#9a6d10; }
html.light .nav-logo { color:var(--white); }
html.light .fa-comment-input, html.light .fa-comment-textarea { background:#fff; border-color:rgba(0,0,0,.15); color:var(--white); }
html.light .fa-comment-form { background:rgba(0,0,0,.02); border-color:rgba(0,0,0,.1); }
html.light .fa-comment-item { background:rgba(0,0,0,.02); border-color:rgba(0,0,0,.08); }
html.light .fa-comment-btn { color:#faf9f7; }
html.light .eval-modal { background:var(--bg2); }
html.light .eval-textarea { background:#fff; border-color:rgba(0,0,0,.12); color:var(--white); }
html.light .eval-textarea::placeholder { color:var(--dimmer); }
html.light .eval-btn-submit { color:#faf9f7; }
html.light .bible-tooltip { background:linear-gradient(135deg,rgba(240,236,228,.99),rgba(250,249,247,.99)); border-color:#9a6d10; }
html.light .bible-tooltip-text { color:var(--cream); }
html.light .bible-tooltip::after { border-top-color:#9a6d10; }
html.light .fa-lead { background:rgba(154,109,16,.04); }
html.light .fa-share-btn { color:var(--dim); border-color:var(--line); }
html.light .fa-share-btn:hover { border-color:rgba(154,109,16,.5); color:#9a6d10; }
html.light .fa-author { background:var(--card); border-color:var(--line); }
html.light .fa-adjacent-card { background:var(--card); border-color:var(--line); }
html.light .fa-adjacent-card:hover { border-color:rgba(154,109,16,.4); background:rgba(154,109,16,.03); }

.fdp-article-nav { position:fixed; top:0; left:0; right:0; z-index:200; padding:22px 56px; display:flex; justify-content:space-between; align-items:center; background:rgba(6,6,5,.96); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); border-bottom:1px solid rgba(255,222,89,.08); }
.nav-back { font-family:'Poppins', sans-serif; font-size:10px; letter-spacing:.22em; text-transform:uppercase; color:var(--dim); text-decoration:none; transition:color .3s; }
.nav-back:hover { color:#ffde59; }
.nav-logo { font-family:var(--font-playfair),'Playfair Display',serif; font-size:17px; color:var(--white); letter-spacing:.06em; }
.fa-article { max-width:760px; margin:0 auto; padding:140px 40px 80px; }
.fa-header { margin-bottom:64px; }
.fa-tag { font-family:'Poppins', sans-serif; font-size:9px; letter-spacing:.3em; text-transform:uppercase; background:linear-gradient(90deg,#ffde59,#ff914d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:24px; }
.fa-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(32px,5vw,62px); color:var(--white); line-height:1.08; margin-bottom:24px; }
.fa-meta { font-family:'Poppins', sans-serif; font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:var(--dim); display:flex; gap:12px; align-items:center; margin-bottom:40px; flex-wrap:wrap; }
.fa-lead { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(18px,2.2vw,24px); font-style:italic; color:var(--cream); line-height:1.55; padding:28px 36px; border-left:3px solid transparent; border-image:linear-gradient(180deg,#ffde59,#ff914d) 1; background:rgba(255,222,89,.04); text-align:justify; }
.fa-body { font-family:var(--font-poppins), 'Poppins', sans-serif; font-size:clamp(17px,1.8vw,21px); line-height:1.9; color:rgba(240,236,228,.78); font-weight:300; }
html.light .fa-body { color:rgba(26,24,20,.82); }
.fa-body h2 { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(22px,3vw,32px); color:var(--white); margin:52px 0 20px; font-weight:700; }
.fa-body h3 { font-family:var(--font-playfair),'Playfair Display',serif; font-size:22px; color:var(--white); margin:40px 0 16px; }
.fa-body p { margin-bottom:28px; text-align:justify; }
.fa-body em { color:var(--cream); }
.fa-body strong { color:var(--white); }
.fa-body blockquote { border-left:3px solid transparent; border-image:linear-gradient(180deg,#ffde59,#ff914d) 1; padding:20px 32px; background:rgba(255,222,89,.04); font-style:italic; font-size:19px; color:var(--cream); margin:40px 0; text-align:justify; }
.fa-body h1 { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(26px,3.6vw,38px); color:var(--white); margin:0 0 12px; font-weight:700; }
.fa-body .eyebrow { font-family:'Poppins', sans-serif; font-size:12px; letter-spacing:.25em; text-transform:uppercase; background:linear-gradient(90deg,#ffde59,#ff914d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:14px; }
.fa-body .subtitle { font-family:var(--font-playfair),'Playfair Display',serif; font-style:italic; font-size:19px; color:var(--dim); margin-bottom:32px; }
.fa-body .lede { font-size:19px; color:var(--cream); margin-bottom:32px; text-align:justify; }
.fa-body .verse-block { background:var(--card); border:1px solid var(--line); border-left:3px solid transparent; border-image:linear-gradient(180deg,#ffde59,#ff914d) 1; border-radius:8px; padding:32px 36px; margin:36px 0; }
.fa-body .verse-block p { font-family:var(--font-playfair),'Playfair Display',serif; font-style:italic; font-size:22px; line-height:1.5; color:var(--cream); margin-bottom:0; text-align:justify; }
.fa-body .verse-block span { display:block; margin-top:16px; font-family:'Poppins', sans-serif; font-style:normal; font-size:11px; font-weight:500; letter-spacing:.15em; text-transform:uppercase; color:var(--gold); }
.fa-body ol.application { list-style:none; counter-reset:app-counter; margin:24px 0 36px; padding:0; }
.fa-body ol.application li { counter-increment:app-counter; position:relative; padding:16px 0 16px 56px; border-top:1px solid var(--line); margin-bottom:0; text-align:justify; }
.fa-body ol.application li:last-child { border-bottom:1px solid var(--line); }
.fa-body ol.application li::before { content:counter(app-counter); position:absolute; left:0; top:14px; width:30px; height:30px; border-radius:50%; background:var(--card); border:1px solid var(--line); color:var(--gold); font-family:var(--font-playfair),'Playfair Display',serif; font-weight:700; font-size:15px; display:flex; align-items:center; justify-content:center; }
.fa-body .prayer { margin-top:44px; padding:32px 36px; background:var(--card); border-left:3px solid transparent; border-image:linear-gradient(180deg,#ffde59,#ff914d) 1; border-radius:8px; }
.fa-body .prayer .label { font-family:'Poppins', sans-serif; font-size:11px; font-weight:500; letter-spacing:.15em; text-transform:uppercase; color:var(--gold); margin-bottom:12px; }
.fa-body .prayer p { font-family:var(--font-playfair),'Playfair Display',serif; font-style:italic; font-size:19px; line-height:1.6; color:var(--cream); margin-bottom:0; }
.fa-related { margin-top:80px; padding-top:56px; border-top:1px solid var(--line); }
.fa-related-label { font-family:'Poppins', sans-serif; font-size:9px; letter-spacing:.3em; text-transform:uppercase; background:linear-gradient(90deg,#ffde59,#ff914d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:32px; display:flex; align-items:center; gap:16px; }
.fa-related-label::before { content:''; width:36px; height:1px; background:linear-gradient(90deg,#ffde59,#ff914d); }
.fa-related-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:2px; }
.fa-related-card { background:var(--card); border:1px solid var(--line); padding:32px 28px; text-decoration:none; color:var(--white); display:flex; flex-direction:column; gap:10px; transition:border-color .3s,padding-left .3s; }
.fa-related-card:hover { border-color:rgba(201,168,76,.25); padding-left:36px; }
.fa-rc-tag { font-family:'Poppins', sans-serif; font-size:9px; letter-spacing:.25em; text-transform:uppercase; color:var(--gold); }
.fa-rc-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:18px; color:var(--white); line-height:1.25; flex:1; }
.fa-rc-meta { font-family:'Poppins', sans-serif; font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:var(--dimmer); }
.fa-footer { margin-top:64px; padding-top:40px; border-top:1px solid var(--line); display:flex; flex-direction:column; gap:24px; }
.fa-adjacent-nav { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.fa-adjacent-card { display:flex; flex-direction:column; gap:8px; padding:20px 24px; border:1px solid var(--line); border-radius:8px; text-decoration:none; background:var(--card); transition:border-color .3s, background .3s, transform .3s; }
.fa-adjacent-card:hover { border-color:rgba(201,168,76,.4); background:rgba(255,222,89,.03); transform:translateY(-2px); }
.fa-adjacent-newer { grid-column:2; text-align:right; align-items:flex-end; }
.fa-adjacent-dir { font-family:'Poppins', sans-serif; font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:var(--gold); display:flex; align-items:center; gap:6px; }
.fa-adjacent-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:15px; color:var(--white); line-height:1.3; }
/* Share row */
.fa-share { display:flex; align-items:center; gap:14px; margin-top:28px; padding-top:24px; border-top:1px solid var(--line); flex-wrap:wrap; }
.fa-share-label { font-family:'Poppins', sans-serif; font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:var(--dim); }
.fa-share-buttons { display:flex; gap:8px; }
.fa-share-btn { width:34px; height:34px; border-radius:50%; border:1px solid var(--line); background:transparent; color:var(--dim); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .25s ease; padding:0; }
.fa-share-btn:hover { border-color:rgba(201,168,76,.5); color:var(--gold); transform:translateY(-2px); }
/* Author card */
.fa-author { display:flex; gap:20px; align-items:center; margin-top:64px; padding:28px; border:1px solid var(--line); border-radius:10px; background:var(--card); }
.fa-author-photo { width:72px; height:72px; border-radius:50%; object-fit:cover; object-position:top; flex-shrink:0; border:2px solid rgba(201,168,76,.3); }
.fa-author-body { flex:1; min-width:0; }
.fa-author-name { font-family:var(--font-playfair),'Playfair Display',serif; font-size:18px; color:var(--white); font-weight:600; }
.fa-author-tagline { font-family:'Poppins', sans-serif; font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:var(--gold); margin:4px 0 10px; }
.fa-author-bio { font-family:var(--font-poppins),'Poppins',sans-serif; font-size:14px; color:var(--dim); line-height:1.6; font-weight:300; margin-bottom:10px; }
.fa-author-link { font-family:'Poppins', sans-serif; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:var(--gold); text-decoration:none; transition:opacity .3s; }
.fa-author-link:hover { opacity:.7; }
.fa-comments { margin-top:70px; padding-top:42px; border-top:1px solid var(--line); }
.fa-comments-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:30px; color:var(--white); margin-bottom:8px; }
.fa-comments-sub { font-size:14px; color:var(--dim); margin-bottom:20px; }
.fa-comments-empty { color:var(--dim); margin-bottom:18px; }
.fa-comments-list { display:flex; flex-direction:column; gap:12px; margin-bottom:22px; }
.fa-comment-item { border:1px solid var(--line); background:rgba(255,255,255,.02); padding:14px 16px; }
.fa-comment-head { font-size:12px; color:var(--gold); margin-bottom:8px; }
.fa-comment-text { font-size:16px; color:var(--cream); line-height:1.6; }
.fa-comment-form { border:1px solid var(--line); background:rgba(255,255,255,.02); padding:16px; }
.fa-comment-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px; }
.fa-comment-input,.fa-comment-textarea { width:100%; border:1px solid var(--line); background:#12110d; color:var(--white); padding:10px 12px; font-family:var(--font-poppins),'Poppins',sans-serif; font-size:13px; }
.fa-comment-textarea { resize:vertical; }
.fa-comment-btn { margin-top:10px; background:linear-gradient(135deg,#ffde59,#ff914d); color:#080807; border:0; padding:10px 16px; font-size:11px; letter-spacing:.08em; text-transform:uppercase; cursor:pointer; }
.fa-back-link { font-family:'Poppins', sans-serif; font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--dim); text-decoration:none; transition:color .3s; }
.fa-back-link:hover { color:var(--gold); }
.fa-cover { margin:40px 0 56px; overflow:hidden; }
.fa-cover-img { width:100%; max-height:520px; object-fit:cover; display:block; }
.fa-infographie { margin:56px 0 0; padding-top:56px; border-top:1px solid var(--line); }
.fa-infographie-label { font-family:'Poppins', sans-serif; font-size:9px; letter-spacing:.3em; text-transform:uppercase; color:var(--gold); margin-bottom:28px; }
.fa-infographie-img { width:100%; display:block; border:1px solid var(--line); }
.eval-modal-overlay { position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.7); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:20px; animation:fadeIn 0.25s ease; }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
.eval-modal { background:var(--bg2); border:1px solid var(--line); border-radius:14px; max-width:400px; width:100%; max-height:85vh; overflow-y:auto; padding:24px 24px 20px; position:relative; animation:slideUp 0.25s ease; box-shadow:0 20px 60px rgba(0,0,0,0.5); }
@keyframes slideUp { from { transform:translateY(16px); opacity:0; } to { transform:translateY(0); opacity:1; } }
.eval-close { position:absolute; top:12px; right:12px; background:transparent; border:none; color:var(--dim); font-size:20px; line-height:1; cursor:pointer; transition:color 0.2s, transform 0.2s; width:26px; height:26px; display:flex; align-items:center; justify-content:center; }
.eval-close:hover { color:var(--white); transform:rotate(90deg); }
.eval-header { margin-bottom:16px; padding-right:20px; }
.eval-header h3 { font-family:var(--font-poppins),'Poppins',sans-serif; font-size:17px; font-weight:600; color:var(--white); margin-bottom:4px; line-height:1.25; }
.eval-header p { font-family:var(--font-poppins),'Poppins',sans-serif; font-size:12.5px; font-weight:300; color:var(--dim); line-height:1.45; }
.eval-body { margin-bottom:18px; }
.eval-label { font-family:var(--font-poppins),'Poppins',sans-serif; font-size:10px; font-weight:500; letter-spacing:0.05em; text-transform:uppercase; color:var(--gold); display:block; margin-bottom:8px; }
.eval-label-categories { margin-top:16px; }
.eval-label-comment { margin-top:14px; }
.eval-required { color:#ff914d; }
.star-rating { display:flex; gap:4px; margin-bottom:2px; }
.star-rating button { background:transparent; border:none; cursor:pointer; font-size:24px; color:var(--dimmer); transition:all 0.2s ease; padding:0; line-height:1; }
.star-rating button:hover, .star-rating button.star-active { color:var(--gold); transform:scale(1.1); }
.eval-checkboxes { display:flex; flex-wrap:wrap; gap:7px; }
.eval-checkbox-label { display:inline-flex; align-items:center; font-family:var(--font-poppins),'Poppins',sans-serif; font-size:12px; font-weight:400; color:var(--dim); cursor:pointer; transition:all 0.2s; padding:6px 13px; border:1px solid var(--line); border-radius:20px; }
.eval-checkbox-label:hover { color:var(--cream); border-color:rgba(201,168,76,.4); }
.eval-checkbox-label:has(input:checked) { background:rgba(201,168,76,.12); border-color:var(--gold); color:var(--gold); }
.eval-checkbox-label input[type="checkbox"] { position:absolute; width:1px; height:1px; opacity:0; pointer-events:none; }
.eval-textarea { width:100%; background:var(--card); border:1px solid var(--line); border-radius:6px; padding:10px 12px; font-family:var(--font-poppins),'Poppins',sans-serif; font-size:13px; font-weight:300; color:var(--white); resize:vertical; min-height:56px; transition:border-color 0.2s; }
.eval-textarea:focus { outline:none; border-color:var(--gold); }
.eval-textarea::placeholder { color:var(--dimmer); }
.eval-actions { display:flex; gap:8px; justify-content:flex-end; }
.eval-btn { font-family:var(--font-poppins),'Poppins',sans-serif; font-size:10.5px; font-weight:500; letter-spacing:0.05em; text-transform:uppercase; padding:10px 18px; border-radius:6px; cursor:pointer; transition:all 0.2s; border:none; }
.eval-btn-skip { background:transparent; color:var(--dim); border:1px solid var(--line); }
.eval-btn-skip:hover { color:var(--white); border-color:var(--dim); }
.eval-btn-submit { background:linear-gradient(135deg,#ffde59,#ff914d); color:var(--bg); border:none; }
.eval-btn-submit:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(255,222,89,0.3); }
.eval-btn-submit:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
.bible-ref { text-decoration:underline; text-decoration-color:var(--gold); text-decoration-thickness:1px; text-underline-offset:3px; cursor:help; color:var(--cream); transition:all 0.2s ease; position:relative; }
.bible-ref:hover { color:var(--gold); text-decoration-thickness:2px; }
.bible-tooltip { position:fixed; z-index:10000; background:linear-gradient(135deg,rgba(15,15,13,0.98),rgba(25,25,23,0.98)); border:1px solid var(--gold); border-radius:8px; padding:16px 20px; max-width:420px; width:max-content; box-shadow:0 12px 40px rgba(0,0,0,0.7),0 0 0 1px rgba(255,222,89,0.1); transform:translateX(-50%) translateY(-100%) translateY(-12px); pointer-events:none; animation:tooltipFadeIn 0.2s ease; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); }
@keyframes tooltipFadeIn { from { opacity:0; transform:translateX(-50%) translateY(-100%) translateY(-8px); } to { opacity:1; transform:translateX(-50%) translateY(-100%) translateY(-12px); } }
.bible-tooltip::after { content:''; position:absolute; bottom:-8px; left:50%; transform:translateX(-50%); width:0; height:0; border-left:8px solid transparent; border-right:8px solid transparent; border-top:8px solid var(--gold); }
.bible-tooltip-text { font-family:var(--font-poppins), 'Poppins', sans-serif; font-size:16px; line-height:1.7; color:var(--cream); font-weight:300; margin-bottom:8px; }
.bible-tooltip-ref { font-family:'Poppins', sans-serif; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--gold); font-weight:400; }
@media(max-width:768px) {
  .fdp-article-nav { padding:18px 24px; }
  .fa-article { padding:130px 24px 60px; }
  .fa-related-grid { grid-template-columns:1fr; }
  .fa-footer { flex-direction:column; align-items:flex-start; }
  .fa-adjacent-nav { grid-template-columns:1fr; }
  .fa-adjacent-newer { grid-column:1; text-align:left; align-items:flex-start; }
  .fa-author { flex-direction:column; text-align:center; padding:24px; }
  .fa-author-link { display:inline-block; }
  .eval-modal { padding:20px 18px 18px; max-width:calc(100vw - 32px); }
  .eval-header h3 { font-size:16px; }
  .star-rating button { font-size:22px; }
  .eval-actions { flex-direction:column; }
  .eval-btn { width:100%; }
  .bible-tooltip { max-width:calc(100vw - 40px); font-size:14px; padding:12px 16px; left:50% !important; }
  .bible-tooltip-text { font-size:14px; line-height:1.6; }
}
`;
