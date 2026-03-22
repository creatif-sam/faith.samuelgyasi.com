import { useState, useEffect } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";

interface DiscipleshipContent {
  id: string;
  title_en: string;
  title_fr: string;
  content_en: string;
  content_fr: string;
  published: boolean;
  sort_order: number;
}

interface DiscipleshipTabProps {
  content: DiscipleshipContent | null;
  onSave: () => Promise<void>;
  db: SupabaseClient;
}

export default function DiscipleshipTab({ content, onSave, db }: DiscipleshipTabProps) {
  const [titleEn, setTitleEn] = useState("");
  const [titleFr, setTitleFr] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentFr, setContentFr] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (content) {
      setTitleEn(content.title_en);
      setTitleFr(content.title_fr);
      setContentEn(content.content_en);
      setContentFr(content.content_fr);
      setPublished(content.published);
    }
  }, [content]);

  const handleSave = async () => {
    if (!titleEn.trim() || !titleFr.trim() || !contentEn.trim() || !contentFr.trim()) {
      toast.error("All fields are required");
      return;
    }

    setSaving(true);
    
    const payload = {
      title_en: titleEn,
      title_fr: titleFr,
      content_en: contentEn,
      content_fr: contentFr,
      published,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (content?.id) {
      ({ error } = await db.from("discipleship_content").update(payload).eq("id", content.id));
    } else {
      ({ error } = await db.from("discipleship_content").insert([{ ...payload, sort_order: 0 }]));
    }

    setSaving(false);
    
    if (error) {
      toast.error("Save failed");
      console.error(error);
      return;
    }

    toast.success("Discipleship content saved");
    await onSave();
  };

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Discipleship</div>
          <p className={TW.pgSub}>Manage discipleship content (bilingual EN/FR)</p>
        </div>
        <button 
          className={cn(TW.btn, TW.gold)} 
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={12} />
          {saving ? "Saving..." : "Save Content"}
        </button>
      </div>

      <div className="max-w-[900px] space-y-6">
        {/* Published Toggle */}
        <div className={TW.field}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-5 h-5 rounded border border-white/20 bg-white/5 checked:bg-[#d4a843] checked:border-[#d4a843] cursor-pointer"
            />
            <span className={TW.label + " !mb-0"}>Published</span>
          </label>
        </div>

        {/* English Section */}
        <div className="p-6 bg-white/[.02] border border-white/[.06] rounded-lg">
          <h3 className="font-poppins text-[14px] font-semibold text-[#d4a843] mb-4">English Version</h3>
          
          <div className={TW.field}>
            <label className={TW.label}>Title (EN)</label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className={TW.input}
              placeholder="Enter English title"
            />
          </div>

          <div className={TW.field}>
            <label className={TW.label}>Content (EN)</label>
            <textarea
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              className={TW.tarea}
              placeholder="Enter English content (Markdown supported)"
              rows={12}
            />
          </div>
        </div>

        {/* French Section */}
        <div className="p-6 bg-white/[.02] border border-white/[.06] rounded-lg">
          <h3 className="font-poppins text-[14px] font-semibold text-[#d4a843] mb-4">Version Française</h3>
          
          <div className={TW.field}>
            <label className={TW.label}>Title (FR)</label>
            <input
              type="text"
              value={titleFr}
              onChange={(e) => setTitleFr(e.target.value)}
              className={TW.input}
              placeholder="Entrez le titre en français"
            />
          </div>

          <div className={TW.field}>
            <label className={TW.label}>Content (FR)</label>
            <textarea
              value={contentFr}
              onChange={(e) => setContentFr(e.target.value)}
              className={TW.tarea}
              placeholder="Entrez le contenu en français (Markdown supporté)"
              rows={12}
            />
          </div>
        </div>
      </div>
    </>
  );
}
