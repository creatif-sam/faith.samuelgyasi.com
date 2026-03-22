import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW, slugify } from "../constants";
import { FaithTest } from "../types";
import { createClient } from "@/lib/supabase/client";

interface FaithTestModalProps {
  test: FaithTest | null;
  onClose: () => void;
  onSave: () => Promise<void>;
  db: ReturnType<typeof createClient>;
}

export default function FaithTestModal({ test, onClose, onSave, db }: FaithTestModalProps) {
  const [nameEn,        setNameEn]        = useState(test?.name_en         ?? "");
  const [nameFr,        setNameFr]        = useState(test?.name_fr         ?? "");
  const [slug,          setSlug]          = useState(test?.slug            ?? "");
  const [descriptionEn, setDescriptionEn] = useState(test?.description_en  ?? "");
  const [descriptionFr, setDescriptionFr] = useState(test?.description_fr  ?? "");
  const [disclaimerEn,  setDisclaimerEn]  = useState(test?.disclaimer_en   ?? "");
  const [disclaimerFr,  setDisclaimerFr]  = useState(test?.disclaimer_fr   ?? "");
  const [published,     setPub]           = useState(test?.published       ?? false);
  const [sortOrder,     setSort]          = useState(test?.sort_order      ?? 0);
  const [saving,        setSaving]        = useState(false);

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
      disclaimer_en: disclaimerEn.trim() || null,
      disclaimer_fr: disclaimerFr.trim() || null,
      published,
      sort_order: sortOrder,
      // total_takes is managed automatically, don't include in insert/update
    };
    
    const { error } = test
      ? await db.from("faith_tests").update(payload).eq("id", test.id)
      : await db.from("faith_tests").insert(payload);
    
    setSaving(false);
    if (error) { 
      toast.error("Save failed: " + error.message); 
      return; 
    }
    
    toast.success(test ? "Test updated" : "Test created");
    await onSave();
  }

  function handleNameEnChange(val: string) {
    setNameEn(val);
    if (!test && !slug) {
      setSlug(slugify(val));
    }
  }

  return (
    <div className={TW.overlay} onClick={onClose}>
      <div className={TW.panel} onClick={(e) => e.stopPropagation()}>
        <div className={TW.pHead}>
          <div className={TW.fTitle}>{test ? "Edit Test" : "New Test"}</div>
          <button className={TW.iconBtn} onClick={onClose}><X size={16} /></button>
        </div>
        <div className={TW.pBody}>
          <div className={TW.field}>
            <label className={TW.label}>Test Name (English) *</label>
            <input 
              className={TW.input} 
              value={nameEn} 
              onChange={(e) => handleNameEnChange(e.target.value)} 
              placeholder="e.g. Laziness Test, Purpose Test" 
            />
          </div>
          
          <div className={TW.field}>
            <label className={TW.label}>Test Name (French) *</label>
            <input 
              className={TW.input} 
              value={nameFr} 
              onChange={(e) => setNameFr(e.target.value)} 
              placeholder="e.g. Test de Paresse" 
            />
          </div>
          
          <div className={TW.field}>
            <label className={TW.label}>Slug (URL) *</label>
            <input 
              className={TW.input} 
              value={slug} 
              onChange={(e) => setSlug(slugify(e.target.value))} 
              placeholder="laziness-test" 
            />
            <div className="text-[10px] text-white/30 mt-1.5">
              URL: /faith-analyzer/{slug || "..."}
            </div>
          </div>
          
          <div className={TW.field}>
            <label className={TW.label}>Description (English)</label>
            <textarea 
              className={cn(TW.tarea, "min-h-[80px]")} 
              value={descriptionEn} 
              onChange={(e) => setDescriptionEn(e.target.value)} 
              placeholder="What does this test measure?" 
            />
          </div>
          
          <div className={TW.field}>
            <label className={TW.label}>Description (French)</label>
            <textarea 
              className={cn(TW.tarea, "min-h-[80px]")} 
              value={descriptionFr} 
              onChange={(e) => setDescriptionFr(e.target.value)} 
              placeholder="Que mesure ce test?" 
            />
          </div>
          
          <div className={TW.field}>
            <label className={TW.label}>Disclaimer (English)</label>
            <textarea 
              className={cn(TW.tarea, "min-h-[100px]")} 
              value={disclaimerEn} 
              onChange={(e) => setDisclaimerEn(e.target.value)} 
              placeholder="Important notice shown before taking the test..." 
            />
            <div className="text-[10px] text-white/30 mt-1.5">
              Shown at the top of the test page before questions
            </div>
          </div>
          
          <div className={TW.field}>
            <label className={TW.label}>Disclaimer (French)</label>
            <textarea 
              className={cn(TW.tarea, "min-h-[100px]")} 
              value={disclaimerFr} 
              onChange={(e) => setDisclaimerFr(e.target.value)} 
              placeholder="Avis important affiché avant de passer le test..." 
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
              id="test-pub" 
              checked={published} 
              onChange={(e) => setPub(e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#c9a84c]" 
            />
            <label htmlFor="test-pub" className={cn(TW.label, "!mb-0 cursor-pointer")}>
              Publish immediately (visible on site)
            </label>
          </div>
        </div>
        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
          <button className={cn(TW.btn, TW.gold)} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : test ? "Update" : "Create Test"}
          </button>
        </div>
      </div>
    </div>
  );
}
