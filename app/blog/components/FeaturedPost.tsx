import Link from "next/link";
import Image from "next/image";
import { BookOpen, Folder } from "lucide-react";
import type { DbPost } from "../blogHelpers";
import { getPostImage, getCategoryLabel } from "../blogHelpers";

interface FeaturedPostProps {
  post: DbPost;
  lang: "en" | "fr";
  showDates: boolean;
  getTitle: (p: DbPost) => string;
  getExcerpt: (p: DbPost) => string | null | undefined;
  seriesName?: string | null;
}

export default function FeaturedPost({ post, lang, showDates, getTitle, getExcerpt, seriesName }: FeaturedPostProps) {
  const img = getPostImage(post);
  return (
    <Link href={`/${lang}/blog/${post.slug}`} className="fb-featured">
      <div className="fb-featured-cover">
        {img ? (
          <Image
            src={img.url}
            alt={getTitle(post)}
            fill
            sizes="(max-width: 900px) 100vw, 900px"
            className="fb-featured-cover-img"
            priority
          />
        ) : (
          <div className="fb-cover-placeholder"><BookOpen size={48} /></div>
        )}
        {img?.isYoutube && (
          <div className="fb-yt-play">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </div>
        )}
      </div>
      <div className="fb-featured-tag">{getCategoryLabel(post.category, lang)}</div>
      {seriesName && <div className="fb-series-badge"><Folder size={10} />{seriesName}</div>}
      <h2 className="fb-featured-title">{getTitle(post)}</h2>
      {getExcerpt(post) && <p className="fb-featured-excerpt">{getExcerpt(post)}</p>}
      <div className="fb-meta">
        {showDates && (
          <>
            <span>
              {new Date(post.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </span>
            <span>.</span>
          </>
        )}
        <span>{post.read_time_minutes} min {lang === "fr" ? "de lecture" : "read"}</span>
      </div>
    </Link>
  );
}
