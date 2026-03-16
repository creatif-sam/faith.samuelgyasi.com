import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface Props { params: Promise<{ slug: string }>; }

const samplePosts: Record<string, { title: string; excerpt: string; content: string; created_at: string; read_time_minutes: number }> = {
  "president-who-listens": {
    title: "The President Who Learns to Listen: Leading the Collective Intelligence Consortium",
    excerpt: "True leadership is less about speaking and more about creating conditions in which others can think and contribute.",
    created_at: "2026-02-18",
    read_time_minutes: 8,
    content: `<p>When I became President of the Collective Intelligence Consortium, I was tempted to arrive with answers. I had ideas, energy, and, frankly, an agenda. But the first week taught me something I have been unlearning and relearning ever since: leadership is not about having the best ideas. It is about creating the space where the best ideas can emerge.</p>
<h2>The Paradox of the President's Voice</h2>
<p>In any room where you hold the title, your voice carries disproportionate weight. A sentence you throw out casually becomes a policy direction. An observation you make in passing becomes the framework around which others organise their thinking. This is influence — but unmanaged, it is also constraint.</p>
<p>I learned to speak last in open discussions. Not always — but often enough that the room stopped waiting for my lead and started generating its own. The quality of conversation improved dramatic ally. People stopped performing for me and started thinking with me.</p>
<h2>What Collective Intelligence Actually Means</h2>
<p>The field of Collective Intelligence is about how groups can think and decide better than individuals. But the deeper lesson is this: the leader's job is not to be the most intelligent person in the room. It is to make the room collectively intelligent.</p>
<blockquote><p>"The servant-leader is servant first... It begins with the natural feeling that one wants to serve, to serve first." — Robert Greenleaf</p></blockquote>
<p>Leadership is an act of facilitation as much as direction. The meetings I am most proud of as president are the ones where I barely said a word — and yet the outcome was extraordinary.</p>`,
  },
  "servant-leadership-model": {
    title: "On Servant Leadership: The Model of Jesus in Modern Organisations",
    excerpt: "The paradox of leadership: the higher you ascend, the more you are called to stoop.",
    created_at: "2026-01-10",
    read_time_minutes: 9,
    content: `<p>In John 13, Jesus — knowing that he had all authority, that all things had been placed in his hands — took a towel and washed his disciples' feet. This is the most compressed leadership lesson in history.</p>
<h2>Authority and Humility as Partners</h2>
<p>Servant leadership is often misunderstood as a kind of weakness — the leader who defers to everyone, who has no spine, who cannot make hard decisions. This is not what Jesus modelled. He washed feet <em>and</em> overturned tables in the temple. He served <em>and</em> confronted. Servant leadership is not about the absence of authority — it is about the right use of it.</p>
<h2>Application in Modern Contexts</h2>
<p>In every leadership role I have held — from class prefect to consortium president — I have tried to ask one guiding question: what does this group need from me right now? Sometimes that is direction. Sometimes that is space. Sometimes it is the hard conversation nobody else is willing to have. The servant leader reads the room and responds to the need, not to the title.</p>
<blockquote><p>"Not so with you. Instead, whoever wants to become great among you must be your servant." — Matthew 20:26</p></blockquote>
<p>Greatness, in the economy of God, is measured not by how many serve you but by how many you serve. This has become the compass point of my leadership philosophy.</p>`,
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = samplePosts[slug];
  return {
    title: post?.title ?? "Leadership Blog Post",
    description: post?.excerpt ?? "Leadership reflections by Samuel Kobina Gyasi.",
  };
}

export default async function LeadershipBlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post: { title: string; excerpt: string | null; content: string; created_at: string; read_time_minutes: number } | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("title, excerpt, content, created_at, read_time_minutes")
      .eq("slug", slug).eq("category", "leadership").eq("published", true).single();
    if (data) post = data;
  } catch { /* fallback */ }

  if (!post) {
    const sample = samplePosts[slug];
    if (!sample) notFound();
    post = sample;
  }

  return (
    <div className="ldp" style={{ minHeight: "100vh" }}>
      <style>{articleCss}</style>
      <nav>
        <Link href="/leadership/blog" className="nav-back">Blog</Link>
        <div className="nav-logo" style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", color: "var(--white,#f0ede8)" }}>Samuel Kobina Gyasi</div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "10px", letterSpacing: ".22em", color: "#c8a84b", textTransform: "uppercase" }}>Leadership</div>
      </nav>
      <article className="la-article">
        <header className="la-header">
          <div className="la-tag">Leadership</div>
          <h1 className="la-title">{post.title}</h1>
          <div className="la-meta">
            <span>{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>·</span>
            <span>{post.read_time_minutes} min read</span>
          </div>
          {post.excerpt && <p className="la-lead">{post.excerpt}</p>}
        </header>
        <div className="la-body" dangerouslySetInnerHTML={{ __html: post.content }} />
        <footer className="la-footer">
          <Link href="/leadership/blog" className="la-back">← All Leadership Writings</Link>
        </footer>
      </article>
      <footer style={{ background: "var(--bg,#0c0b09)", borderTop: "1px solid rgba(240,237,232,0.07)", padding: "28px 56px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "16px", color: "#f0ede8" }}>Samuel Kobina Gyasi</div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", color: "#6b6560" }}>© {new Date().getFullYear()}</div>
        <Link href="/" style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", letterSpacing: ".2em", color: "#c8a84b", textDecoration: "none", textTransform: "uppercase" }}>Home</Link>
      </footer>
    </div>
  );
}

const articleCss = `
.ldp { --bg:#0c0b09; --white:#f0ede8; --gold:#c8a84b; --gray:#6b6560; --line:rgba(240,237,232,.07); }
.ldp nav { position:fixed;top:0;left:0;right:0;z-index:200;padding:22px 56px;display:flex;justify-content:space-between;align-items:center;background:rgba(12,11,9,.88);backdrop-filter:blur(14px);border-bottom:1px solid var(--line); }
.nav-back { font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--gray);text-decoration:none;display:flex;align-items:center;gap:10px;transition:color .3s; }
.nav-back:hover { color:var(--gold); }
.nav-back::before { content:'←';font-size:13px; }
.la-article { padding:160px 56px 80px; max-width:760px; }
.la-tag { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:var(--gold);margin-bottom:24px; }
.la-title { font-family:'Playfair Display',serif;font-size:clamp(32px,5vw,60px);color:var(--white);line-height:1.08;margin-bottom:24px; }
.la-meta { font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:var(--gray);display:flex;gap:12px;margin-bottom:32px;flex-wrap:wrap; }
.la-lead { font-family:'Playfair Display',serif;font-size:clamp(17px,2.2vw,23px);font-style:italic;color:rgba(240,237,232,.8);line-height:1.55;padding:28px 36px;border-left:2px solid var(--gold);background:rgba(200,168,75,.04);margin:24px 0 48px; }
.la-body { font-family:'Cormorant Garamond',serif;font-size:clamp(17px,1.8vw,20px);line-height:1.9;color:var(--gray);font-weight:300; }
.la-body h2 { font-family:'Playfair Display',serif;font-size:clamp(22px,3vw,30px);color:var(--white);margin:52px 0 20px;font-weight:700; }
.la-body p { margin-bottom:24px; }
.la-body em { color:rgba(240,237,232,.85); }
.la-body strong { color:var(--white); }
.la-body blockquote { border-left:2px solid var(--gold);padding:20px 32px;background:rgba(200,168,75,.04);font-style:italic;font-size:18px;color:rgba(240,237,232,.8);margin:36px 0; }
.la-footer { margin-top:72px;padding-top:40px;border-top:1px solid var(--line); }
.la-back { font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);text-decoration:none; }
@media(max-width:768px){ .la-article { padding:120px 24px 60px; } .ldp nav { padding:18px 24px; } }
`;
