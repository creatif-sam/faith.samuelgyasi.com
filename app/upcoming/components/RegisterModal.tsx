"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { type UpcomingEvent } from "./types";

interface RegisterModalProps {
  event: UpcomingEvent;
  onClose: () => void;
}

export function RegisterModal({ event, onClose }: RegisterModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
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
      toast.error("Registration failed. Please try again.");
      return;
    }
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
            <p className="up-modal-done-sub">
              We'll be in touch with details closer to the event.
            </p>
            <button className="up-btn up-btn--gold" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="up-modal-head">
              <div>
                <p className="up-modal-eyebrow">Register</p>
                <h3 className="up-modal-title">{event.title}</h3>
              </div>
              <button className="up-modal-close" onClick={onClose} aria-label="Close">
                ✕
              </button>
            </div>
            <form onSubmit={submit} className="up-modal-form">
              <label className="up-form-label">Full Name</label>
              <input
                className="up-form-input"
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
              <label className="up-form-label">
                Phone <span className="up-form-optional">(optional)</span>
              </label>
              <input
                className="up-form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 890"
              />
              <label className="up-form-label">
                Message <span className="up-form-optional">(optional)</span>
              </label>
              <textarea
                className="up-form-textarea"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Any questions or notes…"
                rows={3}
              />
              <button type="submit" className="up-btn up-btn--gold" disabled={busy}>
                {busy ? "Registering…" : "Confirm Registration"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
