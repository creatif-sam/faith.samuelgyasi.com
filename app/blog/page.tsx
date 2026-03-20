"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n";

type DbPost = {
  id: string;
  title: string;
  title_fr: string | null;
  slug: string;
  category: string;
  excerpt: string | null;
  excerpt_fr: string | null;
  read_time_minutes: number;
  featured_image_url: string | null;
  created_at: string;
};

const CATEGORIES = [
  { value: "faith", label: { en: "Faith", fr: "Foi" } },
  { value: "problems-and-solutions", label: { en: "Problems & Solutions", fr: "Problèmes & Solutions" } },
  { value: "wisdom", label: { en: "Wisdom", fr: "Sagesse" } },
  { value: "leadership", label: { en: "Leadership", fr: "Leadership" } },
];

export default function FaithBlogPage() {
  const { lang } = useLang();
  const [posts, setPosts] = useState<DbPost[]>([]);
  const [activeCat, setActiveCat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add("on-fdp");
    return () => document.body.classList.remove("on-fdp");
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("blog_posts")
      .select("id,title,title_fr,slug,category,excerpt,excerpt_fr,read_time_minutes,featured_image_url,created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered =
    activeCat === "all" ? posts : posts.filter((p) => p.category === activeCat);
  
  // Apply search filter
  const searchFiltered = searchQuery.trim()
    ? filtered.filter((p) => {
        const searchLower = searchQuery.toLowerCase();
        const title = getTitle(p).toLowerCase();
        const excerpt = getExcerpt(p)?.toLowerCase() || "";
        const category = p.category.toLowerCase();
        return title.includes(searchLower) || excerpt.includes(searchLower) || category.includes(searchLower);
      })
    : filtered;

  const featured = searchFiltered[0];
  const rest = searchFiltered.slice(1);

  // Helper to get translated content
  const getTitle = (post: DbPost) => lang === "fr" && post.title_fr ? post.title_fr : post.title;
  const getExcerpt = (post: DbPost) => lang === "fr" && post.excerpt_fr ? post.excerpt_fr : post.excerpt;

  return (
    <div className="fdp" style={{ minHeight: "100vh" }}>
      <style>{blogCss}</style>

      {/* NAV */}
      <nav className="fdp-blog-nav">
        <Link href="/faith" className="nav-back">{"<-"} Faith</Link>
        <div className="nav-logo">Samuel Kobina Gyasi</div>
        <span />
      </nav>

      {/* HEADER */}
      <header className="fb-header">
        <div className="fb-eyebrow">{lang === "fr" ? "Journal de Foi" : "Faith Journal"}</div>
        <h1 className="fb-title">
          <span>{lang === "fr" ? "Mots Qui" : "Words That"}</span>
          <br />
          <em>{lang === "fr" ? "Ancrent" : "Anchor"}</em>
        </h1>
        <p className="fb-subtitle">
          {lang === "fr" 
            ? "Réflexions sur les Écritures, la conviction sacrée et la pratique quotidienne de faire confiance à Dieu à chaque pas."
            : "Reflections on scripture, sacred conviction, and the daily practice of trusting God with every step."}
        </p>
      </header>

      {/* SEARCH BAR */}
      <div className="fb-search-container">
        <div className="fb-search-wrapper">
          <svg className="fb-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="fb-search-input"
            placeholder={lang === "fr" ? "Rechercher des réflexions..." : "Search reflections..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="fb-search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="fb-search-results">
            {searchFiltered.length} {lang === "fr" ? "résultat(s) trouvé(s)" : "result(s) found"}
          </p>
        )}
      </div>

      {/* CATEGORY FILTERS */}
      <div className="fb-filters">
        <button
          className={`fb-filter${activeCat === "all" ? " fb-filter--active" : ""}`}
          onClick={() => setActiveCat("all")}
        >
          {lang === "fr" ? "Tout" : "All"}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            className={`fb-filter${activeCat === cat.value ? " fb-filter--active" : ""}`}
            onClick={() => setActiveCat(cat.value)}
          >
            {cat.label[lang]}
          </button>
        ))}
      </div>

      {/* POSTS */}
      {loading ? (
        <p className="fb-empty">{lang === "fr" ? "Chargement des réflexions..." : "Loading reflections..."}</p>
      ) : searchFiltered.length === 0 ? (
        <p className="fb-empty">
          {searchQuery 
            ? (lang === "fr" ? "Aucun résultat pour votre recherche." : "No results found for your search.")
            : (lang === "fr" ? "Aucune réflexion dans cette catégorie pour le moment." : "No reflections in this category yet.")}
        </p>
      ) : (
        <div className="fb-content">
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="fb-featured">
              {featured.featured_image_url && (
                <div className="fb-featured-cover">
                  <img src={featured.featured_image_url} alt={getTitle(featured)} className="fb-featured-cover-img" />
                </div>
              )}
              <div className="fb-featured-tag">{featured.category}</div>
              <h2 className="fb-featured-title">{getTitle(featured)}</h2>
              {getExcerpt(featured) && (
                <p className="fb-featured-excerpt">{getExcerpt(featured)}</p>
              )}
              <div className="fb-meta">
                <span>
                  {new Date(featured.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span>.</span>
                <span>{featured.read_time_minutes} min {lang === "fr" ? "de lecture" : "read"}</span>
              </div>
            </Link>
          )}

          {rest.length > 0 && (
            <div className="fb-grid">
              {rest.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="fb-card">
                  {post.featured_image_url && (
                    <div className="fb-card-cover">
                      <img src={post.featured_image_url} alt={getTitle(post)} className="fb-card-cover-img" />
                    </div>
                  )}
                  <div className="fb-card-tag">{post.category}</div>
                  <h3 className="fb-card-title">{getTitle(post)}</h3>
                  {getExcerpt(post) && (
                    <p className="fb-card-excerpt">{getExcerpt(post)}</p>
                  )}
                  <div className="fb-meta">
                    <span>
                      {new Date(post.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span>.</span>
                    <span>{post.read_time_minutes} min</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="fb-pg-footer">
        <Link href="/my-story" className="fb-footer-link">My Story {"->"}</Link>
        <p className="fb-footer-copy">
          {`\u00a9 ${new Date().getFullYear()} Samuel Kobina Gyasi`}
        </p>
      </footer>
    </div>
  );
}

const blogCss = `
.fdp {
  --bg:#080807; --bg2:#0e0d0b; --white:#f0ece4; --cream:#e8e0d0;
  --gold:#c9a84c; --dim:#7a7060; --dimmer:#3e3830;
  --line:rgba(240,236,228,.06); --card:#111009; min-height:100vh;
  animation: fadeIn 0.6s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
body.on-fdp { background:#080807; color:#f0ece4; font-family:'Cormorant Garamond',serif; }
.fdp-blog-nav { position:fixed; top:0; left:0; right:0; z-index:200; padding:22px 56px; display:flex; justify-content:space-between; align-items:center; background:rgba(6,6,5,.98); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,222,89,.1); box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
.nav-back { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.22em; text-transform:uppercase; color:var(--dim); text-decoration:none; transition:all .3s ease; transform:translateX(0); }
.nav-back:hover { color:#ffde59; transform:translateX(-4px); }
.nav-logo { font-family:var(--font-playfair),'Playfair Display',serif; font-size:17px; color:var(--white); letter-spacing:.06em; }
.fb-header { padding:160px 56px 72px; border-bottom:1px solid var(--line); animation: slideUp 0.8s ease-out; }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.fb-eyebrow { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.4em; text-transform:uppercase; background:linear-gradient(90deg,#ffde59,#ff914d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:24px; display:flex; align-items:center; gap:16px; animation: fadeIn 0.8s ease-out 0.2s both; }
.fb-eyebrow::before { content:''; width:36px; height:1px; background:linear-gradient(90deg,#ffde59,#ff914d); animation: growWidth 0.8s ease-out 0.4s both; }
@keyframes growWidth {
  from { width: 0; }
  to { width: 36px; }
}
.fb-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(52px,8vw,110px); line-height:.9; color:var(--white); margin:0 0 28px; animation: slideUp 0.8s ease-out 0.3s both; }
.fb-title em { font-style:italic; display:block; font-size:.8em; background:linear-gradient(90deg,#ffde59,#ff914d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation: shimmer 3s ease-in-out infinite; }
@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
.fb-subtitle { font-family:var(--font-cormorant),'Cormorant Garamond',serif; font-size:clamp(16px,1.8vw,20px); font-style:italic; color:var(--dim); max-width:560px; line-height:1.65; font-weight:300; animation: fadeIn 0.8s ease-out 0.5s both; }
.fb-search-container { padding: 32px 56px 20px; background:var(--bg); border-bottom:1px solid var(--line); animation: slideUp 0.6s ease-out 0.6s both; }
.fb-search-wrapper { position: relative; max-width: 600px; margin: 0 auto; }
.fb-search-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: var(--dim); pointer-events: none; }
.fb-search-input { width: 100%; padding: 14px 48px 14px 48px; background: rgba(245,243,239,.04); border: 1px solid var(--line); border-radius: 8px; color: var(--white); font-family: var(--font-poppins),'Poppins',sans-serif; font-size: 15px; outline: none; transition: all 0.3s ease; }
.fb-search-input::placeholder { color: var(--dimmer); }
.fb-search-input:focus { background: rgba(245,243,239,.06); border-color: rgba(201,168,76,.4); box-shadow: 0 0 0 3px rgba(201,168,76,.1); }
.fb-search-clear { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: var(--dim); font-size: 24px; cursor: pointer; padding: 4px 8px; line-height: 1; transition: color 0.2s ease; }
.fb-search-clear:hover { color: var(--gold); }
.fb-search-results { text-align: center; margin-top: 12px; font-family: var(--font-space-mono),'Space Mono',monospace; font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); }
.fb-filters { padding:24px 56px; display:flex; gap:10px; flex-wrap:wrap; background:var(--bg2); border-bottom:1px solid var(--line); position:sticky; top:65px; z-index:100; transition: all 0.3s ease; }
.fb-filter { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.2em; text-transform:uppercase; padding:10px 20px; background:transparent; border:1px solid var(--line); color:var(--dim); cursor:pointer; transition:all .3s ease; border-radius: 4px; position: relative; overflow: hidden; }
.fb-filter::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg,#ffde59,#ff914d); opacity: 0; transition: opacity 0.3s ease; z-index: -1; }
.fb-filter:hover { border-color:rgba(255,222,89,.5); color:var(--gold); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255,222,89,0.2); }
.fb-filter--active { background:linear-gradient(90deg,#ffde59,#ff914d); color:#080807; border-color:transparent; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,222,89,0.3); }
.fb-filter--active::before { opacity: 1; }
.fb-content { padding:0 56px 80px; }
.fb-empty { font-family:var(--font-cormorant),'Cormorant Garamond',serif; font-size:20px; font-style:italic; color:var(--dim); padding:80px 56px; text-align:center; }
.fb-featured { display:block; padding:72px 0 56px; border-bottom:1px solid var(--line); text-decoration:none; color:inherit; transition:all .4s ease; animation: fadeInScale 0.8s ease-out 0.6s both; }
@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.fb-featured:hover { opacity:.95; transform: translateY(-4px); }
.fb-featured-tag { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.3em; text-transform:uppercase; background:linear-gradient(90deg,#ffde59,#ff914d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:20px; display: inline-block; padding: 4px 0; }
.fb-featured-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(28px,4vw,52px); color:var(--white); line-height:1.1; margin-bottom:20px; max-width:820px; transition: color 0.3s ease; }
.fb-featured:hover .fb-featured-title { color: #ffde59; }
.fb-featured-excerpt { font-family:var(--font-cormorant),'Cormorant Garamond',serif; font-size:clamp(16px,1.6vw,19px); font-style:italic; color:var(--dim); line-height:1.7; max-width:680px; font-weight:300; margin-bottom:24px; }
.fb-meta { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:var(--dimmer); display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
.fb-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:24px; padding-top:48px; }
.fb-card { background:var(--card); border:1px solid var(--line); padding:40px 36px; text-decoration:none; color:var(--white); display:flex; flex-direction:column; gap:12px; transition:all .4s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 8px; position: relative; overflow: hidden; }
.fb-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg,#ffde59,#ff914d); transform: scaleX(0); transition: transform 0.4s ease; transform-origin: left; }
.fb-card:hover { border-color:rgba(201,168,76,.5); transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
.fb-card:hover::before { transform: scaleX(1); }
.fb-card-tag { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.3em; text-transform:uppercase; color:var(--gold); transition: color 0.3s ease; }
.fb-card:hover .fb-card-tag { color: #ffde59; }
.fb-card-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(18px,1.8vw,22px); color:var(--white); line-height:1.2; flex:1; transition: color 0.3s ease; }
.fb-card:hover .fb-card-title { color: #e8e0d0; }
.fb-card-excerpt { font-family:var(--font-cormorant),'Cormorant Garamond',serif; font-size:15px; font-style:italic; color:var(--dim); line-height:1.65; font-weight:300; }
.fb-pg-footer { padding:48px 56px; border-top:1px solid var(--line); display:flex; justify-content:space-between; align-items:center; background:var(--bg2); }
.fb-footer-link { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); text-decoration:none; transition:all .3s ease; }
.fb-footer-link:hover { opacity:.8; transform: translateX(4px); }
.fb-footer-copy { font-family:'Space Mono',monospace; font-size:9px; color:var(--dimmer); letter-spacing:.1em; }
.fb-featured-cover { margin-bottom:32px; overflow:hidden; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.fb-featured-cover-img { width:100%; max-height:420px; object-fit:cover; display:block; transition:transform .6s ease; }
.fb-featured:hover .fb-featured-cover-img { transform:scale(1.05); }
.fb-card-cover { overflow:hidden; margin:-40px -36px 20px; border-radius: 8px 8px 0 0; }
.fb-card-cover-img { width:100%; height:200px; object-fit:cover; display:block; transition:transform .6s ease; }
.fb-card:hover .fb-card-cover-img { transform:scale(1.08); }
@media(max-width:900px){
  .fdp-blog-nav { padding:18px 24px; }
  .fb-header { padding:130px 24px 48px; }
  .fb-filters { padding:20px 24px; top:61px; gap: 8px; }
  .fb-content { padding:0 24px 60px; }
  .fb-grid { grid-template-columns:1fr; gap: 20px; }
  .fb-pg-footer { padding:36px 24px; flex-direction:column; gap:16px; text-align:center; }
  .fb-card { padding: 32px 24px; }
  .fb-card-cover { margin: -32px -24px 16px; }
}
`;
