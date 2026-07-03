"use client";

import { useState } from "react";

export function TestimonialSubmitForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !profession.trim() || !quote.trim()) {
      setError("Please fill in your name, profession, and testimony.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), role: profession.trim(), quote: quote.trim(), rating }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="ts-form-wrap ts-form-success">
        <div className="ts-form-success-check">✓</div>
        <p>Thank you, {name.split(" ")[0]}. Your testimony has been received and will appear here once reviewed.</p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="ts-cta">
        <button type="button" className="ts-cta-btn" onClick={() => setOpen(true)}>
          Share Your Testimony
        </button>
      </div>
    );
  }

  return (
    <form className="ts-form-wrap" onSubmit={handleSubmit}>
      <p className="ts-form-title">Share Your Testimony</p>
      <p className="ts-form-note">Submitted testimonies are reviewed before they appear publicly.</p>

      <div className="ts-form-field">
        <label className="ts-form-label" htmlFor="ts-form-name">Name</label>
        <input
          id="ts-form-name"
          className="ts-form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          disabled={submitting}
          required
        />
      </div>

      <div className="ts-form-field">
        <label className="ts-form-label" htmlFor="ts-form-profession">Profession</label>
        <input
          id="ts-form-profession"
          className="ts-form-input"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          placeholder="e.g. Pastor, Teacher, Student"
          disabled={submitting}
          required
        />
      </div>

      <div className="ts-form-field">
        <label className="ts-form-label" htmlFor="ts-form-quote">Your Testimony</label>
        <textarea
          id="ts-form-quote"
          className="ts-form-textarea"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Share how this ministry, mentorship, or message has impacted you..."
          disabled={submitting}
          required
        />
      </div>

      <div className="ts-form-field">
        <label className="ts-form-label">Rating</label>
        <div className="ts-form-stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className="ts-form-star"
              onClick={() => setRating(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              disabled={submitting}
              style={{ color: n <= rating ? "#c9a84c" : "rgba(201,168,76,.25)" }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {error && <p className="ts-form-error">{error}</p>}

      <div className="ts-form-actions">
        <button type="button" className="ts-form-cancel" onClick={() => setOpen(false)} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="ts-form-submit" disabled={submitting}>
          {submitting ? "Sending..." : "Submit Testimony"}
        </button>
      </div>
    </form>
  );
}
