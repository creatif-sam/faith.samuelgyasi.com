"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { blogPosts, categories, getCategoryLabel } from "./blog-data";
import type { Category } from "./blog-data";
import type { Lang } from "../translations";

export default function FaithBlogPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [activeCat, setActiveCat] = useState<Category | "all">("all");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("fdp-lang") as Lang | null;
      if (stored === "en" || stored === "fr") setLang(stored);
    } catch {}
    document.body.classList.add("on-fdp");
    return () => document.body.classList.remove("on-fdp");
  }, []);

  function toggleLang() {
    setLang((l) => {
      const next: Lang = l === "en" ? "fr" : "en";
      try { localStorage.setItem("fdp-lang", next); } catch {}
      return next;
    });
  }

  const filtered = activeCat === "all"
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCat);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="fdp" style={{ minHeight: "100vh" }}>
      <style>{blogCss}</style>

      {/* NAV */}
      <nav className="fdp-blog-nav">
        <Link href="/faith" className="nav-back">{lang === "en" ? "← Faith" : "← Foi"}</Link>
        <div className="nav-logo">Samuel Kobina Gyasi</div>
        <button className="fdp-lang-toggle" onClick={toggleLang} aria-label="Toggle language">
          <span className={lang === "en" ? "active" : ""}>EN</span>
          <span className="sep">/</span>
          <span className={lang === "fr" ? "active" : ""}>FR</span>
        </button>
      </nav>

      {/* HEADER */}
      <header className="fb-header">
        <div className="fb-eyebrow">{lang === "en" ? "Faith Journal" : "Journal de Foi"}</div>
        <h1 className="fb-title">
          {lang === "en"
            ? <><span>Words That</span><br /><em>Anchor</em></>
            : <><span>Des Mots Qui</span><br /><em>Ancrent</em></>}
        </h1>
        <p className="fb-subtitle">
          {lang === "en"
            ? "Reflections on scripture, sacred conviction, and the daily practice of trusting God with every step."
            : "Réflexions sur l'Écriture, la conviction sacrée, et la pratique quotidienne de faire confiance à Dieu à chaque pas."}
        </p>
      </header>

      {/* CATEGORY FILTERS */}
      <div className="fb-filters">
        <button
          className={`fb-filter${activeCat === "all" ? " fb-filter--active" : ""}`}
          onClick={() => setActiveCat("all")}
        >
          {lang === "en" ? "All" : "Tout"}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`fb-filter${activeCat === cat.value ? " fb-filter--active" : ""}`}
            onClick={() => setActiveCat(cat.value as Category)}
          >
            {cat[lang]}
          </button>
        ))}
      </div>

      {/* POSTS */}
      {filtered.length === 0 ? (
        <p className="fb-empty">
          {lang === "en" ? "No reflections in this category yet." : "Pas encore de réflexions dans cette catégorie."}
        </p>
      ) : (
        <div className="fb-content">
          {/* FEATURED POST */}
          {featured && (
            <Link href={`/faith/blog/${featured.slug}`} className="fb-featured">
              <div className="fb-featured-tag">{getCategoryLabel(featured.category, lang)}</div>
              <h2 className="fb-featured-title">{featured[lang].title}</h2>
              <p className="fb-featured-excerpt">{featured[lang].excerpt}</p>
              <div className="fb-meta">
                <span>{new Date(featured.date).toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span>·</span>
                <span>{featured.readTime} {lang === "en" ? "min read" : "min de lecture"}</span>
              </div>
            </Link>
          )}

          {/* GRID */}
          {rest.length > 0 && (
            <div className="fb-grid">
              {rest.map((post) => (
                <Link key={post.slug} href={`/faith/blog/${post.slug}`} className="fb-card">
                  <div className="fb-card-tag">{getCategoryLabel(post.category, lang)}</div>
                  <h3 className="fb-card-title">{post[lang].title}</h3>
                  <p className="fb-card-excerpt">{post[lang].excerpt}</p>
                  <div className="fb-meta">
                    <span>{new Date(post.date).toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                    <span>{post.readTime} {lang === "en" ? "min" : "min"}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="fb-pg-footer">
        <Link href="/my-story" className="fb-footer-link">
          {lang === "en" ? "My Story →" : "Mon Histoire →"}
        </Link>
        <p className="fb-footer-copy">© {new Date().getFullYear()} Samuel Kobina Gyasi</p>
      </footer>
    </div>
  );
}

const blogCss = `
.fdp {
  --bg:#080807; --bg2:#0e0d0b; --white:#f0ece4; --cream:#e8e0d0;
  --gold:#c9a84c; --dim:#7a7060; --dimmer:#3e3830;
  --line:rgba(240,236,228,.06); --card:#111009; min-height:100vh;
}
body.on-fdp { background:#080807; color:#f0ece4; font-family:'Cormorant Garamond',serif; }
.fdp-blog-nav {
  position:fixed; top:0; left:0; right:0; z-index:200;
  padding:22px 56px; display:flex; justify-content:space-between; align-items:center;
  background:rgba(6,6,5,.96); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
  border-bottom:1px solid rgba(255,222,89,.08);
}
.nav-back { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.22em; text-transform:uppercase; color:var(--dim); text-decoration:none; transition:color .3s; }
.nav-back:hover { color:#ffde59; }
.nav-logo { font-family:var(--font-playfair),'Playfair Display',serif; font-size:17px; color:var(--white); letter-spacing:.06em; }
.fdp-lang-toggle { background:transparent; border:1px solid rgba(255,222,89,.3); border-radius:4px; padding:4px 10px; font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.16em; color:var(--dim); cursor:pointer; display:flex; align-items:center; gap:6px; transition:border-color .25s,color .25s; }
.fdp-lang-toggle:hover { border-color:#ffde59; color:#ffde59; }
.fdp-lang-toggle .active { background:linear-gradient(90deg,#ffde59,#ff914d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; font-weight:700; }
.fdp-lang-toggle .sep { opacity:.35; }
.fb-header { padding:160px 56px 64px; border-bottom:1px solid var(--line); }
.fb-eyebrow { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.4em; text-transform:uppercase; background:linear-gradient(90deg,#ffde59,#ff914d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:24px; display:flex; align-items:center; gap:16px; }
.fb-eyebrow::before { content:''; width:36px; height:1px; background:linear-gradient(90deg,#ffde59,#ff914d); }
.fb-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(52px,8vw,110px); line-height:.9; color:var(--white); margin:0 0 28px; }
.fb-title em { font-style:italic; display:block; font-size:.8em; background:linear-gradient(90deg,#ffde59,#ff914d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.fb-subtitle { font-family:var(--font-cormorant),'Cormorant Garamond',serif; font-size:clamp(16px,1.8vw,20px); font-style:italic; color:var(--dim); max-width:560px; line-height:1.65; font-weight:300; }
.fb-filters { padding:24px 56px; display:flex; gap:8px; flex-wrap:wrap; background:var(--bg2); border-bottom:1px solid var(--line); position:sticky; top:65px; z-index:100; }
.fb-filter { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.2em; text-transform:uppercase; padding:8px 18px; background:transparent; border:1px solid var(--line); color:var(--dim); cursor:pointer; transition:all .25s; }
.fb-filter:hover { border-color:rgba(255,222,89,.3); color:var(--gold); }
.fb-filter--active { background:linear-gradient(90deg,#ffde59,#ff914d); color:#080807; border-color:transparent; }
.fb-content { padding:0 56px 80px; }
.fb-empty { font-family:var(--font-cormorant),'Cormorant Garamond',serif; font-size:20px; font-style:italic; color:var(--dim); padding:80px 56px; text-align:center; }
.fb-featured { display:block; padding:72px 0 56px; border-bottom:1px solid var(--line); text-decoration:none; color:inherit; transition:opacity .3s; }
.fb-featured:hover { opacity:.85; }
.fb-featured-tag { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.3em; text-transform:uppercase; background:linear-gradient(90deg,#ffde59,#ff914d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:20px; }
.fb-featured-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(28px,4vw,52px); color:var(--white); line-height:1.1; margin-bottom:20px; max-width:820px; }
.fb-featured-excerpt { font-family:var(--font-cormorant),'Cormorant Garamond',serif; font-size:clamp(16px,1.6vw,19px); font-style:italic; color:var(--dim); line-height:1.7; max-width:680px; font-weight:300; margin-bottom:24px; }
.fb-meta { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:var(--dimmer); display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
.fb-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:2px; padding-top:2px; }
.fb-card { background:var(--card); border:1px solid var(--line); padding:40px 36px; text-decoration:none; color:var(--white); display:flex; flex-direction:column; gap:12px; transition:border-color .3s,padding-left .3s; }
.fb-card:hover { border-color:rgba(201,168,76,.25); padding-left:46px; }
.fb-card-tag { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.3em; text-transform:uppercase; color:var(--gold); }
.fb-card-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(18px,1.8vw,22px); color:var(--white); line-height:1.2; flex:1; }
.fb-card-excerpt { font-family:var(--font-cormorant),'Cormorant Garamond',serif; font-size:15px; font-style:italic; color:var(--dim); line-height:1.65; font-weight:300; }
.fb-pg-footer { padding:48px 56px; border-top:1px solid var(--line); display:flex; justify-content:space-between; align-items:center; background:var(--bg2); }
.fb-footer-link { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); text-decoration:none; transition:opacity .3s; }
.fb-footer-link:hover { opacity:.7; }
.fb-footer-copy { font-family:'Space Mono',monospace; font-size:9px; color:var(--dimmer); letter-spacing:.1em; }
@media(max-width:900px){
  .fdp-blog-nav { padding:18px 24px; }
  .fb-header { padding:130px 24px 48px; }
  .fb-filters { padding:20px 24px; top:61px; }
  .fb-content { padding:0 24px 60px; }
  .fb-grid { grid-template-columns:1fr; }
  .fb-pg-footer { padding:36px 24px; flex-direction:column; gap:16px; text-align:center; }
}
`;
