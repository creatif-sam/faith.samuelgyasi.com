import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { MyStoryContent } from "../types";
import { createClient } from "@/lib/supabase/client";

interface MyStoryEditorTabProps {
  story: MyStoryContent | null;
  onSave: () => Promise<void>;
  db: ReturnType<typeof createClient>;
}

export default function MyStoryEditorTab({ story, onSave, db }: MyStoryEditorTabProps) {
  const [titleEn, setTitleEn] = useState(story?.title_en ?? "");
  const [titleFr, setTitleFr] = useState(story?.title_fr ?? "");
  const [contentEn, setContentEn] = useState(story?.content_en ?? "");
  const [contentFr, setContentFr] = useState(story?.content_fr ?? "");
  const [images, setImages] = useState<string[]>(story?.images ?? []);
  const [imageUrl, setImageUrl] = useState("");
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
      images: images,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (story) {
      ({ error } = await db.from("my_story").update(payload).eq("id", story.id));
    } else {
      ({ error } = await db.from("my_story").insert({ ...payload, id: crypto.randomUUID() }));
    }

    setSaving(false);
    if (error) {
      toast.error(`Save failed: ${error.message}`);
      return;
    }
    toast.success("My Story saved successfully");
    await onSave();
  };

  const addImage = () => {
    if (!imageUrl.trim()) return;
    if (images.length >= 6) {
      toast.error("Maximum 6 images allowed");
      return;
    }
    setImages([...images, imageUrl.trim()]);
    setImageUrl("");
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  return (
    <>
      <div className="flex items-center justify-between mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>My Story Editor</div>
          <p className={TW.pgSub}>Edit your personal story in English and French</p>
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
                placeholder="My Story"
              />
            </div>
            <div>
              <label className={TW.label}>Content *</label>
              <textarea
                value={contentEn}
                onChange={(e) => setContentEn(e.target.value)}
                className={cn(TW.input, "min-h-[280px] resize-y")}
                placeholder="Share your story in English..."
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
                placeholder="Mon Histoire"
              />
            </div>
            <div>
              <label className={TW.label}>Contenu</label>
              <textarea
                value={contentFr}
                onChange={(e) => setContentFr(e.target.value)}
                className={cn(TW.input, "min-h-[280px] resize-y")}
                placeholder="Partagez votre histoire en français..."
              />
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="border border-white/10 rounded-lg p-6 bg-[#0d0e15]">
          <div className="flex items-center gap-2 mb-5">
            <span className={cn(TW.badge, "bg-green-500/10 text-green-400 border border-green-500/20")}>Images ({images.length}/6)</span>
            <h3 className="font-[family-name:'Poppins',sans-serif] text-sm font-semibold text-white/80">Photo Gallery</h3>
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={cn(TW.input, "flex-1")}
                placeholder="Image URL"
                onKeyPress={(e) => e.key === "Enter" && addImage()}
              />
              <button className={cn(TW.btn, TW.gold)} onClick={addImage} disabled={images.length >= 6}>
                Add Image
              </button>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-white/10 bg-black/40">
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-500/90 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
