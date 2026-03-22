import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { BlogSeries } from "../types";

interface BlogSeriesTabProps {
  series: BlogSeries[];
  onNew: () => void;
  onEdit: (s: BlogSeries) => void;
  onDelete: (id: string, name: string) => void;
  onToggle: (id: string, val: boolean) => Promise<void>;
  onView: (s: BlogSeries) => void;
}

export default function BlogSeriesTab({ series, onNew, onEdit, onDelete, onToggle, onView }: BlogSeriesTabProps) {
  const published = series.filter((s) => s.published).length;
  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Blog Series</div>
          <p className={TW.pgSub}>{published} published · {series.length} total</p>
        </div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}><Plus size={12} />Add Series</button>
      </div>
      {series.length === 0 ? <p className={TW.empty}>No blog series yet. Create the first one.</p> : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={TW.th}>Name (EN / FR)</th>
                <th className={TW.th}>Slug</th>
                <th className={TW.th}>Show Dates</th>
                <th className={TW.th}>Status</th>
                <th className={TW.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {series.map((s) => (
                <tr key={s.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                  <td className={TW.td} style={{ color: "#f0ece4", maxWidth: "250px" }}>
                    <div className="font-semibold">{s.name_en}</div>
                    <div className="text-[11px] text-white/40 mt-0.5">{s.name_fr}</div>
                  </td>
                  <td className={TW.td} style={{ fontSize: "12px", fontFamily: "monospace", color: "#c9a84c" }}>
                    /{s.slug}
                  </td>
                  <td className={TW.td}>
                    <span className={cn(TW.badge, s.show_dates ? TW.bOpen : TW.bDft)}>
                      {s.show_dates ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className={TW.td}>
                    <button className={cn(TW.badge, s.published ? TW.bPub : TW.bDft, "cursor-pointer bg-transparent border-none")}
                      onClick={() => onToggle(s.id, !s.published)} title={s.published ? "Click to unpublish" : "Click to publish"}>
                      {s.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className={TW.td}>
                    <div className={TW.actRow}>
                      <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onView(s)} title="View posts in series"><Eye size={10} /></button>
                      <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onEdit(s)}><Pencil size={10} /></button>
                      <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(s.id, s.name_en)}><Trash2 size={10} /></button>
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
