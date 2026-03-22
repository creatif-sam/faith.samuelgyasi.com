// components/blog/SeriesSidebar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";

type BlogSeries = {
  id: string;
  name_en: string;
  name_fr: string;
  slug: string;
  description_en: string | null;
  description_fr: string | null;
  image_url: string | null;
  published: boolean;
  sort_order: number;
};

type BlogPost = {
  id: string;
  title: string;
  title_fr: string | null;
  slug: string;
  series_id: string | null;
  series_order: number | null;
};

export function SeriesSidebar() {
  const { lang } = useLang();
  const [series, setSeries] = useState<BlogSeries[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [expandedSeries, setExpandedSeries] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    Promise.all([
      // Fetch series
      supabase
        .from("blog_series")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true }),
      
      // Fetch posts that belong to series
      supabase
        .from("blog_posts")
        .select("id,title,title_fr,slug,series_id,series_order")
        .eq("published", true)
        .not("series_id", "is", null)
        .order("series_order", { ascending: true })
    ]).then(([seriesResult, postsResult]) => {
      if (seriesResult.data) setSeries(seriesResult.data as BlogSeries[]);
      if (postsResult.data) setPosts(postsResult.data as BlogPost[]);
      setLoading(false);
    });
  }, []);

  const toggleSeries = (seriesId: string) => {
    const newExpanded = new Set(expandedSeries);
    if (newExpanded.has(seriesId)) {
      newExpanded.delete(seriesId);
    } else {
      newExpanded.add(seriesId);
    }
    setExpandedSeries(newExpanded);
  };

  const getSeriesName = (s: BlogSeries) => lang === "fr" ? s.name_fr : s.name_en;
  const getPostTitle = (p: BlogPost) => lang === "fr" && p.title_fr ? p.title_fr : p.title;
  const getSeriesPosts = (seriesId: string) => 
    posts.filter(p => p.series_id === seriesId).sort((a, b) => (a.series_order ?? 0) - (b.series_order ?? 0));

  if (loading) {
    return (
      <aside className="series-sidebar">
        <div className="series-sidebar-header">
          <Folder size={18} />
          <h3>{lang === "fr" ? "Séries" : "Series"}</h3>
        </div>
        <div className="series-loading">{lang === "fr" ? "Chargement..." : "Loading..."}</div>
      </aside>
    );
  }

  if (series.length === 0) {
    return null;
  }

  return (
    <aside className="series-sidebar">
      <div className="series-sidebar-header">
        <Folder size={18} />
        <h3>{lang === "fr" ? "Séries de Blog" : "Blog Series"}</h3>
      </div>
      
      <div className="series-list">
        {series.map((s) => {
          const isExpanded = expandedSeries.has(s.id);
          const seriesPosts = getSeriesPosts(s.id);
          const postCount = seriesPosts.length;

          return (
            <div key={s.id} className="series-item">
              <div 
                className="series-item-header"
                onClick={() => toggleSeries(s.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleSeries(s.id);
                  }
                }}
              >
                <div className="series-item-toggle">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
                <div className="series-item-content">
                  <Link 
                    href={`/blog?series=${s.slug}`}
                    className="series-item-name"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {getSeriesName(s)}
                  </Link>
                  <div className="series-item-count">
                    {postCount} {lang === "fr" ? "article" + (postCount > 1 ? "s" : "") : "post" + (postCount > 1 ? "s" : "")}
                  </div>
                </div>
              </div>
              
              {isExpanded && postCount > 0 && (
                <div className="series-posts">
                  {seriesPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="series-post-item"
                    >
                      <span className="series-post-number">{index + 1}</span>
                      <span className="series-post-title">{getPostTitle(post)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <style jsx>{`
        .series-sidebar {
          background: var(--card, #0b0c12);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 24px;
          position: sticky;
          top: 100px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
        }

        .series-sidebar-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          color: var(--gold, #d4a843);
        }

        .series-sidebar-header h3 {
          font-family: var(--font-poppins), 'Poppins', sans-serif;
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .series-loading {
          font-family: var(--font-poppins), 'Poppins', sans-serif;
          font-size: 14px;
          color: var(--dim, rgba(255, 255, 255, 0.5));
          text-align: center;
          padding: 20px;
        }

        .series-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .series-item {
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .series-item:hover {
          border-color: rgba(212, 168, 67, 0.2);
          background: rgba(212, 168, 67, 0.03);
        }

        .series-item-header {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 12px;
          cursor: pointer;
          user-select: none;
        }

        .series-item-toggle {
          color: var(--gold, #d4a843);
          flex-shrink: 0;
          margin-top: 2px;
          transition: transform 0.2s ease;
        }

        .series-item-content {
          flex: 1;
          min-width: 0;
        }

        .series-item-name {
          font-family: var(--font-playfair), 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--cream, #f0ece4);
          text-decoration: none;
          display: block;
          margin-bottom: 4px;
          line-height: 1.3;
          word-wrap: break-word;
          transition: color 0.2s ease;
        }

        .series-item-name:hover {
          color: var(--gold, #d4a843);
        }

        .series-item-count {
          font-family: var(--font-poppins), 'Poppins', sans-serif;
          font-size: 11px;
          color: var(--dimmer, rgba(255, 255, 255, 0.4));
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .series-posts {
          padding: 8px 12px 12px 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .series-post-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 4px;
          text-decoration: none;
          color: var(--dim, rgba(255, 255, 255, 0.6));
          font-family: var(--font-poppins), 'Poppins', sans-serif;
          font-size: 13px;
          line-height: 1.4;
          transition: all 0.2s ease;
        }

        .series-post-item:hover {
          background: rgba(212, 168, 67, 0.08);
          color: var(--cream, #f0ece4);
          padding-left: 14px;
        }

        .series-post-number {
          font-size: 11px;
          font-weight: 600;
          color: var(--gold, #d4a843);
          flex-shrink: 0;
          min-width: 20px;
        }

        .series-post-title {
          flex: 1;
          min-width: 0;
          word-wrap: break-word;
        }

        /* Scrollbar styling */
        .series-sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .series-sidebar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 3px;
        }

        .series-sidebar::-webkit-scrollbar-thumb {
          background: rgba(212, 168, 67, 0.3);
          border-radius: 3px;
        }

        .series-sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 168, 67, 0.5);
        }

        @media (max-width: 1024px) {
          .series-sidebar {
            position: relative;
            top: 0;
            max-height: none;
            margin-bottom: 40px;
          }
        }
      `}</style>
    </aside>
  );
}
