import { useState, useEffect } from "react";
import { X, Star, Plus, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import type { BlogReview } from "../types";
import type { SupabaseClient } from "@supabase/supabase-js";

interface BlogReviewsModalProps {
  postId: string;
  postTitle: string;
  onClose: () => void;
  db: SupabaseClient;
}

export default function BlogReviewsModal({ postId, postTitle, onClose, db }: BlogReviewsModalProps) {
  const [reviews, setReviews] = useState<BlogReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [postId]);

  async function loadReviews() {
    setLoading(true);
    const { data, error } = await db
      .from("blog_reviews")
      .select("*")
      .eq("blog_post_id", postId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load reviews");
      console.error(error);
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSubmitting(true);
    const { error } = await db.from("blog_reviews").insert({
      blog_post_id: postId,
      reviewer_name: name.trim(),
      reviewer_email: email.trim() || null,
      rating,
      comment: comment.trim() || null,
      published: false, // Reviews start as unpublished for moderation
    });

    if (error) {
      toast.error("Failed to add review");
      console.error(error);
    } else {
      toast.success("Review added");
      setName("");
      setEmail("");
      setRating(5);
      setComment("");
      setShowForm(false);
      await loadReviews();
    }
    setSubmitting(false);
  }

  async function togglePublished(id: string, published: boolean) {
    const { error } = await db
      .from("blog_reviews")
      .update({ published })
      .eq("id", id);

    if (error) {
      toast.error("Update failed");
    } else {
      toast.success(published ? "Published" : "Unpublished");
      await loadReviews();
    }
  }

  async function deleteReview(id: string) {
    if (!confirm("Delete this review?")) return;

    const { error } = await db.from("blog_reviews").delete().eq("id", id);

    if (error) {
      toast.error("Delete failed");
    } else {
      toast.success("Review deleted");
      await loadReviews();
    }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "N/A";

  const publishedCount = reviews.filter((r) => r.published).length;

  return (
    <div className={TW.overlay} onClick={onClose}>
      <div
        className={cn(TW.modal, "max-w-[900px]")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className={TW.fTitle}>Reviews for "{postTitle}"</h2>
            <div className="flex gap-4 mt-3 text-sm">
              <span className="text-white/50">
                <Star size={14} className="inline mr-1 text-yellow-500" />
                Avg: <strong className="text-white/80">{avgRating}</strong>
              </span>
              <span className="text-white/50">
                Total: <strong className="text-white/80">{reviews.length}</strong>
              </span>
              <span className="text-white/50">
                Published: <strong className="text-white/80">{publishedCount}</strong>
              </span>
            </div>
          </div>
          <button
            className={TW.iconBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {!showForm ? (
          <button
            className={cn(TW.btn, TW.gold, "mb-6")}
            onClick={() => setShowForm(true)}
          >
            <Plus size={12} /> Add Review
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/[.02] border border-white/[.06] rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-poppins text-base font-semibold text-white/90">New Review</h3>
              <button
                type="button"
                className={TW.iconBtn}
                onClick={() => setShowForm(false)}
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className={TW.field}>
                <label className={TW.label}>Reviewer Name *</label>
                <input
                  className={TW.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className={TW.field}>
                <label className={TW.label}>Email (optional)</label>
                <input
                  type="email"
                  className={TW.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className={TW.field}>
              <label className={TW.label}>Rating (1-5)</label>
              <div className="flex gap-2 items-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className="bg-transparent border-0 cursor-pointer text-2xl p-0"
                    style={{ color: n <= rating ? "#fbbf24" : "rgba(251,191,36,.2)" }}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-white/60 text-sm">{rating} star{rating !== 1 ? "s" : ""}</span>
              </div>
            </div>

            <div className={TW.field}>
              <label className={TW.label}>Comment (optional)</label>
              <textarea
                className={cn(TW.tarea, "min-h-[120px]")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you think of this post?"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className={cn(TW.btn, TW.ghost)}
                onClick={() => setShowForm(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={cn(TW.btn, TW.gold)}
                disabled={submitting}
              >
                {submitting ? "Adding..." : "Add Review"}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12 text-white/40">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <p className={TW.empty}>No reviews yet. Add the first one!</p>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={cn(
                  "bg-white/[.02] border border-white/[.06] rounded-lg p-5",
                  !review.published && "opacity-60"
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-poppins font-semibold text-white/90 flex items-center gap-2">
                      {review.reviewer_name}
                      {!review.published && (
                        <span className={cn(TW.badge, TW.bDft, "text-[9px]")}>Draft</span>
                      )}
                    </div>
                    {review.reviewer_email && (
                      <div className="text-xs text-white/40 mt-0.5">{review.reviewer_email}</div>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      className={cn(TW.btn, TW.ghost, TW.sm)}
                      onClick={() => togglePublished(review.id, !review.published)}
                      title={review.published ? "Unpublish" : "Publish"}
                    >
                      <Eye size={10} className={review.published ? "opacity-100" : "opacity-40"} />
                    </button>
                    <button
                      className={cn(TW.btn, TW.danger, TW.sm)}
                      onClick={() => deleteReview(review.id)}
                      title="Delete"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className="text-lg"
                      style={{ color: n <= review.rating ? "#fbbf24" : "rgba(251,191,36,.2)" }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {review.comment && (
                  <p className="text-sm text-white/70 leading-relaxed">{review.comment}</p>
                )}

                <div className="text-xs text-white/30 mt-3">
                  {new Date(review.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-white/[.06] flex justify-end">
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
