"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { type UpcomingEvent } from "./types";

interface RecordingModalProps {
  event: UpcomingEvent;
  onClose: () => void;
}

export function RecordingModal({ event, onClose }: RecordingModalProps) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
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
      toast.error("Sign-up failed. Please try again.");
      return;
    }
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
            <p className="up-modal-done-sub">
              We'll send the recording or transcription to your inbox.
            </p>
            <button className="up-btn up-btn--gold" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="up-modal-head">
              <div>
                <p className="up-modal-eyebrow">Can't make it?</p>
                <h3 className="up-modal-title">Get the Recording</h3>
              </div>
              <button className="up-modal-close" onClick={onClose} aria-label="Close">
                ✕
              </button>
            </div>
            <p className="up-modal-sub">
              {event.title} — sign up to receive the recording or transcription after the event.
            </p>
            <form onSubmit={submit} className="up-modal-form">
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
                {busy ? "Signing up…" : "Sign Me Up"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
