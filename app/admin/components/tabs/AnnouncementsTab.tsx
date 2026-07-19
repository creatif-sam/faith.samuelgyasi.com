import { Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { Announcement } from "../types";

interface AnnouncementsTabProps {
  announcements: Announcement[];
  onNew: () => void;
  onEdit: (a: Announcement) => void;
  onDelete: (id: string, label: string) => void;
  onToggle: (id: string, val: boolean) => void;
}

export default function AnnouncementsTab({ announcements, onNew, onEdit, onDelete, onToggle }: AnnouncementsTabProps) {
  return (
    <>
      <div className="flex flex-wrap justify-between items-start gap-3 mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Announcements</div>
          <p className={TW.pgSub}>{announcements.length} announcement{announcements.length !== 1 ? "s" : ""} · shown as a top bar or a popup on the site</p>
        </div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}><Plus size={13} /> New Announcement</button>
      </div>

      {announcements.length === 0 ? <p className={TW.empty}>No announcements yet.</p> : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={TW.th}>Type</th>
                <th className={TW.th}>Message</th>
                <th className={TW.th}>CTA</th>
                <th className={TW.th}>Window</th>
                <th className={TW.th}>Active</th>
                <th className={TW.th}></th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((a) => (
                <tr key={a.id} className="hover:[&>td]:bg-[rgba(84,108,250,.04)]">
                  <td className={TW.td}><span className={cn(TW.badge, TW.bDft, "capitalize")}>{a.type}</span></td>
                  <td className={TW.td} style={{ maxWidth: 340 }}>
                    {a.title && <div style={{ color: "#f0ece4" }} className="mb-0.5 font-medium">{a.title}</div>}
                    <div className="truncate text-white/45">{a.message}</div>
                  </td>
                  <td className={TW.td}>{a.cta_text ? <span className={cn(TW.badge, TW.bPub)}>{a.cta_text}</span> : <span className="text-white/30">—</span>}</td>
                  <td className={TW.td}>
                    {a.starts_at || a.ends_at
                      ? <span className="text-white/45">{a.starts_at ? new Date(a.starts_at).toLocaleDateString("en-GB") : "…"} → {a.ends_at ? new Date(a.ends_at).toLocaleDateString("en-GB") : "…"}</span>
                      : <span className="text-white/30">Always on</span>}
                  </td>
                  <td className={TW.td}>
                    <button className={cn(TW.badge, a.active ? TW.bPub : TW.bDft, "cursor-pointer border-0")} onClick={() => onToggle(a.id, !a.active)}>
                      {a.active ? "Active" : "Paused"}
                    </button>
                  </td>
                  <td className={TW.td}>
                    <div className={TW.actRow}>
                      <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onEdit(a)}><Pencil size={9} /></button>
                      <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(a.id, a.title ?? a.message)}><Trash2 size={9} /></button>
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
