"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n";

const ft = {
  tagline:       { en: "Rooted in the Word.\u2003Walking by Faith.\u2003Living for His Glory.", fr: "Ancr\u00e9 dans la Parole.\u2003Marchant par la Foi.\u2003Vivant pour Sa Gloire." },
  nlHeading:     { en: "Join the Conversation",               fr: "Rejoindre la Conversation" },
  nlSub:         { en: "Reflections on faith, scripture, and the sacred journey of walking with God \u2014 delivered to your inbox.", fr: "R\u00e9flexions sur la foi, les \u00c9critures et le voyage sacr\u00e9 de marcher avec Dieu \u2014 livr\u00e9es dans votre bo\u00eete mail." },
  interestedIn:  { en: "I\u2019m interested in:",             fr: "Je m\u2019int\u00e9resse \u00e0\u00a0:" },
  emailPh:       { en: "Your email address",                  fr: "Votre adresse email" },
  emailLabel:    { en: "Email address",                       fr: "Adresse email" },
  btnIdle:       { en: "Subscribe \u2192",                    fr: "S\u2019abonner \u2192" },
  btnLoading:    { en: "\u2026",                              fr: "\u2026" },
  btnSuccess:    { en: "\u2713 Subscribed",                   fr: "\u2713 Abonn\u00e9" },
  errEmail:      { en: "Please enter a valid email address.", fr: "Veuillez entrer une adresse email valide." },
  errAlready:    { en: "You\u2019re already subscribed \u2014 thank you!", fr: "Vous \u00eates d\u00e9j\u00e0 abonn\u00e9 \u2014 merci\u00a0!" },
  successMsg:    { en: "Subscribed! Expect words that matter.", fr: "Abonn\u00e9\u00a0! Attendez-vous \u00e0 des mots qui comptent." },
  errGeneric:    { en: "Something went wrong. Please try again.", fr: "Une erreur s\u2019est produite. Veuillez r\u00e9essayer." },
  colPillars:    { en: "Pillars",     fr: "Piliers"     },
  colConnect:    { en: "Connect",     fr: "Contact"     },
  colSite:       { en: "Site",        fr: "Site"        },
  colLegal:      { en: "Legal",       fr: "L\u00e9gal"  },
  linkFaith:     { en: "Faith & Beliefs", fr: "Foi &amp; Convictions" },
  linkJournal:   { en: "Journal",     fr: "Journal"     },
  linkStory:     { en: "My Story",    fr: "Mon Histoire"},
  linkConnect:   { en: "Connect",     fr: "Contact"     },
  linkEmail:     { en: "Email",       fr: "Email"       },
  linkPrivacy:   { en: "Privacy Policy", fr: "Politique de Confidentialit\u00e9" },
  copyright:     { en: "All Rights Reserved", fr: "Tous Droits R\u00e9serv\u00e9s" },
  builtWith:     { en: "Built with purpose", fr: "Construit avec intention" },
};

const INTERESTS = [
  { value: "faith",        en: "Faith & Spirituality", fr: "Foi & Spiritualit\u00e9" },
  { value: "theology",     en: "Theology",             fr: "Th\u00e9ologie"          },
  { value: "prayer",       en: "Prayer & Devotion",    fr: "Pri\u00e8re & D\u00e9votion" },
  { value: "scripture",    en: "Scripture Study",      fr: "\u00c9tude des \u00c9critures" },
  { value: "discipleship", en: "Discipleship",         fr: "Disciples"               },
];

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

export function SiteFooter() {
  const { lang } = useLang();
  const [email, setEmail]         = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus]       = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage]     = useState("");
  const inputRef                  = useRef<HTMLInputElement>(null);

  function toggleInterest(value: string) {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage(ft.errEmail[lang]);
      return;
    }
    setStatus("loading");
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim().toLowerCase(), interests });
      if (error && error.code === "23505") {
        setStatus("success");
        setMessage(ft.errAlready[lang]);
      } else if (error) {
        throw error;
      } else {
        setStatus("success");
        setMessage(ft.successMsg[lang]);
        setEmail("");
        setInterests([]);
      }
    } catch {
      setStatus("error");
      setMessage(ft.errGeneric[lang]);
    }
  }

  return (
    <footer className="sf-footer">
      {/* ── TOP BRAND ROW ── */}
      <div className="sf-brand-row">
        <div className="sf-brand-name">Samuel Kobina Gyasi</div>
        <p className="sf-brand-tagline">{ft.tagline[lang]}</p>
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
          <p className="sf-nl-heading">{ft.nlHeading[lang]}</p>
          <p className="sf-nl-sub">{ft.nlSub[lang]}</p>
        </div>
        <form className="sf-nl-form" onSubmit={handleSubscribe} noValidate>
          <div className="sf-nl-interests">
            <p className="sf-nl-interests-label">{ft.interestedIn[lang]}</p>
            <div className="sf-nl-checks">
              {INTERESTS.map((item) => (
                <label key={item.value} className="sf-nl-check-item">
                  <input
                    type="checkbox"
                    className="sf-nl-checkbox"
                    value={item.value}
                    checked={interests.includes(item.value)}
                    onChange={() => toggleInterest(item.value)}
                    disabled={status === "loading" || status === "success"}
                  />
                  <span>{item[lang]}</span>
                </label>
              ))}
            </div>
          </div>

          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
            placeholder={ft.emailPh[lang]}
            className="sf-nl-input"
            disabled={status === "loading" || status === "success"}
            aria-label={ft.emailLabel[lang]}
          />
          <button
            type="submit"
            className="sf-nl-btn"
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading" ? ft.btnLoading[lang] : status === "success" ? ft.btnSuccess[lang] : ft.btnIdle[lang]}
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
          <p className="sf-col-label">{ft.colPillars[lang]}</p>
          <ul className="sf-col-list">
            <li><Link href="/faith"         className="sf-col-link">{lang === "en" ? "Faith & Beliefs"  : "Foi & Convictions"}</Link></li>
            <li><Link href="/blog"          className="sf-col-link">{ft.linkJournal[lang]}</Link></li>
            <li><Link href="/my-story"      className="sf-col-link">{ft.linkStory[lang]}</Link></li>
            <li><Link href="/faith#connect" className="sf-col-link">{ft.linkConnect[lang]}</Link></li>
          </ul>
        </div>

        <div className="sf-col">
          <p className="sf-col-label">{ft.colConnect[lang]}</p>
          <ul className="sf-col-list">
            <li><a href="mailto:impact@samuelgyasi.com" className="sf-col-link">{ft.linkEmail[lang]}</a></li>
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
          <p className="sf-col-label">{ft.colSite[lang]}</p>
          <ul className="sf-col-list">
            <li><Link href="/faith"     className="sf-col-link">{lang === "en" ? "Faith" : "Foi"}</Link></li>
            <li><Link href="/blog"      className="sf-col-link">{ft.linkJournal[lang]}</Link></li>
            <li><Link href="/my-story"  className="sf-col-link">{ft.linkStory[lang]}</Link></li>
          </ul>
        </div>

        <div className="sf-col">
          <p className="sf-col-label">{ft.colLegal[lang]}</p>
          <ul className="sf-col-list">
            <li><span className="sf-col-link" style={{opacity:0.5}}>{ft.linkPrivacy[lang]}</span></li>
          </ul>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="sf-rule" />
      <div className="sf-bottom">
        <span className="sf-copy" suppressHydrationWarning>© {new Date().getFullYear()} Samuel Kobina Gyasi · {ft.copyright[lang]}</span>
        <span className="sf-emblem">✦</span>
        <span className="sf-credit">{ft.builtWith[lang]} · samuelgyasi.com</span>
      </div>
    </footer>
  );
}
