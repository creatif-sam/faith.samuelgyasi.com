export const tabStyles = `

/* Progress */
.dash-progress-label {
  font-size: 10px; color: var(--d-muted);
  display: flex; justify-content: space-between; margin-bottom: 5px;
}
.dash-progress-bar {
  height: 4px; background: color-mix(in srgb, var(--d-text) 10%, transparent);
  border-radius: 2px; overflow: hidden;
}
.dash-progress-fill {
  height: 100%; background: linear-gradient(90deg,#ffde59,#ff914d);
  border-radius: 2px; transition: width .5s ease;
}

/* Buttons */
.dash-btn {
  margin-top: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
  padding: 10px 16px;
  border-radius: 8px; border: none; cursor: pointer;
  transition: opacity .18s, transform .18s; width: 100%;
  font-family: var(--font-poppins), sans-serif;
}
.dash-btn-gold {
  background: linear-gradient(135deg,#d4a843,#c49838);
  color: #09090d;
}
.dash-btn-gold:hover { opacity: .88; transform: translateY(-1px); }
.dash-btn-enrolled {
  background: rgba(212,168,67,.1);
  color: var(--d-gold);
  border: 1px solid rgba(212,168,67,.22) !important;
}

/* Empty */
.dash-empty {
  grid-column: 1 / -1;
  font-size: 14px; color: var(--d-muted);
  padding: 56px; text-align: center;
  border: 1px dashed var(--d-border);
  border-radius: 14px;
}

/* -- PROFILE TAB (redesigned) -- */
.dash-profile-card {
  background: var(--d-surf);
  border: 1px solid var(--d-border);
  border-radius: 16px;
  padding: 32px 36px;
  max-width: 580px;
}
.pf-avatar-wrap {
  position: relative; display: inline-block; cursor: pointer;
}
.pf-avatar-img {
  width: 90px; height: 90px; border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--d-border);
  box-shadow: 0 4px 20px rgba(0,0,0,.25);
  display: block;
}
.pf-avatar-fallback {
  width: 90px; height: 90px; border-radius: 50%;
  background: linear-gradient(135deg,#d4a843,#c49838);
  color: #09090d; font-size: 30px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(212,168,67,.3);
  border: 3px solid rgba(212,168,67,.3);
  flex-shrink: 0;
}
.pf-avatar-overlay {
  position: absolute; inset: 0; border-radius: 50%;
  background: rgba(0,0,0,.55);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity .18s;
  color: #fff;
}
.pf-avatar-wrap:hover .pf-avatar-overlay { opacity: 1; }
.pf-avatar-uploading {
  position: absolute; inset: 0; border-radius: 50%;
  background: rgba(0,0,0,.65);
  display: flex; align-items: center; justify-content: center;
}
.pf-avatar-spinner {
  width: 22px; height: 22px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.2);
  border-top-color: #d4a843;
  animation: pf-spin .7s linear infinite;
}
@keyframes pf-spin { to { transform: rotate(360deg); } }
.pf-hero {
  display: flex; align-items: center; gap: 22px;
  margin-bottom: 28px; padding-bottom: 28px;
  border-bottom: 1px solid var(--d-border);
  flex-wrap: wrap;
}
.pf-hero-info { flex: 1; min-width: 0; }
.pf-hero-name { font-size: 22px; font-weight: 700; color: var(--d-text); line-height: 1.2; }
.pf-hero-email { font-size: 12px; color: var(--d-muted); margin-top: 4px; }
.pf-hero-role {
  font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
  color: var(--d-gold); margin-top: 6px;
}
.pf-section { margin-bottom: 28px; }
.pf-section-label {
  font-family: var(--font-space-mono), monospace;
  font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
  color: var(--d-muted); margin-bottom: 14px;
}
.pf-field { margin-bottom: 14px; }
.pf-label { font-size: 11px; font-weight: 600; color: var(--d-muted); display: block; margin-bottom: 6px; }
.pf-input {
  width: 100%; background: var(--d-soft);
  border: 1px solid var(--d-border); border-radius: 10px;
  color: var(--d-text); font-family: var(--font-poppins), sans-serif;
  font-size: 13px; padding: 10px 14px; outline: none;
  transition: border-color .18s; box-sizing: border-box;
}
.pf-input:focus { border-color: rgba(212,168,67,.5); }
.pf-input:disabled { opacity: .5; cursor: default; }
.pf-input-static { font-size: 13px; color: var(--d-text); font-weight: 500; padding: 10px 0; }
.pf-btn-save {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 20px; border-radius: 10px; border: none; cursor: pointer;
  background: var(--d-gold); color: #09090d;
  font-family: var(--font-poppins), sans-serif;
  font-size: 13px; font-weight: 700;
  transition: opacity .18s;
  margin-top: 4px;
}
.pf-btn-save:disabled { opacity: .5; cursor: default; }
.pf-btn-logout {
  display: flex; align-items: center; gap: 9px;
  width: 100%; padding: 13px 16px; border-radius: 12px;
  border: 1px solid var(--d-border); background: var(--d-soft);
  color: var(--d-text); font-family: var(--font-poppins), sans-serif;
  font-size: 13px; font-weight: 600; cursor: pointer;
  transition: background .18s, border-color .18s;
  margin-bottom: 10px;
}
.pf-btn-logout:hover { background: var(--d-hover); border-color: rgba(212,168,67,.3); }
.pf-danger-zone {
  border: 1px solid rgba(220,60,60,.25);
  border-radius: 14px;
  padding: 20px;
  margin-top: 8px;
  background: rgba(220,60,60,.04);
}
.pf-danger-title {
  font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
  color: #f87171; margin-bottom: 10px;
  display: flex; align-items: center; gap: 7px;
}
.pf-danger-desc { font-size: 12px; color: var(--d-muted); margin-bottom: 16px; line-height: 1.55; }
.pf-btn-delete {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 18px; border-radius: 10px;
  border: 1px solid rgba(220,60,60,.4); background: rgba(220,60,60,.12);
  color: #f87171; font-family: var(--font-poppins), sans-serif;
  font-size: 13px; font-weight: 700; cursor: pointer;
  transition: background .18s;
}
.pf-btn-delete:hover { background: rgba(220,60,60,.22); }
.pf-btn-delete:disabled { opacity: .5; cursor: default; }
.pf-confirm-input {
  width: 100%; background: var(--d-soft);
  border: 1px solid rgba(220,60,60,.4); border-radius: 10px;
  color: var(--d-text); font-family: var(--font-poppins), sans-serif;
  font-size: 13px; padding: 10px 14px; outline: none;
  box-sizing: border-box; margin-bottom: 12px;
}
.pf-confirm-input:focus { border-color: rgba(220,60,60,.7); }
.dash-profile-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--d-border);
  gap: 16px;
}
.dash-profile-row:last-child { border-bottom: none; }
.dash-profile-label { font-size: 12px; color: var(--d-muted); font-weight: 500; }
.dash-profile-value { font-size: 13px; color: var(--d-text); font-weight: 600; text-align: right; }
.dash-toggle-row {
  display: flex; gap: 4px;
  background: var(--d-soft);
  border: 1px solid var(--d-border);
  border-radius: 8px;
  padding: 3px;
}
.dash-toggle-btn {
  padding: 5px 14px;
  border-radius: 6px;
  border: none; background: transparent;.dash-toggle-btn.active {
  background: var(--d-surf);
  color: var(--d-gold);
  box-shadow: 0 1px 6px rgba(0,0,0,.15);
}

/* Loading */
@keyframes db-pulse { 0%,100%{opacity:.2;transform:scale(.8)} 50%{opacity:1;transform:scale(1.1)} }
.dash-dot {
  width: 8px; height: 8px; background: #d4a843; border-radius: 50%;
  animation: db-pulse 1.2s ease-in-out infinite;
}

/* -- HABITS TAB -- */
.hb-form {
  background: var(--d-surf);
  border: 1px solid var(--d-border);
  border-radius: 14px;
  padding: 22px 20px;
  margin-bottom: 28px;
}
.hb-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 600px) { .hb-form-grid { grid-template-columns: 1fr; } }
.hb-label {
  font-size: 11px; font-weight: 600; color: var(--d-muted);
  display: block; margin-bottom: 5px;
}
.hb-input {
  width: 100%; background: var(--d-soft);
  border: 1px solid var(--d-border); border-radius: 9px;
  color: var(--d-text); font-family: var(--font-poppins), sans-serif;
  font-size: 13px; padding: 9px 12px; outline: none;
  transition: border-color .18s;
  box-sizing: border-box;
}
.hb-input:focus { border-color: rgba(212,168,67,.5); }
.hb-icon-row {
  display: flex; flex-wrap: wrap; gap: 6px;
}
.hb-icon-pick {
  width: 34px; height: 34px; border-radius: 8px;
  border: 1px solid var(--d-border); background: var(--d-soft);
  cursor: pointer; font-size: 16px;
  display: flex; align-items: center; justify-content: center;
  transition: border-color .15s, background .15s;
}
.hb-icon-pick.sel {
  border-color: rgba(212,168,67,.6);
  background: rgba(212,168,67,.1);
}
.hb-form-actions {
  display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;
}
.hb-btn-primary {
  background: linear-gradient(135deg,#d4a843,#c49838);
  color: #09090d; border: none;
  font-family: var(--font-poppins), sans-serif;
  font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  padding: 9px 20px; border-radius: 8px; cursor: pointer;
  transition: opacity .18s;
}
.hb-btn-primary:hover { opacity: .88; }
.hb-btn-ghost {
  background: var(--d-soft); border: 1px solid var(--d-border);
  color: var(--d-muted);
  font-family: var(--font-poppins), sans-serif;
  font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
  padding: 9px 20px; border-radius: 8px; cursor: pointer;
  transition: border-color .18s, color .18s;
}
.hb-btn-ghost:hover { border-color: rgba(212,168,67,.4); color: var(--d-text); }

/* Habit cards */
.hb-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 32px; }
.hb-card {
  background: var(--d-surf); border: 1px solid var(--d-border);
  border-radius: 14px; padding: 16px 18px;
  display: flex; align-items: flex-start; gap: 14px;
  transition: border-color .2s, box-shadow .2s;
}
.hb-card:hover { border-color: rgba(212,168,67,.25); box-shadow: 0 6px 20px rgba(0,0,0,.14); }
.hb-card-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.hb-card-body { flex: 1; min-width: 0; }
.hb-card-name { font-size: 14px; font-weight: 600; color: var(--d-text); }
.hb-card-desc { font-size: 12px; color: var(--d-muted); margin-top: 2px; }
.hb-card-actions { display: flex; align-items: center; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
.hb-check-btn {
  display: flex; align-items: center; gap: 5px;
  border: none; border-radius: 8px; cursor: pointer;
  font-family: var(--font-poppins), sans-serif;
  font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase;
  padding: 7px 14px;
  transition: opacity .18s, transform .18s;
}
.hb-check-btn:hover { opacity: .85; transform: scale(1.03); }
.hb-check-btn.done { background: rgba(34,197,94,.12); color: #22c55e; border: 1px solid rgba(34,197,94,.22); }
.hb-check-btn.undone { background: rgba(212,168,67,.1); color: var(--d-gold); border: 1px solid rgba(212,168,67,.2); }
.hb-del-btn {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 7px;
  border: 1px solid var(--d-border); background: transparent;
  color: var(--d-muted); cursor: pointer; transition: border-color .18s, color .18s;
}
.hb-del-btn:hover { border-color: rgba(239,68,68,.4); color: #ef4444; }
.hb-streak-badge {
  display: flex; align-items: center; gap: 4px;
  font-size: 10px; font-weight: 700; color: #f97316;
  background: rgba(249,115,22,.1); border: 1px solid rgba(249,115,22,.18);
  border-radius: 999px; padding: 3px 9px;
}

/* Habit stats */
.hb-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 28px; }
@media (max-width: 480px) { .hb-stats { grid-template-columns: 1fr 1fr; } }
.hb-stat {
  background: var(--d-surf); border: 1px solid var(--d-border);
  border-radius: 12px; padding: 14px 16px;
  display: flex; align-items: center; gap: 12px;
}
.hb-stat-icon {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.hb-stat-num { font-size: 22px; font-weight: 700; color: var(--d-text); line-height: 1; }
.hb-stat-lbl { font-size: 10px; color: var(--d-muted); font-weight: 500; margin-top: 3px; }

/* 30-day heatmap row */
.hb-heatmap { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 10px; }
.hb-day {
  width: 18px; height: 18px; border-radius: 4px;
  background: var(--d-soft); border: 1px solid var(--d-border);
  transition: background .15s;
}
.hb-day.done { background: rgba(212,168,67,.45); border-color: rgba(212,168,67,.6); }
.hb-day.today { outline: 2px solid var(--d-gold); outline-offset: 1px; }

@media (max-width: 640px) {
  .dash-stats { grid-template-columns: repeat(2, 1fr); }
  .dash-content { padding: 16px 14px 88px; }
  .dash-grid { grid-template-columns: 1fr; }
  .dash-profile-card { padding: 22px 18px; }
}

/* -- BOTTOM NAV (mobile only) -- */
.dash-bottom-nav {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  display: flex; align-items: stretch; justify-content: space-around;
  background: var(--d-surf);
  border-top: 1px solid var(--d-border);
  z-index: 600;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  box-shadow: 0 -4px 24px rgba(0,0,0,.22);
  backdrop-filter: blur(10px);
}
@media (min-width: 769px) { .dash-bottom-nav { display: none; } }
.dash-bottom-nav-item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 3px; padding: 8px 4px 10px;
  border: none; background: transparent;
  color: var(--d-muted);
  font-family: var(--font-poppins), sans-serif;
  font-size: 10px; font-weight: 500;
  cursor: pointer; transition: color .18s;
  position: relative;
}
.dash-bottom-nav-item.active { color: var(--d-gold); }
.dash-bottom-nav-item.active::before {
  content: '';
  position: absolute; top: 0; left: 22%; right: 22%; height: 2px;
  background: var(--d-gold);
  border-radius: 0 0 3px 3px;
}
.dash-bottom-nav-badge {
  position: absolute; top: 5px; right: calc(50% - 20px);
  min-width: 14px; height: 14px; border-radius: 999px;
  background: var(--d-gold); color: #09090d;
  font-size: 8px; font-weight: 700;
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0 3px;
}

/* -- OVERVIEW TAB -- */
.ov-hero {
  display: flex; align-items: center; gap: 18px;
  background: var(--d-surf); border: 1px solid var(--d-border);
  border-radius: 16px; padding: 24px 28px; margin-bottom: 28px;
}
.ov-hero-avatar {
  width: 64px; height: 64px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg,#d4a843,#c49838);
  color: #09090d; font-size: 22px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.ov-hero-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.ov-hero-greeting { font-size: clamp(18px,3vw,24px); font-weight: 700; color: var(--d-text); line-height: 1.25; }
.ov-hero-name {
  background: linear-gradient(90deg,#d4a843,#f0cc7a);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.ov-hero-sub { font-size: 13px; color: var(--d-muted); margin-top: 4px; }
.ov-see-all {
  margin-left: auto; display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 500; color: var(--d-gold);
  background: transparent; border: none; cursor: pointer;
  padding: 2px 0; font-family: var(--font-poppins), sans-serif;
  transition: opacity .18s;
}
.ov-see-all:hover { opacity: .7; }
.ov-habits-row { display: flex; flex-wrap: wrap; gap: 10px; }
.ov-habit-chip {
  display: flex; align-items: center; gap: 8px;
  background: var(--d-soft); border: 1px solid var(--d-border);
  border-radius: 999px; padding: 6px 14px;
  font-size: 13px; color: var(--d-muted);
  transition: border-color .2s, color .2s;
}
.ov-habit-chip.done { border-color: rgba(212,168,67,.4); color: var(--d-text); }
.ov-habit-icon { font-size: 16px; }
.ov-habit-name { font-size: 13px; font-weight: 500; }
@media (max-width: 640px) {
  .ov-hero { flex-direction: column; align-items: flex-start; gap: 12px; padding: 18px; }
  .ov-hero-avatar { width: 50px; height: 50px; font-size: 18px; }
}
`;
