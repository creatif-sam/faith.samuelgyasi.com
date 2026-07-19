"use client";
import { visualStyles } from "./visualStyles";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { createAnonClient } from "@/lib/supabase/anon";
import { useLang } from "@/lib/i18n";
import { localizedHref } from "@/lib/i18n/locale";
import { Play, X, ChevronLeft, ChevronRight, Images, ArrowLeft } from "lucide-react";

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

const css = visualStyles;


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
    back: lang === "fr" ? "Ressources" : "Resources",
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
          <Link href={localizedHref(lang, "/resources")} className="visual-back"><ArrowLeft size={12} /> {translations.back}</Link>
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
                        <Play size={48} color="rgba(123,143,252,.3)" />
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
                        <Images size={40} style={{ color: "rgba(123,143,252,.25)" }} />
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
