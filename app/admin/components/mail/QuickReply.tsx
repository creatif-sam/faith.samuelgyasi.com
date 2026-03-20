import { useState } from "react";
import { X, AlignLeft, Code, Send } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { EmailTemplate } from "../types";

interface QuickReplyProps {
  to: string;
  subject: string;
  templates: EmailTemplate[];
  onClose: () => void;
}

export default function QuickReply({ to, subject, templates, onClose }: QuickReplyProps) {
  const [body, setBody] = useState("");
  const [mode, setMode] = useState<"text" | "html">("text");
  const [busy, setBusy] = useState(false);
  const [tpl, setTpl]   = useState("");

  function applyTpl(id: string) {
    const t = templates.find((t) => t.id === id);
    if (t) setBody(mode === "html" ? t.body_html : t.body_text);
    setTpl(id);
  }

  async function send() {
    if (!body.trim()) { toast.error("Body required"); return; }
    setBusy(true);
    const r = await fetch("/api/mail/send", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, bodyHtml: mode === "html" ? body : undefined, bodyText: mode === "text" ? body : undefined }),
    });
    setBusy(false);
    if (!r.ok) { const d = await r.json(); toast.error(d.error ?? "Failed"); return; }
    toast.success(`Reply sent to ${to}`);
    onClose();
  }

  return (
    <div className={TW.qReply}>
      <div className="flex justify-between mb-2.5">
        <span className="font-mono text-[9px] text-white/45 tracking-[.1em] uppercase">Reply to {to}</span>
        <button className="bg-transparent border-0 text-white/35 cursor-pointer p-0" onClick={onClose}><X size={13} /></button>
      </div>
      {templates.length > 0 && (
        <select className={cn(TW.select, "text-xs py-[7px] px-2.5 mb-2")} value={tpl} onChange={(e) => applyTpl(e.target.value)}>
          <option value="">— Load template —</option>
          {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      )}
      <div className="flex gap-1.5 mb-2">
        <button className={cn(TW.btn, TW.sm, mode === "text" ? TW.gold : TW.ghost)} onClick={() => setMode("text")}><AlignLeft size={9} />Text</button>
        <button className={cn(TW.btn, TW.sm, mode === "html" ? TW.gold : TW.ghost)} onClick={() => setMode("html")}><Code size={9} />HTML</button>
      </div>
      <textarea className={cn(TW.tarea, "min-h-[110px]")} value={body} onChange={(e) => setBody(e.target.value)} placeholder={mode === "html" ? "<p>Your reply...</p>" : "Your reply..."} />
      <div className="flex justify-end mt-2">
        <button className={cn(TW.btn, TW.gold)} onClick={send} disabled={busy}><Send size={10} />{busy ? "Sending..." : "Send Reply"}</button>
      </div>
    </div>
  );
}
