import { Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { Testimonial } from "../types";

interface TestimonialsTabProps {
  testimonials: Testimonial[];
  onNew: () => void;
  onEdit: (t: Testimonial) => void;
  onDelete: (id: string, name: string) => void;
  onToggle: (id: string, val: boolean) => Promise<void>;
}

export default function TestimonialsTab({ testimonials, onNew, onEdit, onDelete, onToggle }: TestimonialsTabProps) {
  const published = testimonials.filter((t) => t.published).length;
  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Testimonials</div>
          <p className={TW.pgSub}>{published} published · {testimonials.length} total</p>
        </div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}><Plus size={12} />Add Testimonial</button>
      </div>
      {testimonials.length === 0 ? <p className={TW.empty}>No testimonials yet. Add the first one.</p> : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead><tr><th className={TW.th}>Name</th><th className={TW.th}>Role / Company</th><th className={TW.th}>Rating</th><th className={TW.th}>Status</th><th className={TW.th}>Actions</th></tr></thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                  <td className={TW.td} style={{ color: "#f0ece4", maxWidth: "200px" }}>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-[11px] text-white/40 mt-0.5 italic">{t.quote.slice(0, 60)}{t.quote.length > 60 ? "..." : ""}</div>
                  </td>
                  <td className={TW.td} style={{ fontSize: "12px" }}>{[t.role, t.company].filter(Boolean).join(" · ") || "—"}</td>
                  <td className={TW.td} style={{ color: "#c9a84c", letterSpacing: "2px" }}>{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</td>
                  <td className={TW.td}>
                    <button className={cn(TW.badge, t.published ? TW.bPub : TW.bDft, "cursor-pointer bg-transparent border-none")}
                      onClick={() => onToggle(t.id, !t.published)} title={t.published ? "Click to unpublish" : "Click to publish"}>
                      {t.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className={TW.td}>
                    <div className={TW.actRow}>
                      <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onEdit(t)}><Pencil size={10} /></button>
                      <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(t.id, t.name)}><Trash2 size={10} /></button>
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
