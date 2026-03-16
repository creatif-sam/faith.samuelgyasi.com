import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Beliefs & Faith — Blog",
  description:
    "Reflections on faith, scripture, and the sacred journey of trusting God through every season of life. By Samuel Kobina Gyasi.",
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
    id: "s1",
    title: "When Purpose Meets Patience: Lessons from Four Fully-Funded Scholarships",
    slug: "purpose-meets-patience",
    excerpt:
      "Four scholarships were not coincidences. They were confirmations — evidence that diligence and surrender working together open doors no human hand alone could unlock.",
    created_at: "2026-02-10",
    read_time_minutes: 7,
  },
  {
    id: "s2",
    title: "Proverbs 16:9 and the Art of Planning Without Controlling",
    slug: "proverbs-16-9-planning",
    excerpt:
      "We plan. He establishes. The tension between strategic thinking and sacred surrender is where some of the greatest spiritual growth happens.",
    created_at: "2026-01-28",
    read_time_minutes: 5,
  },
  {
    id: "s3",
    title: "From Ghana to Morocco: What God Teaches You When You're Far From Home",
    slug: "ghana-to-morocco",
    excerpt:
      "Displacement has a way of stripping away everything that isn't essential — and in that stripping, the essential becomes luminous. Faith is one of the things that remained.",
    created_at: "2026-01-15",
    read_time_minutes: 6,
  },
  {
    id: "s4",
    title: "Faith Over Fear: A Theology of Courage",
    slug: "faith-over-fear",
    excerpt:
      "Courage is not the absence of fear — it is faith in motion. Isaiah 41:13 isn't a nice saying; it is instructions for navigation in a terrifying world.",
    created_at: "2025-12-20",
    read_time_minutes: 8,
  },
];

export default async function FaithBlogPage() {
  let posts: Post[] = samplePosts;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, created_at, read_time_minutes")
      .eq("category", "faith")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (data && data.length > 0) posts = data;
  } catch {
    // fallback to sample posts
  }

  return (
    <div className="fdp" style={{ minHeight: "100vh" }}>
      <style>{blogCss}</style>

      {/* NAV */}
      <nav>
        <Link href="/faith" className="nav-back">Beliefs</Link>
        <div className="nav-logo">Samuel Kobina Gyasi</div>
        <div className="nav-tag">Blog</div>
      </nav>

      {/* HEADER */}
      <header className="fb-header section">
        <div className="s-label">Writings on Faith</div>
        <h1 className="fb-title">
          Words That<br /><em>Anchor</em>
        </h1>
        <p className="fb-subtitle">
          Reflections on scripture, sacred conviction, and the daily practice of trusting God
          with every step.
        </p>
      </header>

      {/* POSTS GRID */}
      <section className="section">
        {posts.length === 0 ? (
          <p className="fb-empty">Reflections coming soon — stay tuned.</p>
        ) : (
          <div className="fb-grid">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/faith/blog/${post.slug}`}
                className={`fb-card ${i === 0 ? "fb-card--featured" : ""}`}
              >
                <div className="fb-card-tag">Faith · Belief</div>
                <h2 className="fb-card-title">{post.title}</h2>
                {post.excerpt && <p className="fb-card-excerpt">{post.excerpt}</p>}
                <div className="fb-card-meta">
                  <span>{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span>{post.read_time_minutes} min read</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer>
        <div className="f-name">Samuel Kobina Gyasi</div>
        <div className="f-copy">© {new Date().getFullYear()} · All Rights Reserved</div>
        <Link href="/faith" className="f-link">← Back to Beliefs</Link>
      </footer>
    </div>
  );
}

const blogCss = `
.fdp { --bg:#080807; --bg2:#0e0d0b; --white:#f0ece4; --gold:#c9a84c; --dim:#7a7060; --line:rgba(240,236,228,.06); --card:#111009; }
body.on-fdp-blog { background:#080807; color:#f0ece4; }

.fb-header { padding-top:160px; }
.fb-title {
  font-family:var(--font-playfair),'Playfair Display',serif;
  font-size:clamp(52px,8vw,110px); line-height:.9; color:var(--white);
  margin:16px 0 24px;
}
.fb-title em { font-style:italic; color:var(--gold); display:block; font-size:.8em; }
.fb-subtitle {
  font-family:var(--font-cormorant),'Cormorant Garamond',serif;
  font-size:clamp(16px,1.8vw,20px); font-style:italic;
  color:var(--dim); max-width:560px; line-height:1.65; font-weight:300;
}
.fb-empty {
  font-family:var(--font-cormorant),'Cormorant Garamond',serif;
  font-size:20px; font-style:italic; color:var(--dim);
  padding:60px 0; text-align:center;
}
.fb-grid {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:2px;
}
.fb-card--featured { grid-column:1/-1; }
.fb-card {
  background:var(--card); border:1px solid var(--line);
  padding:44px 40px;
  text-decoration:none; color:var(--white);
  display:flex; flex-direction:column; gap:14px;
  transition:border-color .3s,padding-left .3s;
  cursor:none;
}
.fb-card:hover { border-color:rgba(201,168,76,.25); padding-left:52px; }
.fb-card--featured { padding:56px 52px; }
.fb-card--featured:hover { padding-left:64px; }
.fb-card-tag {
  font-family:'Space Mono',monospace;font-size:9px;
  letter-spacing:.3em;text-transform:uppercase;color:var(--gold);
}
.fb-card-title {
  font-family:var(--font-playfair),'Playfair Display',serif;
  color:var(--white);line-height:1.15;
}
.fb-card--featured .fb-card-title { font-size:clamp(24px,3vw,38px); }
.fb-card:not(.fb-card--featured) .fb-card-title { font-size:clamp(18px,2vw,24px); }
.fb-card-excerpt {
  font-family:var(--font-cormorant),'Cormorant Garamond',serif;
  font-size:16px;font-style:italic;color:var(--dim);line-height:1.65;font-weight:300;flex:1;
}
.fb-card-meta {
  font-family:'Space Mono',monospace;font-size:9px;
  letter-spacing:.15em;text-transform:uppercase;color:var(--dim);
  display:flex;gap:20px;margin-top:8px;
}
@media(max-width:768px){
  .fb-grid { grid-template-columns:1fr; }
  .fb-card--featured { grid-column:1; }
  .fdp .section,.fb-header { padding-left:24px;padding-right:24px; }
}
`;
