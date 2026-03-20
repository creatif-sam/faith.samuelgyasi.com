"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { createAnonClient } from "@/lib/supabase/anon";
import { useLang } from "@/lib/i18n";
import { Download, Play } from "lucide-react";

interface AudioItem {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  download_url: string | null;
  category: string;
  published: boolean;
  created_at: string;
  duration?: string | null;
}

const css = `
.audio-pg {
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  position: relative;
}
.audio-pg::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: radial-gradient(ellipse at 20% 60%, rgba(201,168,76,.04) 0%, transparent 55%);
  pointer-events: none;
  z-index: 0;
}
.audio-pg > * { position: relative; z-index: 1; }

/* ── HEADER ── */
.audio-header {
  padding: 140px 8% 64px;
  border-bottom: 1px solid rgba(201,168,76,.1);
  max-width: 1100px; margin: 0 auto;
}
.audio-back {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .22em; text-transform: uppercase;
  color: rgba(245,243,239,.4); text-decoration: none;
  display: flex; align-items: center; gap: 8px; margin-bottom: 40px;
  transition: color .25s;
}
.audio-back:hover { color: var(--gold); }
.audio-eyebrow {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 10px; letter-spacing: .35em; text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  margin-bottom: 20px;
  opacity: 0; animation: aud-rise .9s .1s ease forwards;
}
.audio-headline {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(44px, 7vw, 96px); font-weight: 900;
  line-height: .9; letter-spacing: -.03em;
  color: var(--white); text-transform: uppercase;
  opacity: 0; animation: aud-rise .9s .25s ease forwards;
}
.audio-headline em {
  font-style: italic; font-weight: 400;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  display: block;
}
.audio-rule {
  width: 56px; height: 2px;
  background: linear-gradient(90deg,#ffde59,#ff914d);
  margin: 24px 0;
  opacity: 0; animation: aud-rise .9s .4s ease forwards;
}
.audio-sub {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: clamp(16px, 1.8vw, 20px); font-weight: 300;
  color: rgba(245,243,239,.6); max-width: 520px; line-height: 1.7;
  opacity: 0; animation: aud-rise .9s .5s ease forwards;
}
@keyframes aud-rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}

/* ── GRID ── */
.audio-grid {
  max-width: 1100px; margin: 0 auto;
  padding: 72px 8% 100px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.audio-card {
  background: rgba(14,13,11,.9);
  border: 1px solid rgba(201,168,76,.08);
  padding: 32px;
  display: flex; gap: 24px;
  opacity: 0; transform: translateY(18px);
  transition: opacity .7s ease, transform .7s ease, border-color .3s;
  text-decoration: none;
  color: inherit;
}
.audio-card.aud-visible { opacity: 1; transform: none; }
.audio-card:hover { border-color: rgba(201,168,76,.22); }
.audio-cover {
  width: 120px; height: 120px;
  background: rgba(201,168,76,.08);
  border: 1px solid rgba(201,168,76,.12);
  display: flex; align-items: center; justify-content: center;
  font-size: 32px; color: rgba(201,168,76,.3);
  flex-shrink: 0;
}
.audio-cover img { width: 100%; height: 100%; object-fit: cover; }
.audio-info { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.audio-cat {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .25em; text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.audio-title {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(18px, 2vw, 24px); font-weight: 700;
  color: var(--white); line-height: 1.2;
}
.audio-desc {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 14px; font-weight: 300;
  color: rgba(245,243,239,.58); line-height: 1.65;
}
.audio-meta {
  display: flex; gap: 16px; align-items: center;
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .15em; text-transform: uppercase;
  color: rgba(245,243,239,.25);
}
.audio-download-btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .22em; text-transform: uppercase;
  padding: 10px 20px;
  background: linear-gradient(90deg,#ffde59,#ff914d);
  color: #0a0a0a; text-decoration: none;
  transition: opacity .25s; cursor: pointer; border: none;
  margin-top: auto;
}
.audio-download-btn:hover { opacity: .8; }

/* ── EMPTY ── */
.audio-empty {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 22px; color: rgba(245,243,239,.35);
  padding: 80px; text-align: center; grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .audio-header { padding: 130px 6% 56px; }
  .audio-grid { grid-template-columns: 1fr; padding: 48px 6% 72px; }
  .audio-card { flex-direction: column; }
  .audio-cover { width: 100%; height: 200px; }
}
`;

function fmt(d: string, lang: string) {
  return new Date(d).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { 
    month: "long", 
    year: "numeric" 
  });
}

export default function AudioPage() {
  const { lang } = useLang();
  const [audioItems, setAudioItems] = useState<AudioItem[]>([]);

  const translations = {
    back: lang === "fr" ? "← Ressources" : "← Resources",
    eyebrow: lang === "fr" ? "Samuel Kobina Gyasi · Bibliothèque Audio" : "Samuel Kobina Gyasi · Audio Library",
    title: lang === "fr" ? "Bibliothèque" : "Audio",
    titleEm: lang === "fr" ? "Audio" : "Library",
    subtitle: lang === "fr" 
      ? "Enseignements parlés, sermons et réflexions sur la foi, les Écritures et la marche chrétienne." 
      : "Spoken teachings, sermons, and reflections on faith, Scripture, and the Christian walk.",
    download: lang === "fr" ? "Télécharger" : "Download",
    empty: lang === "fr" ? "Aucun audio publié pour le moment. Revenez bientôt." : "No audio content published yet. Check back soon.",
  };

  const load = useCallback(async () => {
    try {
      const sb = createAnonClient();
      const { data } = await sb
        .from("library_items")
        .select("*")
        .eq("category", "audio")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (data && data.length > 0) setAudioItems(data);
    } catch {
      // fallback to empty
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("aud-visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".audio-card").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [audioItems]);

  return (
    <>
      <div className="audio-pg">
        <style>{css}</style>

        {/* ── HEADER ── */}
        <div className="audio-header">
          <Link href="/resources" className="audio-back">{translations.back}</Link>
          <p className="audio-eyebrow">{translations.eyebrow}</p>
          <h1 className="audio-headline">
            {translations.title}<br /><em>{translations.titleEm}</em>
          </h1>
          <div className="audio-rule" />
          <p className="audio-sub">{translations.subtitle}</p>
        </div>

        {/* ── GRID ── */}
        <div className="audio-grid">
          {audioItems.length === 0 ? (
            <p className="audio-empty">{translations.empty}</p>
          ) : (
            audioItems.map((item, i) => (
              <div key={item.id} className="audio-card" style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="audio-cover">
                  {item.cover_url ? (
                    <img src={item.cover_url} alt={item.title} />
                  ) : (
                    <Play size={40} />
                  )}
                </div>
                <div className="audio-info">
                  <div className="audio-cat">{item.category || "Audio"}</div>
                  <h3 className="audio-title">{item.title}</h3>
                  {item.description && <p className="audio-desc">{item.description}</p>}
                  <div className="audio-meta">
                    <span>{fmt(item.created_at, lang)}</span>
                    {item.duration && <span>· {item.duration}</span>}
                  </div>
                  {item.download_url && (
                    <a
                      href={item.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="audio-download-btn"
                    >
                      <Download size={14} />
                      {translations.download}
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Suspense fallback={null}><SiteFooter /></Suspense>
    </>
  );
}
