// components/blog/BlogSidebar.tsx — left sidebar: category list + recent posts (WordPress-style widgets)
"use client";

import Link from "next/link";
import { Tags, Clock, BookOpen } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { localizedHref } from "@/lib/i18n/locale";
import type { DbPost } from "@/app/blog/blogHelpers";
import { getPostImage, getCategoryLabel } from "@/app/blog/blogHelpers";

interface BlogSidebarProps {
  categoryValues: string[];
  categoryCounts: Record<string, number>;
  totalCount: number;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  recentPosts: DbPost[];
}

export function BlogSidebar({
  categoryValues,
  categoryCounts,
  totalCount,
  activeCategory,
  onSelectCategory,
  recentPosts,
}: BlogSidebarProps) {
  const { lang } = useLang();
  const getTitle = (p: DbPost) => (lang === "fr" && p.title_fr ? p.title_fr : p.title);
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <aside className="blog-sidebar">
      {/* ── CATEGORIES WIDGET ── */}
      <div className="bsw">
        <div className="bsw-header">
          <Tags size={17} />
          <h3>{lang === "fr" ? "Catégories" : "Categories"}</h3>
        </div>
        <ul className="bsw-cat-list">
          <li>
            <button
              className={`bsw-cat-btn${activeCategory === "all" ? " active" : ""}`}
              onClick={() => onSelectCategory("all")}
            >
              <span>{lang === "fr" ? "Tout" : "All"}</span>
              <span className="bsw-cat-count">{totalCount}</span>
            </button>
          </li>
          {categoryValues.map((cat) => (
            <li key={cat}>
              <button
                className={`bsw-cat-btn${activeCategory === cat ? " active" : ""}`}
                onClick={() => onSelectCategory(cat)}
              >
                <span>{getCategoryLabel(cat, lang)}</span>
                <span className="bsw-cat-count">{categoryCounts[cat] ?? 0}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── RECENT POSTS WIDGET ── */}
      {recentPosts.length > 0 && (
        <div className="bsw">
          <div className="bsw-header">
            <Clock size={17} />
            <h3>{lang === "fr" ? "Articles Récents" : "Recent Posts"}</h3>
          </div>
          <ul className="bsw-recent-list">
            {recentPosts.map((post) => {
              const img = getPostImage(post);
              return (
                <li key={post.id}>
                  <Link href={localizedHref(lang, `/blog/${post.slug}`)} className="bsw-recent-item">
                    <div className="bsw-recent-thumb">
                      {img ? (
                        <img src={img.url} alt={getTitle(post)} />
                      ) : (
                        <BookOpen size={16} />
                      )}
                    </div>
                    <div className="bsw-recent-body">
                      <span className="bsw-recent-title">{getTitle(post)}</span>
                      <span className="bsw-recent-date">{fmt(post.created_at)}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <style jsx>{`
        .blog-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: sticky;
          top: 100px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
        }

        .bsw {
          background: var(--card, #0b0c12);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 24px;
        }

        .bsw-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          color: var(--gold, #546cfa);
        }

        .bsw-header h3 {
          font-family: var(--font-poppins), 'Poppins', sans-serif;
          font-size: 15px;
          font-weight: 600;
          margin: 0;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .bsw-cat-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .bsw-cat-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          background: transparent;
          border: none;
          border-radius: 6px;
          padding: 9px 10px;
          cursor: pointer;
          text-align: left;
          font-family: var(--font-poppins), 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: var(--dim, rgba(255, 255, 255, 0.6));
          transition: all 0.2s ease;
        }

        .bsw-cat-btn:hover {
          background: rgba(84, 108, 250, 0.06);
          color: var(--cream, #f0ece4);
        }

        .bsw-cat-btn.active {
          background: rgba(84, 108, 250, 0.1);
          color: var(--gold, #546cfa);
          font-weight: 600;
        }

        .bsw-cat-count {
          font-size: 11px;
          color: var(--dimmer, rgba(255, 255, 255, 0.35));
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 1px 8px;
          flex-shrink: 0;
        }

        .bsw-cat-btn.active .bsw-cat-count {
          color: var(--gold, #546cfa);
          background: rgba(84, 108, 250, 0.15);
        }

        .bsw-recent-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .bsw-recent-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s ease;
        }

        .bsw-recent-item:hover {
          background: rgba(84, 108, 250, 0.06);
        }

        .bsw-recent-thumb {
          flex-shrink: 0;
          width: 52px;
          height: 52px;
          border-radius: 6px;
          overflow: hidden;
          background: rgba(84, 108, 250, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(84, 108, 250, 0.4);
        }

        .bsw-recent-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .bsw-recent-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .bsw-recent-title {
          font-family: var(--font-poppins), 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.35;
          color: var(--cream, #f0ece4);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .bsw-recent-item:hover .bsw-recent-title {
          color: var(--gold, #546cfa);
        }

        .bsw-recent-date {
          font-family: var(--font-poppins), 'Poppins', sans-serif;
          font-size: 10px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--dimmer, rgba(255, 255, 255, 0.35));
        }

        .blog-sidebar::-webkit-scrollbar {
          width: 6px;
        }
        .blog-sidebar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 3px;
        }
        .blog-sidebar::-webkit-scrollbar-thumb {
          background: rgba(84, 108, 250, 0.3);
          border-radius: 3px;
        }
        .blog-sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(84, 108, 250, 0.5);
        }

        @media (max-width: 1024px) {
          .blog-sidebar {
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
