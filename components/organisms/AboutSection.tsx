"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { aboutTranslations as t } from "@/lib/i18n/about";

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();

  useEffect(() => {
    const entries = sectionRef.current?.querySelectorAll<HTMLElement>(
      ".tl-entry, .mt-item"
    );
    if (!entries) return;

    const observer = new IntersectionObserver(
      (obs) => {
        obs.forEach((o) => {
          if (o.isIntersecting) {
            (o.target as HTMLElement).classList.add("tl-visible");
            observer.unobserve(o.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    entries.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [lang]);

  return (
    <section id="my-story" className="about-section about-timeline-section">
      <div className="tl-inner" ref={sectionRef}>

        <div className="tl-header">
          <span className="tl-eyebrow">{t.eyebrow[lang]}</span>
          <h2 className="tl-main-title">
            {lang === "en"
              ? <>A Life <em>Built</em> on Purpose, <span>Faith &amp; Collective Growth</span></>
              : <>Une Vie <em>Bâtie</em> sur le But, <span>la Foi &amp; la Croissance Collective</span></>}
          </h2>
        </div>

        {/* ── 7 Mountains of Culture ── */}
        <div className="mountains-section">
          <p className="mountains-intro">{t.mountains.intro[lang]}</p>
          <ol className="mountains-list">
            {(t.mountains.list as { en: string; fr: string }[]).map((m, i) => (
              <li
                key={i}
                className="mt-item"
                style={{ "--mi": i } as React.CSSProperties}
              >
                <span className="mt-num">0{i + 1}</span>
                <span className="mt-label">{m[lang]}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="tl-track">
          <div className="tl-spine" aria-hidden="true" />

          {(t.timeline as { year: { en: string; fr: string }; title: { en: string; fr: string }; body: { en: string; fr: string } }[]).map((entry, i) => (
            <div
              key={i}
              className="tl-entry"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="tl-dot" aria-hidden="true">
                <div className="tl-dot-inner" />
              </div>

              <div className="tl-content">
                <div className="tl-year">{entry.year[lang]}</div>
                <h3 className="tl-title">{entry.title[lang]}</h3>
                <p className="tl-body">{entry.body[lang]}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="tl-quote-wrap">
          <blockquote className="tl-quote">
            {(t.quote.text as { en: string; fr: string })[lang]}
            <cite>{(t.quote.cite as { en: string; fr: string })[lang]}</cite>
          </blockquote>
        </div>

      </div>
    </section>
  );
}
