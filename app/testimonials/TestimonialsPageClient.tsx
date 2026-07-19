"use client";
import { testimonialsStyles } from "./testimonialsStyles";

import { useEffect, useState } from "react";
import { Diamond } from "lucide-react";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { StarRating } from "@/components/atoms/StarRating";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  avatar_url: string | null;
  quote: string;
  rating: number;
}

const css = testimonialsStyles;

export default function TestimonialsPageClient({ initialItems }: { initialItems: Testimonial[] }) {
  const [items, setItems] = useState<Testimonial[]>(initialItems);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d) && d.length > 0) setItems(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("tm-visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".tm-card").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, items]);

  const avgRating = items.length
    ? (items.reduce((s, t) => s + t.rating, 0) / items.length).toFixed(1)
    : "5.0";

  return (
    <>
      <div className="tm-pg">
        <style>{css}</style>

        {/* HERO */}
        <div className="tm-hero">
          <p className="tm-eyebrow">Samuel Kobina Gyasi · Voices</p>
          <h1 className="tm-headline">
            Testi&shy;<br /><em>monials</em>
          </h1>
          <div className="tm-rule" />
          <p className="tm-sub">
            Words from those who have walked alongside, been mentored by, or
            collaborated with Samuel across continents and callings.
          </p>
        </div>

        {/* STATS STRIP */}
        {items.length > 0 && (
          <div className="tm-stats">
            <div className="tm-stat" style={{ animationDelay: ".15s" }}>
              <div className="tm-stat-num">{items.length}+</div>
              <div className="tm-stat-label">Testimonials</div>
            </div>
            <div className="tm-stat" style={{ animationDelay: ".27s" }}>
              <div className="tm-stat-num">{avgRating}</div>
              <div className="tm-stat-label">Avg. Rating</div>
            </div>
            <div className="tm-stat" style={{ animationDelay: ".39s" }}>
              <div className="tm-stat-num">4+</div>
              <div className="tm-stat-label">Continents</div>
            </div>
          </div>
        )}

        {/* GRID */}
        <div className="tm-grid-wrap">
          {loading ? (
            <div className="tm-empty">
              <div className="tm-empty-icon" style={{ color: "#546cfa" }}><Diamond size={18} /></div>
              <p>Loading testimonials&hellip;</p>
            </div>
          ) : items.length === 0 ? (
            <div className="tm-empty">
              <div className="tm-empty-icon" style={{ color: "#546cfa" }}><Diamond size={18} /></div>
              <p>Testimonials coming soon.</p>
            </div>
          ) : (
            <div className="tm-grid">
              {items.map((t, idx) => (
                <div
                  key={t.id}
                  className={`tm-card${idx === 0 ? " tm-card--featured" : ""}`}
                  style={{ transitionDelay: `${idx * 0.06}s` }}
                >
                  <StarRating rating={t.rating} size={13} gap={2} className="tm-stars" />
                  <blockquote className="tm-quote">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="tm-author">
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt={t.name} className="tm-avatar" loading="lazy" />
                    ) : (
                      <div className="tm-avatar-initials">
                        {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                    )}
                    <div>
                      <div className="tm-author-name">{t.name}</div>
                      {(t.role || t.company) && (
                        <div className="tm-author-role">
                          {[t.role, t.company].filter(Boolean).join(" · ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <section className="tm-cta">
          <div className="tm-cta-inner">
            <p className="tm-cta-eyebrow">Add Your Voice</p>
            <h2 className="tm-cta-h">Have we worked or walked together?</h2>
            <p className="tm-cta-sub">
              If Samuel has mentored, collaborated with, or served alongside you,
              your words are welcome here.
            </p>
            <a href="mailto:impact@samuelgyasi.com?subject=Testimonial" className="tm-cta-btn">
              Share a Testimonial
            </a>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
