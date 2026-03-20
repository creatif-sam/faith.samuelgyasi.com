import { useState } from "react";
import { X, Code, AlignLeft, Eye } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { EmailTemplate } from "../types";

interface TplModalProps {
  tpl: EmailTemplate | null;
  onClose: () => void;
  onSave: () => Promise<void>;
}

export default function TplModal({ tpl, onClose, onSave }: TplModalProps) {
  const [name, setName] = useState(tpl?.name     ?? "");
  const [subj, setSubj] = useState(tpl?.subject  ?? "");
  const [html, setHtml] = useState(tpl?.body_html ?? "");
  const [text, setText] = useState(tpl?.body_text ?? "");
  const [tab, setTab]   = useState<"html" | "text">("html");
  const [prev, setPrev] = useState(false);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name required");    return; }
    if (!subj.trim()) { toast.error("Subject required"); return; }
    setBusy(true);
    const r = await fetch("/api/mail/templates", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: tpl?.id, name, subject: subj, bodyHtml: html, bodyText: text }),
    });
    setBusy(false);
    if (!r.ok) { toast.error("Save failed"); return; }
    toast.success(tpl ? "Template updated" : "Template created");
    await onSave();
  }

  return (
    <div className={TW.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={TW.modal}>
        <div className="flex justify-between items-center mb-6">
          <div className={TW.fTitle}>{tpl ? "Edit Template" : "New Template"}</div>
          <button onClick={onClose} className="bg-transparent border-0 text-white/40 cursor-pointer p-0"><X size={16} /></button>
        </div>
        <form onSubmit={save}>
          <div className={TW.field}><label className={TW.label}>Template Name *</label><input className={TW.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Welcome Email" required /></div>
          <div className={TW.field}><label className={TW.label}>Subject *</label><input className={TW.input} value={subj} onChange={(e) => setSubj(e.target.value)} placeholder="Email subject line" required /></div>
          <div className="flex gap-1.5 mb-3 items-center">
            <button type="button" className={cn(TW.btn, TW.sm, tab === "html" ? TW.gold : TW.ghost)} onClick={() => setTab("html")}><Code size={9} />HTML Body</button>
            <button type="button" className={cn(TW.btn, TW.sm, tab === "text" ? TW.gold : TW.ghost)} onClick={() => setTab("text")}><AlignLeft size={9} />Plain Text</button>
            {tab === "html" && <button type="button" className={cn(TW.btn, TW.sm, prev ? TW.gold : TW.ghost, "ml-auto")} onClick={() => setPrev(!prev)}><Eye size={9} />Preview</button>}
          </div>
          {tab === "html" && (
            <div className={TW.field}>
              <label className={TW.label}>HTML <span className="text-white/20">{html.length} chars</span></label>
              {prev
                ? <div className="bg-white text-black rounded-lg p-4 overflow-auto max-h-[400px]" dangerouslySetInnerHTML={{ __html: html }} />
                : <textarea className={cn(TW.tarea, "font-mono text-[13px]")} value={html} onChange={(e) => setHtml(e.target.value)} placeholder="<h1>Hello,</h1><p>Your content here.</p>" />
              }
            </div>
          )}
          {tab === "text" && (
            <div className={TW.field}>
              <label className={TW.label}>Plain Text Fallback <span className="text-white/20">{text.length} chars</span></label>
              <textarea className={TW.tarea} value={text} onChange={(e) => setText(e.target.value)} placeholder={"Hello,\n\nYour content here."} />
            </div>
          )}
          <div className="flex gap-2.5 justify-end mt-6">
            <button type="button" className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
            <button type="submit" className={cn(TW.btn, TW.gold)} disabled={busy}>{busy ? "Saving..." : tpl ? "Save Changes" : "Create Template"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
