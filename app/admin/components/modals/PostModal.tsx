import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW, CATEGORIES, slugify } from "../constants";
import type { DefaultCategory } from "../constants";
import { BlogPost } from "../types";
import { createClient } from "@/lib/supabase/client";

interface PostModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onSave: () => Promise<void>;
  db: ReturnType<typeof createClient>;
}

export default function PostModal({ post, onClose, onSave, db }: PostModalProps) {
  const [form, setForm] = useState({
    title:              post?.title              ?? "",
    title_fr:           post?.title_fr           ?? "",
    slug:               post?.slug               ?? "",
    category:           post?.category           ?? "faith",
    excerpt:            post?.excerpt            ?? "",
    excerpt_fr:         post?.excerpt_fr         ?? "",
    content:            post?.content            ?? "",
    content_fr:         post?.content_fr         ?? "",
    read_time_minutes:  post?.read_time_minutes  ?? 5,
    featured_image_url: post?.featured_image_url ?? "",
    infographie_url:    post?.infographie_url    ?? "",
    published:          post?.published          ?? false,
  });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState({ cover: false, infographie: false });

  function setF<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function uploadImage(file: File, folder: string): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await db.storage.from("blog-images").upload(filename, file, { upsert: true });
    if (error) { toast.error(`Upload failed: ${error.message}`); return null; }
    const { data } = db.storage.from("blog-images").getPublicUrl(filename);
    return data.publicUrl;
  }

  async function handleCoverPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading((p) => ({ ...p, cover: true }));
    const url = await uploadImage(file, "covers");
    setUploading((p) => ({ ...p, cover: false }));
    if (url) setF("featured_image_url", url);
  }

  async function handleInfographie(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading((p) => ({ ...p, infographie: true }));
    const url = await uploadImage(file, "infographies");
    setUploading((p) => ({ ...p, infographie: false }));
    if (url) setF("infographie_url", url);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title required"); return; }
    if (!form.slug.trim())  { toast.error("Slug required"); return; }
    setBusy(true);
    const { error } = post
      ? await db.from("blog_posts").update({ ...form, updated_at: new Date().toISOString() }).eq("id", post.id)
      : await db.from("blog_posts").insert({ ...form, author: "Samuel Kobina Gyasi" });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(post ? "Post updated" : "Post created");
    await onSave();
  }

  return (
    <div className={TW.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={TW.modal} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div className={TW.fTitle}>{post ? "Edit Post" : "New Blog Post"}</div>
          <button onClick={onClose} className={TW.iconBtn}><X size={16} /></button>
        </div>
        <form onSubmit={save}>
          <div className={TW.field}><label className={TW.label}>Title *</label>
            <input className={TW.input} value={form.title} onChange={(e) => { setF("title", e.target.value); if (!post) setF("slug", slugify(e.target.value)); }} placeholder="Post title" required />
          </div>
          <div className={TW.field}><label className={TW.label}>Title (French)</label>
            <input className={TW.input} value={form.title_fr} onChange={(e) => setF("title_fr", e.target.value)} placeholder="Titre du post" />
          </div>
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Slug *</label><input className={TW.input} value={form.slug} onChange={(e) => setF("slug", e.target.value)} placeholder="url-slug" required /></div>
            <div className={TW.field}><label className={TW.label}>Category *</label>
              <select className={TW.select} value={CATEGORIES.includes(form.category as DefaultCategory) ? form.category : "_custom"} onChange={(e) => {
                if (e.target.value !== "_custom") setF("category", e.target.value);
                else setF("category", "");
              }}>
                <option value="faith">Faith</option>
                <option value="problems-and-solutions">Problems &amp; Solutions</option>
                <option value="wisdom">Wisdom</option>
                <option value="leadership">Leadership</option>
                <option value="_custom">+ New category…</option>
              </select>
              {(!CATEGORIES.includes(form.category as DefaultCategory) || form.category === "") && (
                <input
                  className={cn(TW.input, "mt-2")}
                  value={form.category === "_custom" ? "" : form.category}
                  onChange={(e) => setF("category", e.target.value)}
                  placeholder="Type new category name…"
                  required
                />
              )}
            </div>
          </div>
          <div className={TW.field}><label className={TW.label}>Excerpt</label><textarea className={cn(TW.tarea, "min-h-[80px]")} value={form.excerpt} onChange={(e) => setF("excerpt", e.target.value)} placeholder="Short summary…" /></div>
          <div className={TW.field}><label className={TW.label}>Excerpt (French)</label><textarea className={cn(TW.tarea, "min-h-[80px]")} value={form.excerpt_fr} onChange={(e) => setF("excerpt_fr", e.target.value)} placeholder="Résumé court…" /></div>
          <div className={TW.field}><label className={TW.label}>Content (HTML)</label><textarea className={TW.tarea} value={form.content} onChange={(e) => setF("content", e.target.value)} placeholder="<p>Full article…</p>" /></div>
          <div className={TW.field}><label className={TW.label}>Content (French, HTML)</label><textarea className={TW.tarea} value={form.content_fr} onChange={(e) => setF("content_fr", e.target.value)} placeholder="<p>Article complet…</p>" /></div>
          <div className={TW.fRow}>
            <div className={TW.field}>
              <label className={TW.label}>Cover Photo</label>
              <label className={cn(TW.input, "flex items-center gap-3 cursor-pointer py-2.5 px-4 border-dashed")}>
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverPhoto} disabled={uploading.cover} />
                {uploading.cover ? (
                  <span className="text-white/40 text-sm">Uploading…</span>
                ) : form.featured_image_url ? (
                  <><img src={form.featured_image_url} alt="cover" className="w-10 h-10 object-cover rounded" /><span className="text-white/50 text-xs truncate max-w-[140px]">{form.featured_image_url.split("/").pop()}</span></>
                ) : (
                  <span className="text-white/30 text-sm">Click to upload cover photo…</span>
                )}
              </label>
            </div>
            <div className={TW.field}><label className={TW.label}>Read Time (min)</label><input className={TW.input} type="number" min={1} max={60} value={form.read_time_minutes} onChange={(e) => setF("read_time_minutes", parseInt(e.target.value, 10) || 5)} /></div>
          </div>
          <div className={TW.field}>
            <label className={TW.label}>Summary Infographie</label>
            <label className={cn(TW.input, "flex items-center gap-3 cursor-pointer py-2.5 px-4 border-dashed")}>
              <input type="file" accept="image/*" className="hidden" onChange={handleInfographie} disabled={uploading.infographie} />
              {uploading.infographie ? (
                <span className="text-white/40 text-sm">Uploading…</span>
              ) : form.infographie_url ? (
                <><img src={form.infographie_url} alt="infographie" className="w-10 h-10 object-cover rounded" /><span className="text-white/50 text-xs truncate max-w-[280px]">{form.infographie_url.split("/").pop()}</span></>
              ) : (
                <span className="text-white/30 text-sm">Click to upload summary infographie…</span>
              )}
            </label>
          </div>
          <div className="flex items-center gap-3 mb-5 py-4 border-y border-white/[.05]">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={() => setF("published", !form.published)} className="sr-only peer" />
              <div className="w-10 h-5 bg-white/10 rounded-full peer-checked:bg-[rgba(212,168,67,.7)] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
            </label>
            <span className="font-mono text-[9px] tracking-[.1em] text-white/50">{form.published ? "Published — visible on site" : "Draft — not visible"}</span>
          </div>
          <div className="flex gap-2.5 justify-end mt-6">
            <button type="button" className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
            <button type="submit" className={cn(TW.btn, TW.gold)} disabled={busy}>{busy ? "Saving..." : post ? "Save Changes" : "Create Post"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
