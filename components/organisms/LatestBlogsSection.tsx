import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";

export async function LatestBlogsSection() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id,title,slug,category,excerpt,read_time_minutes,featured_image_url,created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (!posts || posts.length === 0) return null;

  return (
    <section id="latest-reflections" className="portfolio-section pillars-section">
      <div className="section-inner">
        <SectionLabel>Faith Journal</SectionLabel>

        <ScrollReveal className="pillars-header">
          <h2 className="pillars-title">Latest Reflections</h2>
          <p className="pillars-sub">
            Recent writings on Scripture, sacred conviction, and the daily practice of trusting God.
          </p>
        </ScrollReveal>

        <div className="pillars-grid">
          {posts.map((post) => (
            <ScrollReveal key={post.id}>
              <div className="pillar-card" style={{ padding: 0, overflow: 'hidden' }}>
                {post.featured_image_url && (
                  <div style={{ overflow: 'hidden', height: '180px' }}>
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                )}
                <div style={{ padding: '28px 32px 32px' }}>
                <span className="pillar-icon" style={{ fontSize: "12px", fontFamily: "var(--font-space-mono,'Space Mono',monospace)", letterSpacing: ".24em", textTransform: "uppercase", color: "var(--gold)" }}>
                  {post.category}
                </span>
                <div className="pillar-name" style={{ fontSize: "22px" }}>{post.title}</div>
                {post.excerpt && (
                  <p className="pillar-desc">{post.excerpt}</p>
                )}
                <div className="pillar-verse">
                  {new Date(post.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {" · "}
                  {post.read_time_minutes} min read
                </div>
                <Link href={`/blog/${post.slug}`} className="pillar-cta">
                  Read Reflection →
                </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div style={{ textAlign: "center", marginTop: "56px" }}>
            <Link
              href="/blog"
              style={{
                fontFamily: "var(--font-space-mono,'Space Mono',monospace)",
                fontSize: "10px",
                letterSpacing: ".22em",
                textTransform: "uppercase",
                color: "var(--gold)",
                textDecoration: "none",
                border: "1px solid rgba(201,168,76,.3)",
                padding: "14px 36px",
                display: "inline-block",
                transition: "border-color .3s, color .3s",
              }}
            >
              View All Reflections →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
