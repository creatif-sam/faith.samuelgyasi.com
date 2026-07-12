import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { Announcement } from "../types";
import { createClient } from "@/lib/supabase/client";

interface AnnouncementModalProps {
  announcement: Announcement | null;
  onClose: () => void;
  onSave: () => Promise<void>;
  db: ReturnType<typeof createClient>;
}

export default function AnnouncementModal({ announcement, onClose, onSave, db }: AnnouncementModalProps) {
  const [type, setType] = useState<"bar" | "popup">(announcement?.type ?? "bar");
  const [title, setTitle] = useState(announcement?.title ?? "");
  const [message, setMessage] = useState(announcement?.message ?? "");
  const [ctaText, setCtaText] = useState(announcement?.cta_text ?? "");
  const [ctaUrl, setCtaUrl] = useState(announcement?.cta_url ?? "");
  const [dismissible, setDismissible] = useState(announcement?.dismissible ?? true);
  const [active, setActive] = useState(announcement?.active ?? true);
  const [startsAt, setStartsAt] = useState(announcement?.starts_at?.slice(0, 10) ?? "");
  const [endsAt, setEndsAt] = useState(announcement?.ends_at?.slice(0, 10) ?? "");
  const [sortOrder, setSortOrder] = useState(announcement?.sort_order ?? 0);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!message.trim()) { toast.error("Message is required"); return; }
    setSaving(true);
    const payload = {
      type,
      title: title.trim() || null,
      message: message.trim(),
      cta_text: ctaText.trim() || null,
      cta_url: ctaUrl.trim() || null,
      dismissible,
      active,
      starts_at: startsAt || null,
      ends_at: endsAt || null,
      sort_order: sortOrder,
    };
    const { error } = announcement
      ? await db.from("announcements").update(payload).eq("id", announcement.id)
      : await db.from("announcements").insert(payload);
    setSaving(false);
    if (error) { toast.error("Save failed: " + error.message); return; }
    toast.success(announcement ? "Announcement updated" : "Announcement created");
    await onSave();
  }

  return (
    <div className={TW.overlay} onClick={onClose}>
      <div className={TW.panel} onClick={(e) => e.stopPropagation()}>
        <div className={TW.pHead}>
          <div className={TW.fTitle}>{announcement ? "Edit Announcement" : "New Announcement"}</div>
          <button className={TW.iconBtn} onClick={onClose}><X size={16} /></button>
        </div>
        <div className={TW.pBody}>

          {/* Type */}
          <div className={TW.field}>
            <label className={TW.label}>Display Style</label>
            <div className="flex gap-0 border border-white/[.08]">
              {([
                { v: "bar", label: "Top Bar" },
                { v: "popup", label: "Popup" },
              ] as const).map((t) => (
                <button key={t.v} type="button" onClick={() => setType(t.v)}
                  className={cn("flex-1 py-2 font-poppins text-[9px] tracking-[.2em] uppercase border-0 cursor-pointer transition-colors",
                    type === t.v ? "bg-[rgba(201,168,76,.12)] text-[#c9a84c]" : "bg-transparent text-white/35"
                  )}>
                  {t.label}
                </button>
              ))}
            </div>
            <p className="font-poppins text-[11px] text-white/30 mt-2">
              {type === "bar" ? "Shows as a slim strip above the navigation on every page." : "Shows as a centered popup dialog, once per visitor per session."}
            </p>
          </div>

          {type === "popup" && (
            <div className={TW.field}><label className={TW.label}>Title</label><input className={TW.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Want to be encouraged every morning?" /></div>
          )}

          <div className={TW.field}><label className={TW.label}>Message *</label><textarea className={cn(TW.tarea, "min-h-[90px]")} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What do you want visitors to see?" /></div>

          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Button Text</label><input className={TW.input} value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="e.g. Learn More" /></div>
            <div className={TW.field}><label className={TW.label}>Button Link</label><input className={TW.input} value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https:// or /page" /></div>
          </div>

          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Start Date <span className="text-white/25 normal-case">(optional)</span></label><input className={TW.input} type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} /></div>
            <div className={TW.field}><label className={TW.label}>End Date <span className="text-white/25 normal-case">(optional)</span></label><input className={TW.input} type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} /></div>
          </div>

          <div className="border border-white/[.07] rounded-lg p-4 flex flex-col gap-3 mb-5">
            <p className="font-poppins text-[9px] tracking-[.2em] uppercase text-white/30 mb-1">Options</p>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={dismissible} onChange={(e) => setDismissible(e.target.checked)} className="w-4 h-4 cursor-pointer accent-[#c9a84c]" />
              <span className={cn(TW.label, "!mb-0")}>Visitors can dismiss it (remembered via local storage)</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" id="an-active" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4 cursor-pointer accent-[#c9a84c]" />
              <label htmlFor="an-active" className={cn(TW.label, "!mb-0 cursor-pointer")}>Active (live on site)</label>
            </label>
          </div>

          <div className={TW.field}><label className={TW.label}>Sort Order <span className="text-white/25 normal-case">(lower shows first when multiple are active)</span></label><input className={TW.input} type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} /></div>

        </div>
        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
          <button className={cn(TW.btn, TW.gold)} onClick={handleSave} disabled={saving}>{saving ? "Saving…" : announcement ? "Update" : "Create Announcement"}</button>
        </div>
      </div>
    </div>
  );
}
