import Link from "next/link";
import { BookOpen, Folder } from "lucide-react";
import type { DbPost } from "../blogHelpers";
import { getPostImage } from "../blogHelpers";

interface PostCardProps {
  post: DbPost;
  lang: string;
  showDates: boolean;
  getTitle: (p: DbPost) => string;
  getExcerpt: (p: DbPost) => string | null | undefined;
  seriesName?: string | null;
}

export default function PostCard({ post, lang, showDates, getTitle, getExcerpt, seriesName }: PostCardProps) {
  const img = getPostImage(post);
  return (
    <Link key={post.slug} href={`/blog/${post.slug}`} className="fb-card">
      <div className="fb-card-cover">
        {img ? (
          <img src={img.url} alt={getTitle(post)} className="fb-card-cover-img" />
        ) : (
          <div className="fb-cover-placeholder"><BookOpen size={32} /></div>
        )}
        {img?.isYoutube && (
          <div className="fb-yt-play">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </div>
        )}
      </div>
      <div className="fb-card-tag">{post.category}</div>
      {seriesName && <div className="fb-series-badge"><Folder size={10} />{seriesName}</div>}
      <h3 className="fb-card-title">{getTitle(post)}</h3>
      {getExcerpt(post) && <p className="fb-card-excerpt">{getExcerpt(post)}</p>}
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
        <span>{post.read_time_minutes} min</span>
      </div>
    </Link>
  );
}
