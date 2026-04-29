"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function NotifySection() {
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
      toast.error("Sign-up failed. Please try again.");
      return;
    }
    setDone(true);
    toast.success("You will be notified when new events are posted.");
  }

  return (
    <>
      <section className="up-notify">
        <div className="up-notify-inner">
          <p className="up-notify-eyebrow">Stay Informed</p>
          <h2 className="up-notify-h">Don&rsquo;t miss the next event.</h2>
          <p className="up-notify-sub">
            Get notified when a new intervention, masterclass, or session is announced.
          </p>
          <button className="up-notify-btn" onClick={() => setOpen(true)}>
            Notify Me
          </button>
        </div>
      </section>

      {open && (
        <div className="up-modal-overlay" onClick={() => setOpen(false)}>
          <div className="up-modal up-modal--sm" onClick={(e) => e.stopPropagation()}>
            {done ? (
              <div className="up-modal-done">
                <div className="up-modal-done-icon">✦</div>
                <p className="up-modal-done-h">You&rsquo;re on the list!</p>
                <p className="up-modal-done-sub">We will notify you about upcoming events.</p>
                <button className="up-btn up-btn--gold" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="up-modal-head">
                  <div>
                    <p className="up-modal-eyebrow">Stay Updated</p>
                    <h3 className="up-modal-title">Notify Me</h3>
                  </div>
                  <button className="up-modal-close" onClick={() => setOpen(false)} aria-label="Close">
                    ✕
                  </button>
                </div>
                <p className="up-modal-sub">Get updates when new interventions and sessions are published.</p>
                <form onSubmit={submit} className="up-modal-form">
                  <label className="up-form-label">Name <span className="up-form-optional">(optional)</span></label>
                  <input
                    className="up-form-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                  <label className="up-form-label">Email *</label>
                  <input
                    className="up-form-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                  <button type="submit" className="up-btn up-btn--gold" disabled={busy}>
                    {busy ? "Submitting..." : "Notify Me"}
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
