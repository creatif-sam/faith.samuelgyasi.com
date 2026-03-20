import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { Testimonial } from "../types";
import { createClient } from "@/lib/supabase/client";

interface TestimonialModalProps {
  testimonial: Testimonial | null;
  onClose: () => void;
  onSave: () => Promise<void>;
  db: ReturnType<typeof createClient>;
}

export default function TestimonialModal({ testimonial, onClose, onSave, db }: TestimonialModalProps) {
  const [name,      setName]      = useState(testimonial?.name       ?? "");
  const [role,      setRole]      = useState(testimonial?.role       ?? "");
  const [company,   setCompany]   = useState(testimonial?.company    ?? "");
  const [avatarUrl, setAvatarUrl] = useState(testimonial?.avatar_url ?? "");
  const [quote,     setQuote]     = useState(testimonial?.quote      ?? "");
  const [rating,    setRating]    = useState(testimonial?.rating     ?? 5);
  const [published, setPub]       = useState(testimonial?.published  ?? false);
  const [sortOrder, setSort]       = useState(testimonial?.sort_order ?? 0);
  const [saving,    setSaving]    = useState(false);

  async function handleSave() {
    if (!name.trim() || !quote.trim()) { toast.error("Name and quote are required"); return; }
    setSaving(true);
    const payload = {
      name: name.trim(),
      role: role.trim() || null,
      company: company.trim() || null,
      avatar_url: avatarUrl.trim() || null,
      quote: quote.trim(),
      rating,
      published,
      sort_order: sortOrder,
    };
    const { error } = testimonial
      ? await db.from("testimonials").update(payload).eq("id", testimonial.id)
      : await db.from("testimonials").insert(payload);
    setSaving(false);
    if (error) { toast.error("Save failed: " + error.message); return; }
    toast.success(testimonial ? "Testimonial updated" : "Testimonial added");
    await onSave();
  }

  return (
    <div className={TW.overlay} onClick={onClose}>
      <div className={TW.panel} onClick={(e) => e.stopPropagation()}>
        <div className={TW.pHead}>
          <div className={TW.fTitle}>{testimonial ? "Edit Testimonial" : "New Testimonial"}</div>
          <button className={TW.iconBtn} onClick={onClose}><X size={16} /></button>
        </div>
        <div className={TW.pBody}>
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Name *</label><input className={TW.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" /></div>
            <div className={TW.field}><label className={TW.label}>Role</label><input className={TW.input} value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Professor, Director" /></div>
          </div>
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Company / Organisation</label><input className={TW.input} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. UM6P, World Bank" /></div>
            <div className={TW.field}><label className={TW.label}>Avatar URL</label><input className={TW.input} value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." /></div>
          </div>
          <div className={TW.field}><label className={TW.label}>Quote *</label><textarea className={cn(TW.tarea, "min-h-[100px]")} value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="What did they say about Samuel?" /></div>
          <div className={TW.fRow}>
            <div className={TW.field}>
              <label className={TW.label}>Rating (1–5)</label>
              <div className="flex gap-1.5 items-center">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)}
                    className="bg-transparent border-0 cursor-pointer text-[24px] p-0"
                    style={{ color: n <= rating ? "#c9a84c" : "rgba(201,168,76,.2)" }}>★</button>
                ))}
              </div>
            </div>
            <div className={TW.field}><label className={TW.label}>Sort Order (lower = first)</label><input className={TW.input} type="number" min={0} value={sortOrder} onChange={(e) => setSort(Number(e.target.value))} /></div>
          </div>
          <div className={cn(TW.field, "flex items-center gap-2.5")}>
            <input type="checkbox" id="ts-pub" checked={published} onChange={(e) => setPub(e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#c9a84c]" />
            <label htmlFor="ts-pub" className={cn(TW.label, "!mb-0 cursor-pointer")}>Publish immediately (visible on site)</label>
          </div>
        </div>
        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
          <button className={cn(TW.btn, TW.gold)} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : testimonial ? "Update" : "Add Testimonial"}
          </button>
        </div>
      </div>
    </div>
  );
}
