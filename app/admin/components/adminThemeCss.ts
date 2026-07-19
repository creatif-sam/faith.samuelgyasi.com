export const adminThemeCss = `

.adm-root { transition: background-color .24s ease, color .24s ease; }
.adm-root.adm-dark {
  --adm-page-bg: #07080c;
  --adm-surface: #0b0c12;
  --adm-surface-soft: rgba(255,255,255,.04);
  --adm-border: rgba(255,255,255,.09);
  --adm-text: #eef0f5;
  --adm-text-muted: rgba(255,255,255,.45);
}
.adm-root.adm-light {
  --adm-page-bg: #f3f6fb;
  --adm-surface: #ffffff;
  --adm-surface-soft: #eef2f7;
  --adm-border: rgba(15,23,42,.14);
  --adm-text: #111827;
  --adm-text-muted: #334155;
}
.adm-root,
.adm-main,
.adm-sidebar,
.adm-mobile-header {
  background: var(--adm-page-bg);
  color: var(--adm-text);
}
.adm-sidebar,
.adm-mobile-header,
.adm-topbar {
  background: var(--adm-surface);
  border-color: var(--adm-border);
}
.adm-topbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border: 1px solid var(--adm-border);
  background: var(--adm-surface);
  border-radius: 16px;
  padding: 10px 12px;
  margin-bottom: 18px;
  box-shadow: 0 10px 26px rgba(0,0,0,.16);
}
.adm-topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.adm-search-wrap {
  min-width: 220px;
  width: min(48vw, 520px);
  height: 40px;
  border: 1px solid var(--adm-border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  background: var(--adm-surface-soft);
}
.adm-search-wrap svg { color: var(--adm-text-muted); }
.adm-search {
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--adm-text);
  font-size: 13px;
}
.adm-search::placeholder { color: var(--adm-text-muted); }
.adm-topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.adm-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid var(--adm-border);
  background: var(--adm-surface-soft);
  color: var(--adm-text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.adm-icon-btn:hover {
  border-color: rgba(84,108,250,.42);
  color: var(--adm-text);
}
.adm-profile-wrap { position: relative; }
.adm-profile {
  border: 1px solid var(--adm-border);
  background: var(--adm-surface-soft);
  border-radius: 12px;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  text-align: left;
}
.adm-profile:hover { border-color: rgba(84,108,250,.42); }
.adm-profile-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 190px;
  border: 1px solid var(--adm-border);
  background: var(--adm-surface);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,.22);
  padding: 6px;
  z-index: 240;
}
.adm-profile-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--adm-text-muted);
  font-family: var(--font-poppins, sans-serif);
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: background .14s, color .14s;
}
.adm-profile-menu-item:hover { background: var(--adm-surface-soft); color: var(--adm-text); }
.adm-profile-menu-item svg { flex-shrink: 0; color: inherit; }
.adm-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg,#546cfa,#546cfa);
  color: #09090d;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.adm-pname { color: var(--adm-text); font-size: 12px; font-weight: 600; line-height: 1.1; }
.adm-pmail { color: var(--adm-text-muted); font-size: 11px; line-height: 1.1; }
/* ── Light mode: page / surface backgrounds ── */
.adm-root.adm-light main,
.adm-root.adm-light aside {
  background: var(--adm-page-bg) !important;
}
.adm-root.adm-light [class*="bg-[#07080c]"],
.adm-root.adm-light [class*="bg-[#0b0c12]"],
.adm-root.adm-light [class*="bg-[#0d0e15]"] {
  background: var(--adm-surface) !important;
}
/* semi-transparent white cards → visible soft surface */
.adm-root.adm-light [class*="bg-white/"] {
  background: var(--adm-surface-soft) !important;
}
/* ── Light mode: text ── */
.adm-root.adm-light [class*="text-white"],
.adm-root.adm-light [class*="text-[#eef0f5]"],
.adm-root.adm-light [class*="text-\[#eef0f5\]"] {
  color: var(--adm-text) !important;
}
/* Keep gold / status / badge text as-is (narrow overrides above already won't touch them) */
/* ── Light mode: borders ── */
.adm-root.adm-light [class*="border-white"] {
  border-color: var(--adm-border) !important;
}
/* ── Light mode: sidebar nav inactive items ── */
.adm-root.adm-light aside nav button:not([class*="text-[#546cfa]"]) {
  color: var(--adm-text-muted) !important;
}
.adm-root.adm-light aside nav button:not([class*="text-[#546cfa]"]):hover {
  color: var(--adm-text) !important;
  background: var(--adm-surface-soft) !important;
}
/* ── Light mode: sidebar footer ── */
.adm-root.adm-light aside a,
.adm-root.adm-light aside footer button {
  color: var(--adm-text-muted) !important;
  border-color: var(--adm-border) !important;
}
.adm-root.adm-light [class*="shadow-"] {
  box-shadow: 0 8px 24px rgba(15,23,42,.08) !important;
}
/* ── Search results dropdown ── */
.adm-topbar-left { position: relative; }
.adm-search-results {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  min-width: 260px;
  background: var(--adm-surface);
  border: 1px solid var(--adm-border);
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(0,0,0,.22);
  z-index: 350;
  overflow: hidden;
}
.adm-search-result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-family: var(--font-poppins, sans-serif);
  font-size: 13px;
  color: var(--adm-text);
  border-bottom: 1px solid var(--adm-border);
  transition: background .14s;
}
.adm-search-result-item:last-child { border-bottom: 0; }
.adm-search-result-item:hover { background: var(--adm-surface-soft); }
.adm-search-result-item svg { color: var(--adm-text-muted); flex-shrink: 0; }
.adm-search-no-results {
  padding: 14px;
  font-size: 12px;
  color: var(--adm-text-muted);
  font-family: var(--font-poppins, sans-serif);
  text-align: center;
}
.adm-notif-wrap { position: relative; }
.adm-notif-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #546cfa;
  color: #09090d;
  font-size: 9px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
.adm-notif-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: min(420px, 82vw);
  max-height: 420px;
  overflow-y: auto;
  border: 1px solid var(--adm-border);
  background: var(--adm-surface);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,.22);
  padding: 10px;
  z-index: 240;
}
.adm-notif-item {
  border: 1px solid var(--adm-border);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 8px;
  background: var(--adm-surface-soft);
}
.adm-notif-title { font-size: 12px; color: var(--adm-text); font-weight: 600; margin-bottom: 4px; }
.adm-notif-body { font-size: 12px; color: var(--adm-text-muted); line-height: 1.4; margin-bottom: 4px; }
.adm-notif-time { font-size: 10px; color: var(--adm-text-muted); }
@media (max-width: 768px) {
  .adm-topbar { margin-top: 0; }
  .adm-search-wrap { width: 44vw; min-width: 140px; }
  .adm-profile { display: none; }
}

`;
