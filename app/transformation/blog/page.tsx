import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Transformation — Blog",
  description:
    "Stories and reflections on personal and societal transformation — breaking cycles, becoming, and building what lasts. By Samuel Kobina Gyasi.",
};

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  created_at: string;
  read_time_minutes: number;
}

const samplePosts: Post[] = [
  {
    id: "t1",
    title: "The Anatomy of Transformation: From Identity to Impact",
    slug: "anatomy-of-transformation",
    excerpt:
      "True transformation is not a change of clothes — it is a change of self. It begins with an honest reckoning with who you are before it can move toward who you are becoming.",
    created_at: "2026-02-25",
    read_time_minutes: 10,
  },
  {
    id: "t2",
    title: "Breaking Cycles: How One Generation Can Change Everything",
    slug: "breaking-cycles",
    excerpt:
      "Every generation inherits the unfinished work of the one before it. The question is not whether you received a broken inheritance — almost everyone did. The question is what you do with it.",
    created_at: "2026-02-08",
    read_time_minutes: 8,
  },
  {
    id: "t3",
    title: "On Becoming: A Reflection on Growth, Purpose, and Responsibility",
    slug: "on-becoming",
    excerpt:
      "Becoming is uncomfortable. Becoming requires that you hold the past and the future in tension, honouring what was while refusing to be defined by it.",
    created_at: "2026-01-22",
    read_time_minutes: 7,
  },
  {
    id: "t4",
    title: "Ghana to the World: A Vision for the Next Generation of African Leaders",
    slug: "ghana-to-the-world",
    excerpt:
      "Africa does not need saving. It needs activating. There is a generation rising — equipped, rooted, and globally connected — ready to show what transformation looks like from the inside out.",
    created_at: "2025-12-30",
    read_time_minutes: 9,
  },
];

export default async function TransformationBlogPage() {
  let posts: Post[] = samplePosts;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, created_at, read_time_minutes")
      .eq("category", "transformation")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (data && data.length > 0) posts = data;
  } catch { /* fallback */ }

  return (
    <div className="tdp" style={{ minHeight: "100vh" }}>
      <style>{blogCss}</style>

      <nav>
        <Link href="/transformation" className="nav-back">Transformation</Link>
        <div className="nav-logo">Samuel Kobina Gyasi</div>
        <div className="nav-tag">Blog</div>
      </nav>

      <header className="tb-header">
        <div className="tb-eyebrow">Writings on Change</div>
        <h1 className="tb-title">
          Stories of<br /><em>Becoming</em>
        </h1>
        <p className="tb-subtitle">
          On breaking cycles, building new realities, and the relentless work of becoming who you
          were created to be.
        </p>
      </header>

      <section className="tb-section">
        {posts.length === 0 ? (
          <p className="tb-empty">Transformation stories coming soon.</p>
        ) : (
          <div className="tb-grid">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/transformation/blog/${post.slug}`}
                className={`tb-card ${i === 0 ? "tb-card--featured" : ""}`}
              >
                <div className="tb-card-tag">Transformation</div>
                <h2 className="tb-card-title">{post.title}</h2>
                {post.excerpt && <p className="tb-card-excerpt">{post.excerpt}</p>}
                <div className="tb-card-meta">
                  <span>{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span>{post.read_time_minutes} min read</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="tb-footer">
        <div className="tb-f-name">Samuel Kobina Gyasi</div>
        <div className="tb-f-copy">© {new Date().getFullYear()} · All Rights Reserved</div>
        <Link href="/transformation" className="tb-f-link">← Transformation</Link>
      </footer>
    </div>
  );
}

const blogCss = `
.tdp { --void:#07080a; --white:#f2f0ec; --ember:#e8692a; --mist:#8a8880; --line:rgba(242,240,236,.06); --card:#131619; background:var(--void); color:var(--white); }
.tdp nav { position:fixed;top:0;left:0;right:0;z-index:200;padding:22px 56px;display:flex;justify-content:space-between;align-items:center;background:rgba(7,8,10,.88);backdrop-filter:blur(14px);border-bottom:1px solid var(--line); }
.nav-back { font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--mist);text-decoration:none;display:flex;align-items:center;gap:10px;transition:color .3s; }
.nav-back:hover { color:var(--ember); }
.nav-back::before { content:'←';font-size:13px; }
.nav-logo { font-family:'Playfair Display',serif;font-size:16px;color:var(--white); }
.nav-tag { font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--ember); }
.tb-header { padding:160px 56px 60px; }
.tb-eyebrow { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:var(--ember);margin-bottom:20px; }
.tb-title { font-family:'Playfair Display',serif;font-size:clamp(52px,8vw,110px);line-height:.9;color:var(--white);margin:16px 0 24px; }
.tb-title em { font-style:italic;color:var(--ember);display:block;font-size:.8em; }
.tb-subtitle { font-family:'Cormorant Garamond',serif;font-size:clamp(16px,1.8vw,20px);font-style:italic;color:var(--mist);max-width:560px;line-height:1.65;font-weight:300; }
.tb-section { padding:60px 56px; }
.tb-empty { font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;color:var(--mist);padding:60px 0;text-align:center; }
.tb-grid { display:grid;grid-template-columns:1fr 1fr;gap:2px; }
.tb-card--featured { grid-column:1/-1; }
.tb-card { background:var(--card);border:1px solid var(--line);padding:44px 40px;text-decoration:none;color:var(--white);display:flex;flex-direction:column;gap:14px;transition:border-color .3s,padding-left .3s; }
.tb-card:hover { border-color:rgba(232,105,42,.3);padding-left:52px; }
.tb-card--featured { padding:56px 52px; }
.tb-card--featured:hover { padding-left:64px; }
.tb-card-tag { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:var(--ember); }
.tb-card-title { font-family:'Playfair Display',serif;color:var(--white);line-height:1.15; }
.tb-card--featured .tb-card-title { font-size:clamp(24px,3vw,38px); }
.tb-card:not(.tb-card--featured) .tb-card-title { font-size:clamp(18px,2vw,24px); }
.tb-card-excerpt { font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;color:var(--mist);line-height:1.65;font-weight:300;flex:1; }
.tb-card-meta { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:var(--mist);display:flex;gap:20px;margin-top:8px; }
.tb-footer { background:var(--void);border-top:1px solid var(--line);padding:28px 56px;display:flex;justify-content:space-between;align-items:center; }
.tb-f-name { font-family:'Playfair Display',serif;font-size:16px;color:var(--white); }
.tb-f-copy { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--mist); }
.tb-f-link { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--ember);text-decoration:none; }
@media(max-width:768px){ .tb-grid { grid-template-columns:1fr; } .tb-card--featured { grid-column:1; } .tb-header,.tb-section { padding-left:24px;padding-right:24px; } .tb-footer { flex-direction:column;gap:12px;text-align:center;padding:24px; } }
`;
