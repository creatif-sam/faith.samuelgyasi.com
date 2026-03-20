import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { UpcomingEvent } from "../types";

interface UpcomingTabProps {
  events: UpcomingEvent[];
  onNew: () => void;
  onEdit: (ev: UpcomingEvent) => void;
  onDelete: (id: string, title: string) => void;
  onToggle: (id: string, val: boolean) => Promise<void>;
}

export default function UpcomingTab({ events, onNew, onEdit, onDelete, onToggle }: UpcomingTabProps) {
  const [subTab, setSubTab] = useState<"intervention" | "masterclass" | "session">("intervention");
  const filtered  = events.filter((e) => e.category === subTab);
  const published = filtered.filter((e) => e.published).length;

  const SUB_TABS: { id: "intervention" | "masterclass" | "session"; label: string }[] = [
    { id: "intervention", label: "Interventions"  },
    { id: "masterclass",  label: "Masterclass"    },
    { id: "session",      label: "Sessions"       },
  ];

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Upcoming</div>
          <p className={TW.pgSub}>{published} published · {filtered.length} {SUB_TABS.find((t) => t.id === subTab)?.label}</p>
        </div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}><Plus size={12} />Add Event</button>
      </div>

      <div className="flex gap-0 border-b border-white/[.08] mb-6">
        {SUB_TABS.map((t) => (
          <button key={t.id} onClick={() => setSubTab(t.id)}
            className={cn("font-mono text-[9px] tracking-[.2em] uppercase px-5 py-3 bg-transparent border-0 cursor-pointer transition-colors",
              subTab === t.id ? "text-[#c9a84c] border-b-2 border-[#c9a84c]" : "text-white/35 border-b-2 border-transparent"
            )}>
            {t.label} ({events.filter((e) => e.category === t.id).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? <p className={TW.empty}>No {SUB_TABS.find((t) => t.id === subTab)?.label ?? "events"} yet.</p> : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead><tr><th className={TW.th}>Title</th><th className={TW.th}>Date</th><th className={TW.th}>Location</th><th className={TW.th}>Status</th><th className={TW.th}>Actions</th></tr></thead>
            <tbody>
              {filtered.map((ev) => (
                <tr key={ev.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                  <td className={TW.td} style={{ color: "#f0ece4", maxWidth: "260px" }}>
                    <div className="font-semibold">{ev.title}</div>
                    {ev.description && <div className="text-[11px] text-white/40 mt-0.5 italic">{ev.description.slice(0, 70)}{ev.description.length > 70 ? "..." : ""}</div>}
                  </td>
                  <td className={TW.td} style={{ fontSize: "11px", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>{ev.date_text ?? "—"}</td>
                  <td className={TW.td} style={{ fontSize: "11px" }}>{ev.location ?? "—"}</td>
                  <td className={TW.td}>
                    <button className={cn(TW.badge, ev.published ? TW.bPub : TW.bDft, "cursor-pointer bg-transparent border-none")}
                      onClick={() => onToggle(ev.id, !ev.published)}>
                      {ev.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className={TW.td}>
                    <div className={TW.actRow}>
                      <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onEdit(ev)}><Pencil size={10} /></button>
                      <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(ev.id, ev.title)}><Trash2 size={10} /></button>
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
