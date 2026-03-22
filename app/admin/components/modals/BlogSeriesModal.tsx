import { useState } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
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
  const [imageUrl,       setImageUrl]       = useState(series?.image_url        ?? "");
  const [showDates,      setShowDates]      = useState(series?.show_dates       ?? true);
  const [published,      setPub]            = useState(series?.published        ?? false);
  const [sortOrder,      setSort]           = useState(series?.sort_order       ?? 0);
  const [saving,         setSaving]         = useState(false);
  const [uploading,      setUploading]      = useState(false);

  async function uploadSeriesImage(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const filename = `series/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await db.storage.from("blog-images").upload(filename, file, { upsert: true });
    if (error) { 
      toast.error(`Upload failed: ${error.message}`); 
      return null; 
    }
    const { data } = db.storage.from("blog-images").getPublicUrl(filename);
    return data.publicUrl;
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    
    setUploading(true);
    const url = await uploadSeriesImage(file);
    setUploading(false);
    if (url) {
      setImageUrl(url);
      toast.success("Series image uploaded successfully");
    }
  }

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
      image_url: imageUrl.trim() || null,
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
            <label className={TW.label}>Series Cover Image</label>
            
            {/* Image Preview */}
            {imageUrl && (
              <div className="mb-3 relative rounded-lg overflow-hidden border border-white/10">
                <img 
                  src={imageUrl} 
                  alt="Series cover preview" 
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {/* Upload Button */}
            <label className={cn(
              "flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed transition-all cursor-pointer",
              uploading ? "border-[#c9a84c] bg-[#c9a84c]/10 cursor-wait" : "border-white/20 hover:border-[#c9a84c] hover:bg-white/5"
            )}>
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#c9a84c] border-t-transparent" />
                  <span className="text-sm text-white/70">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={16} className="text-[#c9a84c]" />
                  <span className="text-sm text-white/70">
                    {imageUrl ? "Change Image" : "Upload Series Image"}
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            
            <div className="text-[10px] text-white/30 mt-1.5">
              Upload a cover image for this series (JPG, PNG, WebP - max 5MB)
            </div>
            
            {/* Optional: Manual URL input as fallback */}
            <details className="mt-3">
              <summary className="text-[11px] text-white/40 cursor-pointer hover:text-white/60 transition-colors">
                Or enter image URL manually
              </summary>
              <input 
                className={cn(TW.input, "mt-2")} 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
                placeholder="https://example.com/series-image.jpg" 
              />
            </details>
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
