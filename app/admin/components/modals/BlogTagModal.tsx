import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW, slugify } from "../constants";
import { BlogTag } from "../types";
import { createClient } from "@/lib/supabase/client";

interface BlogTagModalProps {
  tag: BlogTag | null;
  onClose: () => void;
  onSave: () => Promise<void>;
  db: ReturnType<typeof createClient>;
}

export default function BlogTagModal({ tag, onClose, onSave, db }: BlogTagModalProps) {
  const [nameEn,         setNameEn]         = useState(tag?.name_en          ?? "");
  const [nameFr,         setNameFr]         = useState(tag?.name_fr          ?? "");
  const [slug,           setSlug]           = useState(tag?.slug             ?? "");
  const [descriptionEn,  setDescriptionEn]  = useState(tag?.description_en   ?? "");
  const [descriptionFr,  setDescriptionFr]  = useState(tag?.description_fr   ?? "");
  const [color,          setColor]          = useState(tag?.color            ?? "#c9a84c");
  const [published,      setPub]            = useState(tag?.published        ?? true);
  const [sortOrder,      setSort]           = useState(tag?.sort_order       ?? 0);
  const [saving,         setSaving]         = useState(false);

  async function handleSave() {
    if (!nameEn.trim() || !nameFr.trim()) { 
      toast.error("Name (EN and FR) are required"); 
      return; 
    }
    if (!slug.trim()) { 
      toast.error("Slug is required"); 
      return; 
    }
    
    setSaving(true);
    const payload = {
      name_en: nameEn.trim(),
      name_fr: nameFr.trim(),
      slug: slug.trim(),
      description_en: descriptionEn.trim() || null,
      description_fr: descriptionFr.trim() || null,
      color: color.trim() || "#c9a84c",
      published,
      sort_order: sortOrder,
    };
    
    const { error } = tag
      ? await db.from("blog_tags").update(payload).eq("id", tag.id)
      : await db.from("blog_tags").insert(payload);
    
    setSaving(false);
    if (error) { 
      toast.error("Save failed: " + error.message); 
      return; 
    }
    
    toast.success(tag ? "Tag updated" : "Tag created");
    await onSave();
  }

  function handleNameEnChange(val: string) {
    setNameEn(val);
    if (!tag && !slug) {
      setSlug(slugify(val));
    }
  }

  return (
    <div className={TW.overlay} onClick={onClose}>
      <div className={TW.panel} onClick={(e) => e.stopPropagation()}>
        <div className={TW.pHead}>
          <div className={TW.fTitle}>{tag ? "Edit Tag" : "New Tag"}</div>
          <button className={TW.iconBtn} onClick={onClose}><X size={16} /></button>
        </div>
        <div className={TW.pBody}>
          <div className={TW.field}>
            <label className={TW.label}>Name (English) *</label>
            <input 
              className={TW.input} 
              value={nameEn} 
              onChange={(e) => handleNameEnChange(e.target.value)} 
              placeholder="e.g. Prayer" 
            />
          </div>
          
          <div className={TW.field}>
            <label className={TW.label}>Name (French) *</label>
            <input 
              className={TW.input} 
              value={nameFr} 
              onChange={(e) => setNameFr(e.target.value)} 
              placeholder="e.g. Prière" 
            />
          </div>
          
          <div className={TW.field}>
            <label className={TW.label}>Slug (URL) *</label>
            <input 
              className={TW.input} 
              value={slug} 
              onChange={(e) => setSlug(slugify(e.target.value))} 
              placeholder="prayer" 
            />
          </div>
          
          <div className={TW.field}>
            <label className={TW.label}>Description (English)</label>
            <textarea 
              className={cn(TW.tarea, "min-h-[60px]")} 
              value={descriptionEn} 
              onChange={(e) => setDescriptionEn(e.target.value)} 
              placeholder="Brief description of this tag..." 
            />
          </div>
          
          <div className={TW.field}>
            <label className={TW.label}>Description (French)</label>
            <textarea 
              className={cn(TW.tarea, "min-h-[60px]")} 
              value={descriptionFr} 
              onChange={(e) => setDescriptionFr(e.target.value)} 
              placeholder="Brève description de ce tag..." 
            />
          </div>
          
          <div className={TW.field}>
            <label className={TW.label}>Color (Hex) *</label>
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded border border-white/10 cursor-pointer" 
              />
              <input 
                className={cn(TW.input, "flex-1")} 
                value={color} 
                onChange={(e) => setColor(e.target.value)} 
                placeholder="#c9a84c" 
              />
            </div>
            <div className="text-[10px] text-white/30 mt-1.5">
              This color will be used for tag badges on the site
            </div>
          </div>
          
          <div className={TW.field}>
            <label className={TW.label}>Sort Order (lower = first)</label>
            <input 
              className={TW.input} 
              type="number" 
              min={0} 
              value={sortOrder} 
              onChange={(e) => setSort(Number(e.target.value))} 
            />
          </div>
          
          <div className={cn(TW.field, "flex items-center gap-2.5")}>
            <input 
              type="checkbox" 
              id="tag-pub" 
              checked={published} 
              onChange={(e) => setPub(e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#c9a84c]" 
            />
            <label htmlFor="tag-pub" className={cn(TW.label, "!mb-0 cursor-pointer")}>
              Publish immediately (visible on site)
            </label>
          </div>
        </div>
        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
          <button className={cn(TW.btn, TW.gold)} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : tag ? "Update" : "Create Tag"}
          </button>
        </div>
      </div>
    </div>
  );
}
