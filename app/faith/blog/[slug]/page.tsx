import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ slug: string }>;
}

const samplePosts: Record<string, { title: string; excerpt: string; content: string; created_at: string; read_time_minutes: number }> = {
  "purpose-meets-patience": {
    title: "When Purpose Meets Patience: Lessons from Four Fully-Funded Scholarships",
    excerpt: "Four scholarships were not coincidences. They were confirmations.",
    created_at: "2026-02-10",
    read_time_minutes: 7,
    content: `<p>There is a verse I have returned to more times than I can count: <em>"Commit to the Lord whatever you do, and he will establish your plans."</em> — Proverbs 16:3.</p>
<p>When I received my first fully-funded scholarship from the Government of Ghana, I was grateful but unsure. When the second arrived — from Golden Star Gold Mines — I started to see a pattern. By the time the third (IBN ROCHD) and fourth (the Excellence Award) came, I understood something profound: provision is not accidental. Purpose has a way of announcing itself through open doors.</p>
<h2>The Waiting Room</h2>
<p>Between each scholarship, there was a waiting room. Applications, rejections, uncertainty. But the pattern I noticed was this: the seasons of waiting were not wasted. They were preparation. Every challenge I faced in those seasons deepened something in me that the scholarship alone couldn't build — resilience, humility, dependence on God rather than on my own intelligence.</p>
<h2>What I Learned</h2>
<p>Purpose and patience are not opposites. They are partners. Purpose gives you direction; patience gives you character for the journey. The scholarship was not just financial provision — it was a testimony. And testimonies are meant to be shared.</p>
<blockquote><p>"For I know the plans I have for you, declares the Lord — plans to prosper you and not to harm you, plans to give you hope and a future." — Jeremiah 29:11</p></blockquote>
<p>If you are in a waiting room right now, this is what I want you to know: the waiting is not wasted. God is not slow; He is precise. Trust the process. The scholarship of your life is coming.</p>`,
  },
  "proverbs-16-9-planning": {
    title: "Proverbs 16:9 and the Art of Planning Without Controlling",
    excerpt: "We plan. He establishes. The tension between strategic thinking and sacred surrender is where some of the greatest spiritual growth happens.",
    created_at: "2026-01-28",
    read_time_minutes: 5,
    content: `<p><em>"In their hearts humans plan their course, but the Lord establishes their steps."</em> — Proverbs 16:9</p>
<p>I am, by temperament and training, a planner. I believe in strategy, in preparation, in the discipline of thinking ahead. And yet, some of the most significant moments in my life have arrived not through my plans but in spite of them — or through the ruins of them.</p>
<h2>The Planner's Dilemma</h2>
<p>The planner's temptation is to confuse preparation with control. We build spreadsheets and five-year plans and mistake our capacity for foresight with the authority to determine outcomes. Proverbs 16:9 doesn't condemn planning — the first half is "in their hearts humans plan." Planning is human. It is right. But the second half is the correction: "the Lord establishes their steps."</p>
<h2>Sacred Surrender</h2>
<p>The art is in holding your plans loosely enough that God can redirect them without you breaking. This is what I have learned: plan with everything you have, and then submit the plan. Bring it before God. Say, "Here is what I see. What do You see?" And remain genuinely open to the answer being different from your expectation.</p>
<p>Some of my best "plans" have been interrupted in ways that turned out to be divine upgrades. The detour was the route. The obstacle was the door.</p>`,
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = samplePosts[slug];
  return {
    title: post?.title ?? "Faith Blog Post",
    description: post?.excerpt ?? "A reflection on faith by Samuel Kobina Gyasi.",
  };
}

export default async function FaithBlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post: { title: string; excerpt: string | null; content: string; created_at: string; read_time_minutes: number } | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("title, excerpt, content, created_at, read_time_minutes")
      .eq("slug", slug)
      .eq("category", "faith")
      .eq("published", true)
      .single();
    if (data) post = data;
  } catch { /* fallback */ }

  if (!post) {
    const sample = samplePosts[slug];
    if (!sample) notFound();
    post = sample;
  }

  return (
    <div className="fdp" style={{ minHeight: "100vh" }}>
      <style>{articleCss}</style>

      <nav>
        <Link href="/faith/blog" className="nav-back">Blog</Link>
        <div className="nav-logo">Samuel Kobina Gyasi</div>
        <div className="nav-tag">Faith</div>
      </nav>

      <article className="section fa-article">
        <header className="fa-header">
          <div className="fa-tag">Faith · Belief</div>
          <h1 className="fa-title">{post.title}</h1>
          <div className="fa-meta">
            <span>{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>·</span>
            <span>{post.read_time_minutes} min read</span>
            <span>·</span>
            <span>Samuel Kobina Gyasi</span>
          </div>
          {post.excerpt && <p className="fa-lead">{post.excerpt}</p>}
        </header>

        <div
          className="fa-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="fa-footer">
          <Link href="/faith/blog" className="fa-back-link">← All Faith Writings</Link>
        </footer>
      </article>

      <footer>
        <div className="f-name">Samuel Kobina Gyasi</div>
        <div className="f-copy">© {new Date().getFullYear()} · All Rights Reserved</div>
        <Link href="/" className="f-link">Home</Link>
      </footer>
    </div>
  );
}

const articleCss = `
.fa-article { padding-top: 140px; max-width: 760px; }
.fa-tag {
  font-family:'Space Mono',monospace;font-size:9px;
  letter-spacing:.3em;text-transform:uppercase;color:var(--gold);
  margin-bottom:24px;
}
.fa-title {
  font-family:var(--font-playfair),'Playfair Display',serif;
  font-size:clamp(32px,5vw,62px);color:var(--white);line-height:1.08;
  margin-bottom:24px;
}
.fa-meta {
  font-family:'Space Mono',monospace;font-size:9px;
  letter-spacing:.15em;text-transform:uppercase;color:var(--dim);
  display:flex;gap:12px;align-items:center;margin-bottom:32px;
  flex-wrap:wrap;
}
.fa-lead {
  font-family:var(--font-playfair),'Playfair Display',serif;
  font-size:clamp(18px,2.2vw,24px);font-style:italic;
  color:var(--cream,var(--white));line-height:1.55;
  padding:28px 36px;border-left:2px solid var(--gold);
  background:rgba(201,168,76,.04);margin:32px 0 48px;
}
.fa-body {
  font-family:var(--font-cormorant),'Cormorant Garamond',serif;
  font-size:clamp(17px,1.8vw,20px);line-height:1.9;color:var(--dim);
  font-weight:300;
}
.fa-body h2 {
  font-family:var(--font-playfair),'Playfair Display',serif;
  font-size:clamp(22px,3vw,32px);color:var(--white);
  margin:52px 0 20px;font-weight:700;
}
.fa-body h3 {
  font-family:var(--font-playfair),'Playfair Display',serif;
  font-size:22px;color:var(--white);margin:40px 0 16px;
}
.fa-body p { margin-bottom:24px; }
.fa-body em { color:var(--cream,var(--white)); }
.fa-body strong { color:var(--white); }
.fa-body blockquote {
  border-left:2px solid var(--gold);
  padding:20px 32px;background:rgba(201,168,76,.04);
  font-style:italic;font-size:18px;color:var(--cream,var(--white));
  margin:36px 0;
}
.fa-footer { margin-top:72px;padding-top:40px;border-top:1px solid var(--line); }
.fa-back-link {
  font-family:'Space Mono',monospace;font-size:10px;
  letter-spacing:.2em;text-transform:uppercase;
  color:var(--gold);text-decoration:none;
  transition:opacity .3s;
}
.fa-back-link:hover { opacity:.7; }
`;
