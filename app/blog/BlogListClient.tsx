"use client";
import { blogStyles } from "./blogStyles";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n";
import { localizedHref } from "@/lib/i18n/locale";
import Breadcrumbs from "@/components/atoms/Breadcrumbs";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { SeriesSidebar } from "@/components/blog/SeriesSidebar";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { Suspense } from "react";
import { BlogRequestModal } from "@/components/organisms/BlogRequestModal";
import type { DbPost, BlogSeries } from "./blogHelpers";
import { CATEGORY_LABELS } from "./blogHelpers";
import FeaturedPost from "./components/FeaturedPost";
import PostCard from "./components/PostCard";

interface BlogContentProps {
  initialPosts: DbPost[];
  initialSeriesList: BlogSeries[];
}

function BlogContent({ initialPosts, initialSeriesList }: BlogContentProps) {
  const { lang } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const seriesSlug = searchParams?.get("series");
  const activeCat = searchParams?.get("category") ?? "all";

  const [posts, setPosts] = useState<DbPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [currentSeries, setCurrentSeries] = useState<BlogSeries | null>(null);
  const [seriesList, setSeriesList] = useState<BlogSeries[]>(initialSeriesList);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [showBlogRequestModal, setShowBlogRequestModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(7);

  useEffect(() => {
    document.body.classList.add("on-fdp");
    return () => document.body.classList.remove("on-fdp");
  }, []);

  useEffect(() => {
    const supabase = createClient();
    if (seriesSlug) {
      supabase.from("blog_series").select("*").eq("slug", seriesSlug).eq("published", true).single()
        .then(({ data, error }) => { if (!error && data) setCurrentSeries(data as BlogSeries); });
    } else {
      setCurrentSeries(null);
    }
    supabase.from("blog_posts")
      .select("id,title,title_fr,slug,category,excerpt,excerpt_fr,read_time_minutes,featured_image_url,youtube_url,created_at,series_id,series_order")
      .eq("published", true).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) { setPosts(data); setLoading(false); } });
    supabase.from("blog_series")
      .select("id,name_en,name_fr,slug,description_en,description_fr,image_url,show_dates,sort_order")
      .eq("published", true).order("sort_order", { ascending: true })
      .then(({ data }) => { if (data) { setSeriesList(data as BlogSeries[]); setSeriesLoading(false); } });
  }, [seriesSlug]);

  const seriesMap = useMemo(() => {
    const map: Record<string, { name_en: string; name_fr: string }> = {};
    seriesList.forEach((s) => { map[s.id] = { name_en: s.name_en, name_fr: s.name_fr }; });
    return map;
  }, [seriesList]);

  const getSeriesBadge = (post: DbPost) => {
    if (!post.series_id) return null;
    const s = seriesMap[post.series_id];
    if (!s) return null;
    return lang === "fr" ? s.name_fr : s.name_en;
  };

  let baseFiltered = posts;
  if (currentSeries) {
    baseFiltered = posts.filter((p) => p.series_id === currentSeries.id);
    baseFiltered.sort((a, b) => (a.series_order ?? 0) - (b.series_order ?? 0));
  }
  const filtered = activeCat === "all" ? baseFiltered : baseFiltered.filter((p) => p.category === activeCat);
  const getTitle = (post: DbPost) => lang === "fr" && post.title_fr ? post.title_fr : post.title;
  const getExcerpt = (post: DbPost) => lang === "fr" && post.excerpt_fr ? post.excerpt_fr : post.excerpt;
  const searchFiltered = searchQuery.trim()
    ? filtered.filter((p) => {
        const q = searchQuery.toLowerCase();
        return getTitle(p).toLowerCase().includes(q) || (getExcerpt(p)?.toLowerCase() ?? "").includes(q) || p.category.toLowerCase().includes(q);
      })
    : filtered;

  const featured = searchFiltered[0];
  const rest = searchFiltered.slice(1, visibleCount);
  const hasMore = searchFiltered.length > visibleCount;
  const resetVisible = () => setVisibleCount(7);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => { counts[p.category] = (counts[p.category] ?? 0) + 1; });
    return counts;
  }, [posts]);

  // Known categories keep the curated order declared in CATEGORY_LABELS;
  // any freeform ones (added via the admin's "+ New category" field) are
  // appended after, most-used first, instead of everything being alphabetical.
  const categoryValues = useMemo(() => {
    const known = Object.keys(CATEGORY_LABELS).filter((c) => categoryCounts[c] > 0);
    const unknown = Object.keys(categoryCounts)
      .filter((c) => !CATEGORY_LABELS[c])
      .sort((a, b) => categoryCounts[b] - categoryCounts[a]);
    return [...known, ...unknown];
  }, [categoryCounts]);

  // Sitewide latest 5 posts for the sidebar widget — independent of the
  // active category/series filter, like a WordPress "Recent Posts" widget.
  const recentPosts = useMemo(() => posts.slice(0, 5), [posts]);

  function setCategory(cat: string) {
    const params = new URLSearchParams(searchParams?.toString());
    if (cat === "all") params.delete("category"); else params.set("category", cat);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname ?? "/blog", { scroll: false });
    resetVisible();
  }

  const getSeriesName = () => lang === "fr" ? currentSeries?.name_fr : currentSeries?.name_en;
  const getSeriesDescription = () => lang === "fr" ? currentSeries?.description_fr : currentSeries?.description_en;
  const showDates = !currentSeries || currentSeries.show_dates;

  return (
    <div className="fdp" style={{ minHeight: "100vh" }}>
      <style>{blogStyles}</style>
      <div className="fb-container">
        <Breadcrumbs items={[
          { label: lang === "fr" ? "Accueil" : "Home", href: localizedHref(lang, "/") },
          { label: lang === "fr" ? "Foi" : "Faith", href: localizedHref(lang, "/faith") },
          { label: lang === "fr" ? "Journal" : "Journal" },
        ]} />
      </div>
      <header className="fb-header">
        {currentSeries ? (
          <>
            {currentSeries.image_url && (
              <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto 40px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                <img src={currentSeries.image_url} alt={getSeriesName()} style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} />
              </div>
            )}
            <div className="fb-eyebrow">{lang === "fr" ? "Série" : "Series"}</div>
            <h1 className="fb-title"><span>{getSeriesName()}</span></h1>
            {getSeriesDescription() && <p className="fb-subtitle">{getSeriesDescription()}</p>}
            <div style={{ marginTop: "20px" }}>
              <Link href={localizedHref(lang, "/blog")} className="fb-series-back"
                style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", transition: "all 0.3s ease" }}
              >
                <ArrowLeft size={13} /> {lang === "fr" ? "Tous les articles" : "All Posts"}
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="fb-eyebrow">{lang === "fr" ? "Journal de Foi" : "Faith Journal"}</div>
            <h1 className="fb-title">
              <span>{lang === "fr" ? "Mots Qui" : "Words That"}</span><br />
              <em>{lang === "fr" ? "Ancrent" : "Anchor"}</em>
            </h1>
            <p className="fb-subtitle">
              {lang === "fr"
                ? "Réflexions sur les Écritures, la conviction sacrée et la pratique quotidienne de faire confiance à Dieu à chaque pas."
                : "Reflections on scripture, sacred conviction, and the daily practice of trusting God with every step."}
            </p>
            <div style={{ marginTop: "32px" }}>
              <button onClick={() => setShowBlogRequestModal(true)} className="fb-request-btn">
                {lang === "fr" ? "Demander un sujet de blog" : "Request a Blog Topic"}
              </button>
            </div>
          </>
        )}
      </header>
      <div className="fb-search-container">
        <div className="fb-search-wrapper">
          <svg className="fb-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" className="fb-search-input"
            placeholder={lang === "fr" ? "Rechercher des réflexions..." : "Search reflections..."}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); resetVisible(); }}
          />
          {searchQuery && <button className="fb-search-clear" onClick={() => setSearchQuery("")} aria-label="Clear search"><X size={14} /></button>}
        </div>
        {searchQuery && (
          <p className="fb-search-results">{searchFiltered.length} {lang === "fr" ? "résultat(s) trouvé(s)" : "result(s) found"}</p>
        )}
      </div>
      <div className="fb-layout-with-sidebar">
        <BlogSidebar
          categoryValues={categoryValues}
          categoryCounts={categoryCounts}
          totalCount={posts.length}
          activeCategory={activeCat}
          onSelectCategory={setCategory}
          recentPosts={recentPosts}
        />
        <div className="fb-main-content">
          {loading ? (
            <p className="fb-empty">{lang === "fr" ? "Chargement des réflexions..." : "Loading reflections..."}</p>
          ) : searchFiltered.length === 0 ? (
            <p className="fb-empty">
              {searchQuery
                ? (lang === "fr" ? "Aucun résultat pour votre recherche." : "No results found for your search.")
                : (lang === "fr" ? "Aucune réflexion dans cette catégorie pour le moment." : "No reflections in this category yet.")}
            </p>
          ) : (
            <div className="fb-content">
              {featured && <FeaturedPost post={featured} lang={lang} showDates={showDates} getTitle={getTitle} getExcerpt={getExcerpt} seriesName={currentSeries ? null : getSeriesBadge(featured)} />}
              {rest.length > 0 && (
                <div className="fb-grid">
                  {rest.map((post) => (
                    <PostCard key={post.slug} post={post} lang={lang} showDates={showDates} getTitle={getTitle} getExcerpt={getExcerpt} seriesName={currentSeries ? null : getSeriesBadge(post)} />
                  ))}
                </div>
              )}
              {hasMore && (
                <div style={{ textAlign: "center", padding: "40px 0 20px" }}>
                  <button className="fb-load-more" onClick={() => setVisibleCount((v) => v + 6)}>
                    {lang === "fr" ? "Charger plus" : "Load more"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <SeriesSidebar series={seriesList} posts={posts} loading={seriesLoading} />
      </div>
      <Suspense fallback={null}><SiteFooter /></Suspense>
      {showBlogRequestModal && <BlogRequestModal onClose={() => setShowBlogRequestModal(false)} lang={lang} />}
    </div>
  );
}

export default function BlogListClient(props: BlogContentProps) {
  return (
    <Suspense fallback={
      <div className="fdp" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#f0ece4", fontFamily: "'Poppins', sans-serif" }}>Loading...</p>
      </div>
    }>
      <BlogContent {...props} />
    </Suspense>
  );
}
