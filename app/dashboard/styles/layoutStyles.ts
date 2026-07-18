export const layoutStyles = `

/* â”€â”€ THEME TOKENS â”€â”€ */
.dash-root {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  transition: background .24s, color .24s;
}
.dash-root.dash-dark {
  --d-page:   #07080c;
  --d-surf:   #0b0c12;
  --d-soft:   rgba(255,255,255,.04);
  --d-border: rgba(255,255,255,.09);
  --d-text:   #eef0f5;
  --d-muted:  rgba(255,255,255,.42);
  --d-gold:   #546cfa;
}
.dash-root.dash-light {
  --d-page:   #f3f6fb;
  --d-surf:   #ffffff;
  --d-soft:   #eef2f7;
  --d-border: rgba(15,23,42,.14);
  --d-text:   #111827;
  --d-muted:  #475569;
  --d-gold:   #b8900a;
}

/* â”€â”€ LAYOUT â”€â”€ */
.dash-root { background: var(--d-page); color: var(--d-text); }
.dash-main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  min-width: 0;
}

/* â”€â”€ SIDEBAR â”€â”€ */
.dash-sidebar {
  width: 240px;
  flex-shrink: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--d-surf);
  border-right: 1px solid var(--d-border);
  overflow-y: auto;
  padding: 20px 12px 24px;
  gap: 6px;
  transition: transform .25s cubic-bezier(.4,0,.2,1);
  z-index: 300;
}
@media (max-width: 768px) {
  .dash-sidebar {
    position: fixed;
    left: 0; top: 0; bottom: 0;
    transform: translateX(-100%);
    box-shadow: 4px 0 32px rgba(0,0,0,.5);
  }
  .dash-sidebar.open { transform: translateX(0); }
}
.dash-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.55);
  z-index: 290;
  backdrop-filter: blur(2px);
}
@media (max-width: 768px) { .dash-overlay { display: block; } }

/* Sidebar brand */
.dash-brand {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 8px 18px;
  border-bottom: 1px solid var(--d-border);
  margin-bottom: 8px;
  text-decoration: none; color: var(--d-text);
}
.dash-brand-dot {
  width: 34px; height: 34px; border-radius: 10px;
  background: linear-gradient(135deg,#546cfa,#546cfa);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #09090d; flex-shrink: 0;
}
.dash-brand-name {
  font-size: 14px; font-weight: 700; letter-spacing: -.01em;
}

/* Sidebar nav */
.dash-nav-item {
  width: 100%;
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--d-muted);
  font-family: var(--font-poppins), sans-serif;
  font-size: 13px; font-weight: 500;
  cursor: pointer;
  transition: background .18s, color .18s;
  text-align: left;
}
.dash-nav-item:hover {
  background: var(--d-soft);
  color: var(--d-text);
}
.dash-nav-item.active {
  background: rgba(212,168,67,.12);
  color: var(--d-gold);
  font-weight: 600;
}
.dash-nav-item .dash-nav-badge {
  margin-left: auto;
  background: var(--d-gold);
  color: #09090d;
  font-size: 10px; font-weight: 700;
  border-radius: 999px;
  padding: 1px 7px;
  min-width: 20px; text-align: center;
}
.dash-nav-section {
  font-family: var(--font-poppins), sans-serif;
  font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
  color: var(--d-muted);
  padding: 14px 12px 6px;
}
.dash-sidebar-spacer { flex: 1; }
.dash-logout {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--d-border);
  background: var(--d-soft);
  color: var(--d-muted);
  font-family: var(--font-poppins), sans-serif;
  font-size: 12px; font-weight: 500;
  cursor: pointer;
  transition: all .18s;
  width: 100%;
}
.dash-logout:hover { border-color: rgba(212,168,67,.4); color: var(--d-gold); }

/* -- MOBILE HEADER (fixed, md:hidden) -- */
.dash-mobile-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 600;
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px;
  background: var(--d-surf);
  border-bottom: 1px solid var(--d-border);
  box-shadow: 0 2px 20px rgba(0,0,0,.4);
}
@media (min-width: 769px) { .dash-mobile-header { display: none; } }
.dash-mobile-ham {
  background: var(--d-soft); border: 1px solid var(--d-border);
  border-radius: 8px; color: var(--d-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center; padding: 6px;
  transition: all .18s;
}
.dash-mobile-ham:hover { background: var(--d-border); color: var(--d-text); }
.dash-mobile-brand {
  font-size: 14px; font-weight: 600; color: var(--d-text);
  display: flex; align-items: center; gap: 8px;
}
.dash-mobile-brand-dot {
  width: 28px; height: 28px; border-radius: 8px;
  background: linear-gradient(135deg,#546cfa,#546cfa);
  color: #09090d; font-size: 9px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
/* -- TOPBAR (floating, exactly like admin) -- */
.dash-topbar {
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: space-between;
  gap: 14px; padding: 10px 12px;
  margin: 62px 16px 0;
  border-radius: 16px;
  border: 1px solid var(--d-border);
  background: var(--d-surf);
  box-shadow: 0 10px 26px rgba(0,0,0,.16);
}
@media (min-width: 769px) { .dash-topbar { margin: 24px 48px 0; } }
.dash-topbar-left { display: flex; align-items: center; gap: 10px; min-width: 0; position: relative; }
.dash-topbar-right { display: flex; align-items: center; gap: 10px; }
.dash-search-wrap {
  min-width: 220px; width: min(48vw, 520px); height: 40px;
  border: 1px solid var(--d-border); border-radius: 12px;
  display: flex; align-items: center; gap: 8px; padding: 0 10px;
  background: var(--d-soft);
}
.dash-search-wrap svg { color: var(--d-muted); }
.dash-search {
  flex: 1; border: 0; outline: 0; background: transparent;
  color: var(--d-text); font-size: 13px;
  font-family: var(--font-poppins), sans-serif;
}
.dash-search::placeholder { color: var(--d-muted); }
.dash-icon-btn {
  width: 36px; height: 36px; border-radius: 999px;
  border: 1px solid var(--d-border); background: var(--d-soft);
  color: var(--d-muted);
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; transition: border-color .18s, color .18s;
}
.dash-icon-btn:hover { border-color: rgba(212,168,67,.42); color: var(--d-text); }
.dash-profile-wrap { position: relative; }
.dash-profile {
  border: 1px solid var(--d-border); background: var(--d-soft);
  border-radius: 12px; padding: 6px 10px;
  display: flex; align-items: center; gap: 8px;
  cursor: pointer; text-align: left; font-family: inherit;
}
.dash-profile:hover { border-color: rgba(212,168,67,.42); }
.dash-avatar {
  width: 30px; height: 30px; border-radius: 50%;
  background: linear-gradient(135deg,#546cfa,#546cfa);
  color: #09090d; font-size: 12px; font-weight: 700;
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.dash-pname { color: var(--d-text); font-size: 12px; font-weight: 600; line-height: 1.1; }
.dash-pmail { color: var(--d-muted); font-size: 11px; line-height: 1.1; }
.dash-profile-menu {
  position: absolute; top: calc(100% + 8px); right: 0;
  min-width: 190px;
  border: 1px solid var(--d-border); background: var(--d-surf);
  border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,.22);
  padding: 6px; z-index: 700;
}
.dash-profile-menu-item {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 9px 10px; border-radius: 8px;
  border: none; background: transparent; color: var(--d-muted);
  font-family: var(--font-poppins), sans-serif; font-size: 12px; font-weight: 500;
  text-decoration: none; cursor: pointer; transition: background .14s, color .14s;
}
.dash-profile-menu-item:hover { background: var(--d-soft); color: var(--d-text); }
.dash-profile-menu-item svg { flex-shrink: 0; color: inherit; }
.dash-notif-wrap { position: relative; }
.dash-notif-badge {
  position: absolute; top: -5px; right: -5px;
  min-width: 16px; height: 16px; border-radius: 999px;
  background: #546cfa; color: #09090d; font-size: 9px; font-weight: 700;
  display: inline-flex; align-items: center; justify-content: center; padding: 0 4px;
}
.dash-notif-panel {
  position: absolute; top: calc(100% + 8px); right: 0;
  width: min(360px, 88vw); max-height: 420px; overflow-y: auto;
  border: 1px solid var(--d-border); background: var(--d-surf);
  border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,.22);
  padding: 10px; z-index: 700;
}
.dash-notif-panel-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 8px; padding: 0 2px;
}
.dash-notif-panel-title { font-size: 12px; font-weight: 600; color: var(--d-text); }
.dash-notif-mark-read {
  font-size: 11px; color: var(--d-gold); background: none; border: none; cursor: pointer;
}
.dash-notif-mark-read:disabled { opacity: .5; cursor: default; }
.dash-notif-item {
  border: 1px solid var(--d-border); border-radius: 10px;
  padding: 10px; margin-bottom: 6px; background: var(--d-soft);
  position: relative;
}
.dash-notif-item.unread { border-color: rgba(212,168,67,.4); }
.dash-notif-item.unread::before {
  content: ""; position: absolute; top: 12px; left: -5px;
  width: 8px; height: 8px; border-radius: 50%; background: var(--d-gold);
}
.dash-notif-title-row { font-size: 12px; font-weight: 600; color: var(--d-text); margin-bottom: 3px; }
.dash-notif-body { font-size: 12px; color: var(--d-muted); line-height: 1.45; margin-bottom: 4px; }
.dash-notif-time { font-size: 10px; color: var(--d-muted); }
.dash-notif-empty { padding: 20px 8px; text-align: center; font-size: 12px; color: var(--d-muted); }
@media (max-width: 768px) {
  .dash-root { display: block; }
  .dash-main-area { height: 100vh; }
  .dash-topbar { padding: 8px 10px; gap: 6px; margin: 62px 10px 0; }
  .dash-topbar-left { flex: 1; }
  .dash-search-wrap { width: 100%; min-width: unset; }
  .dash-topbar-right { display: none; }
  .dash-profile { display: none; }
  .dash-content { padding-bottom: 88px; }
}

/* â”€â”€ MAIN CONTENT â”€â”€ */
.dash-content {
  flex: 1;
  overflow-y: auto;
  padding: 22px 22px 40px;
}
.dash-content::-webkit-scrollbar { width: 6px; }
.dash-content::-webkit-scrollbar-track { background: transparent; }
.dash-content::-webkit-scrollbar-thumb { background: var(--d-border); border-radius: 3px; }

/* Page header */
.dash-page-header { margin-bottom: 28px; }
.dash-page-title {
  font-size: 26px; font-weight: 700; color: var(--d-text);
  letter-spacing: -.02em; line-height: 1.2;
}
.dash-page-sub { font-size: 13px; color: var(--d-muted); margin-top: 4px; }

/* â”€â”€ STATS ROW â”€â”€ */
.dash-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 32px;
}
.dash-stat {
  background: var(--d-surf);
  border: 1px solid var(--d-border);
  border-radius: 14px;
  padding: 18px 20px;
  display: flex; align-items: center; gap: 14px;
  transition: border-color .2s, box-shadow .2s;
}
.dash-stat:hover {
  border-color: rgba(212,168,67,.3);
  box-shadow: 0 6px 20px rgba(0,0,0,.15);
}
.dash-stat-icon {
  width: 42px; height: 42px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.dash-stat-icon.gold   { background: rgba(212,168,67,.12); color: #546cfa; }
.dash-stat-icon.green  { background: rgba(34,197,94,.1);  color: #22c55e; }
.dash-stat-icon.blue   { background: rgba(96,165,250,.1); color: #60a5fa; }
.dash-stat-icon.purple { background: rgba(167,139,250,.1); color: #a78bfa; }
.dash-stat-num {
  font-size: 24px; font-weight: 700;
  background: linear-gradient(135deg,#546cfa,#f0cc7a);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  line-height: 1;
}
.dash-stat-lbl { font-size: 11px; color: var(--d-muted); margin-top: 3px; font-weight: 500; }

/* Section header */
.dash-section-head {
  display: flex; align-items: center; gap: 10px;
  font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase;
  color: var(--d-muted);
  margin-bottom: 18px;
}
.dash-section-head::after { content: ''; flex: 1; height: 1px; background: var(--d-border); }

/* â”€â”€ TRAINING CARDS â”€â”€ */
.dash-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(288px, 1fr));
  gap: 18px;
  margin-bottom: 40px;
}
.dash-card {
  background: var(--d-surf);
  border: 1px solid var(--d-border);
  border-radius: 14px;
  overflow: hidden;
  display: flex; flex-direction: column;
  transition: border-color .25s, box-shadow .25s, transform .25s;
  text-decoration: none; color: inherit;
}
.dash-card:hover {
  border-color: rgba(212,168,67,.4);
  box-shadow: 0 14px 36px rgba(0,0,0,.3);
  transform: translateY(-3px);
}
.dash-card-thumb {
  width: 100%; aspect-ratio: 16/9;
  background: rgba(212,168,67,.06);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  position: relative;
}
.dash-card-thumb img { width: 100%; height: 100%; object-fit: cover; }
.dash-card-placeholder { color: rgba(212,168,67,.2); }
.dash-blog-read-badge {
  position: absolute; top: 10px; right: 10px;
  display: inline-flex; align-items: center; gap: 4px;
  background: rgba(10,10,10,.72); backdrop-filter: blur(4px);
  color: #4ade80; font-size: 10px; font-weight: 600;
  padding: 4px 9px; border-radius: 999px;
  font-family: var(--font-poppins), sans-serif;
}
.dash-card-body { padding: 18px 20px; flex: 1; display: flex; flex-direction: column; gap: 7px; }
.dash-card-cat {
  font-family: var(--font-poppins), sans-serif;
  font-size: 9px; letter-spacing: .25em; text-transform: uppercase;
  background: linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.dash-card-title { font-size: 15px; font-weight: 600; color: var(--d-text); line-height: 1.35; flex: 1; }
.dash-card-desc { font-size: 12px; color: var(--d-muted); line-height: 1.6; font-weight: 300; }
.dash-card-meta {
  font-family: var(--font-poppins), sans-serif;
  font-size: 9px; letter-spacing: .1em; text-transform: uppercase;
  color: var(--d-muted);
  display: flex; gap: 12px;
  border-top: 1px solid var(--d-border); padding-top: 10px; margin-top: 4px;
}
`;
