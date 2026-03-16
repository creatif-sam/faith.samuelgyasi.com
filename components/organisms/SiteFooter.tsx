"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/samuel-k-gyasi/",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/samuel_gsi?igsh=MWswMzRycjk1dXZ0cw==",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://web.facebook.com/samuel.kobinagyasi/",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@samuel_gsi?_r=1&_t=ZS-94iqxzPNKqm",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.17 8.17 0 0 0 4.78 1.52V7a4.85 4.85 0 0 1-1.01-.31z" />
      </svg>
    ),
  },
];

const pillarsLinks = [
  { href: "/faith",           label: "Beliefs"        },
  { href: "/leadership",      label: "Leadership"     },
  { href: "/intellectuality", label: "Intellectuality" },
  { href: "/transformation",  label: "Transformation" },
];

export function SiteFooter() {
  const [email, setEmail]     = useState("");
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const inputRef              = useRef<HTMLInputElement>(null);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim().toLowerCase() });
      if (error && error.code === "23505") {
        setStatus("success");
        setMessage("You're already subscribed — thank you!");
      } else if (error) {
        throw error;
      } else {
        setStatus("success");
        setMessage("Subscribed! Expect words that matter.");
        setEmail("");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <footer className="sf-footer">
      {/* ── TOP BRAND ROW ── */}
      <div className="sf-brand-row">
        <div className="sf-brand-name">Samuel Kobina Gyasi</div>
        <p className="sf-brand-tagline">
          Rooted in the Word.&ensp;Refined by Purpose.&ensp;Rising to Transform.
        </p>
        <div className="sf-social-row">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="sf-social-icon"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="sf-rule" />

      {/* ── NEWSLETTER ── */}
      <div className="sf-newsletter">
        <div className="sf-nl-left">
          <p className="sf-nl-heading">Join the Conversation</p>
          <p className="sf-nl-sub">
            Reflections on faith, leadership, and the pursuit of purpose —
            delivered to your inbox.
          </p>
        </div>
        <form className="sf-nl-form" onSubmit={handleSubscribe} noValidate>
          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
            placeholder="Your email address"
            className="sf-nl-input"
            disabled={status === "loading" || status === "success"}
            aria-label="Email address"
          />
          <button
            type="submit"
            className="sf-nl-btn"
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading" ? "…" : status === "success" ? "✓ Subscribed" : "Subscribe →"}
          </button>
          {message && (
            <p className={`sf-nl-msg ${status === "error" ? "sf-nl-msg--error" : ""}`}>
              {message}
            </p>
          )}
        </form>
      </div>

      {/* ── DIVIDER ── */}
      <div className="sf-rule" />

      {/* ── LINKS COLUMNS ── */}
      <div className="sf-columns">
        <div className="sf-col">
          <p className="sf-col-label">Pillars</p>
          <ul className="sf-col-list">
            {pillarsLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="sf-col-link">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sf-col">
          <p className="sf-col-label">Connect</p>
          <ul className="sf-col-list">
            <li><a href="mailto:impact@samuelgyasi.com" className="sf-col-link">Email</a></li>
            {socialLinks.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="sf-col-link">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="sf-col">
          <p className="sf-col-label">Site</p>
          <ul className="sf-col-list">
            <li><Link href="/" className="sf-col-link">Home</Link></li>
            <li><a href="/#about"   className="sf-col-link">About</a></li>
            <li><a href="/#vision"  className="sf-col-link">Vision</a></li>
            <li><a href="/#connect" className="sf-col-link">Contact</a></li>
          </ul>
        </div>

        <div className="sf-col">
          <p className="sf-col-label">Legal</p>
          <ul className="sf-col-list">
            <li><Link href="/privacy-policy" className="sf-col-link">Privacy Policy</Link></li>
            <li><Link href="/privacy-policy#cookies" className="sf-col-link">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="sf-rule" />
      <div className="sf-bottom">
        <span className="sf-copy">© {new Date().getFullYear()} Samuel Kobina Gyasi · All Rights Reserved</span>
        <span className="sf-emblem">✦</span>
        <span className="sf-credit">Built with purpose · samuelgyasi.com</span>
      </div>
    </footer>
  );
}

