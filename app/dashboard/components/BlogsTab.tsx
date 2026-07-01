"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Newspaper } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { localizedHref } from "@/lib/i18n/locale";
import { createClient } from "@/lib/supabase/client";
import { BibleEnhancedContent } from "@/components/BibleEnhancedContent";
import { articleCss } from "@/app/blog/articleStyles";
import type { BlogPostSummary } from "../types";
import type { Translations } from "../translations";

interface BlogsTabProps {
  posts: BlogPostSummary[];
  readPostIds: Set<string>;
  userId: string | null;
  t: Translations;
  onMarkRead: (postId: string) => void;
}

interface FullContent {
  content: string | null;
  content_fr: string | null;
}

export default function BlogsTab({ posts, readPostIds, userId, t, onMarkRead }: BlogsTabProps) {
  const { lang } = useLang();
  const [selected, setSelected] = useState<BlogPostSummary | null>(null);
  const [full, setFull] = useState<FullContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  async function openPost(post: BlogPostSummary) {
    setSelected(post);
    setFull(null);
    setLoadingContent(true);

    const db = createClient();
    const { data } = await db.from("blog_posts").select("content,content_fr").eq("id", post.id).single();
    setFull((data as FullContent) ?? { content: null, content_fr: null });
    setLoadingContent(false);

    if (userId && !readPostIds.has(post.id)) {
      await db.from("blog_reads").upsert(
        { user_id: userId, blog_post_id: post.id },
        { onConflict: "user_id,blog_post_id", ignoreDuplicates: true }
      );
      onMarkRead(post.id);
    }
  }

  if (selected) {
    const title = lang === "fr" && selected.title_fr ? selected.title_fr : selected.title;
    const content = (lang === "fr" && full?.content_fr ? full.content_fr : full?.content) ?? "";
    return (
      <>
        <style>{articleCss}</style>
        <button className="dash-btn" onClick={() => setSelected(null)} style={{ marginBottom: 20 }}>
          {t.backToBlogs}
        </button>
        <div className="fdp">
          <article className="fa-article" style={{ padding: 0, maxWidth: 760 }}>
            <header className="fa-header">
              <div className="fa-tag">{selected.category}</div>
              <h1 className="fa-title">{title}</h1>
              <div className="fa-meta">
                <span>{new Date(selected.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span>·</span>
                <span>{selected.read_time_minutes} {t.blogMinRead}</span>
              </div>
              {selected.featured_image_url && (
                <div className="fa-cover">
                  <img src={selected.featured_image_url} alt={title} className="fa-cover-img" />
                </div>
              )}
            </header>
            {loadingContent ? (
              <p className="fa-body">…</p>
            ) : (
              <BibleEnhancedContent content={content} />
            )}
            <div style={{ marginTop: 40 }}>
              <Link href={localizedHref(lang, `/blog/${selected.slug}`)} className="fa-author-link" target="_blank">
                {t.openFullArticle}
              </Link>
            </div>
          </article>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="dash-page-header">
        <h1 className="dash-page-title">{t.blogs}</h1>
        <p className="dash-page-sub">{t.blogsSub}</p>
      </div>
      <div className="dash-section-head">
        <Newspaper size={13} /> {t.blogs} ({posts.length})
      </div>
      <div className="dash-grid">
        {posts.length === 0 ? (
          <div className="dash-empty">{t.noBlogsPublished}</div>
        ) : (
          posts.map((post) => {
            const title = lang === "fr" && post.title_fr ? post.title_fr : post.title;
            const excerpt = lang === "fr" && post.excerpt_fr ? post.excerpt_fr : post.excerpt;
            const isRead = readPostIds.has(post.id);
            return (
              <div key={post.id} className="dash-card" style={{ cursor: "pointer" }} onClick={() => openPost(post)}>
                <div className="dash-card-thumb">
                  {post.featured_image_url
                    ? <img src={post.featured_image_url} alt={title} />
                    : <BookOpen size={40} className="dash-card-placeholder" />}
                  {isRead && (
                    <span className="dash-blog-read-badge">
                      <CheckCircle2 size={11} /> {t.blogReadBadge}
                    </span>
                  )}
                </div>
                <div className="dash-card-body">
                  <div className="dash-card-cat">{post.category}</div>
                  <div className="dash-card-title">{title}</div>
                  {excerpt && (
                    <div className="dash-card-desc">
                      {excerpt.slice(0, 90)}{excerpt.length > 90 ? "…" : ""}
                    </div>
                  )}
                  <div className="dash-card-meta">
                    <span>{post.read_time_minutes} {t.blogMinRead}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
