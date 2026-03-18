"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { BilingualPost } from "../blog-data";
import { blogPosts, getCategoryLabel } from "../blog-data";
import { useLang } from "@/lib/i18n";

export function ArticleClient({ post }: { post: BilingualPost }) {
  const { lang, toggleLang } = useLang();

  useEffect(() => {
    document.body.classList.add("on-fdp");
    return () => document.body.classList.remove("on-fdp");
  }, []);

  const content = post[lang];
  const related = blogPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="fdp" style={{ minHeight: "100vh" }}>
      <style>{articleCss}</style>

      {/* NAV */}
      <nav className="fdp-article-nav">
        <Link href="/blog" className="nav-back">
          {lang === "en" ? "← Journal" : "← Journal"}
        </Link>
        <div className="nav-logo">Samuel Kobina Gyasi</div>
        <button className="fdp-lang-toggle" onClick={toggleLang} aria-label={lang === "en" ? "Passer en français" : "Switch to English"}>
          <span className={lang === "en" ? "active" : ""}>EN</span>
          <span className="sep">|</span>
          <span className={lang === "fr" ? "active" : ""}>FR</span>
        </button>
      </nav>

      {/* ARTICLE */}
      <article className="fa-article">
        <header className="fa-header">
          <div className="fa-tag">{getCategoryLabel(post.category, lang)}</div>
          <h1 className="fa-title">{content.title}</h1>
          <div className="fa-meta">
            <span>
              {new Date(post.date).toLocaleDateString(
                lang === "en" ? "en-GB" : "fr-FR",
                { day: "numeric", month: "long", year: "numeric" }
              )}
            </span>
            <span>·</span>
            <span>{post.readTime} {lang === "en" ? "min read" : "min de lecture"}</span>
            <span>·</span>
            <span>Samuel Kobina Gyasi</span>
          </div>
          <p className="fa-lead">{content.excerpt}</p>
        </header>

        <div className="fa-body" dangerouslySetInnerHTML={{ __html: content.content }} />

        {related.length > 0 && (
          <aside className="fa-related">
            <div className="fa-related-label">
              {lang === "en" ? "More in this Category" : "Plus dans cette Catégorie"}
            </div>
            <div className="fa-related-grid">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="fa-related-card">
                  <div className="fa-rc-tag">{getCategoryLabel(p.category, lang)}</div>
                  <div className="fa-rc-title">{p[lang].title}</div>
                  <div className="fa-rc-meta">
                    {p.readTime} {lang === "en" ? "min read" : "min"}
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        )}

        <footer className="fa-footer">
          <Link href="/blog" className="fa-back-link">
            ← {lang === "en" ? "All Reflections" : "Toutes les Réflexions"}
          </Link>
          <Link href="/my-story" className="fa-credo-link">
            {lang === "en" ? "My Story →" : "Mon Histoire →"}
          </Link>
        </footer>
      </article>
    </div>
  );
}

const articleCss = `
.fdp {
  --bg:#080807; --bg2:#0e0d0b; --white:#f0ece4; --cream:#e8e0d0;
  --gold:#c9a84c; --dim:#7a7060; --dimmer:#3e3830;
  --line:rgba(240,236,228,.06); --card:#111009; min-height:100vh;
}
body.on-fdp { background:#080807; color:#f0ece4; font-family:'Cormorant Garamond',serif; }

/* NAV */
.fdp-article-nav {
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

/* ARTICLE */
.fa-article { max-width:760px; margin:0 auto; padding:140px 40px 80px; }
.fa-header { margin-bottom:64px; }
.fa-tag { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.3em; text-transform:uppercase; background:linear-gradient(90deg,#ffde59,#ff914d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:24px; }
.fa-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(32px,5vw,62px); color:var(--white); line-height:1.08; margin-bottom:24px; }
.fa-meta { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:var(--dim); display:flex; gap:12px; align-items:center; margin-bottom:40px; flex-wrap:wrap; }
.fa-lead { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(18px,2.2vw,24px); font-style:italic; color:var(--cream); line-height:1.55; padding:28px 36px; border-left:3px solid transparent; border-image:linear-gradient(180deg,#ffde59,#ff914d) 1; background:rgba(255,222,89,.04); }

/* BODY */
.fa-body { font-family:var(--font-cormorant),'Cormorant Garamond',serif; font-size:clamp(17px,1.8vw,21px); line-height:1.9; color:var(--dim); font-weight:300; }
.fa-body h2 { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(22px,3vw,32px); color:var(--white); margin:52px 0 20px; font-weight:700; }
.fa-body h3 { font-family:var(--font-playfair),'Playfair Display',serif; font-size:22px; color:var(--white); margin:40px 0 16px; }
.fa-body p { margin-bottom:28px; }
.fa-body em { color:var(--cream); }
.fa-body strong { color:var(--white); }
.fa-body blockquote { border-left:3px solid transparent; border-image:linear-gradient(180deg,#ffde59,#ff914d) 1; padding:20px 32px; background:rgba(255,222,89,.04); font-style:italic; font-size:19px; color:var(--cream); margin:40px 0; }

/* RELATED */
.fa-related { margin-top:80px; padding-top:56px; border-top:1px solid var(--line); }
.fa-related-label { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.3em; text-transform:uppercase; background:linear-gradient(90deg,#ffde59,#ff914d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:32px; display:flex; align-items:center; gap:16px; }
.fa-related-label::before { content:''; width:36px; height:1px; background:linear-gradient(90deg,#ffde59,#ff914d); }
.fa-related-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:2px; }
.fa-related-card { background:var(--card); border:1px solid var(--line); padding:32px 28px; text-decoration:none; color:var(--white); display:flex; flex-direction:column; gap:10px; transition:border-color .3s,padding-left .3s; }
.fa-related-card:hover { border-color:rgba(201,168,76,.25); padding-left:36px; }
.fa-rc-tag { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.25em; text-transform:uppercase; color:var(--gold); }
.fa-rc-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:18px; color:var(--white); line-height:1.25; flex:1; }
.fa-rc-meta { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:var(--dimmer); }

/* FOOTER */
.fa-footer { margin-top:64px; padding-top:40px; border-top:1px solid var(--line); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; }
.fa-back-link { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--dim); text-decoration:none; transition:color .3s; }
.fa-back-link:hover { color:var(--gold); }
.fa-credo-link { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--gold); text-decoration:none; transition:opacity .3s; }
.fa-credo-link:hover { opacity:.7; }

@media(max-width:768px) {
  .fdp-article-nav { padding:18px 24px; }
  .fa-article { padding:130px 24px 60px; }
  .fa-related-grid { grid-template-columns:1fr; }
  .fa-footer { flex-direction:column; align-items:flex-start; }
}
`;
