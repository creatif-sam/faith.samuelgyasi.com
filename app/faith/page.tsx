"use client";
import { faithStyles1 } from "./faithStyles1";
import { faithStyles2 } from "./faithStyles2";

import { useEffect, useRef, Suspense } from "react";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { TestimonialsClient } from "@/components/organisms/TestimonialsClient";
import { useLang } from "@/lib/i18n";

/* ── Atomic / Molecular components ── */
import { FaithParticles }  from "./atoms/FaithParticles";
import { FaithNav }        from "./molecules/FaithNav";
import { FaithHero }       from "./molecules/FaithHero";
import { FaithBeliefs }    from "./molecules/FaithBeliefs";
import { FaithJourney }    from "./molecules/FaithJourney";
import { FaithScriptures } from "./molecules/FaithScriptures";
import { FaithPractice }   from "./molecules/FaithPractice";
import { FaithReflection } from "./molecules/FaithReflection";
import { FaithBlogStrip }  from "./molecules/FaithBlogStrip";
import { FaithConnect }    from "./molecules/FaithConnect";

const css = faithStyles1 + faithStyles2;


export default function FaithPage() {
  const { lang, toggleLang } = useLang();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("on-fdp");
    return () => document.body.classList.remove("on-fdp");
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(
      ".fdp .belief-card, .fdp .journey-entry, .fdp .sm-card, .fdp .pr-item"
    ).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [lang]);

  return (
    <div className="fdp" ref={sectionRef}>
      <style>{css}</style>

      {/* ── Ambient particles ── */}
      <FaithParticles />

      {/* ── Navigation ── */}
      <FaithNav lang={lang} onToggleLang={toggleLang} />

      {/* ── Hero ── */}
      <FaithHero lang={lang} />

      {/* ── Creed Declaration Strip ── */}
      <div className="fdp-creed-strip">
        <div className="fcs-inner">
          <span>Rooted in the Word</span>
          <span className="fcs-dot">·</span>
          <span>Shaped by Prayer</span>
          <span className="fcs-dot">·</span>
          <span>Called to Serve</span>
          <span className="fcs-dot">·</span>
          <span>Living by Grace</span>
        </div>
      </div>

      {/* ── Core Beliefs ── */}
      <FaithBeliefs lang={lang} />

      {/* ── Spiritual Journey ── */}
      <FaithJourney lang={lang} />

      {/* ── Scripture Gallery ── */}
      <FaithScriptures lang={lang} />

      {/* ── Pillars of Practice ── */}
      <FaithPractice lang={lang} />

      {/* ── Central Reflection ── */}
      <FaithReflection lang={lang} />

      {/* ── Blog Strip ── */}
      <FaithBlogStrip lang={lang} />

      {/* ── Connect ── */}
      <FaithConnect lang={lang} />

      {/* ── Testimonials & Footer ── */}
      <TestimonialsClient />
      <Suspense fallback={null}><SiteFooter /></Suspense>
    </div>
  );
}
