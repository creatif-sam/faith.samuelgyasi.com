"use client";
import { translations, PARTICLES } from "./myStoryTranslations";
import { myStoryStyles1 } from "./myStoryStyles1";
import { myStoryStyles2 } from "./myStoryStyles2";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n";

type Lang = "en" | "fr";

interface MyStoryContent {
  id: string;
  title_en: string;
  title_fr: string;
  content_en: string;
  content_fr: string;
  images: string[];
  updated_at: string;
  created_at: string;
}

const css = myStoryStyles1 + myStoryStyles2;


export default function MyStoryPage() {
  const { lang } = useLang();
  const [dbContent, setDbContent] = useState<MyStoryContent | null>(null);
  const [loading, setLoading] = useState(true);
  const t = translations[lang];

  useEffect(() => {
    const fetchContent = async () => {
      const db = createClient();
      const { data } = await db.from("my_story").select("*").single();
      setDbContent(data);
      setLoading(false);
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("msp-visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".msp-item, .msp-now-card").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [lang]);

  return (
    <>
      <div className="msp">
        <style>{css}</style>

        {/* PHOTO MOSAIC */}
        <div className="msp-mosaic">
          <p className="msp-mosaic-label">Samuel Kobina Gyasi</p>
          <div className="msp-mosaic-grid">
            {[1,2,3,4,5].map((n) => (
              <div key={n} className={`msp-photo msp-photo--${n}`}>
                <img src={`/my-story/my-story${n}.jpg`} alt={`Photo ${n}`} loading={n === 1 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </div>

        {/* HERO */}
        <div className="msp-hero">
          <div className="msp-hero-glow" aria-hidden />

          <div className="msp-particles" aria-hidden>
            {PARTICLES.map((p) => (
              <div
                key={p.id}
                className="msp-particle"
                style={{
                  width: p.size,
                  height: p.size,
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  animationDuration: `${p.dur}s`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}
          </div>

          <p className="msp-hero-eyebrow">{t.eyebrow}</p>
          <h1 className="msp-hero-headline">
            {t.headlineMain}
            <span className="msp-hl-gold">{t.headlineItalic}</span>
          </h1>
          <div className="msp-hero-rule" />
          <p className="msp-hero-sub">{t.sub}</p>
        </div>

        {/* PUBLIC NARRATIVE */}
        <div className="msp-narrative">
          <p className="msp-narrative-eyebrow">{t.narrativeEyebrow}</p>
          <h2 className="msp-narrative-heading">{t.narrativeHeading}</h2>
          <p className="msp-narrative-lead">{t.narrativeLead}</p>
          <div className="msp-three-acts">
            {t.narrativeActs.map((act, i) => (
              <div key={`${lang}-act-${i}`} className="msp-act">
                <div className="msp-act-num">{act.num}</div>
                <div className="msp-act-title">{act.title}</div>
                <div className="msp-act-body">{act.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TIMELINE */}
        <div className="msp-section">
          <div className="msp-timeline">
            {t.timeline.map((entry, i) => (
              <div
                key={`${lang}-${i}`}
                className="msp-item"
                style={{ transitionDelay: `${i * 0.04}s` }}
              >
                <div className="msp-dot-col">
                  <div className="msp-dot" />
                </div>
                <div className="msp-text">
                  <div className="msp-item-head">
                    <span className="msp-year">{entry.year}</span>
                    <span className="msp-title">{entry.title}</span>
                  </div>
                  <div className="msp-body">
                    {entry.body.map((p, j) => <p key={j}>{p}</p>)}
                  </div>
                  {entry.quote && (
                    <div className="msp-pullquote">&ldquo;{entry.quote}&rdquo;</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WHAT I DO NOW */}
        <section className="msp-now">
          <div className="msp-now-inner">
            <p className="msp-now-label">{t.nowLabel}</p>
            <h2 className="msp-now-heading">{t.nowHeading}</h2>
            <div className="msp-now-grid">
              {t.nowCards.map((card, i) => (
                <div
                  key={`${lang}-nc-${i}`}
                  className="msp-now-card"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="msp-now-num">{card.num}</div>
                  <div className="msp-now-card-title">{card.title}</div>
                  <div className="msp-now-card-body">{card.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DATABASE-DRIVEN CONTENT */}
        {dbContent && (
          <section style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '100px 8% 80px',
            borderTop: '1px solid rgba(201,168,76,.18)',
          }}>
            <div style={{
              fontFamily: "var(--font-space-mono),'Space Mono',monospace",
              fontSize: '10px',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              background: 'var(--gold-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px',
              animation: 'msp-rise .8s .05s ease both',
            }}>
              {lang === "fr" && dbContent.title_fr ? "Mon Histoire" : "My Story"}
            </div>
            <h2 style={{
              fontFamily: "var(--font-cormorant),'Cormorant Garamond',serif",
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 500,
              lineHeight: 1.2,
              color: 'var(--white)',
              marginBottom: '32px',
              animation: 'msp-rise .8s .1s ease both',
            }}>
              {lang === "fr" && dbContent.title_fr ? dbContent.title_fr : dbContent.title_en}
            </h2>
            <div style={{
              fontFamily: "var(--font-poppins),Poppins,sans-serif",
              fontSize: 'clamp(15px, 1.8vw, 18px)',
              lineHeight: 1.75,
              color: 'rgba(245,243,239,.72)',
              marginBottom: dbContent.images.length > 0 ? '60px' : '0',
              maxWidth: '840px',
              whiteSpace: 'pre-wrap',
              animation: 'msp-rise .8s .15s ease both',
            }}>
              {lang === "fr" && dbContent.content_fr ? dbContent.content_fr : dbContent.content_en}
            </div>

            {/* IMAGE GALLERY */}
            {dbContent.images.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginTop: '40px',
                animation: 'msp-rise .8s .2s ease both',
              }}>
                {dbContent.images.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      aspectRatio: '4/3',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid rgba(201,168,76,.2)',
                      background: 'rgba(0,0,0,.3)',
                    }}
                  >
                    <img
                      src={img}
                      alt={`${lang === "fr" && dbContent.title_fr ? dbContent.title_fr : dbContent.title_en} - ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <SiteFooter />
    </>
  );
}