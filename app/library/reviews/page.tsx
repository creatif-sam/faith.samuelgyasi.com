"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { createAnonClient } from "@/lib/supabase/anon";

interface BookReview {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  cover_url: string | null;
  rating: number | null;
  category: string;
  published: boolean;
  created_at: string;
}

const SAMPLE_REVIEWS: BookReview[] = [
  {
    id: "r1",
    title: "Mere Christianity",
    author: "C.S. Lewis",
    description: "Lewis builds the case for Christianity not through sentiment but through rigorous argument. What struck me most was his treatment of morality as a pointer to a transcendent lawgiver. A book that is both philosophically demanding and spiritually clarifying — I return to it every year.",
    cover_url: null,
    rating: 5,
    category: "Theology",
    published: true,
    created_at: "2026-02-10",
  },
  {
    id: "r2",
    title: "Servant Leadership",
    author: "Robert K. Greenleaf",
    description: "The foundational text for anyone serious about leading through service. Greenleaf's central insight — that the greatest leaders are first servants — resonates deeply with the model of Jesus. This book gave me language for what I had already observed in the best leaders I admired.",
    cover_url: null,
    rating: 5,
    category: "Leadership",
    published: true,
    created_at: "2025-11-05",
  },
  {
    id: "r3",
    title: "The Ruthless Elimination of Hurry",
    author: "John Mark Comer",
    description: "An urgent and deeply personal book about the modern affliction of busyness. Comer diagnoses hurry as a spiritual disease and calls readers back to the unhurried life of Jesus. It challenged me to protect margin and presence with the same discipline I apply to productivity.",
    cover_url: null,
    rating: 4,
    category: "Spiritual Formation",
    published: true,
    created_at: "2025-08-22",
  },
  {
    id: "r4",
    title: "The Power of the Other",
    author: "Henry Cloud",
    description: "Cloud makes a compelling case that human beings are not designed for isolation — growth happens in connection. The science of attachment he presents confirms what the Church has always practiced: no one thrives alone. An essential read for leaders who want to build real community.",
    cover_url: null,
    rating: 4,
    category: "Leadership & Psychology",
    published: true,
    created_at: "2025-05-14",
  },
  {
    id: "r5",
    title: "Half the Sky",
    author: "Nicholas D. Kristof & Sheryl WuDunn",
    description: "A gut-wrenching and ultimately hopeful account of the oppression of women globally — and the individuals who are fighting to change it. This book did not just inform me; it convicted me. If you are serious about justice, read this book and be changed by it.",
    cover_url: null,
    rating: 5,
    category: "Justice & Society",
    published: true,
    created_at: "2024-12-01",
  },
];

const CATS = ["All", "Theology", "Leadership", "Spiritual Formation", "Leadership & Psychology", "Justice & Society"];

const css = `
.reviews-pg {
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  position: relative;
}
.reviews-pg::before {
  content: '';
  position: fixed; inset: 0;
  background-image: radial-gradient(ellipse at 80% 40%, rgba(201,168,76,.04) 0%, transparent 55%);
  pointer-events: none; z-index: 0;
}
.reviews-pg > * { position: relative; z-index: 1; }

/* ── HEADER ── */
.reviews-header {
  padding: 140px 8% 64px;
  border-bottom: 1px solid rgba(201,168,76,.1);
  max-width: 1100px; margin: 0 auto;
}
.reviews-back {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .22em; text-transform: uppercase;
  color: rgba(245,243,239,.4); text-decoration: none;
  display: flex; align-items: center; gap: 8px; margin-bottom: 40px;
  transition: color .25s;
}
.reviews-back:hover { color: var(--gold); }
.reviews-eyebrow {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 10px; letter-spacing: .35em; text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  margin-bottom: 20px;
  opacity: 0; animation: rv-rise .9s .1s ease forwards;
}
.reviews-headline {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(44px, 7vw, 96px); font-weight: 900;
  line-height: .9; letter-spacing: -.03em;
  color: var(--white); text-transform: uppercase;
  opacity: 0; animation: rv-rise .9s .25s ease forwards;
}
.reviews-headline em {
  font-style: italic; font-weight: 400;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  display: block;
}
.reviews-rule {
  width: 56px; height: 2px;
  background: linear-gradient(90deg,#ffde59,#ff914d);
  margin: 24px 0;
  opacity: 0; animation: rv-rise .9s .4s ease forwards;
}
.reviews-sub {
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-size: clamp(16px, 1.8vw, 20px); font-style: italic;
  color: rgba(245,243,239,.6); max-width: 520px; line-height: 1.7;
  opacity: 0; animation: rv-rise .9s .5s ease forwards;
}
@keyframes rv-rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}

/* ── FILTERS ── */
.reviews-filters {
  max-width: 1100px; margin: 0 auto;
  padding: 0 8%;
  display: flex; gap: 8px; flex-wrap: wrap;
  padding-top: 48px; padding-bottom: 0;
}
.rv-filter {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
  padding: 8px 18px; background: transparent;
  border: 1px solid rgba(201,168,76,.12);
  color: rgba(245,243,239,.4); cursor: pointer; transition: all .25s;
}
.rv-filter:hover { border-color: rgba(201,168,76,.3); color: var(--gold); }
.rv-filter.active { background: linear-gradient(90deg,#ffde59,#ff914d); color: #0a0a0a; border-color: transparent; }

/* ── REVIEWS LIST ── */
.reviews-list {
  max-width: 1100px; margin: 0 auto;
  padding: 48px 8% 100px;
  display: flex; flex-direction: column; gap: 2px;
}
.rv-card {
  background: rgba(14,13,11,.9);
  border: 1px solid rgba(201,168,76,.08);
  padding: 48px 44px;
  display: grid; grid-template-columns: 120px 1fr; gap: 40px;
  align-items: start;
  opacity: 0; transform: translateX(-16px);
  transition: opacity .7s ease, transform .7s ease, border-color .3s;
}
.rv-card.rv-visible { opacity: 1; transform: none; }
.rv-card:hover { border-color: rgba(201,168,76,.2); }
.rv-cover {
  aspect-ratio: 2/3;
  background: rgba(201,168,76,.08);
  border: 1px solid rgba(201,168,76,.12);
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; color: rgba(201,168,76,.3); flex-shrink: 0;
}
.rv-cover img { width: 100%; height: 100%; object-fit: cover; }
.rv-meta-row {
  display: flex; align-items: center; gap: 16px;
  flex-wrap: wrap; margin-bottom: 12px;
}
.rv-cat {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .25em; text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.rv-stars { display: flex; gap: 2px; }
.rv-star { font-size: 12px; color: rgba(201,168,76,.25); }
.rv-star.on { color: #c9a84c; }
.rv-title {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(20px, 2.2vw, 28px); font-weight: 700;
  color: var(--white); line-height: 1.15; margin-bottom: 6px;
}
.rv-author {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 10px; letter-spacing: .15em; text-transform: uppercase;
  color: rgba(245,243,239,.3); margin-bottom: 20px;
}
.rv-review {
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-size: clamp(16px, 1.6vw, 18px); font-style: italic;
  color: rgba(245,243,239,.68); line-height: 1.85;
}
.rv-date {
  margin-top: 16px;
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .15em; text-transform: uppercase;
  color: rgba(245,243,239,.2);
}

/* ── EMPTY ── */
.reviews-empty {
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-size: 22px; font-style: italic; color: rgba(245,243,239,.35);
  padding: 80px; text-align: center;
}

@media (max-width: 700px) {
  .reviews-header { padding: 130px 6% 56px; }
  .reviews-filters { padding: 36px 6% 0; }
  .reviews-list { padding: 36px 6% 72px; }
  .rv-card { grid-template-columns: 1fr; gap: 24px; padding: 32px 24px; }
  .rv-cover { height: 180px; aspect-ratio: auto; }
}
`;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="rv-stars" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`rv-star${i < rating ? " on" : ""}`}>★</span>
      ))}
    </div>
  );
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default function BookReviewsPage() {
  const [reviews, setReviews] = useState<BookReview[]>(SAMPLE_REVIEWS);
  const [activeCat, setActiveCat] = useState("All");

  const load = useCallback(async () => {
    try {
      const sb = createAnonClient();
      const { data } = await sb
        .from("library_items")
        .select("*")
        .eq("category_type", "review")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (data && data.length > 0) setReviews(data);
    } catch {
      // fallback to sample data
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("rv-visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".rv-card").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reviews, activeCat]);

  const displayed = activeCat === "All"
    ? reviews
    : reviews.filter((r) => r.category === activeCat);

  const allCats = ["All", ...Array.from(new Set(reviews.map((r) => r.category)))];

  return (
    <>
      <div className="reviews-pg">
        <style>{css}</style>

        {/* ── HEADER ── */}
        <div className="reviews-header">
          <Link href="/library" className="reviews-back">← Library</Link>
          <p className="reviews-eyebrow">Samuel Kobina Gyasi · Reading Journal</p>
          <h1 className="reviews-headline">
            Book<br /><em>Reviews</em>
          </h1>
          <div className="reviews-rule" />
          <p className="reviews-sub">
            Honest reflections on the books that have shaped, challenged, and deepened my thinking
            across theology, leadership, justice, and the life of the mind.
          </p>
        </div>

        {/* ── FILTERS ── */}
        <div className="reviews-filters">
          {allCats.map((cat) => (
            <button
              key={cat}
              className={`rv-filter${activeCat === cat ? " active" : ""}`}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── LIST ── */}
        <div className="reviews-list">
          {displayed.length === 0 ? (
            <p className="reviews-empty">No reviews in this category yet.</p>
          ) : (
            displayed.map((review, i) => (
              <div key={review.id} className="rv-card" style={{ transitionDelay: `${i * 0.05}s` }}>
                <div className="rv-cover">
                  {review.cover_url ? (
                    <img src={review.cover_url} alt={review.title} />
                  ) : (
                    <span>◆</span>
                  )}
                </div>
                <div>
                  <div className="rv-meta-row">
                    <span className="rv-cat">{review.category}</span>
                    {review.rating && <StarRating rating={review.rating} />}
                  </div>
                  <h3 className="rv-title">{review.title}</h3>
                  {review.author && <div className="rv-author">by {review.author}</div>}
                  {review.description && <p className="rv-review">{review.description}</p>}
                  <div className="rv-date">{fmt(review.created_at)}</div>
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
