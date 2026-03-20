"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";

interface BlogPost {
  id: string;
  title: string;
  title_fr?: string | null;
  slug: string;
  category: string;
  excerpt: string | null;
  excerpt_fr?: string | null;
  read_time_minutes: number;
  featured_image_url: string | null;
  created_at: string;
}

export function LatestBlogsSection() {
  const { lang } = useLang();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const translations = {
    label: lang === "fr" ? "Journal de Foi" : "Faith Journal",
    title: lang === "fr" ? "Dernières Réflexions" : "Latest Reflections",
    subtitle: lang === "fr" 
      ? "Écrits récents sur les Écritures, les convictions sacrées et la pratique quotidienne de faire confiance à Dieu." 
      : "Recent writings on Scripture, sacred conviction, and the daily practice of trusting God.",
    readReflection: lang === "fr" ? "Lire la Réflexion →" : "Read Reflection →",
    viewAll: lang === "fr" ? "Voir Toutes les Réflexions →" : "View All Reflections →",
    minRead: lang === "fr" ? "min de lecture" : "min read",
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("blog_posts")
        .select("id,title,title_fr,slug,category,excerpt,excerpt_fr,read_time_minutes,featured_image_url,created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(2);
      
      if (data) setPosts(data);
    };
    fetchPosts();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section id="latest-reflections" className="portfolio-section pillars-section">
      <div className="section-inner">
        <SectionLabel>{translations.label}</SectionLabel>

        <ScrollReveal className="pillars-header">
          <h2 className="pillars-title">{translations.title}</h2>
          <p className="pillars-sub">
            {translations.subtitle}
          </p>
        </ScrollReveal>

        <div className="pillars-grid">
          {posts.map((post) => {
            const title = lang === "fr" && post.title_fr ? post.title_fr : post.title;
            const excerpt = lang === "fr" && post.excerpt_fr ? post.excerpt_fr : post.excerpt;
            
            return (
              <ScrollReveal key={post.id}>
                <div className="pillar-card" style={{ padding: 0, overflow: 'hidden' }}>
                  {post.featured_image_url && (
                    <div style={{ overflow: 'hidden', height: '180px' }}>
                      <img
                        src={post.featured_image_url}
                        alt={title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  )}
                  <div style={{ padding: '28px 32px 32px' }}>
                    <span className="pillar-icon" style={{ fontSize: "12px", fontFamily: "var(--font-space-mono,'Space Mono',monospace)", letterSpacing: ".24em", textTransform: "uppercase", color: "var(--gold)" }}>
                      {post.category}
                    </span>
                    <div className="pillar-name" style={{ fontSize: "22px" }}>{title}</div>
                    {excerpt && (
                      <p className="pillar-desc">{excerpt}</p>
                    )}
                    <div className="pillar-verse">
                      {new Date(post.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {" · "}
                      {post.read_time_minutes} {translations.minRead}
                    </div>
                    <Link href={`/blog/${post.slug}`} className="pillar-cta">
                      {translations.readReflection}
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
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
              {translations.viewAll}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
