"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { navTranslations as t } from "@/lib/i18n/nav";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname                = usePathname();
  const { lang, toggleLang }    = useLang();

  const navLinks = [
    { href: "/blog",      label: t.blog[lang]      },
    { href: "/my-story",  label: t.story[lang]     },
    { href: "/resources", label: t.resources[lang] },
    { href: "/credo",     label: t.credo[lang]     },
    { href: "/upcoming",  label: t.upcoming[lang]  },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* ── NAV BAR ── */}
      <nav className={`portfolio-nav nav-modern ${scrolled ? "nav-scrolled" : ""}`}>
        <Link href="/" className="nav-logo-modern" onClick={close}>
          <span className="nav-logo-initials">SKG</span>
        </Link>

        {/* Desktop links */}
        <ul className="nav-links nav-desktop nav-modern-links">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={pathname.startsWith(l.href) ? "nav-active" : ""}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Theme & Language toggle — desktop */}
        <div className="nav-controls">
          <ThemeSwitcher />
          <button
            className="nav-lang-btn nav-lang-modern"
            onClick={toggleLang}
            aria-label={lang === "en" ? t.langLabel.en : t.langLabel.fr}
            title={lang === "en" ? t.langLabel.en : t.langLabel.fr}
          >
            <span className={lang === "en" ? "nlb-active" : ""}>EN</span>
            <span className="nlb-sep">|</span>
            <span className={lang === "fr" ? "nlb-active" : ""}>FR</span>
          </button>
          
          {/* Keep this visible on desktop, hidden on mobile navbar */}
          <Link
            href="/auth/login"
            className="nav-login-btn hidden md:flex"
            aria-label="Sign in"
            title={lang === "en" ? "Sign in" : "Se connecter"}
          >
            <LogIn size={15} />
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className={`nav-burger ${open ? "nav-burger--open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <div className={`nav-drawer ${open ? "nav-drawer--open" : ""}`} aria-hidden={!open}>
        <button className="nav-drawer-close" aria-label="Close menu" onClick={close}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="nav-drawer-inner">
          <ul className="nd-links">
            {navLinks.map((l, i) => (
              <li key={l.href} style={{ "--i": i } as React.CSSProperties}>
                <Link href={l.href} onClick={close}>{l.label}</Link>
              </li>
            ))}
            {/* Login button removed from here (the list) to keep it off the mobile menu */}
          </ul>

          <div className="nd-bottom">
            <div className="nd-controls">
              <ThemeSwitcher />
              <button
                className="nd-lang-btn"
                onClick={toggleLang}
                aria-label={lang === "en" ? t.langLabel.en : t.langLabel.fr}
              >
                <span className={lang === "en" ? "nlb-active" : ""}>EN</span>
                <span className="nlb-sep">|</span>
                <span className={lang === "fr" ? "nlb-active" : ""}>FR</span>
              </button>
            </div>
            <a href="mailto:impact@samuelgyasi.com" className="nd-email">impact@samuelgyasi.com</a>
          </div>
        </div>
      </div>

      {open && <div className="nav-backdrop" onClick={close} aria-hidden />}
    </>
  );
}