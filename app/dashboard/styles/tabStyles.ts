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
  height: 100%; background: linear-gradient(90deg,#546cfa,#546cfa);
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
  background: linear-gradient(135deg,#546cfa,#546cfa);
  color: #09090d;
}
.dash-btn-gold:hover { opacity: .88; transform: translateY(-1px); }
.dash-btn-enrolled {
  background: rgba(84,108,250,.1);
  color: var(--d-gold);
  border: 1px solid rgba(84,108,250,.22) !important;
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
  background: linear-gradient(135deg,#546cfa,#546cfa);
  color: #09090d; font-size: 30px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(84,108,250,.3);
  border: 3px solid rgba(84,108,250,.3);
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
  border-top-color: #546cfa;
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
.pf-hero-email {
  font-size: 12px; color: var(--d-muted); margin-top: 4px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  max-width: 100%;
}
.pf-hero-role {
  font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
  color: var(--d-gold); margin-top: 6px;
}
.pf-section { margin-bottom: 28px; }
.pf-section-label {
  font-family: var(--font-poppins), sans-serif;
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
.pf-input:focus { border-color: rgba(84,108,250,.5); }
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
.pf-btn-logout:hover { background: var(--d-hover); border-color: rgba(84,108,250,.3); }
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
.dash-profile-value {
  font-size: 13px; color: var(--d-text); font-weight: 600;
  text-align: right; overflow: hidden; text-overflow: ellipsis;
  white-space: nowrap; max-width: 220px;
}
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
  border: none; background: transparent;
  color: var(--d-muted);
  font-family: var(--font-poppins), sans-serif;
  font-size: 12px; font-weight: 500;
  cursor: pointer; transition: color .18s, background .18s;
}
.dash-toggle-btn.active {
  background: var(--d-surf);
  color: var(--d-gold);
  box-shadow: 0 1px 6px rgba(0,0,0,.15);
}

/* Loading */
@keyframes db-pulse { 0%,100%{opacity:.2;transform:scale(.8)} 50%{opacity:1;transform:scale(1.1)} }
.dash-dot {
  width: 8px; height: 8px; background: #546cfa; border-radius: 50%;
  animation: db-pulse 1.2s ease-in-out infinite;
}

/* Skeleton shimmer */
@keyframes sk-shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}
.sk-block {
  border-radius: 8px;
  background: linear-gradient(90deg, var(--d-soft) 25%, color-mix(in srgb, var(--d-text) 6%, transparent) 50%, var(--d-soft) 75%);
  background-size: 800px 100%;
  animation: sk-shimmer 1.4s ease-in-out infinite;
}
.sk-card {
  border-radius: 14px;
  border: 1px solid var(--d-border);
  overflow: hidden;
}
.sk-thumb { height: 140px; }
.sk-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.sk-title { height: 14px; width: 70%; }
.sk-sub   { height: 11px; width: 45%; }
.sk-bar   { height: 6px;  width: 100%; }
.sk-stat  {
  border: 1px solid var(--d-border);
  border-radius: 12px;
  padding: 16px;
  display: flex; align-items: center; gap: 12px;
}
.sk-stat-icon { width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0; }
.sk-stat-num  { height: 22px; width: 48px; margin-bottom: 6px; }
.sk-stat-lbl  { height: 11px; width: 72px; }

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
.hb-input:focus { border-color: rgba(84,108,250,.5); }
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
  border-color: rgba(84,108,250,.6);
  background: rgba(84,108,250,.1);
}
.hb-form-actions {
  display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;
}
.hb-btn-primary {
  background: linear-gradient(135deg,#546cfa,#546cfa);
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
.hb-btn-ghost:hover { border-color: rgba(84,108,250,.4); color: var(--d-text); }

/* Habit cards */
.hb-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 32px; }
.hb-card {
  background: var(--d-surf); border: 1px solid var(--d-border);
  border-radius: 14px; padding: 16px 18px;
  display: flex; align-items: flex-start; gap: 14px;
  transition: border-color .2s, box-shadow .2s;
}
.hb-card:hover { border-color: rgba(84,108,250,.25); box-shadow: 0 6px 20px rgba(0,0,0,.14); }
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
.hb-check-btn.undone { background: rgba(84,108,250,.1); color: var(--d-gold); border: 1px solid rgba(84,108,250,.2); }
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
.hb-day.done { background: rgba(84,108,250,.45); border-color: rgba(84,108,250,.6); }
.hb-day.today { outline: 2px solid var(--d-gold); outline-offset: 1px; }

@media (max-width: 640px) {
  .dash-stats { grid-template-columns: repeat(2, 1fr); }
  .dash-content { padding: 16px 14px 88px; }
  .dash-grid { grid-template-columns: 1fr; }
  .dash-profile-card { padding: 22px 18px; }
}

/* -- BOTTOM NAV (mobile only, app-style) -- */
.dash-bottom-nav {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  display: flex; align-items: center; justify-content: space-around;
  height: calc(62px + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: var(--d-surf);
  border-top: 1px solid var(--d-border);
  z-index: 600;
  box-shadow: 0 -6px 32px rgba(0,0,0,.28);
  backdrop-filter: blur(14px) saturate(1.4);
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
}
@media (min-width: 769px) { .dash-bottom-nav { display: none; } }
.dash-bottom-nav-item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 4px; padding: 6px 4px;
  border: none; background: transparent;
  color: var(--d-muted);
  font-family: var(--font-poppins), sans-serif;
  font-size: 9px; font-weight: 600; letter-spacing: .02em;
  cursor: pointer; transition: color .2s;
  position: relative;
  min-height: 56px;
}
.dash-bottom-nav-item .bn-icon-wrap {
  width: 40px; height: 28px; border-radius: 999px;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s, transform .18s;
}
.dash-bottom-nav-item.active { color: var(--d-gold); }
.dash-bottom-nav-item.active .bn-icon-wrap {
  background: rgba(84,108,250,.15);
  transform: translateY(-1px);
}
.dash-bottom-nav-badge {
  position: absolute; top: 4px; left: calc(50% + 6px);
  min-width: 14px; height: 14px; border-radius: 999px;
  background: var(--d-gold); color: #09090d;
  font-size: 8px; font-weight: 700;
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0 3px; border: 2px solid var(--d-page);
}

/* -- OVERVIEW TAB -- */
.ov-hero {
  display: flex; align-items: center; gap: 18px;
  background: var(--d-surf); border: 1px solid var(--d-border);
  border-radius: 16px; padding: 24px 28px; margin-bottom: 28px;
}
.ov-hero-avatar {
  width: 64px; height: 64px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg,#546cfa,#546cfa);
  color: #09090d; font-size: 22px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.ov-hero-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.ov-hero-greeting { font-size: clamp(18px,3vw,24px); font-weight: 700; color: var(--d-text); line-height: 1.25; }
.ov-hero-name {
  background: linear-gradient(90deg,#546cfa,#f0cc7a);
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
.ov-habit-chip.done { border-color: rgba(84,108,250,.4); color: var(--d-text); }
.ov-habit-icon { font-size: 16px; }
.ov-habit-name { font-size: 13px; font-weight: 500; }
@media (max-width: 640px) {
  .ov-hero { flex-direction: column; align-items: flex-start; gap: 12px; padding: 18px; }
  .ov-hero-avatar { width: 50px; height: 50px; font-size: 18px; }
}

/* Onboarding checklist */
.ob-checklist {
  background: var(--d-surf); border: 1px solid rgba(84,108,250,.25);
  border-radius: 14px; padding: 18px 20px; margin-bottom: 24px;
}
.ob-checklist-title {
  font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  color: var(--d-gold); margin-bottom: 12px;
}
.ob-steps { display: flex; flex-direction: column; gap: 8px; }
.ob-step {
  display: flex; align-items: center; gap: 10px;
  background: transparent; border: none; padding: 4px 0;
  font-size: 13px; color: var(--d-text); cursor: pointer; text-align: left;
  font-family: var(--font-poppins), sans-serif;
}
.ob-step svg { color: var(--d-gold); flex-shrink: 0; }
.ob-step.done { color: var(--d-muted); text-decoration: line-through; cursor: default; }
.ob-step.done svg { color: #22c55e; }

/* Messages tab */
.msg-list { display: flex; flex-direction: column; gap: 14px; }
.msg-card {
  background: var(--d-surf); border: 1px solid var(--d-border);
  border-radius: 14px; padding: 16px 18px;
}
.msg-card.unread { border-color: rgba(84,108,250,.35); }
.msg-card-head { display: flex; align-items: center; gap: 8px; color: var(--d-gold); margin-bottom: 8px; }
.msg-card-title { font-size: 13px; font-weight: 700; color: var(--d-text); }
.msg-card-time { font-size: 11px; color: var(--d-muted); margin-left: auto; }
.msg-card-body { font-size: 13px; color: var(--d-muted); line-height: 1.6; margin: 0 0 10px; }
.msg-reply-sent {
  background: var(--d-soft); border-radius: 10px; padding: 10px 14px; margin-top: 6px;
}
.msg-reply-label { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--d-gold); margin-bottom: 4px; }
.msg-reply-sent p { font-size: 13px; color: var(--d-text); margin: 0; }
.msg-reply-form { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.msg-reply-input {
  width: 100%; background: var(--d-soft); border: 1px solid var(--d-border); border-radius: 9px;
  color: var(--d-text); font-family: var(--font-poppins), sans-serif;
  font-size: 13px; padding: 9px 12px; outline: none; resize: vertical; min-height: 60px;
  box-sizing: border-box; transition: border-color .18s;
}
.msg-reply-input:focus { border-color: rgba(84,108,250,.5); }

/* Journal tab */
.jr-textarea { min-height: 90px; resize: vertical; }
.jr-form-actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 12px; flex-wrap: wrap; }
.jr-share-toggle { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--d-muted); cursor: pointer; }
.jr-list { display: flex; flex-direction: column; gap: 14px; }
.jr-card {
  background: var(--d-surf); border: 1px solid var(--d-border);
  border-radius: 14px; padding: 16px 18px;
}
.jr-card-head { display: flex; align-items: center; gap: 8px; color: var(--d-gold); margin-bottom: 8px; }
.jr-card-date { font-size: 11px; color: var(--d-muted); }
.jr-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase;
  color: var(--d-muted); background: var(--d-soft); border: 1px solid var(--d-border);
  border-radius: 999px; padding: 3px 9px;
}
.jr-badge.shared { color: var(--d-gold); border-color: rgba(84,108,250,.3); }
.jr-card-body { font-size: 13px; color: var(--d-text); line-height: 1.7; margin: 0; white-space: pre-wrap; }

/* Goals tab */
.gl-list { display: flex; flex-direction: column; gap: 14px; }
.gl-card {
  background: var(--d-surf); border: 1px solid var(--d-border);
  border-radius: 14px; padding: 16px 18px;
  display: flex; align-items: flex-start; gap: 14px;
}
.gl-card.completed { opacity: .6; }
.gl-card-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  background: rgba(84,108,250,.1); color: var(--d-gold);
}
.gl-card-icon.done { background: rgba(34,197,94,.12); color: #22c55e; }
.gl-card-body { flex: 1; min-width: 0; }
.gl-card-title { font-size: 14px; font-weight: 600; color: var(--d-text); }
.gl-card-desc { font-size: 12px; color: var(--d-muted); margin-top: 2px; }
.gl-card-date { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--d-muted); margin-top: 6px; }
.gl-card-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

/* Growth tab — internal sub-nav (Messages / Journal / Goals) */
.gr-subnav {
  display: flex; gap: 6px; margin-bottom: 20px;
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  scrollbar-width: none; padding-bottom: 2px;
}
.gr-subnav::-webkit-scrollbar { display: none; }
.gr-subnav-item {
  display: flex; align-items: center; gap: 6px; flex-shrink: 0;
  background: var(--d-soft); border: 1px solid var(--d-border);
  border-radius: 999px; padding: 8px 14px;
  font-family: var(--font-poppins), sans-serif;
  font-size: 12px; font-weight: 600; color: var(--d-muted);
  cursor: pointer; white-space: nowrap; transition: border-color .18s, color .18s;
}
.gr-subnav-item.active { color: var(--d-gold); border-color: rgba(84,108,250,.4); background: rgba(84,108,250,.08); }
.gr-subnav-badge {
  min-width: 16px; height: 16px; border-radius: 999px;
  background: var(--d-gold); color: #09090d;
  font-size: 9px; font-weight: 700;
  display: inline-flex; align-items: center; justify-content: center; padding: 0 4px;
}

/* Mobile: keep card headers from squeezing titles when a badge/time/delete
   button share the row — let them wrap onto a second line instead. */
@media (max-width: 480px) {
  .msg-card-head, .jr-card-head { flex-wrap: wrap; row-gap: 4px; }
  .msg-card-time { margin-left: 0; width: 100%; order: 3; }
  .jr-badge { margin-left: 0; }
  .jr-card-head > button.hb-del-btn { margin-left: auto; }
  .gl-card { flex-wrap: wrap; }
  .gl-card-actions { width: 100%; }
  .dash-page-header { margin-bottom: 16px; }
  .hb-form, .msg-card, .jr-card, .gl-card { padding: 14px; }
}
`;
