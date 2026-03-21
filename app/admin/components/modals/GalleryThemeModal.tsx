import { useState, useCallback, useEffect } from "react";
import { X, Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { GalleryTheme, GalleryPhoto } from "../types";
import { createClient } from "@/lib/supabase/client";

const MAX_PHOTOS = 10;

interface GalleryThemeModalProps {
  theme: GalleryTheme | null;
  onClose: () => void;
  onSave: () => Promise<void>;
  db: ReturnType<typeof createClient>;
}

export default function GalleryThemeModal({ theme, onClose, onSave, db }: GalleryThemeModalProps) {
  const [title,     setTitle]    = useState(theme?.title       ?? "");
  const [desc,      setDesc]     = useState(theme?.description ?? "");
  const [coverUrl,  setCover]    = useState(theme?.cover_url   ?? "");
  const [published, setPub]      = useState(theme?.published   ?? false);
  const [sortOrder, setSort]     = useState(theme?.sort_order  ?? 0);
  const [photos,    setPhotos]   = useState<Omit<GalleryPhoto, "created_at">[]>([]);
  const [saving,    setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  // Load existing photos when editing
  const loadPhotos = useCallback(async () => {
    if (!theme?.id) return;
    const { data } = await db
      .from("gallery_photos")
      .select("*")
      .eq("theme_id", theme.id)
      .order("sort_order", { ascending: true });
    setPhotos(data ?? []);
  }, [db, theme?.id]);

  useEffect(() => { loadPhotos(); }, [loadPhotos]);

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    const name = `gallery-covers/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { data, error } = await db.storage.from("gallery-photos").upload(name, file, { upsert: false });
    setCoverUploading(false);
    if (error) { toast.error("Upload failed: " + error.message); return; }
    const { data: { publicUrl } } = db.storage.from("gallery-photos").getPublicUrl(data.path);
    setCover(publicUrl);
    toast.success("Cover uploaded!");
  }

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    if (photos.length + files.length > MAX_PHOTOS) {
      toast.error(`Max ${MAX_PHOTOS} photos per gallery.`);
      return;
    }
    setUploading(true);
    for (const file of files) {
      const name = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { data, error } = await db.storage.from("gallery-photos").upload(name, file, { upsert: false });
      if (error) { toast.error(`Upload failed: ${file.name}`); continue; }
      const { data: { publicUrl } } = db.storage.from("gallery-photos").getPublicUrl(data.path);
      setPhotos((prev) => [
        ...prev,
        { id: `tmp-${Date.now()}-${Math.random()}`, theme_id: theme?.id ?? "", photo_url: publicUrl, caption: null, sort_order: prev.length },
      ]);
    }
    setUploading(false);
    toast.success("Photos uploaded!");
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx).map((p, i) => ({ ...p, sort_order: i })));
  }

  function updateCaption(idx: number, caption: string) {
    setPhotos((prev) => prev.map((p, i) => i === idx ? { ...p, caption: caption || null } : p));
  }

  async function handleSave() {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);

    let themeId = theme?.id;

    // Upsert theme
    const payload = {
      title: title.trim(),
      description: desc.trim() || null,
      cover_url: coverUrl.trim() || null,
      published,
      sort_order: sortOrder,
    };

    if (theme?.id) {
      const { error } = await db.from("gallery_themes").update(payload).eq("id", theme.id);
      if (error) { toast.error("Save failed: " + error.message); setSaving(false); return; }
    } else {
      const { data, error } = await db.from("gallery_themes").insert(payload).select().single();
      if (error || !data) { toast.error("Save failed: " + (error?.message ?? "unknown")); setSaving(false); return; }
      themeId = data.id;
    }

    // Handle photos: delete removed ones, insert new ones
    if (themeId) {
      // Get existing photo IDs from DB
      const { data: existingPhotos } = await db
        .from("gallery_photos")
        .select("id")
        .eq("theme_id", themeId);

      const existingIds = new Set((existingPhotos ?? []).map((p: { id: string }) => p.id));
      const currentIds = new Set(photos.filter((p) => !p.id.startsWith("tmp-")).map((p) => p.id));

      // Delete removed photos
      const toDelete = [...existingIds].filter((id) => !currentIds.has(id));
      if (toDelete.length > 0) {
        await db.from("gallery_photos").delete().in("id", toDelete);
      }

      // Insert new photos (tmp ids)
      const newPhotos = photos.filter((p) => p.id.startsWith("tmp-"));
      if (newPhotos.length > 0) {
        await db.from("gallery_photos").insert(
          newPhotos.map((p, i) => ({
            theme_id: themeId,
            photo_url: p.photo_url,
            caption: p.caption,
            sort_order: photos.indexOf(p),
          }))
        );
      }

      // Update sort orders for existing photos
      for (const p of photos.filter((p) => !p.id.startsWith("tmp-"))) {
        await db.from("gallery_photos").update({ sort_order: photos.indexOf(p), caption: p.caption }).eq("id", p.id);
      }
    }

    setSaving(false);
    toast.success(theme ? "Gallery updated!" : "Gallery created!");
    await onSave();
  }

  return (
    <div className={TW.overlay} onClick={onClose}>
      <div
        className={cn(TW.panel, "max-w-[700px]")}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 700 }}
      >
        <div className={TW.pHead}>
          <div className={TW.fTitle}>{theme ? "Edit Gallery Theme" : "New Gallery Theme"}</div>
          <button className={TW.iconBtn} onClick={onClose}><X size={16} /></button>
        </div>

        <div className={TW.pBody}>
          {/* Title & sort order */}
          <div className={TW.fRow}>
            <div className={TW.field}>
              <label className={TW.label}>Title *</label>
              <input className={TW.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Gallery theme title" />
            </div>
            <div className={TW.field}>
              <label className={TW.label}>Sort Order</label>
              <input className={TW.input} type="number" min={0} value={sortOrder} onChange={(e) => setSort(Number(e.target.value))} />
            </div>
          </div>

          <div className={TW.field}>
            <label className={TW.label}>Description</label>
            <textarea className={cn(TW.tarea, "min-h-[72px]")} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief description of this gallery…" />
          </div>

          {/* Cover image */}
          <div className={TW.field}>
            <label className={TW.label}>Cover Image (used as gallery card thumbnail)</label>
            <label className={cn(TW.input, "flex items-center gap-3 cursor-pointer py-2.5 px-4 border-dashed mb-2")}>
              <input type="file" accept="image/*" className="hidden" onChange={uploadCover} disabled={coverUploading} />
              {coverUploading ? (
                <span className="text-white/40 text-sm">Uploading…</span>
              ) : coverUrl ? (
                <><img src={coverUrl} alt="cover" className="w-10 h-10 object-cover rounded" /><span className="text-white/50 text-xs truncate max-w-[260px]">{coverUrl.split("/").pop()}</span></>
              ) : (
                <span className="text-white/30 text-sm">Click to upload cover image…</span>
              )}
            </label>
            <input className={TW.input} value={coverUrl} onChange={(e) => setCover(e.target.value)} placeholder="Or paste URL" />
          </div>

          {/* Photos */}
          <div className={TW.field}>
            <div className="flex items-center justify-between mb-2">
              <label className={TW.label} style={{ marginBottom: 0 }}>
                Gallery Photos ({photos.length}/{MAX_PHOTOS})
              </label>
              {photos.length < MAX_PHOTOS && (
                <label className={cn(TW.btn, TW.ghost, TW.sm, "cursor-pointer")}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={uploadPhoto}
                    disabled={uploading}
                  />
                  <Plus size={10} />
                  {uploading ? "Uploading…" : "Add Photos"}
                </label>
              )}
            </div>

            {photos.length === 0 ? (
              <div className="border border-dashed border-white/[.08] rounded-lg p-8 text-center">
                <p className="font-poppins text-[12px] text-white/25">
                  No photos yet. Upload up to {MAX_PHOTOS} photos.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {photos.map((photo, idx) => (
                  <div key={photo.id} className="bg-white/[.03] border border-white/[.07] rounded-lg overflow-hidden">
                    <div className="relative">
                      <img src={photo.photo_url} alt={photo.caption ?? ""} className="w-full h-28 object-cover" />
                      <button
                        className="absolute top-2 right-2 bg-black/60 border border-white/10 text-white/60 rounded-md p-1 cursor-pointer hover:text-red-400 transition-colors"
                        onClick={() => removePhoto(idx)}
                      >
                        <Trash2 size={11} />
                      </button>
                      <span className="absolute bottom-2 left-2 bg-black/60 text-white/40 font-mono text-[9px] px-1.5 py-0.5 rounded">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="px-3 py-2">
                      <input
                        className="w-full bg-transparent border-b border-white/[.07] text-white/60 text-xs py-1 outline-none placeholder:text-white/20 font-poppins"
                        placeholder="Add caption…"
                        value={photo.caption ?? ""}
                        onChange={(e) => updateCaption(idx, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={cn(TW.field, "flex items-center gap-2.5")}>
            <input type="checkbox" id="gal-pub" checked={published} onChange={(e) => setPub(e.target.checked)} className="w-4 h-4 cursor-pointer accent-[#c9a84c]" />
            <label htmlFor="gal-pub" className={cn(TW.label, "!mb-0 cursor-pointer")}>
              Publish (visible on Visual Library page)
            </label>
          </div>
        </div>

        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
          <button className={cn(TW.btn, TW.gold)} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : theme ? "Update Gallery" : "Create Gallery"}
          </button>
        </div>
      </div>
    </div>
  );
}
