"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { createAnonClient } from "@/lib/supabase/anon";
import { useLang } from "@/lib/i18n";
import { Play, X, ChevronLeft, ChevronRight, Images } from "lucide-react";

interface VideoItem {
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

interface GalleryPhoto {
  id: string;
  photo_url: string;
  caption: string | null;
  sort_order: number;
}

interface GalleryTheme {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  photos: GalleryPhoto[];
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

/* ── GALLERY SECTION ── */
.gallery-section {
  max-width: 1100px; margin: 0 auto;
  padding: 0 8% 80px;
}
.gallery-section-title {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 11px; letter-spacing: .28em; text-transform: uppercase;
  color: rgba(245,243,239,.3);
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 28px;
}
.gallery-section-title::after {
  content: ''; flex: 1; height: 1px; background: rgba(201,168,76,.08);
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.gallery-card {
  background: rgba(14,13,11,.95);
  border: 1px solid rgba(201,168,76,.08);
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color .3s, box-shadow .3s, transform .3s;
  opacity: 0; transform: translateY(14px);
}
.gallery-card.vis-visible { opacity: 1; transform: none; }
.gallery-card:hover {
  border-color: rgba(201,168,76,.3);
  box-shadow: 0 12px 32px rgba(0,0,0,.4);
  transform: translateY(-3px);
}
.gallery-card-thumb {
  width: 100%; aspect-ratio: 4/3; overflow: hidden;
  background: rgba(201,168,76,.07);
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
.gallery-card-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
.gallery-card:hover .gallery-card-thumb img { transform: scale(1.06); }
.gallery-card-count {
  position: absolute; bottom: 8px; right: 8px;
  background: rgba(0,0,0,.65); backdrop-filter: blur(6px);
  color: rgba(245,243,239,.8);
  font-family: var(--font-space-mono), monospace;
  font-size: 9px; letter-spacing: .12em;
  padding: 4px 9px; border-radius: 3px;
}
.gallery-card-info {
  padding: 18px 20px;
}
.gallery-card-title {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 15px; font-weight: 600; color: var(--white); line-height: 1.3; margin-bottom: 6px;
}
.gallery-card-desc {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 12px; font-weight: 300; color: rgba(245,243,239,.45); line-height: 1.65;
}

/* ── LIGHTBOX ── */
.lb-overlay {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(0,0,0,.94); backdrop-filter: blur(16px);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  animation: lb-in .25s ease;
}
@keyframes lb-in { from { opacity: 0; } to { opacity: 1; } }
.lb-close {
  position: absolute; top: 20px; right: 24px;
  background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
  border-radius: 8px; color: rgba(255,255,255,.7);
  cursor: pointer; padding: 8px; display: flex; transition: all .2s; z-index: 10;
}
.lb-close:hover { background: rgba(255,255,255,.15); color: #fff; }
.lb-main {
  display: flex; align-items: center; justify-content: center; gap: 16px;
  max-width: min(90vw, 1100px); width: 100%;
}
.lb-arrow {
  background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.1);
  border-radius: 50%; color: rgba(255,255,255,.6);
  cursor: pointer; width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all .2s;
}
.lb-arrow:hover { background: rgba(201,168,76,.2); color: #d4a843; border-color: rgba(201,168,76,.3); }
.lb-arrow:disabled { opacity: .2; cursor: default; }
.lb-img-wrap {
  flex: 1; max-height: 78vh; display: flex; align-items: center; justify-content: center;
}
.lb-img-wrap img {
  max-width: 100%; max-height: 78vh; object-fit: contain;
  border-radius: 4px; box-shadow: 0 12px 48px rgba(0,0,0,.6);
}
.lb-footer {
  margin-top: 20px; text-align: center;
}
.lb-caption {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 13px; color: rgba(245,243,239,.55); font-weight: 300;
  margin-bottom: 10px; min-height: 20px;
}
.lb-dots {
  display: flex; gap: 7px; justify-content: center;
}
.lb-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: rgba(255,255,255,.18); cursor: pointer; transition: background .2s;
  border: none;
}
.lb-dot.active { background: #d4a843; }

/* ── EMPTY ── */
.visual-empty {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 22px; color: rgba(245,243,239,.35);
  padding: 80px; text-align: center; grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .visual-header { padding: 130px 6% 56px; }
  .visual-grid { grid-template-columns: 1fr; padding: 48px 6% 72px; }
  .gallery-section { padding: 0 6% 72px; }
  .gallery-grid { grid-template-columns: 1fr; }
  .lb-arrow { width: 36px; height: 36px; }
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
  const [galleries, setGalleries] = useState<GalleryTheme[]>([]);

  // Lightbox state
  const [lightbox, setLightbox] = useState<{ photos: GalleryPhoto[]; index: number } | null>(null);

  const translations = {
    back: lang === "fr" ? "← Ressources" : "← Resources",
    eyebrow: lang === "fr" ? "Samuel Kobina Gyasi · Bibliothèque Visuelle" : "Samuel Kobina Gyasi · Visual Library",
    title: lang === "fr" ? "Bibliothèque" : "Visual",
    titleEm: lang === "fr" ? "Visuelle" : "Library",
    subtitle: lang === "fr" 
      ? "Enseignements vidéo, conférences et galeries photos explorant la foi." 
      : "Video teachings, talks, and photo galleries exploring the depths of faith and theology.",
    empty: lang === "fr" ? "Aucune vidéo publiée pour le moment. Revenez bientôt." : "No video content published yet. Check back soon.",
  };

  const load = useCallback(async () => {
    try {
      const sb = createAnonClient();
      const [vidRes, galRes] = await Promise.all([
        sb.from("library_items")
          .select("*")
          .eq("category", "visual")
          .eq("published", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
        sb.from("gallery_themes")
          .select("*, photos:gallery_photos(*)")
          .eq("published", true)
          .order("sort_order", { ascending: true }),
      ]);
      if (vidRes.data && vidRes.data.length > 0) setVideoItems(vidRes.data);
      if (galRes.data) {
        setGalleries(galRes.data.map((g: GalleryTheme & { photos: GalleryPhoto[] }) => ({
          ...g,
          photos: [...(g.photos ?? [])].sort((a, b) => a.sort_order - b.sort_order),
        })));
      }
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
    document.querySelectorAll(".video-card, .gallery-card").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [videoItems, galleries]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setLightbox((p) => p ? { ...p, index: Math.min(p.index + 1, p.photos.length - 1) } : p);
      if (e.key === "ArrowLeft")  setLightbox((p) => p ? { ...p, index: Math.max(p.index - 1, 0) } : p);
      if (e.key === "Escape")     setLightbox(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

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

        {/* ── VIDEO GRID ── */}
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
                      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
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

        {/* ── PHOTO GALLERIES ── */}
        {galleries.length > 0 && (
          <div className="gallery-section">
            <div className="gallery-section-title">
              <Images size={13} /> Photo Galleries
            </div>
            <div className="gallery-grid">
              {galleries.map((theme, i) => {
                const cover = theme.cover_url ?? theme.photos?.[0]?.photo_url;
                return (
                  <div
                    key={theme.id}
                    className="gallery-card vis-visible"
                    style={{ transitionDelay: `${i * 0.06}s` }}
                    onClick={() => theme.photos?.length > 0 && setLightbox({ photos: theme.photos, index: 0 })}
                  >
                    <div className="gallery-card-thumb">
                      {cover ? (
                        <img src={cover} alt={theme.title} />
                      ) : (
                        <Images size={40} style={{ color: "rgba(201,168,76,.25)" }} />
                      )}
                      {theme.photos?.length > 0 && (
                        <div className="gallery-card-count">{theme.photos.length} photos</div>
                      )}
                    </div>
                    <div className="gallery-card-info">
                      <div className="gallery-card-title">{theme.title}</div>
                      {theme.description && (
                        <p className="gallery-card-desc">{theme.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div className="lb-overlay" onClick={() => setLightbox(null)}>
          <button className="lb-close" onClick={() => setLightbox(null)}><X size={18} /></button>

          <div className="lb-main" onClick={(e) => e.stopPropagation()}>
            <button
              className="lb-arrow"
              disabled={lightbox.index === 0}
              onClick={() => setLightbox((p) => p ? { ...p, index: p.index - 1 } : p)}
            >
              <ChevronLeft size={20} />
            </button>

            <div className="lb-img-wrap">
              <img
                src={lightbox.photos[lightbox.index].photo_url}
                alt={lightbox.photos[lightbox.index].caption ?? ""}
              />
            </div>

            <button
              className="lb-arrow"
              disabled={lightbox.index === lightbox.photos.length - 1}
              onClick={() => setLightbox((p) => p ? { ...p, index: p.index + 1 } : p)}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="lb-footer" onClick={(e) => e.stopPropagation()}>
            <div className="lb-caption">
              {lightbox.photos[lightbox.index].caption ?? ""}
            </div>
            <div className="lb-dots">
              {lightbox.photos.map((_, i) => (
                <button
                  key={i}
                  className={`lb-dot${i === lightbox.index ? " active" : ""}`}
                  onClick={() => setLightbox((p) => p ? { ...p, index: i } : p)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={null}><SiteFooter /></Suspense>
    </>
  );
}
