"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { type UpcomingEvent } from "./types";
import { useLang } from "@/lib/i18n";
import { upcomingTranslations as ut } from "../translations";
import { HoneypotField } from "@/components/HoneypotField";
import { useHoneypot } from "@/lib/useHoneypot";

interface RecordingModalProps {
  event: UpcomingEvent;
  onClose: () => void;
}

export function RecordingModal({ event, onClose }: RecordingModalProps) {
  const { lang } = useLang();
  const t = ut.recording;
  const [email, setEmail] = useState("");
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
      type: "recording",
      name: null,
      email: email.trim().toLowerCase(),
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
      <div className="up-modal up-modal--sm" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="up-modal-done">
            <div className="up-modal-done-icon">✦</div>
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
                <h3 className="up-modal-title">{t.title[lang]}</h3>
              </div>
              <button className="up-modal-close" onClick={onClose} aria-label="Close">
                ✕
              </button>
            </div>
            <p className="up-modal-sub">
              {event.title} — {t.sub[lang]}
            </p>
            <form onSubmit={submit} className="up-modal-form">
              <HoneypotField inputRef={honeypot.inputRef} />
              <label className="up-form-label">{t.emailLbl[lang]}</label>
              <input
                className="up-form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPh[lang]}
                required
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
