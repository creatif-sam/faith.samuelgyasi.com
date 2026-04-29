"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const TYPES = [
  { value: "intervention", label: "Intervention", icon: "⚡" },
  { value: "masterclass",  label: "Masterclass",  icon: "🎓" },
  { value: "session",      label: "Session",      icon: "🕊️" },
  { value: "podcast",      label: "Podcast",      icon: "🎙️" },
];

interface ReserveModalProps {
  onClose: () => void;
}

export function ReserveModal({ onClose }: ReserveModalProps) {
  const [type,    setType]    = useState("intervention");
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [busy,    setBusy]    = useState(false);
  const [done,    setDone]    = useState(false);
  const [err,     setErr]     = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const db = createClient();
      const { error } = await db.from("reservation_requests").insert({
        type:    type,
        name:    name.trim()    || null,
        email:   email.trim().toLowerCase(),
        message: message.trim() || null,
      });
      if (error) throw error;
      setDone(true);
    } catch {
      setErr("Something went wrong. Please try again or email impact@samuelgyasi.com");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="up-modal-overlay" onClick={onClose}>
      <div className="up-reserve-modal" onClick={(e) => e.stopPropagation()}>
        <button className="up-modal-close" onClick={onClose} aria-label="Close">✕</button>

        {done ? (
          <div className="up-modal-done">
            <div className="up-modal-done-icon">✦</div>
            <p className="up-modal-done-h">Reservation Received!</p>
            <p className="up-modal-done-sub">
              Thank you — I'll reach out shortly with next steps.
            </p>
            <button className="up-btn up-btn--gold" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="up-reserve-head">
              <p className="up-reserve-eyebrow">Reserve a Spot</p>
              <h2 className="up-reserve-title">Secure Your Place</h2>
              <p className="up-reserve-sub">
                Choose a format and share your details. I'll follow up personally.
              </p>
            </div>

            {/* Type selector */}
            <div className="up-reserve-types">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className={`up-reserve-type-pill${type === t.value ? " up-reserve-type-pill--active" : ""}`}
                  onClick={() => setType(t.value)}
                >
                  <span className="up-reserve-pill-icon">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            <form className="up-reserve-form" onSubmit={submit} noValidate>
              <div className="up-reserve-field">
                <label className="up-reserve-label">Your Name <span className="up-reserve-optional">(optional)</span></label>
                <input
                  type="text"
                  className="up-reserve-input"
                  placeholder="e.g. Ama Asante"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={busy}
                />
              </div>

              <div className="up-reserve-field">
                <label className="up-reserve-label">Email Address <span className="up-reserve-required">*</span></label>
                <input
                  type="email"
                  className="up-reserve-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                  disabled={busy}
                  required
                />
              </div>

              <div className="up-reserve-field">
                <label className="up-reserve-label">Message <span className="up-reserve-optional">(optional)</span></label>
                <textarea
                  className="up-reserve-textarea"
                  placeholder="Tell me a bit about what you're hoping to get from this experience..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={busy}
                  rows={3}
                />
              </div>

              {err && <p className="up-reserve-err">{err}</p>}

              <button type="submit" className="up-btn up-btn--gold up-reserve-submit" disabled={busy}>
                {busy ? "Sending…" : "Reserve My Spot →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
