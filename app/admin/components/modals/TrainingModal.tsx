import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { Training } from "../types";
import { createClient } from "@/lib/supabase/client";

interface TrainingModalProps {
  training: Training | null;
  onClose: () => void;
  onSave: () => Promise<void>;
  db: ReturnType<typeof createClient>;
}

export default function TrainingModal({ training, onClose, onSave, db }: TrainingModalProps) {
  const [title,        setTitle]       = useState(training?.title         ?? "");
  const [description,  setDesc]        = useState(training?.description   ?? "");
  const [thumbnail,    setThumb]       = useState(training?.thumbnail_url ?? "");
  const [category,     setCat]         = useState(training?.category      ?? "general");
  const [published,    setPub]         = useState(training?.published     ?? false);
  const [sortOrder,    setSort]        = useState(training?.sort_order    ?? 0);
  const [saving,       setSaving]      = useState(false);
  const [uploading,    setUploading]   = useState(false);

  async function handleThumbUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const name = `trainings/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { data, error } = await db.storage.from("book-covers").upload(name, file, { upsert: false });
    if (error) { toast.error("Upload failed: " + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = db.storage.from("book-covers").getPublicUrl(data.path);
    setThumb(publicUrl);
    setUploading(false);
    toast.success("Thumbnail uploaded!");
  }

  async function handleSave() {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);

    // Count existing lessons if editing
    let totalLessons = training?.total_lessons ?? 0;
    if (training) {
      const { count } = await db
        .from("training_lessons")
        .select("*", { count: "exact", head: true })
        .eq("training_id", training.id);
      totalLessons = count ?? 0;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      thumbnail_url: thumbnail.trim() || null,
      category: category.trim() || "general",
      published,
      sort_order: sortOrder,
      total_lessons: totalLessons,
      updated_at: new Date().toISOString(),
    };

    const { error } = training
      ? await db.from("trainings").update(payload).eq("id", training.id)
      : await db.from("trainings").insert({ ...payload, total_lessons: 0 });

    setSaving(false);
    if (error) { toast.error("Save failed: " + error.message); return; }
    toast.success(training ? "Training updated" : "Training created");
    await onSave();
  }

  return (
    <div className={TW.overlay} onClick={onClose}>
      <div className={TW.panel} onClick={(e) => e.stopPropagation()}>
        <div className={TW.pHead}>
          <div className={TW.fTitle}>{training ? "Edit Training" : "New Training"}</div>
          <button className={TW.iconBtn} onClick={onClose}><X size={16} /></button>
        </div>

        <div className={TW.pBody}>
          <div className={TW.field}>
            <label className={TW.label}>Title *</label>
            <input className={TW.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Training title" />
          </div>

          <div className={TW.field}>
            <label className={TW.label}>Description</label>
            <textarea className={cn(TW.tarea, "min-h-[90px]")} value={description} onChange={(e) => setDesc(e.target.value)} placeholder="What will students learn?" />
          </div>

          <div className={TW.field}>
            <label className={TW.label}>Category</label>
            <input className={TW.input} value={category} onChange={(e) => setCat(e.target.value)} placeholder="e.g. Faith, Leadership, Discipleship…" />
          </div>

          <div className={TW.field}>
            <label className={TW.label}>Thumbnail Image</label>
            <label className={cn(TW.input, "flex items-center gap-3 cursor-pointer py-2.5 px-4 border-dashed mb-2")}>
              <input type="file" accept="image/*" className="hidden" onChange={handleThumbUpload} disabled={uploading} />
              {uploading ? (
                <span className="text-white/40 text-sm">Uploading…</span>
              ) : thumbnail ? (
                <><img src={thumbnail} alt="thumbnail" className="w-10 h-10 object-cover rounded" /><span className="text-white/50 text-xs truncate max-w-[260px]">{thumbnail.split("/").pop()}</span></>
              ) : (
                <span className="text-white/30 text-sm">Click to upload thumbnail…</span>
              )}
            </label>
            <input className={TW.input} value={thumbnail} onChange={(e) => setThumb(e.target.value)} placeholder="Or paste image URL" />
          </div>

          <div className={TW.fRow}>
            <div className={TW.field}>
              <label className={TW.label}>Sort Order</label>
              <input className={TW.input} type="number" min={0} value={sortOrder} onChange={(e) => setSort(Number(e.target.value))} />
            </div>
          </div>

          <div className={cn(TW.field, "flex items-center gap-2.5")}>
            <input type="checkbox" id="trn-pub" checked={published} onChange={(e) => setPub(e.target.checked)} className="w-4 h-4 cursor-pointer accent-[#c9a84c]" />
            <label htmlFor="trn-pub" className={cn(TW.label, "!mb-0 cursor-pointer")}>
              Publish immediately (visible to enrolled users)
            </label>
          </div>
        </div>

        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
          <button className={cn(TW.btn, TW.gold)} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : training ? "Update Training" : "Create Training"}
          </button>
        </div>
      </div>
    </div>
  );
}
