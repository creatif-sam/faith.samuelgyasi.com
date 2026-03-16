import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface Props { params: Promise<{ slug: string }>; }

const samplePosts: Record<string, { title: string; excerpt: string; content: string; created_at: string; read_time_minutes: number }> = {
  "anatomy-of-transformation": {
    title: "The Anatomy of Transformation: From Identity to Impact",
    excerpt: "True transformation is not a change of clothes — it is a change of self.",
    created_at: "2026-02-25",
    read_time_minutes: 10,
    content: `<p>Transformation is one of the most overused and underexplained words in personal development, theology, and social change discourse. People talk about being "transformed" the way they talk about being "inspired" — as if it were a feeling that happens to you rather than a process you enter into, often at great cost.</p>
<p>I want to offer a more honest account of transformation — from my own experience, and from years of watching what actually shifts in people and communities.</p>
<h2>Phase 1: The Crisis of Identity</h2>
<p>Every genuine transformation I have witnessed — in myself or in others — begins with a rupture. Something that was working ceases to work. A narrative you had about yourself turns out to be insufficient. A way of being that served the old context becomes a liability in the new one.</p>
<p>This rupture is not a failure. It is an invitation. The question is whether you accept it.</p>
<h2>Phase 2: The Descent</h2>
<p>Before the new can emerge, there is almost always a period of disorientation. The old identity is dissolving and the new one has not yet solidified. This is the most dangerous phase — and the most formative.</p>
<blockquote><p>"Unless a grain of wheat falls into the earth and dies, it remains alone; but if it dies, it bears much fruit." — John 12:24</p></blockquote>
<p>The descent cannot be skipped. It can only be navigated with grace, honesty, and — if you are fortunate — the company of people who have been through it themselves.</p>
<h2>Phase 3: The Emergence</h2>
<p>Transformation produces a version of you that is not alien — it is more essentially <em>you</em> than the version that went in. The transformation does not dissolve your identity; it clarifies it. And with that clarity comes impact — the ability to contribute to the world around you from a place of genuine wholeness rather than performance.</p>
<p>That, ultimately, is what all transformation is for: not for yourself alone, but for the community your emergence serves.</p>`,
  },
  "breaking-cycles": {
    title: "Breaking Cycles: How One Generation Can Change Everything",
    excerpt: "Every generation inherits the unfinished work of the one before it.",
    created_at: "2026-02-08",
    read_time_minutes: 8,
    content: `<p>The concept of generational cycles is not merely a sociological observation — it is a deeply personal confrontation. To break a cycle, you must first see it clearly. And seeing it clearly means acknowledging both the pain it has caused and the dignity of those who carried it before you.</p>
<h2>What Breaking a Cycle is Not</h2>
<p>Breaking a cycle is not the same as disowning your past. It is not rejecting your parents, your community, or your heritage. The cycle-breaker is not the one who escapes their people — it is the one who loves their people enough to refuse to pass on what was handed to them without examination.</p>
<p>This requires something extraordinarily difficult: the ability to hold in one hand the gift your inheritance gave you, and in the other hand the wound it also gave you, and to be honest about both simultaneously.</p>
<h2>The Weight and the Calling</h2>
<p>I grew up in Ghana, carried on full scholarship to university in Morocco, and found myself in rooms that none of my immediate predecessors had entered. This is not cause for pride — it is cause for responsibility. Every door I walk through should be held open for the person behind me.</p>
<p>That is what it means to break a cycle: not merely to succeed, but to succeed in a way that creates pathways for others.</p>
<blockquote><p>"We are the ones we have been waiting for." — June Jordan</p></blockquote>`,
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = samplePosts[slug];
  return {
    title: post?.title ?? "Transformation Blog Post",
    description: post?.excerpt ?? "Transformation stories by Samuel Kobina Gyasi.",
  };
}

export default async function TransformationBlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post: { title: string; excerpt: string | null; content: string; created_at: string; read_time_minutes: number } | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("title, excerpt, content, created_at, read_time_minutes")
      .eq("slug", slug).eq("category", "transformation").eq("published", true).single();
    if (data) post = data;
  } catch { /* fallback */ }

  if (!post) {
    const sample = samplePosts[slug];
    if (!sample) notFound();
    post = sample;
  }

  return (
    <div className="tdp" style={{ minHeight: "100vh" }}>
      <style>{articleCss}</style>
      <nav>
        <Link href="/transformation/blog" className="nav-back">Blog</Link>
        <div className="nav-logo">Samuel Kobina Gyasi</div>
        <div className="nav-tag">Transformation</div>
      </nav>
      <article className="ta-article">
        <header className="ta-header">
          <div className="ta-tag">Transformation</div>
          <h1 className="ta-title">{post.title}</h1>
          <div className="ta-meta">
            <span>{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>·</span>
            <span>{post.read_time_minutes} min read</span>
          </div>
          {post.excerpt && <p className="ta-lead">{post.excerpt}</p>}
        </header>
        <div className="ta-body" dangerouslySetInnerHTML={{ __html: post.content }} />
        <footer className="ta-footer">
          <Link href="/transformation/blog" className="ta-back">← All Transformation Writings</Link>
        </footer>
      </article>
      <footer style={{ background: "#07080a", borderTop: "1px solid rgba(242,240,236,.06)", padding: "28px 56px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "16px", color: "#f2f0ec" }}>Samuel Kobina Gyasi</div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", color: "#8a8880" }}>© {new Date().getFullYear()}</div>
        <Link href="/" style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", letterSpacing: ".2em", color: "#e8692a", textDecoration: "none", textTransform: "uppercase" }}>Home</Link>
      </footer>
    </div>
  );
}

const articleCss = `
.tdp { --void:#07080a; --white:#f2f0ec; --ember:#e8692a; --mist:#8a8880; --line:rgba(242,240,236,.06); background:var(--void); color:var(--white); }
.tdp nav { position:fixed;top:0;left:0;right:0;z-index:200;padding:22px 56px;display:flex;justify-content:space-between;align-items:center;background:rgba(7,8,10,.88);backdrop-filter:blur(14px);border-bottom:1px solid var(--line); }
.nav-back { font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--mist);text-decoration:none;display:flex;align-items:center;gap:10px;transition:color .3s; }
.nav-back:hover { color:var(--ember); }
.nav-back::before { content:'←';font-size:13px; }
.nav-logo { font-family:'Playfair Display',serif;font-size:16px;color:var(--white); }
.nav-tag { font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--ember); }
.ta-article { padding:160px 56px 80px;max-width:760px; }
.ta-tag { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:var(--ember);margin-bottom:24px; }
.ta-title { font-family:'Playfair Display',serif;font-size:clamp(32px,5vw,60px);color:var(--white);line-height:1.08;margin-bottom:24px; }
.ta-meta { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:var(--mist);display:flex;gap:12px;margin-bottom:32px; }
.ta-lead { font-family:'Playfair Display',serif;font-size:clamp(17px,2.2vw,22px);font-style:italic;color:rgba(242,240,236,.8);line-height:1.55;padding:24px 32px;border-left:2px solid var(--ember);background:rgba(232,105,42,.06);margin:24px 0 48px; }
.ta-body { font-family:'Cormorant Garamond',serif;font-size:clamp(17px,1.8vw,20px);line-height:1.9;color:var(--mist);font-weight:300; }
.ta-body h2 { font-family:'Playfair Display',serif;font-size:clamp(22px,3vw,30px);color:var(--white);margin:52px 0 20px;font-weight:700; }
.ta-body p { margin-bottom:24px; }
.ta-body em { color:rgba(242,240,236,.85); }
.ta-body strong { color:var(--white); }
.ta-body blockquote { border-left:2px solid var(--ember);padding:20px 32px;background:rgba(232,105,42,.06);font-style:italic;font-size:18px;color:rgba(242,240,236,.8);margin:36px 0; }
.ta-footer { margin-top:72px;padding-top:40px;border-top:1px solid var(--line); }
.ta-back { font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--ember);text-decoration:none; }
@media(max-width:768px){ .ta-article { padding:120px 24px 60px; } .tdp nav { padding:18px 24px; } }
`;
