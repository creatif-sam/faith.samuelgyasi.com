"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { createAnonClient } from "@/lib/supabase/anon";

interface Ebook {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  download_url: string | null;
  category: string;
  published: boolean;
  created_at: string;
}

const SAMPLE_EBOOKS: Ebook[] = [
  {
    id: "e1",
    title: "Faith Over Fear: A Practical Guide to Trusting God in Every Season",
    description: "An intimate reflection on what it means to walk by faith when circumstances push us toward anxiety. Drawing from Scripture, prayer, and lived experience, this essay offers a roadmap for cultivating radical trust in God.",
    cover_url: null,
    download_url: null,
    category: "Faith & Spirituality",
    published: true,
    created_at: "2026-01-15",
  },
  {
    id: "e2",
    title: "The Collective Intelligence of the Body of Christ",
    description: "Applying collective intelligence principles to the Church — how congregations discern together, make decisions in community, and unlock the wisdom distributed across all members. A bridge between social science and theological practice.",
    cover_url: null,
    download_url: null,
    category: "Leadership & Community",
    published: true,
    created_at: "2025-09-20",
  },
  {
    id: "e3",
    title: "Servant Leadership: The Biblical Blueprint",
    description: "What does it mean to lead like Jesus? This short book unpacks the servant-leadership model through the life of Christ, the letters of Paul, and the hard-won lessons of leading communities from Ghana to Morocco.",
    cover_url: null,
    download_url: null,
    category: "Leadership",
    published: true,
    created_at: "2025-06-01",
  },
];

const css = `
.ebooks-pg {
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  position: relative;
}
.ebooks-pg::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: radial-gradient(ellipse at 20% 60%, rgba(201,168,76,.04) 0%, transparent 55%);
  pointer-events: none;
  z-index: 0;
}
.ebooks-pg > * { position: relative; z-index: 1; }

/* ── HEADER ── */
.ebooks-header {
  padding: 140px 8% 64px;
  border-bottom: 1px solid rgba(201,168,76,.1);
  max-width: 1100px; margin: 0 auto;
}
.ebooks-back {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .22em; text-transform: uppercase;
  color: rgba(245,243,239,.4); text-decoration: none;
  display: flex; align-items: center; gap: 8px; margin-bottom: 40px;
  transition: color .25s;
}
.ebooks-back:hover { color: var(--gold); }
.ebooks-eyebrow {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 10px; letter-spacing: .35em; text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  margin-bottom: 20px;
  opacity: 0; animation: eb-rise .9s .1s ease forwards;
}
.ebooks-headline {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(44px, 7vw, 96px); font-weight: 900;
  line-height: .9; letter-spacing: -.03em;
  color: var(--white); text-transform: uppercase;
  opacity: 0; animation: eb-rise .9s .25s ease forwards;
}
.ebooks-headline em {
  font-style: italic; font-weight: 400;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  display: block;
}
.ebooks-rule {
  width: 56px; height: 2px;
  background: linear-gradient(90deg,#ffde59,#ff914d);
  margin: 24px 0;
  opacity: 0; animation: eb-rise .9s .4s ease forwards;
}
.ebooks-sub {
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-size: clamp(16px, 1.8vw, 20px); font-style: italic;
  color: rgba(245,243,239,.6); max-width: 520px; line-height: 1.7;
  opacity: 0; animation: eb-rise .9s .5s ease forwards;
}
@keyframes eb-rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}

/* ── GRID ── */
.ebooks-grid {
  max-width: 1100px; margin: 0 auto;
  padding: 72px 8% 100px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}
.ebook-card {
  background: rgba(14,13,11,.9);
  border: 1px solid rgba(201,168,76,.08);
  padding: 40px 36px;
  display: flex; flex-direction: column; gap: 16px;
  opacity: 0; transform: translateY(18px);
  transition: opacity .7s ease, transform .7s ease, border-color .3s;
}
.ebook-card.eb-visible { opacity: 1; transform: none; }
.ebook-card:hover { border-color: rgba(201,168,76,.22); }
.ebook-cat {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .25em; text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.ebook-cover {
  width: 100%; aspect-ratio: 3/4;
  background: rgba(201,168,76,.08);
  border: 1px solid rgba(201,168,76,.12);
  display: flex; align-items: center; justify-content: center;
  font-size: 40px; color: rgba(201,168,76,.3);
}
.ebook-cover img { width: 100%; height: 100%; object-fit: cover; }
.ebook-title {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(17px, 1.8vw, 21px); font-weight: 700;
  color: var(--white); line-height: 1.2;
}
.ebook-desc {
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-size: 15px; font-style: italic;
  color: rgba(245,243,239,.58); line-height: 1.75; flex: 1;
}
.ebook-date {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .15em; text-transform: uppercase;
  color: rgba(245,243,239,.25);
}
.ebook-download-btn {
  display: inline-block;
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .22em; text-transform: uppercase;
  padding: 12px 20px;
  background: linear-gradient(90deg,#ffde59,#ff914d);
  color: #0a0a0a; text-decoration: none;
  transition: opacity .25s; margin-top: 8px; cursor: pointer; border: none;
  width: 100%; text-align: center;
}
.ebook-download-btn:hover { opacity: .8; }
.ebook-soon {
  display: inline-block;
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .22em; text-transform: uppercase;
  padding: 12px 20px;
  background: transparent;
  border: 1px solid rgba(201,168,76,.2);
  color: rgba(201,168,76,.5); margin-top: 8px; width: 100%; text-align: center;
}

/* ── EMPTY ── */
.ebooks-empty {
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-size: 22px; font-style: italic; color: rgba(245,243,239,.35);
  padding: 80px; text-align: center;
}

@media (max-width: 900px) {
  .ebooks-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .ebooks-header { padding: 130px 6% 56px; }
  .ebooks-grid { grid-template-columns: 1fr; padding: 48px 6% 72px; }
}
`;

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default function EbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>(SAMPLE_EBOOKS);

  const load = useCallback(async () => {
    try {
      const sb = createAnonClient();
      const { data } = await sb
        .from("library_items")
        .select("*")
        .eq("category_type", "ebook")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (data && data.length > 0) setEbooks(data);
    } catch {
      // fallback to sample data
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("eb-visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".ebook-card").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ebooks]);

  return (
    <>
      <div className="ebooks-pg">
        <style>{css}</style>

        {/* ── HEADER ── */}
        <div className="ebooks-header">
          <Link href="/library" className="ebooks-back">← Library</Link>
          <p className="ebooks-eyebrow">Samuel Kobina Gyasi · Published Works</p>
          <h1 className="ebooks-headline">
            My<br /><em>eBooks</em>
          </h1>
          <div className="ebooks-rule" />
          <p className="ebooks-sub">
            Writing is how I think out loud. These are the essays, reflections, and short books
            I have written — available to read, download, and share freely.
          </p>
        </div>

        {/* ── GRID ── */}
        <div className="ebooks-grid">
          {ebooks.length === 0 ? (
            <p className="ebooks-empty">No eBooks published yet. Check back soon.</p>
          ) : (
            ebooks.map((book, i) => (
              <div key={book.id} className="ebook-card" style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="ebook-cat">{book.category}</div>
                <div className="ebook-cover">
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} />
                  ) : (
                    <span>◆</span>
                  )}
                </div>
                <h3 className="ebook-title">{book.title}</h3>
                {book.description && <p className="ebook-desc">{book.description}</p>}
                <div className="ebook-date">{fmt(book.created_at)}</div>
                {book.download_url ? (
                  <a href={book.download_url} target="_blank" rel="noopener noreferrer" className="ebook-download-btn">
                    Download Free →
                  </a>
                ) : (
                  <div className="ebook-soon">Coming Soon</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <Suspense fallback={null}><SiteFooter /></Suspense>
    </>
  );
}
