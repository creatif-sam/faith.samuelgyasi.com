"use client";

import { useState } from "react";
import { X, Sparkle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { type UpcomingEvent } from "./types";
import { useLang } from "@/lib/i18n";
import { upcomingTranslations as ut } from "../translations";
import { HoneypotField } from "@/components/HoneypotField";
import { useHoneypot } from "@/lib/useHoneypot";

interface RegisterModalProps {
  event: UpcomingEvent;
  onClose: () => void;
}

export function RegisterModal({ event, onClose }: RegisterModalProps) {
  const { lang } = useLang();
  const t = ut.register;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const honeypot = useHoneypot();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    if (honeypot.isBot()) {
      // Pretend success so the bot doesn't learn it was caught.
      toast.success(t.successMsg[lang]);
      setDone(true);
      return;
    }
    setBusy(true);
    const db = createClient();
    const { error } = await db.from("event_registrations").insert({
      event_id: event.id,
      type: "attendance",
      name: name.trim() || null,
      email: email.trim().toLowerCase(),
      phone: phone.trim() || null,
      message: msg.trim() || null,
    });
    setBusy(false);
    if (error) {
      toast.error(t.errFail[lang]);
      return;
    }
    toast.success(t.successMsg[lang]);
    setDone(true);
  }

  return (
    <div className="up-modal-overlay" onClick={() => onClose()}>
      <div className="up-modal" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="up-modal-done">
            <div className="up-modal-done-icon"><Sparkle size={26} style={{ color: "#d4a843" }} fill="currentColor" /></div>
            <p className="up-modal-done-h">{t.doneTitle[lang]}</p>
            <p className="up-modal-done-sub">{t.doneSub[lang]}</p>
            <button className="up-btn up-btn--gold" onClick={onClose}>
              {t.close[lang]}
            </button>
          </div>
        ) : (
          <>
            <div className="up-modal-head">
              <div>
                <p className="up-modal-eyebrow">{t.eyebrow[lang]}</p>
                <h3 className="up-modal-title">{event.title}</h3>
              </div>
              <button className="up-modal-close" onClick={onClose} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={submit} className="up-modal-form">
              <HoneypotField inputRef={honeypot.inputRef} />
              <label className="up-form-label">{t.nameLbl[lang]}</label>
              <input
                className="up-form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePh[lang]}
              />
              <label className="up-form-label">{t.emailLbl[lang]}</label>
              <input
                className="up-form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPh[lang]}
                required
              />
              <label className="up-form-label">
                {t.phoneLbl[lang]} <span className="up-form-optional">{t.phoneOpt[lang]}</span>
              </label>
              <input
                className="up-form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePh[lang]}
              />
              <label className="up-form-label">
                {t.msgLbl[lang]} <span className="up-form-optional">{t.msgOpt[lang]}</span>
              </label>
              <textarea
                className="up-form-textarea"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder={t.msgPh[lang]}
                rows={3}
              />
              <button type="submit" className="up-btn up-btn--gold" disabled={busy}>
                {busy ? t.submitBusy[lang] : t.submitIdle[lang]}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
