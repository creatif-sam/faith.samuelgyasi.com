import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW, slugify } from "../constants";
import { BlogSeries } from "../types";
import { createClient } from "@/lib/supabase/client";

interface BlogSeriesModalProps {
  series: BlogSeries | null;
  onClose: () => void;
  onSave: () => Promise<void>;
  db: ReturnType<typeof createClient>;
}

export default function BlogSeriesModal({ series, onClose, onSave, db }: BlogSeriesModalProps) {
  const [nameEn,         setNameEn]         = useState(series?.name_en          ?? "");
  const [nameFr,         setNameFr]         = useState(series?.name_fr          ?? "");
  const [slug,           setSlug]           = useState(series?.slug             ?? "");
  const [descriptionEn,  setDescriptionEn]  = useState(series?.description_en   ?? "");
  const [descriptionFr,  setDescriptionFr]  = useState(series?.description_fr   ?? "");
  const [showDates,      setShowDates]      = useState(series?.show_dates       ?? true);
  const [published,      setPub]            = useState(series?.published        ?? false);
  const [sortOrder,      setSort]           = useState(series?.sort_order       ?? 0);
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
      show_dates: showDates,
      published,
      sort_order: sortOrder,
    };
    
    const { error } = series
      ? await db.from("blog_series").update(payload).eq("id", series.id)
      : await db.from("blog_series").insert(payload);
    
    setSaving(false);
    if (error) { 
      toast.error("Save failed: " + error.message); 
      return; 
    }
    
    toast.success(series ? "Series updated" : "Series created");
    await onSave();
  }

  function handleNameEnChange(val: string) {
    setNameEn(val);
    if (!series && !slug) {
      setSlug(slugify(val));
    }
  }

  return (
    <div className={TW.overlay} onClick={onClose}>
      <div className={TW.panel} onClick={(e) => e.stopPropagation()}>
        <div className={TW.pHead}>
          <div className={TW.fTitle}>{series ? "Edit Series" : "New Series"}</div>
          <button className={TW.iconBtn} onClick={onClose}><X size={16} /></button>
        </div>
        <div className={TW.pBody}>
          <div className={TW.field}>
            <label className={TW.label}>Name (English) *</label>
            <input 
              className={TW.input} 
              value={nameEn} 
              onChange={(e) => handleNameEnChange(e.target.value)} 
              placeholder="e.g. Holiness Series" 
            />
          </div>
          
          <div className={TW.field}>
            <label className={TW.label}>Name (French) *</label>
            <input 
              className={TW.input} 
              value={nameFr} 
              onChange={(e) => setNameFr(e.target.value)} 
              placeholder="e.g. Série sur la Sainteté" 
            />
          </div>
          
          <div className={TW.field}>
            <label className={TW.label}>Slug (URL) *</label>
            <input 
              className={TW.input} 
              value={slug} 
              onChange={(e) => setSlug(slugify(e.target.value))} 
              placeholder="holiness-series" 
            />
            <div className="text-[10px] text-white/30 mt-1.5">
              URL: /blog?series={slug || "..."}
            </div>
          </div>
          
          <div className={TW.field}>
            <label className={TW.label}>Description (English)</label>
            <textarea 
              className={cn(TW.tarea, "min-h-[80px]")} 
              value={descriptionEn} 
              onChange={(e) => setDescriptionEn(e.target.value)} 
              placeholder="Brief description of this series..." 
            />
          </div>
          
          <div className={TW.field}>
            <label className={TW.label}>Description (French)</label>
            <textarea 
              className={cn(TW.tarea, "min-h-[80px]")} 
              value={descriptionFr} 
              onChange={(e) => setDescriptionFr(e.target.value)} 
              placeholder="Brève description de cette série..." 
            />
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
              id="series-show-dates" 
              checked={showDates} 
              onChange={(e) => setShowDates(e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#c9a84c]" 
            />
            <label htmlFor="series-show-dates" className={cn(TW.label, "!mb-0 cursor-pointer")}>
              Show dates for posts in this series
            </label>
          </div>
          
          <div className={cn(TW.field, "flex items-center gap-2.5")}>
            <input 
              type="checkbox" 
              id="series-pub" 
              checked={published} 
              onChange={(e) => setPub(e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#c9a84c]" 
            />
            <label htmlFor="series-pub" className={cn(TW.label, "!mb-0 cursor-pointer")}>
              Publish immediately (visible on site)
            </label>
          </div>
        </div>
        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
          <button className={cn(TW.btn, TW.gold)} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : series ? "Update" : "Create Series"}
          </button>
        </div>
      </div>
    </div>
  );
}
