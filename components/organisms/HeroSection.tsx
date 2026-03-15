"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const heroPillars = [
  { num: "01", label: "Beliefs",            href: "/faith"           },
  { num: "02", label: "Leadership",        href: "/leadership"      },
  { num: "03", label: "Intellectuality",   href: "/intellectuality" },
  { num: "04", label: "Transformation",    href: "/transformation"  },
];

export function HeroSection() {
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    const handleMove = (e: MouseEvent) => {
      raf = requestAnimationFrame(() => {
        if (!photoRef.current) return;
        const { innerWidth: w, innerHeight: h } = window;
        const dx = (e.clientX / w - 0.5) * 12;
        const dy = (e.clientY / h - 0.5) * 8;
        photoRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => { window.removeEventListener("mousemove", handleMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="hero" className="hero-section hero-v2">
      {/* ── background rings ── */}
      <svg className="hero-rings-bg" aria-hidden="true" viewBox="0 0 800 800">
        <circle cx="400" cy="400" r="340" />
        <circle cx="400" cy="400" r="260" />
        <circle cx="400" cy="400" r="180" />
        <polygon points="400,80 700,540 100,540" />
        <polygon points="400,720 100,260 700,260" />
      </svg>

      {/* ── left panel: text ── */}
      <div className="hero-left-v2">
        <p className="hero-eyebrow-v2">Leader · CI Facilitator · Thinker · Transformation Contributor</p>
        <h1 className="hero-name-v2">
          <span className="hn-first">Samuel</span>
          <span className="hn-last">Gyasi</span>
        </h1>
        <div className="hero-divider-v2" />
        <p className="hero-tagline-v2">
          &ldquo;Rooted in the Word.<br />Refined by Purpose.<br />Rising to Transform.&rdquo;
        </p>
        <div className="hero-cta-row">
          <a href="#about" className="hero-btn-primary">Explore</a>
          <a href="#connect" className="hero-btn-ghost">Connect</a>
        </div>
      </div>

      {/* ── centre: photo ── */}
      <div className="hero-photo-wrap" ref={photoRef}>
        <div className="hero-photo-glow" />
        <div className="hero-photo-frame">
          <Image
            src="/photo-hero.png"
            alt="Samuel Kobina Gyasi"
            fill
            priority
            sizes="(max-width:768px) 260px, 380px"
            className="hero-photo-img"
          />
        </div>
        <div className="hero-photo-badge">
          <span className="hpb-line">CI Facilitator</span>
          <span className="hpb-sub">Collective Intelligence</span>
        </div>
      </div>

      {/* ── right panel: pillars ── */}
      <div className="hero-right-v2">
        <ul className="pillar-list-v2">
          {heroPillars.map((p) => (
            <li key={p.num}>
              <Link href={p.href} className="pillar-link">
                <span className="pillar-num-v2">{p.num}</span>
                <span className="pillar-label">{p.label}</span>
                <span className="pillar-arrow">→</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="hero-scroll-v2">
          <span>Scroll</span>
        </div>
      </div>
    </section>
  );
}
