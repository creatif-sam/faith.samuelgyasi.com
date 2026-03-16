"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_KEY = "sg_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // Private browsing / storage blocked — don't show
    }
  }, []);

  function accept() {
    try { localStorage.setItem(COOKIE_KEY, "accepted"); } catch { /* ignore */ }
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem(COOKIE_KEY, "declined"); } catch { /* ignore */ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="ck-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <div className="ck-inner">
        <div className="ck-text">
          <span className="ck-emblem">✦</span>
          <p>
            This site uses cookies to improve your experience and to analyse
            visitor behaviour. Read our{" "}
            <Link href="/privacy-policy#cookies" className="ck-link">
              Cookie Policy
            </Link>
            .
          </p>
        </div>
        <div className="ck-actions">
          <button className="ck-btn ck-btn--accept" onClick={accept}>
            Accept All
          </button>
          <button className="ck-btn ck-btn--decline" onClick={decline}>
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
}
