"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n";
import { upcomingTranslations as ut } from "../translations";
import { HoneypotField } from "@/components/HoneypotField";
import { useHoneypot } from "@/lib/useHoneypot";

const TYPES = [
  { value: "intervention", icon: "⚡" },
  { value: "masterclass",  icon: "🎓" },
  { value: "session",      icon: "🕊️" },
  { value: "podcast",      icon: "🎙️" },
];

interface ReserveModalProps {
  onClose: () => void;
}

export function ReserveModal({ onClose }: ReserveModalProps) {
  const { lang } = useLang();
  const t = ut.reserve;
  const [type,    setType]    = useState("intervention");
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [busy,    setBusy]    = useState(false);
  const [done,    setDone]    = useState(false);
  const [err,     setErr]     = useState("");
  const honeypot = useHoneypot();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr(t.errValid[lang]);
      return;
    }
    if (honeypot.isBot()) {
      // Pretend success so the bot doesn't learn it was caught.
      setDone(true);
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
      setErr(t.errGeneric[lang]);
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
            <p className="up-modal-done-h">{t.doneTitle[lang]}</p>
            <p className="up-modal-done-sub">{t.doneSub[lang]}</p>
            <button className="up-btn up-btn--gold" onClick={onClose}>{t.close[lang]}</button>
          </div>
        ) : (
          <>
            <div className="up-reserve-head">
              <p className="up-reserve-eyebrow">{t.eyebrow[lang]}</p>
              <h2 className="up-reserve-title">{t.title[lang]}</h2>
              <p className="up-reserve-sub">{t.sub[lang]}</p>
            </div>

            {/* Type selector */}
            <div className="up-reserve-types">
              {TYPES.map((tp) => (
                <button
                  key={tp.value}
                  type="button"
                  className={`up-reserve-type-pill${type === tp.value ? " up-reserve-type-pill--active" : ""}`}
                  onClick={() => setType(tp.value)}
                >
                  <span className="up-reserve-pill-icon">{tp.icon}</span>
                  {ut.reserve.typePills[tp.value as keyof typeof ut.reserve.typePills][lang]}
                </button>
              ))}
            </div>

            <form className="up-reserve-form" onSubmit={submit} noValidate>
              <HoneypotField inputRef={honeypot.inputRef} />
              <div className="up-reserve-field">
                <label className="up-reserve-label">{t.nameLbl[lang]} <span className="up-reserve-optional">{t.optional[lang]}</span></label>
                <input
                  type="text"
                  className="up-reserve-input"
                  placeholder={t.namePh[lang]}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={busy}
                />
              </div>

              <div className="up-reserve-field">
                <label className="up-reserve-label">{t.emailLbl[lang]} <span className="up-reserve-required">{t.required[lang]}</span></label>
                <input
                  type="email"
                  className="up-reserve-input"
                  placeholder={t.emailPh[lang]}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                  disabled={busy}
                  required
                />
              </div>

              <div className="up-reserve-field">
                <label className="up-reserve-label">{t.msgLbl[lang]} <span className="up-reserve-optional">{t.optional[lang]}</span></label>
                <textarea
                  className="up-reserve-textarea"
                  placeholder={t.msgPh[lang]}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={busy}
                  rows={3}
                />
              </div>

              {err && <p className="up-reserve-err">{err}</p>}

              <button type="submit" className="up-btn up-btn--gold up-reserve-submit" disabled={busy}>
                {busy ? t.submitBusy[lang] : t.submitIdle[lang]}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

