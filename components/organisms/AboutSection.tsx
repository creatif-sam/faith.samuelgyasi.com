"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { aboutTranslations as t } from "@/lib/i18n/about";

type BilingualStr = { en: string; fr: string };

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();

  useEffect(() => {
    const entries = sectionRef.current?.querySelectorAll<HTMLElement>(
      ".tl-entry, .mt-item, .cp-item"
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

  const transforming = t.transforming as {
    label: BilingualStr; heading: BilingualStr;
    steps: BilingualStr[]; description: BilingualStr;
  };
  const cardinalPoints = t.cardinalPoints as {
    label: BilingualStr; points: BilingualStr[];
  };

  return (
    <section id="my-story" className="about-section about-timeline-section">
      <div className="tl-inner" ref={sectionRef}>

        <div className="tl-header">
          <span className="tl-eyebrow">{t.eyebrow[lang]}</span>
          <h2 className="tl-main-title">
            {lang === "en"
              ? <>A Life <em>Built</em> on Purpose, <span>Faith &amp; Collective Growth</span></>
              : <>Une Vie <em>B�tie</em> sur le But, <span>la Foi &amp; la Croissance Collective</span></>}
          </h2>
        </div>

        {/* -- Transformation journey -- */}
        <div className="transformation-section">
          <p className="tl-eyebrow" style={{ marginBottom: "16px" }}>{transforming.label[lang]}</p>
          <p className="transformation-description">{transforming.description[lang]}</p>
          <div className="transformation-steps">
            {transforming.steps.map((step, i) => (
              <div key={i} className="transformation-step">
                <span className="transformation-arrow">{i > 0 ? "?" : ""}</span>
                <span className="transformation-word">{step[lang]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* -- 4 Cardinal Points -- */}
        <div className="cardinal-section">
          <p className="tl-eyebrow" style={{ marginBottom: "24px" }}>{cardinalPoints.label[lang]}</p>
          <ol className="cardinal-list">
            {cardinalPoints.points.map((pt, i) => (
              <li key={i} className="cp-item mt-item" style={{ "--mi": i } as React.CSSProperties}>
                <span className="mt-num">0{i + 1}</span>
                <span className="mt-label">{pt[lang]}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* -- 7 Mountains of Culture -- */}
        <div className="mountains-section">
          <p className="mountains-intro">{t.mountains.intro[lang]}</p>
          <ol className="mountains-list">
            {(t.mountains.list as BilingualStr[]).map((m, i) => (
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

          {(t.timeline as { year: BilingualStr; title: BilingualStr; body: BilingualStr }[]).map((entry, i) => (
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
            {(t.quote.text as BilingualStr)[lang]}
            <cite>{(t.quote.cite as BilingualStr)[lang]}</cite>
          </blockquote>
        </div>

      </div>
    </section>
  );
}
