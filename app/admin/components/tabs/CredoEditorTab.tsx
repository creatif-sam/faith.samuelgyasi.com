import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { CredoContent } from "../types";
import { createClient } from "@/lib/supabase/client";

interface CredoEditorTabProps {
  content: CredoContent | null;
  onSave: () => Promise<void>;
  db: ReturnType<typeof createClient>;
}

export default function CredoEditorTab({ content, onSave, db }: CredoEditorTabProps) {
  const [titleEn, setTitleEn] = useState(content?.title_en ?? "");
  const [titleFr, setTitleFr] = useState(content?.title_fr ?? "");
  const [contentEn, setContentEn] = useState(content?.content_en ?? "");
  const [contentFr, setContentFr] = useState(content?.content_fr ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!titleEn.trim() || !contentEn.trim()) {
      toast.error("English title and content are required");
      return;
    }

    setSaving(true);
    const payload = {
      title_en: titleEn,
      title_fr: titleFr,
      content_en: contentEn,
      content_fr: contentFr,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (content) {
      ({ error } = await db.from("credo_content").update(payload).eq("id", content.id));
    } else {
      ({ error } = await db.from("credo_content").insert({ ...payload, id: crypto.randomUUID() }));
    }

    setSaving(false);
    if (error) {
      toast.error(`Save failed: ${error.message}`);
      return;
    }
    toast.success("Credo saved successfully");
    await onSave();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Credo Editor</div>
          <p className={TW.pgSub}>Edit your faith credo in English and French</p>
        </div>
        <button className={cn(TW.btn, TW.gold)} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-8 max-w-4xl">
        {/* English Section */}
        <div className="border border-white/10 rounded-lg p-6 bg-[#0d0e15]">
          <div className="flex items-center gap-2 mb-5">
            <span className={cn(TW.badge, "bg-blue-500/10 text-blue-400 border border-blue-500/20")}>English</span>
            <h3 className="font-[family-name:'Poppins',sans-serif] text-sm font-semibold text-white/80">English Version</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={TW.label}>Title *</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className={TW.input}
                placeholder="My Credo"
              />
            </div>
            <div>
              <label className={TW.label}>Content *</label>
              <textarea
                value={contentEn}
                onChange={(e) => setContentEn(e.target.value)}
                className={cn(TW.input, "min-h-[280px] resize-y")}
                placeholder="Share your faith credo in English..."
              />
            </div>
          </div>
        </div>

        {/* French Section */}
        <div className="border border-white/10 rounded-lg p-6 bg-[#0d0e15]">
          <div className="flex items-center gap-2 mb-5">
            <span className={cn(TW.badge, "bg-purple-500/10 text-purple-400 border border-purple-500/20")}>Français</span>
            <h3 className="font-[family-name:'Poppins',sans-serif] text-sm font-semibold text-white/80">French Version</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={TW.label}>Titre</label>
              <input
                type="text"
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                className={TW.input}
                placeholder="Mon Credo"
              />
            </div>
            <div>
              <label className={TW.label}>Contenu</label>
              <textarea
                value={contentFr}
                onChange={(e) => setContentFr(e.target.value)}
                className={cn(TW.input, "min-h-[280px] resize-y")}
                placeholder="Partagez votre credo en français..."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
