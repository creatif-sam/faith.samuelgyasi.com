import { useState, useEffect } from "react";
import { X, Pencil, Eye, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { BlogSeries, BlogPost } from "../types";
import { createClient } from "@/lib/supabase/client";

interface BlogSeriesDetailModalProps {
  series: BlogSeries;
  onClose: () => void;
  onEditPost?: (post: BlogPost) => void;
  db: ReturnType<typeof createClient>;
}

export default function BlogSeriesDetailModal({ 
  series, 
  onClose, 
  onEditPost,
  db 
}: BlogSeriesDetailModalProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [series.id]);

  async function loadPosts() {
    setLoading(true);
    const { data, error } = await db
      .from("blog_posts")
      .select("*")
      .eq("series_id", series.id)
      .order("series_order", { ascending: true });
    
    if (!error && data) {
      setPosts(data as BlogPost[]);
    }
    setLoading(false);
  }

  const publishedPosts = posts.filter(p => p.published).length;

  return (
    <div className={TW.overlay} onClick={onClose}>
      <div 
        className={cn(TW.panel, "max-w-[900px]")} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={TW.pHead}>
          <div>
            <div className={TW.fTitle}>Series Details</div>
            <p className="text-[11px] text-white/40 mt-1">
              {publishedPosts} published · {posts.length} total posts
            </p>
          </div>
          <button className={TW.iconBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className={TW.pBody}>
          {/* Series Info */}
          <div className="bg-white/[.03] border border-white/[.08] rounded-lg p-5 mb-6">
            <div className="flex items-start gap-5">
              {series.image_url && (
                <div className="flex-shrink-0">
                  <img 
                    src={series.image_url} 
                    alt={series.name_en}
                    className="w-32 h-32 object-cover rounded-lg border border-white/10"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-[18px] font-semibold text-[#f0ece4] mb-1">
                      {series.name_en}
                    </h2>
                    <p className="text-[14px] text-white/50">
                      {series.name_fr}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={cn(
                      TW.badge,
                      series.published ? TW.bPub : TW.bDft
                    )}>
                      {series.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                
                {series.description_en && (
                  <div className="mb-2">
                    <p className="text-[12px] text-white/70 leading-relaxed">
                      {series.description_en}
                    </p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-white/40">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[#c9a84c]">/{series.slug}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    <span>Dates: {series.show_dates ? "Visible" : "Hidden"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>Order: {series.sort_order}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div>
            <h3 className="text-[13px] font-semibold text-white/60 uppercase tracking-wider mb-4">
              Posts in This Series ({posts.length})
            </h3>
            
            {loading ? (
              <div className="text-center py-8 text-white/40">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#c9a84c] border-t-transparent mx-auto mb-2" />
                Loading posts...
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-white/30 bg-white/[.02] rounded-lg border border-white/[.05]">
                <Eye size={32} className="mx-auto mb-3 opacity-20" />
                <p>No posts in this series yet.</p>
                <p className="text-[11px] mt-1">Assign posts to this series when creating or editing them.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {posts.map((post, index) => (
                  <div
                    key={post.id}
                    className="bg-white/[.02] hover:bg-white/[.05] border border-white/[.08] rounded-lg p-4 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Order Number */}
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded text-[#c9a84c] text-[13px] font-semibold">
                        {post.series_order ?? index + 1}
                      </div>

                      {/* Thumbnail */}
                      {post.featured_image_url && (
                        <div className="flex-shrink-0">
                          <img 
                            src={post.featured_image_url} 
                            alt={post.title}
                            className="w-16 h-16 object-cover rounded border border-white/10"
                          />
                        </div>
                      )}

                      {/* Post Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[14px] font-semibold text-[#f0ece4] truncate mb-0.5">
                              {post.title}
                            </h4>
                            {post.title_fr && (
                              <p className="text-[12px] text-white/40 truncate">
                                {post.title_fr}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              TW.badge,
                              TW.sm,
                              post.published ? TW.bPub : TW.bDft
                            )}>
                              {post.published ? "Published" : "Draft"}
                            </span>
                            {onEditPost && (
                              <button
                                onClick={() => onEditPost(post)}
                                className={cn(TW.btn, TW.ghost, TW.sm, "opacity-0 group-hover:opacity-100")}
                                title="Edit post"
                              >
                                <Pencil size={10} />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 text-[11px] text-white/40">
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-0.5 bg-white/5 rounded text-[10px]">
                              {post.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={11} />
                            <span>{post.read_time_minutes} min read</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={11} />
                            <span>
                              {new Date(post.created_at).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[#c9a84c]/60">/{post.slug}</span>
                          </div>
                        </div>
                        
                        {post.excerpt && (
                          <p className="text-[11px] text-white/50 mt-2 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
