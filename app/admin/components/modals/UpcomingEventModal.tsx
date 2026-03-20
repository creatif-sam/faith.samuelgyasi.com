import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { UpcomingEvent } from "../types";
import { createClient } from "@/lib/supabase/client";

interface UpcomingEventModalProps {
  event: UpcomingEvent | null;
  onClose: () => void;
  onSave: () => Promise<void>;
  db: ReturnType<typeof createClient>;
}

export default function UpcomingEventModal({ event, onClose, onSave, db }: UpcomingEventModalProps) {
  const [title,       setTitle]      = useState(event?.title              ?? "");
  const [desc,        setDesc]       = useState(event?.description        ?? "");
  const [dateText,    setDateText]   = useState(event?.date_text          ?? "");
  const [eventDate,   setEventDate]  = useState(event?.event_date         ?? "");
  const [location,    setLocation]   = useState(event?.location           ?? "");
  const [tag,         setTag]        = useState(event?.tag                ?? "");
  const [category,    setCategory]   = useState<"intervention" | "masterclass" | "session">(event?.category ?? "intervention");
  const [format,      setFormat]     = useState<"online" | "in-person" | "both">(event?.format ?? "in-person");
  const [needsReg,    setNeedsReg]   = useState(event?.needs_registration ?? false);
  const [joinUrl,     setJoinUrl]    = useState(event?.join_url           ?? "");
  const [fbUrl,       setFbUrl]      = useState(event?.facebook_url       ?? "");
  const [hostName,    setHostName]   = useState(event?.host_name          ?? "");
  const [hostUrl,     setHostUrl]    = useState(event?.host_url           ?? "");
  const [flyerUrl,    setFlyerUrl]   = useState(event?.flyer_url          ?? "");
  const [recSignup,   setRecSignup]  = useState(event?.recording_signup   ?? false);
  const [published,   setPub]        = useState(event?.published          ?? false);
  const [sortOrder,   setSort]       = useState(event?.sort_order         ?? 0);
  const [saving,      setSaving]     = useState(false);
  const [uploading,   setUploading]  = useState(false);

  const CAT_LABELS = { intervention: "Intervention", masterclass: "Masterclass", session: "Session" };
  const FMT_LABELS = { online: "Online", "in-person": "In Person", both: "Online + In Person" };

  async function uploadFlyer(file: File) {
    const ext = file.name.split(".").pop();
    const filename = `flyers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    setUploading(true);
    const { error } = await db.storage.from("event-flyers").upload(filename, file, { upsert: true });
    setUploading(false);
    if (error) { toast.error("Flyer upload failed: " + error.message); return; }
    const { data } = db.storage.from("event-flyers").getPublicUrl(filename);
    setFlyerUrl(data.publicUrl);
  }

  async function handleSave() {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const payload = {
      title: title.trim(),
      description: desc.trim() || null,
      date_text: dateText.trim() || null,
      event_date: eventDate || null,
      location: location.trim() || null,
      tag: tag.trim() || null,
      category,
      format,
      needs_registration: needsReg,
      join_url: joinUrl.trim() || null,
      facebook_url: fbUrl.trim() || null,
      host_name: hostName.trim() || null,
      host_url: hostUrl.trim() || null,
      flyer_url: flyerUrl || null,
      recording_signup: recSignup,
      published,
      sort_order: sortOrder,
    };
    const { error } = event
      ? await db.from("upcoming_events").update(payload).eq("id", event.id)
      : await db.from("upcoming_events").insert(payload);
    setSaving(false);
    if (error) { toast.error("Save failed: " + error.message); return; }
    toast.success(event ? "Event updated" : "Event added");
    await onSave();
  }

  return (
    <div className={TW.overlay} onClick={onClose}>
      <div className={TW.panel} onClick={(e) => e.stopPropagation()}>
        <div className={TW.pHead}>
          <div className={TW.fTitle}>{event ? "Edit Event" : "New Upcoming Event"}</div>
          <button className={TW.iconBtn} onClick={onClose}><X size={16} /></button>
        </div>
        <div className={TW.pBody}>

          {/* Type */}
          <div className={TW.field}>
            <label className={TW.label}>Type</label>
            <div className="flex gap-0 border border-white/[.08]">
              {(["intervention", "masterclass", "session"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setCategory(t)}
                  className={cn("flex-1 py-2 font-mono text-[9px] tracking-[.2em] uppercase border-0 cursor-pointer transition-colors",
                    category === t ? "bg-[rgba(201,168,76,.12)] text-[#c9a84c]" : "bg-transparent text-white/35"
                  )}>
                  {CAT_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className={TW.field}>
            <label className={TW.label}>Format</label>
            <div className="flex gap-0 border border-white/[.08]">
              {(["in-person", "online", "both"] as const).map((f) => (
                <button key={f} type="button" onClick={() => setFormat(f)}
                  className={cn("flex-1 py-2 font-mono text-[9px] tracking-[.15em] uppercase border-0 cursor-pointer transition-colors",
                    format === f ? "bg-[rgba(201,168,76,.12)] text-[#c9a84c]" : "bg-transparent text-white/35"
                  )}>
                  {FMT_LABELS[f]}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className={TW.field}><label className={TW.label}>Title *</label><input className={TW.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" /></div>

          {/* Description */}
          <div className={TW.field}><label className={TW.label}>Description</label><textarea className={cn(TW.tarea, "min-h-[80px]")} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief description…" /></div>

          {/* Date */}
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Event Date</label><input className={TW.input} type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} /></div>
            <div className={TW.field}><label className={TW.label}>Date Display Text <span className="text-white/25 normal-case tracking-normal">(overrides date)</span></label><input className={TW.input} value={dateText} onChange={(e) => setDateText(e.target.value)} placeholder="e.g. March 28–30, 2026" /></div>
          </div>

          {/* Location + Tag */}
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Location</label><input className={TW.input} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country or Online" /></div>
            <div className={TW.field}><label className={TW.label}>Tag / Badge</label><input className={TW.input} value={tag} onChange={(e) => setTag(e.target.value)} placeholder="e.g. Free · Open to All" /></div>
          </div>

          {/* Host */}
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Host Institution / Church</label><input className={TW.input} value={hostName} onChange={(e) => setHostName(e.target.value)} placeholder="Host name" /></div>
            <div className={TW.field}><label className={TW.label}>Host Website URL</label><input className={TW.input} value={hostUrl} onChange={(e) => setHostUrl(e.target.value)} placeholder="https://…" /></div>
          </div>

          {/* Links */}
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Join Us Link <span className="text-white/25 normal-case">(online events)</span></label><input className={TW.input} value={joinUrl} onChange={(e) => setJoinUrl(e.target.value)} placeholder="https://zoom.us/…" /></div>
            <div className={TW.field}><label className={TW.label}>Facebook Page / Event URL</label><input className={TW.input} value={fbUrl} onChange={(e) => setFbUrl(e.target.value)} placeholder="https://facebook.com/…" /></div>
          </div>

          {/* Flyer upload */}
          <div className={TW.field}>
            <label className={TW.label}>Event Flyer</label>
            <label className={cn(TW.input, "flex items-center gap-3 cursor-pointer py-2.5 px-4 border-dashed")}>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFlyer(f); }} disabled={uploading} />
              {uploading ? (
                <span className="text-white/40 text-sm">Uploading flyer…</span>
              ) : flyerUrl ? (
                <><img src={flyerUrl} alt="flyer" className="w-12 h-16 object-cover rounded" /><span className="text-white/50 text-xs truncate max-w-[260px]">{flyerUrl.split("/").pop()}</span><button type="button" className="ml-auto text-red-400 text-xs hover:text-red-300" onClick={(e) => { e.preventDefault(); setFlyerUrl(""); }}>Remove</button></>
              ) : (
                <span className="text-white/30 text-sm">Click to upload event flyer…</span>
              )}
            </label>
          </div>

          {/* Options */}
          <div className="border border-white/[.07] rounded-lg p-4 flex flex-col gap-3 mb-5">
            <p className="font-mono text-[9px] tracking-[.2em] uppercase text-white/30 mb-1">Options</p>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={needsReg} onChange={(e) => setNeedsReg(e.target.checked)} className="w-4 h-4 cursor-pointer accent-[#c9a84c]" />
              <span className={cn(TW.label, "!mb-0")}>Enable registration form on site</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={recSignup} onChange={(e) => setRecSignup(e.target.checked)} className="w-4 h-4 cursor-pointer accent-[#c9a84c]" />
              <span className={cn(TW.label, "!mb-0")}>Show "Sign up for recording / transcription"</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" id="up-pub2" checked={published} onChange={(e) => setPub(e.target.checked)} className="w-4 h-4 cursor-pointer accent-[#c9a84c]" />
              <label htmlFor="up-pub2" className={cn(TW.label, "!mb-0 cursor-pointer")}>Publish (visible on site)</label>
            </label>
          </div>

          {/* Sort order */}
          <div className={TW.field}><label className={TW.label}>Sort Order <span className="text-white/25 normal-case">(lower = first)</span></label><input className={TW.input} type="number" min={0} value={sortOrder} onChange={(e) => setSort(Number(e.target.value))} /></div>

        </div>
        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
          <button className={cn(TW.btn, TW.gold)} onClick={handleSave} disabled={saving || uploading}>{saving ? "Saving…" : event ? "Update" : "Add Event"}</button>
        </div>
      </div>
    </div>
  );
}
