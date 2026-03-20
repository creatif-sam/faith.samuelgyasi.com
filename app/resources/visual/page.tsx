"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { createAnonClient } from "@/lib/supabase/anon";
import { useLang } from "@/lib/i18n";
import { Play } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  download_url: string | null; // YouTube URL
  category: string;
  published: boolean;
  created_at: string;
  duration?: string | null;
}

// Extract YouTube video ID from URL
function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

const css = `
.visual-pg {
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  position: relative;
}
.visual-pg::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: radial-gradient(ellipse at 20% 60%, rgba(201,168,76,.04) 0%, transparent 55%);
  pointer-events: none;
  z-index: 0;
}
.visual-pg > * { position: relative; z-index: 1; }

/* ── HEADER ── */
.visual-header {
  padding: 140px 8% 64px;
  border-bottom: 1px solid rgba(201,168,76,.1);
  max-width: 1100px; margin: 0 auto;
}
.visual-back {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .22em; text-transform: uppercase;
  color: rgba(245,243,239,.4); text-decoration: none;
  display: flex; align-items: center; gap: 8px; margin-bottom: 40px;
  transition: color .25s;
}
.visual-back:hover { color: var(--gold); }
.visual-eyebrow {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 10px; letter-spacing: .35em; text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  margin-bottom: 20px;
  opacity: 0; animation: vis-rise .9s .1s ease forwards;
}
.visual-headline {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(44px, 7vw, 96px); font-weight: 900;
  line-height: .9; letter-spacing: -.03em;
  color: var(--white); text-transform: uppercase;
  opacity: 0; animation: vis-rise .9s .25s ease forwards;
}
.visual-headline em {
  font-style: italic; font-weight: 400;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  display: block;
}
.visual-rule {
  width: 56px; height: 2px;
  background: linear-gradient(90deg,#ffde59,#ff914d);
  margin: 24px 0;
  opacity: 0; animation: vis-rise .9s .4s ease forwards;
}
.visual-sub {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: clamp(16px, 1.8vw, 20px); font-weight: 300;
  color: rgba(245,243,239,.6); max-width: 520px; line-height: 1.7;
  opacity: 0; animation: vis-rise .9s .5s ease forwards;
}
@keyframes vis-rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}

/* ── GRID ── */
.visual-grid {
  max-width: 1100px; margin: 0 auto;
  padding: 72px 8% 100px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}
.video-card {
  background: rgba(14,13,11,.9);
  border: 1px solid rgba(201,168,76,.08);
  overflow: hidden;
  opacity: 0; transform: translateY(18px);
  transition: opacity .7s ease, transform .7s ease, border-color .3s;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
}
.video-card.vis-visible { opacity: 1; transform: none; }
.video-card:hover { border-color: rgba(201,168,76,.22); }
.video-thumbnail {
  width: 100%; aspect-ratio: 16/9;
  background: rgba(201,168,76,.08);
  border-bottom: 1px solid rgba(201,168,76,.12);
  position: relative;
  overflow: hidden;
}
.video-thumbnail img {
  width: 100%; height: 100%; object-fit: cover;
}
.video-thumbnail::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity .3s;
}
.video-card:hover .video-thumbnail::after {
  opacity: 1;
}
.video-play-icon {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 60px; height: 60px;
  background: rgba(255,255,255,.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a0a0a;
  opacity: 0;
  transition: opacity .3s, transform .3s;
  pointer-events: none;
}
.video-card:hover .video-play-icon {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.1);
}
.video-info {
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}
.video-cat {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .25em; text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.video-title {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(18px, 2vw, 24px); font-weight: 700;
  color: var(--white); line-height: 1.2;
}
.video-desc {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 14px; font-weight: 300;
  color: rgba(245,243,239,.58); line-height: 1.65;
}
.video-meta {
  display: flex; gap: 16px; align-items: center;
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .15em; text-transform: uppercase;
  color: rgba(245,243,239,.25);
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(201,168,76,.08);
}

/* ── EMPTY ── */
.visual-empty {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 22px; color: rgba(245,243,239,.35);
  padding: 80px; text-align: center; grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .visual-header { padding: 130px 6% 56px; }
  .visual-grid { grid-template-columns: 1fr; padding: 48px 6% 72px; }
}
`;

function fmt(d: string, lang: string) {
  return new Date(d).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { 
    month: "long", 
    year: "numeric" 
  });
}

export default function VisualPage() {
  const { lang } = useLang();
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);

  const translations = {
    back: lang === "fr" ? "← Ressources" : "← Resources",
    eyebrow: lang === "fr" ? "Samuel Kobina Gyasi · Bibliothèque Visuelle" : "Samuel Kobina Gyasi · Visual Library",
    title: lang === "fr" ? "Bibliothèque" : "Visual",
    titleEm: lang === "fr" ? "Visuelle" : "Library",
    subtitle: lang === "fr" 
      ? "Enseignements vidéo, conférences et contenu visuel explorant les profondeurs de la foi." 
      : "Video teachings, talks, and visual content exploring the depths of faith and theology.",
    empty: lang === "fr" ? "Aucune vidéo publiée pour le moment. Revenez bientôt." : "No video content published yet. Check back soon.",
  };

  const load = useCallback(async () => {
    try {
      const sb = createAnonClient();
      const { data } = await sb
        .from("library_items")
        .select("*")
        .eq("category", "visual")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (data && data.length > 0) setVideoItems(data);
    } catch {
      // fallback to empty
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis-visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".video-card").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [videoItems]);

  return (
    <>
      <div className="visual-pg">
        <style>{css}</style>

        {/* ── HEADER ── */}
        <div className="visual-header">
          <Link href="/resources" className="visual-back">{translations.back}</Link>
          <p className="visual-eyebrow">{translations.eyebrow}</p>
          <h1 className="visual-headline">
            {translations.title}<br /><em>{translations.titleEm}</em>
          </h1>
          <div className="visual-rule" />
          <p className="visual-sub">{translations.subtitle}</p>
        </div>

        {/* ── GRID ── */}
        <div className="visual-grid">
          {videoItems.length === 0 ? (
            <p className="visual-empty">{translations.empty}</p>
          ) : (
            videoItems.map((item, i) => {
              const videoId = item.download_url ? getYouTubeId(item.download_url) : null;
              const thumbnailUrl = videoId 
                ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                : item.cover_url;

              return (
                <a
                  key={item.id}
                  href={item.download_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-card"
                  style={{ transitionDelay: `${i * 0.06}s` }}
                >
                  <div className="video-thumbnail">
                    {thumbnailUrl ? (
                      <img src={thumbnailUrl} alt={item.title} />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={48} color="rgba(201,168,76,.3)" />
                      </div>
                    )}
                    <div className="video-play-icon">
                      <Play size={28} fill="currentColor" />
                    </div>
                  </div>
                  <div className="video-info">
                    <div className="video-cat">{item.category || "Video"}</div>
                    <h3 className="video-title">{item.title}</h3>
                    {item.description && <p className="video-desc">{item.description}</p>}
                    <div className="video-meta">
                      <span>{fmt(item.created_at, lang)}</span>
                      {item.duration && <span>· {item.duration}</span>}
                    </div>
                  </div>
                </a>
              );
            })
          )}
        </div>
      </div>
      <Suspense fallback={null}><SiteFooter /></Suspense>
    </>
  );
}
