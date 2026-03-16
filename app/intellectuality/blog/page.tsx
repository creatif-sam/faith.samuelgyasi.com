import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Intellectuality — Blog",
  description:
    "Essays on collective intelligence, scholarship, and the bridge between ancient wisdom and modern thought. By Samuel Kobina Gyasi.",
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
    id: "i1",
    title: "Collective Intelligence: When Community Thinks Together",
    slug: "collective-intelligence-community",
    excerpt:
      "The smartest thing an individual can do is create the conditions for a group to be smarter than any one of its members. This is the science — and the art — of collective intelligence.",
    created_at: "2026-02-22",
    read_time_minutes: 9,
  },
  {
    id: "i2",
    title: "The Bridge Between Ancient Wisdom and Modern Technology",
    slug: "ancient-wisdom-modern-tech",
    excerpt:
      "African proverbs are not relics — they are compressed algorithms for collective decision-making. The question is whether we are listening closely enough.",
    created_at: "2026-02-05",
    read_time_minutes: 7,
  },
  {
    id: "i3",
    title: "How Scholarship Shapes Character, Not Just Knowledge",
    slug: "scholarship-shapes-character",
    excerpt:
      "A university education is not primarily about information transfer. At its best, it is a formation process — a making of the person, not just the professional.",
    created_at: "2026-01-20",
    read_time_minutes: 6,
  },
  {
    id: "i4",
    title: "Reading as a Spiritual Discipline",
    slug: "reading-spiritual-discipline",
    excerpt:
      "There are books that inform and books that transform. The discipline of deep reading — unhurried, annotating, returning — is one of the most undervalued practices of serious thinkers.",
    created_at: "2025-12-28",
    read_time_minutes: 5,
  },
];

export default async function IntellectualityBlogPage() {
  let posts: Post[] = samplePosts;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, created_at, read_time_minutes")
      .eq("category", "intellectuality")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (data && data.length > 0) posts = data;
  } catch { /* fallback */ }

  return (
    <div className="idp" style={{ minHeight: "100vh" }}>
      <style>{blogCss}</style>

      <nav>
        <Link href="/intellectuality" className="nav-back">Intellectuality</Link>
        <div className="nav-logo">Samuel Kobina Gyasi</div>
        <div className="nav-tag">Blog</div>
      </nav>

      <header className="ib-header">
        <div className="ib-eyebrow">Essays & Thinking</div>
        <h1 className="ib-title">
          Ideas That<br /><em>Matter</em>
        </h1>
        <p className="ib-subtitle">
          On collective intelligence, scholarship, and the relentless pursuit of understanding.
        </p>
      </header>

      <section className="ib-section">
        {posts.length === 0 ? (
          <p className="ib-empty">Essays coming soon — stay curious.</p>
        ) : (
          <div className="ib-grid">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/intellectuality/blog/${post.slug}`}
                className={`ib-card ${i === 0 ? "ib-card--featured" : ""}`}
              >
                <div className="ib-card-num">{String(i + 1).padStart(2, "0")}</div>
                <h2 className="ib-card-title">{post.title}</h2>
                {post.excerpt && <p className="ib-card-excerpt">{post.excerpt}</p>}
                <div className="ib-card-meta">
                  <span>{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span>·</span>
                  <span>{post.read_time_minutes} min read</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="ib-footer">
        <div className="ib-f-name">Samuel Kobina Gyasi</div>
        <div className="ib-f-copy">© {new Date().getFullYear()}</div>
        <Link href="/intellectuality" className="ib-f-link">← Intellectuality</Link>
      </footer>
    </div>
  );
}

const blogCss = `
.idp { --ink:#0a0908; --paper:#f4f1eb; --mid:#7a746a; --red:#c0392b; --line:rgba(10,9,8,.1); background:var(--paper); color:var(--ink); }
.idp nav { position:fixed;top:0;left:0;right:0;z-index:200;padding:22px 56px;display:flex;justify-content:space-between;align-items:center;background:rgba(244,241,235,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--line); }
.nav-back { font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--mid);text-decoration:none;display:flex;align-items:center;gap:10px;transition:color .3s; }
.nav-back:hover { color:var(--red); }
.nav-back::before { content:'←';font-size:13px; }
.nav-logo { font-family:'Playfair Display',serif;font-size:16px;color:var(--ink); }
.nav-tag { font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--red); }
.ib-header { padding:160px 56px 60px; }
.ib-eyebrow { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:var(--mid);margin-bottom:20px; }
.ib-title { font-family:'Playfair Display',serif;font-size:clamp(52px,8vw,110px);line-height:.9;color:var(--ink);margin:0 0 24px; }
.ib-title em { font-style:italic;color:var(--red);display:block; }
.ib-subtitle { font-family:'Cormorant Garamond',serif;font-size:clamp(16px,1.8vw,20px);font-style:italic;color:var(--mid);max-width:540px;line-height:1.65;font-weight:300; }
.ib-section { padding:60px 56px; }
.ib-empty { font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;color:var(--mid);padding:60px 0;text-align:center; }
.ib-grid { display:flex;flex-direction:column;gap:2px; }
.ib-card { background:#efece6;border:1px solid var(--line);padding:40px 44px 40px 120px;text-decoration:none;color:var(--ink);display:flex;flex-direction:column;gap:12px;position:relative;transition:background .3s,padding-left .3s; }
.ib-card:hover { background:#e8e4dd;padding-left:132px; }
.ib-card--featured { padding:52px 44px 52px 120px; }
.ib-card-num { position:absolute;left:40px;top:40px;font-family:'Playfair Display',serif;font-size:48px;font-weight:700;color:rgba(10,9,8,.08);line-height:1; }
.ib-card--featured .ib-card-num { font-size:72px; }
.ib-card-title { font-family:'Playfair Display',serif;line-height:1.15;color:var(--ink); }
.ib-card--featured .ib-card-title { font-size:clamp(22px,3vw,34px); }
.ib-card:not(.ib-card--featured) .ib-card-title { font-size:clamp(18px,2vw,24px); }
.ib-card-excerpt { font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;color:var(--mid);line-height:1.65;font-weight:300; }
.ib-card-meta { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:var(--mid);display:flex;gap:12px;margin-top:4px; }
.ib-footer { background:var(--ink);padding:28px 56px;display:flex;justify-content:space-between;align-items:center; }
.ib-f-name { font-family:'Playfair Display',serif;font-size:16px;color:var(--paper); }
.ib-f-copy { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:rgba(244,241,235,.4); }
.ib-f-link { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#c0392b;text-decoration:none; }
@media(max-width:768px){ .ib-card { padding:36px 24px 36px 80px; } .ib-card-num { left:20px;font-size:36px; } .ib-header,.ib-section { padding-left:24px;padding-right:24px; } .ib-footer { flex-direction:column;gap:12px;text-align:center;padding:24px; } }
`;
