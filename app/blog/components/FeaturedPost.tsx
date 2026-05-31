import Link from "next/link";
import type { DbPost } from "../blogHelpers";
import { getPostImage } from "../blogHelpers";

interface FeaturedPostProps {
  post: DbPost;
  lang: string;
  showDates: boolean;
  getTitle: (p: DbPost) => string;
  getExcerpt: (p: DbPost) => string | null | undefined;
}

export default function FeaturedPost({ post, lang, showDates, getTitle, getExcerpt }: FeaturedPostProps) {
  const img = getPostImage(post);
  return (
    <Link href={`/blog/${post.slug}`} className="fb-featured">
      {img && (
        <div className="fb-featured-cover">
          <img src={img.url} alt={getTitle(post)} className="fb-featured-cover-img" />
          {img.isYoutube && (
            <div className="fb-yt-play">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
          )}
        </div>
      )}
      <div className="fb-featured-tag">{post.category}</div>
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
