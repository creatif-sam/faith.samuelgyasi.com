import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { BlogPost } from "../types";

interface PostsTabProps {
  posts: BlogPost[];
  onNew: () => void;
  onEdit: (p: BlogPost) => void;
  onDelete: (id: string, title: string) => void;
  onToggle: (id: string, val: boolean) => Promise<void>;
  onViewReviews?: (p: BlogPost) => void;
}

export default function PostsTab({ posts, onNew, onEdit, onDelete, onToggle, onViewReviews }: PostsTabProps) {
  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div><div className={TW.pgTitle}>Blog Posts</div><p className={TW.pgSub}>{posts.length} post{posts.length !== 1 ? "s" : ""}</p></div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}><Plus size={10} />New Post</button>
      </div>
      {posts.length === 0 ? <p className={TW.empty}>No posts yet.</p> : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead><tr><th className={TW.th}>Title</th><th className={TW.th}>Cat.</th><th className={TW.th}>Status</th><th className={TW.th}>Date</th><th className={TW.th}>Actions</th></tr></thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                  <td className={TW.td} style={{ color: "#f0ece4", maxWidth: "240px" }}>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">{p.title}</div>
                    <div className="text-[10px] text-white/25 font-mono mt-0.5">/{p.category}/blog/{p.slug}</div>
                  </td>
                  <td className={TW.td} style={{ textTransform: "capitalize" }}>{p.category}</td>
                  <td className={TW.td}><span className={cn(TW.badge, p.published ? TW.bPub : TW.bDft)}>{p.published ? "Published" : "Draft"}</span></td>
                  <td className={TW.td}>{new Date(p.created_at).toLocaleDateString("en-GB")}</td>
                  <td className={TW.td}>
                    <div className={TW.actRow}>
                      {onViewReviews && (
                        <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onViewReviews(p)} title="View Reviews">
                          <Star size={9} />
                        </button>
                      )}
                      <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onToggle(p.id, !p.published)}>{p.published ? "Unpublish" : "Publish"}</button>
                      <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onEdit(p)}><Pencil size={9} /></button>
                      <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(p.id, p.title)}><Trash2 size={9} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
