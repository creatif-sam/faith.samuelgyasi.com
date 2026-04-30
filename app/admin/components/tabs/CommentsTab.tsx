import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { BlogComment, BlogPost } from "../types";

interface CommentsTabProps {
  comments: BlogComment[];
  posts: BlogPost[];
  onApprove: (id: string) => Promise<void>;
  onDelete: (id: string) => void;
}

export default function CommentsTab({ comments, posts, onApprove, onDelete }: CommentsTabProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  const filtered = comments.filter((c) => {
    if (filter === "pending")  return !c.approved;
    if (filter === "approved") return c.approved;
    return true;
  });

  const pending  = comments.filter((c) => !c.approved).length;
  const approved = comments.filter((c) => c.approved).length;

  const FILTERS = [
    { id: "pending"  as const, label: `Pending (${pending})` },
    { id: "approved" as const, label: `Approved (${approved})` },
    { id: "all"      as const, label: `All (${comments.length})` },
  ];

  function getPostTitle(postId: string) {
    return posts.find((p) => p.id === postId)?.title ?? "Unknown Post";
  }

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Blog Comments</div>
          <p className={TW.pgSub}>{pending} pending · {comments.length} total</p>
        </div>
      </div>

      <div className="flex gap-0 border-b border-white/[.08] mb-6 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "font-mono text-[9px] tracking-[.2em] uppercase px-5 py-3 bg-transparent border-0 cursor-pointer transition-colors whitespace-nowrap",
              filter === f.id
                ? "text-[#c9a84c] border-b-2 border-[#c9a84c]"
                : "text-white/35 border-b-2 border-transparent"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className={TW.empty}>No comments here.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((c) => (
            <div key={c.id} className={cn(TW.msgCard, c.approved && "opacity-60")}>
              <div className={TW.msgHead}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn(TW.badge, c.approved ? TW.bPub : TW.bNew)}>
                      {c.approved ? "Approved" : "Pending"}
                    </span>
                    <span className="font-poppins text-[13px] font-semibold" style={{ color: "var(--adm-text)" }}>
                      {c.commenter_name}
                    </span>
                    {c.commenter_email && (
                      <span className="font-mono text-[9px] text-white/40">{c.commenter_email}</span>
                    )}
                  </div>
                  <span className="font-poppins text-[10px] text-white/35 italic">
                    on: {getPostTitle(c.blog_post_id)}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-white/25 whitespace-nowrap">
                  {new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>

              <p className={TW.msgBody}>{c.comment_text}</p>

              <div className={cn(TW.actRow, "mt-3 pt-3 border-t border-white/[.05]")}>
                {!c.approved && (
                  <button
                    className={cn(TW.btn, TW.gold, TW.sm)}
                    onClick={() => onApprove(c.id)}
                  >
                    <Check size={9} /> Approve
                  </button>
                )}
                <button
                  className={cn(TW.btn, TW.danger, TW.sm)}
                  onClick={() => onDelete(c.id)}
                >
                  <Trash2 size={9} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
