import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { LibraryItem } from "../types";
import { createClient } from "@/lib/supabase/client";

interface LibraryItemModalProps {
  item: LibraryItem | null;
  onClose: () => void;
  onSave: () => Promise<void>;
  db: ReturnType<typeof createClient>;
}

export default function LibraryItemModal({ item, onClose, onSave, db }: LibraryItemModalProps) {
  const [title,       setTitle]      = useState(item?.title        ?? "");
  const [author,      setAuthor]     = useState(item?.author       ?? "");
  const [category,    setCategory]   = useState<"ebook" | "review" | "audio" | "visual">(item?.category ?? "ebook");
  const [description, setDesc]       = useState(item?.description  ?? "");
  const [rating,      setRating]     = useState(item?.rating       ?? 5);
  const [downloadUrl, setDlUrl]      = useState(item?.download_url ?? "");
  const [coverUrl,    setCoverUrl]   = useState(item?.cover_url    ?? "");
  const [duration,    setDuration]   = useState(item?.duration     ?? "");
  const [published,   setPub]        = useState(item?.published    ?? false);
  const [sortOrder,   setSort]       = useState(item?.sort_order   ?? 0);
  const [saving,      setSaving]     = useState(false);
  const [uploading, setUploading]    = useState(false);

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { data, error } = await db.storage.from("book-covers").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });
    
    if (error) {
      toast.error(`Upload failed: ${error.message}`);
      setUploading(false);
      return;
    }
    
    const { data: { publicUrl } } = db.storage.from("book-covers").getPublicUrl(data.path);
    setCoverUrl(publicUrl);
    setUploading(false);
    toast.success("Cover uploaded!");
  }

  async function handleSave() {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const payload = {
      title: title.trim(),
      author: (category === "review" && author.trim()) || null,
      category,
      description: description.trim() || null,
      rating: category === "review" ? rating : null,
      download_url: downloadUrl.trim() || null,
      cover_url: coverUrl.trim() || null,
      duration: (category === "audio" || category === "visual") ? (duration.trim() || null) : null,
      published,
      sort_order: sortOrder,
    };
    const { error } = item
      ? await db.from("library_items").update(payload).eq("id", item.id)
      : await db.from("library_items").insert(payload);
    setSaving(false);
    if (error) { toast.error("Save failed: " + error.message); return; }
    toast.success(item ? "Item updated" : "Item added");
    await onSave();
  }

  return (
    <div className={TW.overlay} onClick={onClose}>
      <div className={TW.panel} onClick={(e) => e.stopPropagation()}>
        <div className={TW.pHead}>
          <div className={TW.fTitle}>{item ? "Edit Library Item" : "New Library Item"}</div>
          <button className={TW.iconBtn} onClick={onClose}><X size={16} /></button>
        </div>
        <div className={TW.pBody}>
          <div className={TW.field}>
            <label className={TW.label}>Type</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { id: "ebook", label: "eBook" },
                { id: "review", label: "Book Review" },
                { id: "audio", label: "Audio" },
                { id: "visual", label: "Visual" },
              ] as const).map((t) => (
                <button key={t.id} type="button" onClick={() => setCategory(t.id)}
                  className={cn("py-2.5 px-3 font-mono text-[9px] tracking-[.2em] uppercase border border-white/[.08] cursor-pointer transition-colors",
                    category === t.id ? "bg-[rgba(201,168,76,.12)] text-[#c9a84c] border-[#c9a84c]/30" : "bg-transparent text-white/35"
                  )}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Title *</label><input className={TW.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" /></div>
            {category === "review" && (
              <div className={TW.field}><label className={TW.label}>Author</label><input className={TW.input} value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" /></div>
            )}
            {(category === "audio" || category === "visual") && (
              <div className={TW.field}><label className={TW.label}>Duration (optional)</label><input className={TW.input} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 45 min, 1hr 20min" /></div>
            )}
          </div>
          <div className={TW.field}><label className={TW.label}>Description</label><textarea className={cn(TW.tarea, "min-h-[80px]")} value={description} onChange={(e) => setDesc(e.target.value)} placeholder="Short description or review excerpt…" /></div>
          <div className={TW.field}>
            <label className={TW.label}>Cover Image</label>
            <label className={cn(TW.input, "flex items-center gap-3 cursor-pointer py-2.5 px-4 border-dashed")}>
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={uploading} />
              {uploading ? (
                <span className="text-white/40 text-sm">Uploading…</span>
              ) : coverUrl ? (
                <><img src={coverUrl} alt="cover" className="w-10 h-10 object-cover rounded" /><span className="text-white/50 text-xs truncate max-w-[280px]">{coverUrl.split("/").pop()}</span></>
              ) : (
                <span className="text-white/30 text-sm">Click to upload cover image…</span>
              )}
            </label>
            <input className={cn(TW.input, "mt-2")} value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="Or paste URL here" />
          </div>
          <div className={TW.fRow}>
            {category === "ebook" ? (
              <div className={TW.field}><label className={TW.label}>Download URL</label><input className={TW.input} value={downloadUrl} onChange={(e) => setDlUrl(e.target.value)} placeholder="https://..." /></div>
            ) : (
              <div className={TW.field}>
                <label className={TW.label}>Rating (1–5)</label>
                <div className="flex gap-1 items-center pt-1.5">
                  {[1,2,3,4,5].map((n) => (
                    <button key={n} type="button" onClick={() => setRating(n)} className="bg-transparent border-0 cursor-pointer text-[22px] p-0"
                      style={{ color: n <= rating ? "#c9a84c" : "rgba(201,168,76,.2)" }}>★</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Sort Order (lower = first)</label><input className={TW.input} type="number" min={0} value={sortOrder} onChange={(e) => setSort(Number(e.target.value))} /></div>
          </div>
          <div className={cn(TW.field, "flex items-center gap-2.5")}>
            <input type="checkbox" id="lib-pub" checked={published} onChange={(e) => setPub(e.target.checked)} className="w-4 h-4 cursor-pointer accent-[#c9a84c]" />
            <label htmlFor="lib-pub" className={cn(TW.label, "!mb-0 cursor-pointer")}>Publish immediately (visible on site)</label>
          </div>
        </div>
        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
          <button className={cn(TW.btn, TW.gold)} onClick={handleSave} disabled={saving}>{saving ? "Saving..." : item ? "Update" : "Add Item"}</button>
        </div>
      </div>
    </div>
  );
}
