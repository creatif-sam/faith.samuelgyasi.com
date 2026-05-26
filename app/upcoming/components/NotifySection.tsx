"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useLang } from "@/lib/i18n";
import { upcomingTranslations as t } from "../translations";

export function NotifySection() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    const db = createClient();
    const { error } = await db.from("notify_requests").insert({
      email: email.trim().toLowerCase(),
      name: name.trim() || null,
      source: "upcoming",
    });
    setBusy(false);
    if (error) {
      toast.error(t.notify.errorFail[lang]);
      return;
    }
    setDone(true);
    toast.success(t.notify.successMsg[lang]);
  }

  return (
    <>
      <section className="up-notify">
        <div className="up-notify-inner">
          <p className="up-notify-eyebrow">{t.notify.eyebrow[lang]}</p>
          <h2 className="up-notify-h">{t.notify.heading[lang]}</h2>
          <p className="up-notify-sub">{t.notify.sub[lang]}</p>
          <button className="up-notify-btn" onClick={() => setOpen(true)}>
            {t.notify.btn[lang]}
          </button>
        </div>
      </section>

      {open && (
        <div className="up-modal-overlay" onClick={() => setOpen(false)}>
          <div className="up-modal up-modal--sm" onClick={(e) => e.stopPropagation()}>
            {done ? (
              <div className="up-modal-done">
                <div className="up-modal-done-icon">✦</div>
                <p className="up-modal-done-h">{t.notify.doneTitle[lang]}</p>
                <p className="up-modal-done-sub">{t.notify.doneSub[lang]}</p>
                <button className="up-btn up-btn--gold" onClick={() => setOpen(false)}>
                  {t.notify.close[lang]}
                </button>
              </div>
            ) : (
              <>
                <div className="up-modal-head">
                  <div>
                    <p className="up-modal-eyebrow">{t.notify.modalEyebrow[lang]}</p>
                    <h3 className="up-modal-title">{t.notify.modalTitle[lang]}</h3>
                  </div>
                  <button className="up-modal-close" onClick={() => setOpen(false)} aria-label="Close">
                    ✕
                  </button>
                </div>
                <p className="up-modal-sub">{t.notify.modalSub[lang]}</p>
                <form onSubmit={submit} className="up-modal-form">
                  <label className="up-form-label">{t.notify.nameLbl[lang]} <span className="up-form-optional">{t.notify.nameOpt[lang]}</span></label>
                  <input
                    className="up-form-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.notify.namePh[lang]}
                  />
                  <label className="up-form-label">{t.notify.emailLbl[lang]}</label>
                  <input
                    className="up-form-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.notify.emailPh[lang]}
                    required
                  />
                  <button type="submit" className="up-btn up-btn--gold" disabled={busy}>
                    {busy ? t.notify.submitBusy[lang] : t.notify.submitIdle[lang]}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

