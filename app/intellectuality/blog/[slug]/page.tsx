import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface Props { params: Promise<{ slug: string }>; }

const samplePosts: Record<string, { title: string; excerpt: string; content: string; created_at: string; read_time_minutes: number }> = {
  "collective-intelligence-community": {
    title: "Collective Intelligence: When Community Thinks Together",
    excerpt: "The smartest thing an individual can do is create the conditions for a group to be smarter than any one of its members.",
    created_at: "2026-02-22",
    read_time_minutes: 9,
    content: `<p>There is a proverb from West Africa: <em>"If you want to go fast, go alone. If you want to go far, go together."</em> The field of Collective Intelligence is, in many ways, the scientific attempt to understand when, how, and why going together produces outcomes that going alone cannot.</p>
<h2>What the Research Shows</h2>
<p>Studies on group intelligence consistently show that the most collectively intelligent groups are not necessarily those with the most intelligent individuals. The key factors? Equal participation, high social sensitivity, and a diversity of perspectives. In other words: the quality of the <em>relationships</em> determines the quality of the <em>thinking</em>.</p>
<h2>African Epistemic Traditions</h2>
<p>African knowledge traditions have understood this for millennia. The concept of <em>Ubuntu</em> — "I am because we are" — is not just a philosophical statement. It is an epistemological one: my understanding is constituted through my relationships. We do not think in isolation; we think in community.</p>
<blockquote><p>"The whole is greater than the sum of its parts." — Aristotle, Metaphysics</p></blockquote>
<h2>Implications for Modern Institutions</h2>
<p>What would our schools, companies, and governments look like if they were designed for collective intelligence rather than individual performance? This is the question I am spending my academic career trying to answer. I believe the answer will transform not just how we work, but how we live together.</p>`,
  },
  "ancient-wisdom-modern-tech": {
    title: "The Bridge Between Ancient Wisdom and Modern Technology",
    excerpt: "African proverbs are not relics — they are compressed algorithms for collective decision-making.",
    created_at: "2026-02-05",
    read_time_minutes: 7,
    content: `<p>When I began studying Collective Intelligence at UM6P, I brought with me a treasury that most of my fellow students did not know they were missing: a deep formation in African oral tradition, proverbs, and communal decision-making practices. What I discovered is that these ancient tools are not pre-modern curiosities — they are <em>compression algorithms</em> for complex social knowledge.</p>
<h2>Proverbs as Algorithms</h2>
<p>Consider this Ghanaian proverb: <em>"The ruin of a nation begins in the homes of its people."</em> In a single sentence, this encodes a theory of institutional decay that would take a political scientist several papers to articulate. The proverb compresses centuries of observed patterns into a portable, memorable, sharable format.</p>
<p>This is what algorithms do. They compress complex operations into callable procedures. The difference is that proverbs are optimised for human memory and social transmission rather than computation.</p>
<h2>The Integration</h2>
<p>The future of collective intelligence is not a choice between ancient and modern. It is an integration — drawing on the pattern-recognition density of oral wisdom traditions and the computational power of modern technology to create tools for community flourishing that neither could produce alone.</p>
<p>I believe the researchers best positioned to build this bridge are those who carry both worlds. That is a calling I take seriously.</p>`,
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = samplePosts[slug];
  return {
    title: post?.title ?? "Intellectuality Blog Post",
    description: post?.excerpt ?? "Essays on intellect and scholarship by Samuel Kobina Gyasi.",
  };
}

export default async function IntellectualityBlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post: { title: string; excerpt: string | null; content: string; created_at: string; read_time_minutes: number } | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("title, excerpt, content, created_at, read_time_minutes")
      .eq("slug", slug).eq("category", "intellectuality").eq("published", true).single();
    if (data) post = data;
  } catch { /* fallback */ }

  if (!post) {
    const sample = samplePosts[slug];
    if (!sample) notFound();
    post = sample;
  }

  return (
    <div className="idp" style={{ minHeight: "100vh" }}>
      <style>{articleCss}</style>
      <nav>
        <Link href="/intellectuality/blog" className="nav-back">Blog</Link>
        <div className="nav-logo">Samuel Kobina Gyasi</div>
        <div className="nav-tag">Intellectuality</div>
      </nav>
      <article className="ia-article">
        <header className="ia-header">
          <div className="ia-tag">Essay · Intellectuality</div>
          <h1 className="ia-title">{post.title}</h1>
          <div className="ia-meta">
            <span>{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>·</span>
            <span>{post.read_time_minutes} min read</span>
          </div>
          {post.excerpt && <p className="ia-lead">{post.excerpt}</p>}
        </header>
        <div className="ia-body" dangerouslySetInnerHTML={{ __html: post.content }} />
        <footer className="ia-footer">
          <Link href="/intellectuality/blog" className="ia-back">← All Essays</Link>
        </footer>
      </article>
      <footer style={{ background: "#0a0908", padding: "28px 56px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "16px", color: "#f4f1eb" }}>Samuel Kobina Gyasi</div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(244,241,235,.4)" }}>© {new Date().getFullYear()}</div>
        <Link href="/" style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", letterSpacing: ".2em", color: "#c0392b", textDecoration: "none", textTransform: "uppercase" }}>Home</Link>
      </footer>
    </div>
  );
}

const articleCss = `
.idp { --ink:#0a0908; --paper:#f4f1eb; --mid:#7a746a; --red:#c0392b; --line:rgba(10,9,8,.1); background:var(--paper); color:var(--ink); }
.idp nav { position:fixed;top:0;left:0;right:0;z-index:200;padding:22px 56px;display:flex;justify-content:space-between;align-items:center;background:rgba(244,241,235,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--line); }
.nav-back { font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--mid);text-decoration:none;display:flex;align-items:center;gap:10px;transition:color .3s; }
.nav-back:hover { color:var(--red); }
.nav-back::before { content:'←';font-size:13px; }
.nav-logo { font-family:'Playfair Display',serif;font-size:16px;color:var(--ink); }
.nav-tag { font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--red); }
.ia-article { padding:160px 56px 80px;max-width:760px; }
.ia-tag { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:var(--red);margin-bottom:24px; }
.ia-title { font-family:'Playfair Display',serif;font-size:clamp(32px,5vw,60px);color:var(--ink);line-height:1.08;margin-bottom:24px; }
.ia-meta { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:var(--mid);display:flex;gap:12px;margin-bottom:32px; }
.ia-lead { font-family:'Playfair Display',serif;font-size:clamp(17px,2.2vw,22px);font-style:italic;color:var(--ink);line-height:1.55;padding:24px 32px;border-left:3px solid var(--red);margin:24px 0 48px;background:rgba(192,57,43,.04); }
.ia-body { font-family:'Cormorant Garamond',serif;font-size:clamp(17px,1.8vw,20px);line-height:1.9;color:#4a4440;font-weight:400; }
.ia-body h2 { font-family:'Playfair Display',serif;font-size:clamp(22px,3vw,30px);color:var(--ink);margin:52px 0 20px;font-weight:700; }
.ia-body p { margin-bottom:24px; }
.ia-body em { font-style:italic; }
.ia-body blockquote { border-left:3px solid var(--red);padding:20px 32px;background:rgba(192,57,43,.04);font-style:italic;font-size:18px;color:var(--ink);margin:36px 0; }
.ia-footer { margin-top:72px;padding-top:40px;border-top:2px solid var(--ink); }
.ia-back { font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--red);text-decoration:none; }
@media(max-width:768px){ .ia-article { padding:120px 24px 60px; } .idp nav { padding:18px 24px; } }
`;
