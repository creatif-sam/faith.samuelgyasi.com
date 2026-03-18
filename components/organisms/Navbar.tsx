"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/blog",      label: "Blog"     },
  { href: "/my-story", label: "Story"    },
  { href: "/library",  label: "Library"  },
  { href: "/credo",    label: "Credo"    },
  { href: "/upcoming", label: "Upcoming" },
];

export function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname                = usePathname();

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
      <nav className={`portfolio-nav ${scrolled ? "nav-scrolled" : ""}`}>
        <Link href="/" className="nav-logo" onClick={close}>SKG</Link>

        {/* Desktop links */}
        <ul className="nav-links nav-desktop">
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
          </ul>

          <div className="nd-bottom">
            <a href="mailto:impact@samuelgyasi.com" className="nd-email">impact@samuelgyasi.com</a>
            <div className="nd-social-row">
              <a href="https://www.linkedin.com/in/samuel-k-gyasi/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="nd-social-link">in</a>
              <a href="https://www.instagram.com/samuel_gsi?igsh=MWswMzRycjk1dXZ0cw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="nd-social-link">ig</a>
              <a href="https://web.facebook.com/samuel.kobinagyasi/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="nd-social-link">fb</a>
              <a href="https://www.tiktok.com/@samuel_gsi?_r=1&_t=ZS-94iqxzPNKqm" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="nd-social-link">tt</a>
            </div>
          </div>
        </div>
      </div>

      {open && <div className="nav-backdrop" onClick={close} aria-hidden />}
    </>
  );
}

