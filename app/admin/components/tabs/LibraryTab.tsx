import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { LibraryItem } from "../types";

interface LibraryTabProps {
  items: LibraryItem[];
  onNew: () => void;
  onEdit: (item: LibraryItem) => void;
  onDelete: (id: string, title: string) => void;
  onToggle: (id: string, val: boolean) => Promise<void>;
}

export default function LibraryTab({ items, onNew, onEdit, onDelete, onToggle }: LibraryTabProps) {
  const [subTab, setSubTab] = useState<"ebook" | "review" | "audio" | "visual">("ebook");
  const filtered  = items.filter((i) => i.category === subTab);
  const published = filtered.filter((i) => i.published).length;

  const SUB_TABS: { id: "ebook" | "review" | "audio" | "visual"; label: string }[] = [
    { id: "ebook",   label: "eBooks" },
    { id: "review",  label: "Book Reviews" },
    { id: "audio",   label: "Audio" },
    { id: "visual",  label: "Visual" },
  ];

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Library</div>
          <p className={TW.pgSub}>{published} published · {filtered.length} {SUB_TABS.find((t) => t.id === subTab)?.label}</p>
        </div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}><Plus size={12} />Add Item</button>
      </div>

      <div className="flex gap-0 border-b border-white/[.08] mb-6">
        {SUB_TABS.map((t) => (
          <button key={t.id} onClick={() => setSubTab(t.id)}
            className={cn("font-mono text-[9px] tracking-[.2em] uppercase px-5 py-3 bg-transparent border-0 cursor-pointer transition-colors",
              subTab === t.id ? "text-[#c9a84c] border-b-2 border-[#c9a84c]" : "text-white/35 border-b-2 border-transparent"
            )}>
            {t.label} ({items.filter((i) => i.category === t.id).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? <p className={TW.empty}>No {SUB_TABS.find((t) => t.id === subTab)?.label.toLowerCase()} yet.</p> : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead><tr>
              <th className={TW.th}>Title</th>
              {subTab === "review" && <th className={TW.th}>Author</th>}
              {subTab === "review" && <th className={TW.th}>Rating</th>}
              {(subTab === "audio" || subTab === "visual") && <th className={TW.th}>Duration</th>}
              <th className={TW.th}>Status</th>
              <th className={TW.th}>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                  <td className={TW.td} style={{ color: "#f0ece4", maxWidth: "260px" }}>
                    <div className="font-semibold">{item.title}</div>
                    {item.description && <div className="text-[11px] text-white/40 mt-0.5 italic">{item.description.slice(0, 70)}{item.description.length > 70 ? "..." : ""}</div>}
                  </td>
                  {subTab === "review" && <td className={TW.td} style={{ fontSize: "12px" }}>{item.author ?? "—"}</td>}
                  {subTab === "review" && (
                    <td className={TW.td}>
                      {item.rating !== null
                        ? <span style={{ color: "#c9a84c", letterSpacing: "2px" }}>{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</span>
                        : "—"}
                    </td>
                  )}
                  {(subTab === "audio" || subTab === "visual") && <td className={TW.td}>{item.duration ?? "—"}</td>}
                  <td className={TW.td}>
                    <button className={cn(TW.badge, item.published ? TW.bPub : TW.bDft, "cursor-pointer bg-transparent border-none")}
                      onClick={() => onToggle(item.id, !item.published)}>
                      {item.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className={TW.td}>
                    <div className={TW.actRow}>
                      <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onEdit(item)}><Pencil size={10} /></button>
                      <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(item.id, item.title)}><Trash2 size={10} /></button>
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
