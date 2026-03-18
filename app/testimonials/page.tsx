"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { SiteFooter } from "@/components/organisms/SiteFooter";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  avatar_url: string | null;
  quote: string;
  rating: number;
}

const css = `
.tm-pg {
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  position: relative;
}

/* ── AMBIENT ── */
.tm-pg::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(ellipse at 25% 55%, rgba(201,168,76,.04) 0%, transparent 55%),
    radial-gradient(ellipse at 78% 15%, rgba(201,168,76,.03) 0%, transparent 55%);
  pointer-events: none;
  z-index: 0;
}

/* ── HERO ── */
.tm-hero {
  position: relative;
  z-index: 1;
  padding: 140px 8% 80px;
  border-bottom: 1px solid rgba(201,168,76,.12);
  max-width: 1100px;
  margin: 0 auto;
}
.tm-eyebrow {
  font-family: var(--font-space-mono),'Space Mono',monospace;
  font-size: 10px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  opacity: 0;
  animation: tm-rise .85s .1s ease forwards;
}
.tm-headline {
  font-family: var(--font-playfair),'Playfair Display',serif;
  font-size: clamp(52px,8vw,110px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  margin-bottom: 28px;
  opacity: 0;
  animation: tm-rise .85s .25s ease forwards;
}
.tm-headline em {
  display: block;
  font-style: italic;
  font-weight: 400;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.tm-rule {
  width: 56px; height: 2px;
  background: var(--gold-gradient);
  margin: 24px 0;
  opacity: 0;
  animation: tm-rise .85s .38s ease forwards;
}
.tm-sub {
  font-family: var(--font-cormorant),'Cormorant Garamond',serif;
  font-size: clamp(17px,2vw,22px);
  font-style: italic;
  color: rgba(245,243,239,.6);
  max-width: 560px;
  line-height: 1.7;
  opacity: 0;
  animation: tm-rise .85s .5s ease forwards;
}
@keyframes tm-rise {
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:none; }
}

/* ── STATS STRIP ── */
.tm-stats {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 0;
  border-bottom: 1px solid rgba(201,168,76,.12);
}
.tm-stat {
  flex: 1;
  padding: 40px 5%;
  border-right: 1px solid rgba(201,168,76,.12);
  text-align: center;
  opacity: 0;
  animation: tm-rise .85s ease forwards;
}
.tm-stat:last-child { border-right: none; }
.tm-stat-num {
  font-family: var(--font-playfair),'Playfair Display',serif;
  font-size: clamp(36px,5vw,64px);
  font-weight: 900;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 6px;
}
.tm-stat-label {
  font-family: var(--font-space-mono),'Space Mono',monospace;
  font-size: 9px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(245,243,239,.4);
}

/* ── GRID ── */
.tm-grid-wrap {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 8% 80px;
}
.tm-grid {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 2px;
}
.tm-card {
  padding: 40px;
  background: rgba(245,243,239,.025);
  border: 1px solid rgba(201,168,76,.1);
  transition: border-color .25s, background .25s;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity .6s ease, transform .6s ease, border-color .25s, background .25s;
}
.tm-card.tm-visible { opacity:1; transform:none; }
.tm-card:hover { border-color: rgba(201,168,76,.3); background: rgba(245,243,239,.04); }
.tm-card--featured {
  grid-column: 1 / 3;
  background: rgba(201,168,76,.04);
  border-color: rgba(201,168,76,.2);
}
.tm-stars {
  display: flex;
  gap: 2px;
  margin-bottom: 18px;
}
.tm-star { font-size: 13px; color: rgba(245,243,239,.2); }
.tm-star.on { color: #c9a84c; }
.tm-quote {
  font-family: var(--font-playfair),'Playfair Display',serif;
  font-style: italic;
  font-size: clamp(16px,1.6vw,19px);
  line-height: 1.75;
  color: rgba(245,243,239,.82);
  margin: 0 0 28px;
}
.tm-card--featured .tm-quote {
  font-size: clamp(18px,2vw,23px);
}
.tm-author {
  display: flex;
  align-items: center;
  gap: 14px;
}
.tm-avatar {
  width: 42px; height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(201,168,76,.3);
  flex-shrink: 0;
}
.tm-avatar-initials {
  width: 42px; height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(201,168,76,.3);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-space-mono),'Space Mono',monospace;
  font-size: 11px;
  letter-spacing: 0.05em;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
}
.tm-author-name {
  font-family: var(--font-space-mono),'Space Mono',monospace;
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--white);
  margin-bottom: 3px;
}
.tm-author-role {
  font-family: var(--font-cormorant),'Cormorant Garamond',serif;
  font-size: 14px;
  font-style: italic;
  color: rgba(245,243,239,.4);
}

/* ── EMPTY ── */
.tm-empty {
  padding: 80px 24px;
  text-align: center;
}
.tm-empty-icon {
  font-size: 36px;
  margin-bottom: 20px;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: tm-pulse 4s ease-in-out infinite;
}
@keyframes tm-pulse { 0%,100%{opacity:.3;} 50%{opacity:.7;} }
.tm-empty p {
  font-family: var(--font-cormorant),'Cormorant Garamond',serif;
  font-size: 20px;
  font-style: italic;
  color: rgba(245,243,239,.35);
}

/* ── CTA ── */
.tm-cta {
  position: relative;
  z-index: 1;
  border-top: 1px solid rgba(201,168,76,.12);
  padding: 80px 8%;
  text-align: center;
  background: rgba(201,168,76,.02);
}
.tm-cta-inner { max-width: 620px; margin: 0 auto; }
.tm-cta-eyebrow {
  font-family: var(--font-space-mono),'Space Mono',monospace;
  font-size: 9px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
}
.tm-cta-h {
  font-family: var(--font-playfair),'Playfair Display',serif;
  font-size: clamp(24px,3vw,38px);
  font-style: italic;
  color: var(--white);
  margin-bottom: 16px;
  line-height: 1.2;
}
.tm-cta-sub {
  font-family: var(--font-cormorant),'Cormorant Garamond',serif;
  font-size: 18px;
  font-style: italic;
  color: rgba(245,243,239,.5);
  margin-bottom: 36px;
  line-height: 1.6;
}
.tm-cta-btn {
  display: inline-block;
  font-family: var(--font-space-mono),'Space Mono',monospace;
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  padding: 14px 32px;
  border: 1px solid rgba(201,168,76,.6);
  color: rgba(201,168,76,.9);
  text-decoration: none;
  transition: all .2s ease;
  background: transparent;
}
.tm-cta-btn:hover {
  background: rgba(201,168,76,.08);
  border-color: rgba(201,168,76,.9);
  color: #fff;
}

@media(max-width:900px) {
  .tm-grid { grid-template-columns: 1fr 1fr; }
  .tm-card--featured { grid-column: 1/-1; }
  .tm-stats { flex-wrap: wrap; }
  .tm-stat { flex: 1 1 50%; }
}
@media(max-width:600px) {
  .tm-hero { padding: 130px 6% 60px; }
  .tm-grid-wrap { padding: 60px 6%; }
  .tm-cta { padding: 60px 6%; }
  .tm-grid { grid-template-columns: 1fr; }
  .tm-card--featured { grid-column: 1; }
  .tm-stat { flex: 1 1 100%; border-right: none; border-bottom: 1px solid rgba(201,168,76,.12); }
  .tm-stat:last-child { border-bottom: none; }
}
`;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="tm-stars" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`tm-star${i < rating ? " on" : ""}`}>★</span>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
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
      <Navbar />
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
              <div className="tm-empty-icon">◆</div>
              <p>Loading testimonials&hellip;</p>
            </div>
          ) : items.length === 0 ? (
            <div className="tm-empty">
              <div className="tm-empty-icon">◆</div>
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
                  <StarRating rating={t.rating} />
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
