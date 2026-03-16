import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Leadership — Blog",
  description:
    "Insights on servant leadership, authority, and building institutions that outlast their founders. By Samuel Kobina Gyasi.",
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
    id: "l1",
    title: "The President Who Learns to Listen: Leading the Collective Intelligence Consortium",
    slug: "president-who-listens",
    excerpt:
      "True leadership is less about speaking and more about creating the conditions in which others can speak, think, and contribute at full capacity.",
    created_at: "2026-02-18",
    read_time_minutes: 8,
  },
  {
    id: "l2",
    title: "What Class Prefect at Saint John's Taught Me About Authority",
    slug: "class-prefect-authority",
    excerpt:
      "Authority without relationship is just power. Power without character is just threat. The seeds of servant leadership were planted long before I understood the concept.",
    created_at: "2026-01-30",
    read_time_minutes: 6,
  },
  {
    id: "l3",
    title: "On Servant Leadership: The Model of Jesus in Modern Organisations",
    slug: "servant-leadership-model",
    excerpt:
      "The paradox of leadership: the higher you ascend, the more you are called to stoop. Jesus washed feet. What are you willing to do?",
    created_at: "2026-01-10",
    read_time_minutes: 9,
  },
  {
    id: "l4",
    title: "Cultural Intelligence: Leading Across the Ghana-Morocco Divide",
    slug: "cultural-intelligence",
    excerpt:
      "Moving between two cultures taught me that leadership is contextual. What works in one room can alienate in another. Cultural intelligence isn't optional — it is foundational.",
    created_at: "2025-12-15",
    read_time_minutes: 7,
  },
];

export default async function LeadershipBlogPage() {
  let posts: Post[] = samplePosts;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, created_at, read_time_minutes")
      .eq("category", "leadership")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (data && data.length > 0) posts = data;
  } catch { /* fallback */ }

  return (
    <div className="ldp" style={{ minHeight: "100vh" }}>
      <style>{blogCss}</style>

      <nav>
        <Link href="/leadership" className="nav-back">Leadership</Link>
        <div className="nav-logo">Samuel Kobina Gyasi</div>
        <div className="nav-tag">Blog</div>
      </nav>

      <header className="lb-header">
        <div className="s-label" style={{ color: "var(--gold)" }}>Writings on Leadership</div>
        <h1 className="lb-title">
          Lead with<br /><em>Purpose</em>
        </h1>
        <p className="lb-subtitle">
          Insights on authority, service, and building organisations that outlast their founders.
        </p>
      </header>

      <section className="section">
        {posts.length === 0 ? (
          <p className="lb-empty">Leadership reflections coming soon.</p>
        ) : (
          <div className="lb-grid">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/leadership/blog/${post.slug}`}
                className={`lb-card ${i === 0 ? "lb-card--featured" : ""}`}
              >
                <div className="lb-card-tag">Leadership</div>
                <h2 className="lb-card-title">{post.title}</h2>
                {post.excerpt && <p className="lb-card-excerpt">{post.excerpt}</p>}
                <div className="lb-card-meta">
                  <span>{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span>{post.read_time_minutes} min read</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer>
        <div className="f-name" style={{ color: "var(--white)" }}>Samuel Kobina Gyasi</div>
        <div className="f-copy" style={{ color: "var(--gray)" }}>© {new Date().getFullYear()} · All Rights Reserved</div>
        <Link href="/leadership" className="f-link">← Back to Leadership</Link>
      </footer>
    </div>
  );
}

const blogCss = `
.ldp { --bg:#0c0b09; --white:#f0ede8; --gold:#c8a84b; --gray:#6b6560; --line:rgba(240,237,232,0.07); --card:#141210; }
.ldp footer { background:var(--bg);border-top:1px solid var(--line);padding:28px 56px;display:flex;justify-content:space-between;align-items:center; }
.f-name { font-family:'Playfair Display',serif;font-size:16px;color:var(--white); }
.f-copy { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase; }
.f-link { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.2em;color:var(--gold);text-decoration:none;text-transform:uppercase; }
.lb-header { padding:160px 56px 60px; background:var(--bg); }
.s-label { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.4em;text-transform:uppercase;margin-bottom:20px; }
.lb-title { font-family:'Playfair Display',serif;font-size:clamp(52px,8vw,110px);line-height:.9;color:var(--white);margin:16px 0 24px; }
.lb-title em { font-style:italic;color:var(--gold);display:block;font-size:.8em; }
.lb-subtitle { font-family:'Cormorant Garamond',serif;font-size:clamp(16px,1.8vw,20px);font-style:italic;color:var(--gray);max-width:560px;line-height:1.65;font-weight:300; }
.lb-empty { font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;color:var(--gray);padding:60px 0;text-align:center; }
.section { padding:60px 56px; background:var(--bg); }
.lb-grid { display:grid;grid-template-columns:1fr 1fr;gap:2px; }
.lb-card--featured { grid-column:1/-1; }
.lb-card { background:var(--card);border:1px solid var(--line);padding:44px 40px;text-decoration:none;color:var(--white);display:flex;flex-direction:column;gap:14px;transition:border-color .3s,padding-left .3s;cursor:none; }
.lb-card:hover { border-color:rgba(200,168,75,.3);padding-left:52px; }
.lb-card--featured { padding:56px 52px; }
.lb-card--featured:hover { padding-left:64px; }
.lb-card-tag { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:var(--gold); }
.lb-card-title { font-family:'Playfair Display',serif;color:var(--white);line-height:1.15; }
.lb-card--featured .lb-card-title { font-size:clamp(24px,3vw,38px); }
.lb-card:not(.lb-card--featured) .lb-card-title { font-size:clamp(18px,2vw,24px); }
.lb-card-excerpt { font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;color:var(--gray);line-height:1.65;font-weight:300;flex:1; }
.lb-card-meta { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:var(--gray);display:flex;gap:20px;margin-top:8px; }
.nav-back { font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--gray);text-decoration:none;display:flex;align-items:center;gap:10px;transition:color .3s; }
.nav-back:hover { color:var(--gold); }
.nav-back::before { content:'←';font-size:13px; }
@media(max-width:768px){ .lb-grid { grid-template-columns:1fr; } .lb-card--featured { grid-column:1; } .lb-header,.section { padding-left:24px;padding-right:24px; } .ldp footer { flex-direction:column;gap:12px;text-align:center;padding:24px; } }
`;
