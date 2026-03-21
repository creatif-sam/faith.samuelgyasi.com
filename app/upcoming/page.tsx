"use client";

import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const css = `
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
  line-height: 0.9;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  margin-bottom: 28px;
  opacity: 0;
  animation: up-rise .85s .24s ease forwards;
}
.up-headline em {
  display: block;
  font-style: italic;
  font-weight: 400;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.up-rule {
  width: 56px; height: 2px;
  background: var(--gold-gradient);
  margin: 20px 0 28px;
  opacity: 0;
  animation: up-rise .8s .36s ease forwards;
}
.up-sub {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: clamp(16px,2vw,19px);
  font-weight: 300;
  color: rgba(245,243,239,.6);
  max-width: 560px;
  line-height: 1.7;
  opacity: 0;
  animation: up-rise .8s .48s ease forwards;
}
@keyframes up-rise {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: none; }
}

/* ── SECTION ANCHOR LABELS ── */
.up-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 8% 100px;
}
.up-section {
  padding-top: 80px;
  border-top: 1px solid rgba(201,168,76,.1);
  margin-top: 60px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity .65s ease, transform .65s ease;
}
.up-section:first-child { border-top: none; }
.up-section.up-visible { opacity: 1; transform: none; }

.up-section-label {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 9px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}
.up-section-title {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: clamp(28px,4vw,52px);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--white);
  margin-bottom: 48px;
}

/* ── EVENT CARDS ── */
.up-cards {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 20px;
}
.up-card {
  padding: 0;
  background: rgba(245,243,239,.03);
  border: 1px solid rgba(201,168,76,.15);
  border-radius: 16px;
  transition: border-color .3s, background .3s, transform .3s, box-shadow .3s;
  opacity: 0;
  transform: translateY(16px);
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,.2);
}
.up-card.up-visible { opacity: 1; transform: none; }
.up-card:hover { 
  border-color: rgba(201,168,76,.4); 
  background: rgba(245,243,239,.05); 
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(201,168,76,.15);
}

.up-card-date {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 9px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 14px;
}
.up-card-tag {
  display: inline-block;
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 8px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 4px 10px;
  border: 1px solid rgba(201,168,76,.3);
  color: rgba(201,168,76,.7);
  margin-bottom: 18px;
}
.up-card-title {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: clamp(16px,1.8vw,20px);
  font-weight: 700;
  color: var(--white);
  line-height: 1.3;
  margin-bottom: 12px;
}
.up-card-body {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.8;
  color: rgba(245,243,239,.5);
  margin-bottom: 20px;
}
.up-card-location {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(245,243,239,.3);
}
.up-card-location::before { content: '◎ '; }

/* empty state */
.up-coming-soon {
  grid-column: 1/-1;
  padding: 60px 40px;
  text-align: center;
  border: 1px dashed rgba(201,168,76,.15);
  border-radius: 16px;
  background: rgba(245,243,239,.01);
}
.up-coming-soon-icon {
  font-size: 28px;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  animation: up-pulse 4s ease-in-out infinite;
}
@keyframes up-pulse { 0%,100%{opacity:.3;} 50%{opacity:.7;} }
.up-coming-soon p {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 16px;
  font-weight: 300;
  color: rgba(245,243,239,.3);
}

/* ── NOTIFY STRIP ── */
.up-notify {
  background: rgba(201,168,76,.04);
  border-top: 1px solid rgba(201,168,76,.12);
  border-bottom: 1px solid rgba(201,168,76,.12);
  padding: 72px 8%;
  text-align: center;
}
.up-notify-inner { max-width: 560px; margin: 0 auto; }
.up-notify-eyebrow {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 9px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 18px;
}
.up-notify-h {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: clamp(22px,3vw,36px);
  font-style: italic;
  color: var(--white);
  margin-bottom: 14px;
  line-height: 1.2;
}
.up-notify-sub {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 16px;
  font-weight: 300;
  color: rgba(245,243,239,.45);
  margin-bottom: 32px;
  line-height: 1.6;
}
.up-notify-btn {
  display: inline-block;
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  padding: 13px 30px;
  border: 1px solid rgba(201,168,76,.55);
  color: rgba(201,168,76,.85);
  text-decoration: none;
  transition: all .2s;
}
.up-notify-btn:hover {
  background: rgba(201,168,76,.08);
  border-color: rgba(201,168,76,.9);
  color: #fff;
}

/* ── CARD (overrides) ── */
.up-card--past { border-color: rgba(245,243,239,.08); box-shadow: 0 2px 12px rgba(0,0,0,.15); }
.up-card--past:hover { 
  border-color: rgba(245,243,239,.15); 
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,.2);
}

/* FLYER */
.up-card-flyer { position: relative; overflow: hidden; }
.up-card-flyer-img { width: 100%; display: block; aspect-ratio: 3/4; object-fit: cover; transition: transform .5s ease; }
.up-card:hover .up-card-flyer-img { transform: scale(1.03); }
.up-card--past .up-card-flyer-img { filter: grayscale(30%) brightness(.85); }

/* Past badge */
.up-card-past-badge {
  position: absolute; top: 12px; right: 12px;
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 7px; letter-spacing: .2em; text-transform: uppercase;
  padding: 4px 9px;
  background: rgba(10,10,10,.85); border: 1px solid rgba(245,243,239,.15);
  color: rgba(245,243,239,.4); backdrop-filter: blur(6px);
}
.up-card-past-badge--inline {
  position: static; display: inline-block; margin: 12px 12px 0;
}

/* Card body wrap */
.up-card-body-wrap { padding: 24px 28px 28px; }
.up-card--past .up-card-body-wrap { padding: 16px 20px 20px; }

.up-card-meta-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
.up-card--past .up-card-date { background: none; -webkit-text-fill-color: rgba(245,243,239,.3); color: rgba(245,243,239,.3); }
.up-card-format {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 7px; letter-spacing: .16em; text-transform: uppercase;
  padding: 3px 8px; border-radius: 2px; white-space: nowrap;
}
.up-card-format--online { background: rgba(99,206,180,.12); color: #63ceb4; border: 1px solid rgba(99,206,180,.2); }
.up-card-format--in-person { background: rgba(201,168,76,.1); color: #c9a84c; border: 1px solid rgba(201,168,76,.2); }
.up-card-format--both { background: rgba(145,147,255,.1); color: #9193ff; border: 1px solid rgba(145,147,255,.2); }

.up-card--past .up-card-title { font-size: clamp(14px,1.2vw,16px); color: rgba(245,243,239,.55); }
.up-card-desc {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 14px; font-weight: 300; line-height: 1.75;
  color: rgba(245,243,239,.45); margin-bottom: 12px;
}
.up-card-host {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 8px; letter-spacing: .14em; text-transform: uppercase;
  color: rgba(245,243,239,.28); margin-bottom: 18px;
}
.up-card-host-link { color: rgba(201,168,76,.65); text-decoration: none; }
.up-card-host-link:hover { color: #c9a84c; }

.up-section--past { border-top: 1px solid rgba(245,243,239,.06); }
.up-section-title--past { font-size: clamp(20px,2.5vw,32px); color: rgba(245,243,239,.4); }
.up-cards--past { grid-template-columns: repeat(4,1fr); }

/* Action buttons */
.up-card-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.up-btn {
  display: inline-flex; align-items: center; justify-content: center;
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 8px; letter-spacing: .18em; text-transform: uppercase;
  padding: 9px 18px; border: 1px solid transparent;
  cursor: pointer; text-decoration: none; transition: all .2s;
  background: transparent; white-space: nowrap;
}
.up-btn--gold { background: var(--gold-gradient); color: #08080a; border: none; }
.up-btn--gold:hover { opacity: .88; transform: translateY(-1px); }
.up-btn--gold:disabled { opacity: .5; cursor: not-allowed; transform: none; }
.up-btn--outline { border-color: rgba(201,168,76,.4); color: rgba(201,168,76,.85); }
.up-btn--outline:hover { background: rgba(201,168,76,.08); border-color: rgba(201,168,76,.7); color: var(--white); }
.up-btn--ghost { border-color: rgba(245,243,239,.12); color: rgba(245,243,239,.45); }
.up-btn--ghost:hover { background: rgba(245,243,239,.05); border-color: rgba(245,243,239,.25); color: rgba(245,243,239,.75); }
.up-btn--rec {
  margin-top: 14px; font-size: 7px; letter-spacing: .2em;
  padding: 7px 16px; border: 1px solid rgba(201,168,76,.2);
  color: rgba(201,168,76,.55); width: 100%; justify-content: center; background: transparent;
}
.up-btn--rec:hover { border-color: rgba(201,168,76,.4); color: rgba(201,168,76,.85); background: rgba(201,168,76,.05); }

/* MODAL */
.up-modal-overlay {
  position: fixed; inset: 0; z-index: 9100;
  background: rgba(4,4,3,.9); backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
  overflow-y: auto;
}
.up-modal {
  background: #0d0e12; border: 1px solid rgba(201,168,76,.15);
  border-radius: 12px; width: 100%; max-width: 520px;
  max-height: 85vh; overflow-y: auto;
  box-shadow: 0 32px 80px rgba(0,0,0,.7);
  margin: auto;
}
.up-modal--sm { max-width: 420px; }
.up-modal-head {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 24px 28px 0; gap: 16px;
}
.up-modal-eyebrow {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: #c9a84c; margin-bottom: 6px;
}
.up-modal-title {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: clamp(18px,2.5vw,24px); font-weight: 700; color: var(--white); line-height: 1.2;
}
.up-modal-sub {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 14px; font-weight: 300; color: rgba(245,243,239,.45);
  line-height: 1.6; padding: 10px 28px 0;
}
.up-modal-close {
  background: transparent; border: none; cursor: pointer;
  color: rgba(245,243,239,.3); font-size: 14px; padding: 4px; line-height: 1; transition: color .2s; flex-shrink: 0;
}
.up-modal-close:hover { color: rgba(245,243,239,.7); }
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

/* ── TYPES ── */
interface UpcomingEvent {
  id: string;
  title: string;
  description: string | null;
  date_text: string | null;
  event_date: string | null;
  location: string | null;
  tag: string | null;
  category: "intervention" | "masterclass" | "session";
  format: "online" | "in-person" | "both";
  needs_registration: boolean;
  join_url: string | null;
  facebook_url: string | null;
  host_name: string | null;
  host_url: string | null;
  flyer_url: string | null;
  recording_signup: boolean;
}

function isPast(ev: UpcomingEvent): boolean {
  if (!ev.event_date) return false;
  return new Date(ev.event_date) < new Date(new Date().toDateString());
}

function displayDate(ev: UpcomingEvent): string {
  if (ev.date_text) return ev.date_text;
  if (ev.event_date) {
    return new Date(ev.event_date).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });
  }
  return "Coming Soon";
}

const FORMAT_LABEL: Record<string, string> = {
  online: "Online",
  "in-person": "In Person",
  both: "Online + In Person",
};

/* ── REGISTRATION MODAL ── */
function RegisterModal({ event, onClose }: { event: UpcomingEvent; onClose: () => void }) {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg]     = useState("");
  const [busy, setBusy]   = useState(false);
  const [done, setDone]   = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    const db = createClient();
    const { error } = await db.from("event_registrations").insert({
      event_id: event.id, type: "attendance",
      name: name.trim() || null, email: email.trim().toLowerCase(),
      phone: phone.trim() || null, message: msg.trim() || null,
    });
    setBusy(false);
    if (error) { toast.error("Registration failed. Please try again."); return; }
    toast.success("You're registered! See you there.");
    setDone(true);
  }

  return (
    <div className="up-modal-overlay" onClick={() => onClose()}>
      <div className="up-modal" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="up-modal-done">
            <div className="up-modal-done-icon">✦</div>
            <p className="up-modal-done-h">You're registered!</p>
            <p className="up-modal-done-sub">We'll be in touch with details closer to the event.</p>
            <button className="up-btn up-btn--gold" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="up-modal-head">
              <div>
                <p className="up-modal-eyebrow">Register</p>
                <h3 className="up-modal-title">{event.title}</h3>
              </div>
              <button className="up-modal-close" onClick={onClose} aria-label="Close">✕</button>
            </div>
            <form onSubmit={submit} className="up-modal-form">
              <label className="up-form-label">Full Name</label>
              <input className="up-form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              <label className="up-form-label">Email *</label>
              <input className="up-form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              <label className="up-form-label">Phone <span className="up-form-optional">(optional)</span></label>
              <input className="up-form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 890" />
              <label className="up-form-label">Message <span className="up-form-optional">(optional)</span></label>
              <textarea className="up-form-textarea" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Any questions or notes…" rows={3} />
              <button type="submit" className="up-btn up-btn--gold" disabled={busy}>{busy ? "Registering…" : "Confirm Registration"}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ── RECORDING SIGNUP MODAL ── */
function RecordingModal({ event, onClose }: { event: UpcomingEvent; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy]   = useState(false);
  const [done, setDone]   = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    const db = createClient();
    const { error } = await db.from("event_registrations").insert({
      event_id: event.id, type: "recording",
      name: null, email: email.trim().toLowerCase(),
    });
    setBusy(false);
    if (error) { toast.error("Sign-up failed. Please try again."); return; }
    toast.success("You'll receive the recording when it's available.");
    setDone(true);
  }

  return (
    <div className="up-modal-overlay" onClick={() => onClose()}>
      <div className="up-modal up-modal--sm" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="up-modal-done">
            <div className="up-modal-done-icon">✦</div>
            <p className="up-modal-done-h">You're on the list!</p>
            <p className="up-modal-done-sub">We'll send the recording or transcription to your inbox.</p>
            <button className="up-btn up-btn--gold" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="up-modal-head">
              <div>
                <p className="up-modal-eyebrow">Can't make it?</p>
                <h3 className="up-modal-title">Get the Recording</h3>
              </div>
              <button className="up-modal-close" onClick={onClose} aria-label="Close">✕</button>
            </div>
            <p className="up-modal-sub">{event.title} — sign up to receive the recording or transcription after the event.</p>
            <form onSubmit={submit} className="up-modal-form">
              <label className="up-form-label">Email *</label>
              <input className="up-form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              <button type="submit" className="up-btn up-btn--gold" disabled={busy}>{busy ? "Signing up…" : "Sign Me Up"}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function EventCard({ item, delay, isPastEvent }: { item: UpcomingEvent; delay: number; isPastEvent: boolean }) {
  const [regOpen, setRegOpen] = useState(false);
  const [recOpen, setRecOpen] = useState(false);

  return (
    <>
      <div className={`up-card${isPastEvent ? " up-card--past" : ""}`} style={{ transitionDelay: `${delay}s` }}>
        {/* Flyer */}
        {item.flyer_url && (
          <div className="up-card-flyer">
            <img src={item.flyer_url} alt={item.title} className="up-card-flyer-img" />
            {isPastEvent && <div className="up-card-past-badge">Past Event</div>}
          </div>
        )}
        {!item.flyer_url && isPastEvent && (
          <div className="up-card-past-badge up-card-past-badge--inline">Past Event</div>
        )}

        <div className="up-card-body-wrap">
          <div className="up-card-meta-row">
            <div className="up-card-date">{displayDate(item)}</div>
            <div className={`up-card-format up-card-format--${item.format}`}>{FORMAT_LABEL[item.format] ?? item.format}</div>
          </div>

          {item.tag && <div className="up-card-tag">{item.tag}</div>}
          <div className="up-card-title">{item.title}</div>
          {item.description && <div className="up-card-desc">{item.description}</div>}
          {item.location && <div className="up-card-location">{item.location}</div>}
          {item.host_name && (
            <div className="up-card-host">
              Hosted by{" "}
              {item.host_url
                ? <a href={item.host_url} target="_blank" rel="noopener noreferrer" className="up-card-host-link">{item.host_name}</a>
                : <span>{item.host_name}</span>}
            </div>
          )}

          {/* CTA buttons — only for upcoming events */}
          {!isPastEvent && (
            <div className="up-card-actions">
              {item.needs_registration && (
                <button className="up-btn up-btn--gold" onClick={() => setRegOpen(true)}>Register Now</button>
              )}
              {(item.format === "online" || item.format === "both") && item.join_url && (
                <a href={item.join_url} target="_blank" rel="noopener noreferrer" className="up-btn up-btn--outline">Join Us →</a>
              )}
              {item.facebook_url && (
                <a href={item.facebook_url} target="_blank" rel="noopener noreferrer" className="up-btn up-btn--ghost">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 5, flexShrink: 0 }}>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              )}
            </div>
          )}

          {/* Recording signup — shown for both upcoming and past */}
          {item.recording_signup && (
            <button className="up-btn up-btn--rec" onClick={() => setRecOpen(true)}>
              ✦ Get recording / transcription
            </button>
          )}
        </div>
      </div>

      {regOpen && <RegisterModal event={item} onClose={() => setRegOpen(false)} />}
      {recOpen && <RecordingModal event={item} onClose={() => setRecOpen(false)} />}
    </>
  );
}

function EmptySlot({ label }: { label: string }) {
  return (
    <div className="up-coming-soon">
      <div className="up-coming-soon-icon">◆</div>
      <p>No {label} announced yet — check back soon.</p>
    </div>
  );
}

export default function UpcomingPage() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    const db = createClient();
    db.from("upcoming_events")
      .select("id,title,description,date_text,event_date,location,tag,category,format,needs_registration,join_url,facebook_url,host_name,host_url,flyer_url,recording_signup")
      .eq("published", true)
      .then(({ data }) => { if (data) setEvents(data as UpcomingEvent[]); });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("up-visible"); }),
      { threshold: 0.05 }
    );
    document.querySelectorAll(".up-section, .up-card").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [events]);

  // Sort: upcoming (soonest first), then past (most recent first)
  const upcoming = events
    .filter((e) => !isPast(e))
    .sort((a, b) => {
      if (!a.event_date && !b.event_date) return 0;
      if (!a.event_date) return 1;
      if (!b.event_date) return -1;
      return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
    });
  const past = events
    .filter((e) => isPast(e))
    .sort((a, b) => new Date(b.event_date!).getTime() - new Date(a.event_date!).getTime());

  const upInterventions = upcoming.filter((e) => e.category === "intervention");
  const upMasterclasses = upcoming.filter((e) => e.category === "masterclass");
  const upSessions      = upcoming.filter((e) => e.category === "session");

  return (
    <>
      <div className="up-pg">
        <style>{css}</style>

        {/* HERO */}
        <div className="up-hero">
          <p className="up-eyebrow">Samuel Kobina Gyasi · What's Next</p>
          <h1 className="up-headline">
            Up<br /><em>coming</em>
          </h1>
          <div className="up-rule" />
          <p className="up-sub">
            Interventions, masterclasses, and facilitated sessions — spaces where
            ideas become action and individuals become collectives.
          </p>
        </div>

        {/* SECTIONS */}
        <div className="up-body">

          {upInterventions.length > 0 && (
            <div id="interventions" className="up-section">
              <p className="up-section-label">01 · Engagements</p>
              <h2 className="up-section-title">Interventions</h2>
            <div className="up-cards">
              {upInterventions.map((item, i) => <EventCard key={item.id} item={item} delay={i * 0.08} isPastEvent={false} />)}
            </div>
            </div>
          )}

          {upMasterclasses.length > 0 && (
            <div id="masterclass" className="up-section">
              <p className="up-section-label">02 · Deep Learning</p>
              <h2 className="up-section-title">Masterclass</h2>
              <div className="up-cards">
                {upMasterclasses.map((item, i) => <EventCard key={item.id} item={item} delay={i * 0.08} isPastEvent={false} />)}
              </div>
            </div>
          )}

          {upSessions.length > 0 && (
            <div id="sessions" className="up-section">
              <p className="up-section-label">03 · Open Conversations</p>
              <h2 className="up-section-title">Sessions</h2>
              <div className="up-cards">
                {upSessions.map((item, i) => <EventCard key={item.id} item={item} delay={i * 0.08} isPastEvent={false} />)}
              </div>
            </div>
          )}

          {upcoming.length === 0 && (
            <div className="up-section">
              <EmptySlot label="upcoming events" />
            </div>
          )}

          {/* PAST EVENTS */}
          {past.length > 0 && (
            <div className="up-section up-section--past">
              <p className="up-section-label">Past Events</p>
              <h2 className="up-section-title up-section-title--past">Recent Gatherings</h2>
              <div className="up-cards up-cards--past">
                {past.map((item, i) => <EventCard key={item.id} item={item} delay={i * 0.06} isPastEvent={true} />)}
              </div>
            </div>
          )}

        </div>

        {/* NOTIFY CTA */}
        <section className="up-notify">
          <div className="up-notify-inner">
            <p className="up-notify-eyebrow">Stay Informed</p>
            <h2 className="up-notify-h">Don&rsquo;t miss the next event.</h2>
            <p className="up-notify-sub">
              Get notified when a new intervention, masterclass, or session is announced.
            </p>
            <a href="mailto:impact@samuelgyasi.com?subject=Notify me of upcoming events" className="up-notify-btn">
              Notify Me
            </a>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
