"use client";

import { useEffect } from "react";
import Link from "next/link";

type DbPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string | null;
  read_time_minutes: number;
  featured_image_url: string | null;
  created_at: string;
};

type RelatedPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  read_time_minutes: number;
  created_at: string;
};

export function ArticleClient({
  post,
  related,
}: {
  post: DbPost;
  related: RelatedPost[];
}) {
  useEffect(() => {
    document.body.classList.add("on-fdp");
    return () => document.body.classList.remove("on-fdp");
  }, []);

  return (
    <div className="fdp" style={{ minHeight: "100vh" }}>
      <style>{articleCss}</style>

      {/* NAV */}
      <nav className="fdp-article-nav">
        <Link href="/blog" className="nav-back">← Journal</Link>
        <div className="nav-logo">Samuel Kobina Gyasi</div>
        <span />
      </nav>

      {/* ARTICLE */}
      <article className="fa-article">
        <header className="fa-header">
          <div className="fa-tag">{post.category}</div>
          <h1 className="fa-title">{post.title}</h1>
          <div className="fa-meta">
            <span>
              {new Date(post.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span>·</span>
            <span>{post.read_time_minutes} min read</span>
            <span>·</span>
            <span>Samuel Kobina Gyasi</span>
          </div>
          {post.excerpt && <p className="fa-lead">{post.excerpt}</p>}
        </header>

        {post.content && (
          <div
            className="fa-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}

        {related.length > 0 && (
          <aside className="fa-related">
            <div className="fa-related-label">More in this Category</div>
            <div className="fa-related-grid">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="fa-related-card"
                >
                  <div className="fa-rc-tag">{p.category}</div>
                  <div className="fa-rc-title">{p.title}</div>
                  <div className="fa-rc-meta">{p.read_time_minutes} min read</div>
                </Link>
              ))}
            </div>
          </aside>
        )}

        <footer className="fa-footer">
          <Link href="/blog" className="fa-back-link">← All Reflections</Link>
          <Link href="/my-story" className="fa-credo-link">My Story →</Link>
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
.fdp-article-nav { position:fixed; top:0; left:0; right:0; z-index:200; padding:22px 56px; display:flex; justify-content:space-between; align-items:center; background:rgba(6,6,5,.96); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); border-bottom:1px solid rgba(255,222,89,.08); }
.nav-back { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.22em; text-transform:uppercase; color:var(--dim); text-decoration:none; transition:color .3s; }
.nav-back:hover { color:#ffde59; }
.nav-logo { font-family:var(--font-playfair),'Playfair Display',serif; font-size:17px; color:var(--white); letter-spacing:.06em; }
.fa-article { max-width:760px; margin:0 auto; padding:140px 40px 80px; }
.fa-header { margin-bottom:64px; }
.fa-tag { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.3em; text-transform:uppercase; background:linear-gradient(90deg,#ffde59,#ff914d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:24px; }
.fa-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(32px,5vw,62px); color:var(--white); line-height:1.08; margin-bottom:24px; }
.fa-meta { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:var(--dim); display:flex; gap:12px; align-items:center; margin-bottom:40px; flex-wrap:wrap; }
.fa-lead { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(18px,2.2vw,24px); font-style:italic; color:var(--cream); line-height:1.55; padding:28px 36px; border-left:3px solid transparent; border-image:linear-gradient(180deg,#ffde59,#ff914d) 1; background:rgba(255,222,89,.04); }
.fa-body { font-family:var(--font-cormorant),'Cormorant Garamond',serif; font-size:clamp(17px,1.8vw,21px); line-height:1.9; color:var(--dim); font-weight:300; }
.fa-body h2 { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(22px,3vw,32px); color:var(--white); margin:52px 0 20px; font-weight:700; }
.fa-body h3 { font-family:var(--font-playfair),'Playfair Display',serif; font-size:22px; color:var(--white); margin:40px 0 16px; }
.fa-body p { margin-bottom:28px; }
.fa-body em { color:var(--cream); }
.fa-body strong { color:var(--white); }
.fa-body blockquote { border-left:3px solid transparent; border-image:linear-gradient(180deg,#ffde59,#ff914d) 1; padding:20px 32px; background:rgba(255,222,89,.04); font-style:italic; font-size:19px; color:var(--cream); margin:40px 0; }
.fa-related { margin-top:80px; padding-top:56px; border-top:1px solid var(--line); }
.fa-related-label { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.3em; text-transform:uppercase; background:linear-gradient(90deg,#ffde59,#ff914d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:32px; display:flex; align-items:center; gap:16px; }
.fa-related-label::before { content:''; width:36px; height:1px; background:linear-gradient(90deg,#ffde59,#ff914d); }
.fa-related-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:2px; }
.fa-related-card { background:var(--card); border:1px solid var(--line); padding:32px 28px; text-decoration:none; color:var(--white); display:flex; flex-direction:column; gap:10px; transition:border-color .3s,padding-left .3s; }
.fa-related-card:hover { border-color:rgba(201,168,76,.25); padding-left:36px; }
.fa-rc-tag { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.25em; text-transform:uppercase; color:var(--gold); }
.fa-rc-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:18px; color:var(--white); line-height:1.25; flex:1; }
.fa-rc-meta { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:var(--dimmer); }
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
