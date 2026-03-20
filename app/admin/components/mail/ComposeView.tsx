import { useState } from "react";
import { Send, AlignLeft, Code, Eye } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { EmailTemplate } from "../types";

interface ComposeViewProps {
  templates: EmailTemplate[];
  onReload: () => Promise<void>;
}

export default function ComposeView({ templates, onReload }: ComposeViewProps) {
  const [to, setTo]     = useState("");
  const [sub, setSub]   = useState("");
  const [body, setBody] = useState("");
  const [mode, setMode] = useState<"html" | "text">("html");
  const [prev, setPrev] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tpl, setTpl]   = useState("");

  function loadTpl(id: string) {
    const t = templates.find((t) => t.id === id);
    if (t) { setSub(t.subject); setBody(mode === "html" ? t.body_html : t.body_text); }
    setTpl(id);
  }

  async function send() {
    if (!to.trim())   { toast.error("Recipient required"); return; }
    if (!sub.trim())  { toast.error("Subject required");   return; }
    if (!body.trim()) { toast.error("Body required");      return; }
    setBusy(true);
    const r = await fetch("/api/mail/send", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject: sub, bodyHtml: mode === "html" ? body : undefined, bodyText: mode === "text" ? body : undefined, templateId: tpl || undefined }),
    });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) { toast.error(d.error ?? "Failed"); return; }
    toast.success(`Email sent to ${to}`);
    setTo(""); setSub(""); setBody(""); setTpl("");
    await onReload();
  }

  return (
    <div className={TW.compose}>
      <div className="flex gap-2 items-center mb-6 flex-wrap">
        {templates.length > 0 && (
          <select className={cn(TW.select, "flex-1 max-w-[260px] text-xs py-2 px-[11px]")} value={tpl} onChange={(e) => loadTpl(e.target.value)}>
            <option value="">— Load template —</option>
            {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        )}
        <div className="flex gap-1.5 ml-auto">
          <button className={cn(TW.btn, TW.sm, mode === "text" ? TW.gold : TW.ghost)} onClick={() => setMode("text")}><AlignLeft size={9} />Plain text</button>
          <button className={cn(TW.btn, TW.sm, mode === "html" ? TW.gold : TW.ghost)} onClick={() => setMode("html")}><Code size={9} />HTML</button>
          {mode === "html" && <button className={cn(TW.btn, TW.sm, prev ? TW.gold : TW.ghost)} onClick={() => setPrev(!prev)}><Eye size={9} />Preview</button>}
        </div>
      </div>

      <div className={TW.field}><label className={TW.label}>To</label><input className={TW.input} type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@email.com" /></div>
      <div className={TW.field}><label className={TW.label}>Subject</label><input className={TW.input} value={sub} onChange={(e) => setSub(e.target.value)} placeholder="Email subject" /></div>
      <div className={TW.field}>
        <label className={TW.label}>{mode === "html" ? "Body (HTML)" : "Body (Plain text)"} <span className="text-white/20 ml-1.5">{body.length} chars</span></label>
        {prev && mode === "html"
          ? <div className="bg-white text-black rounded-lg p-4 overflow-auto max-h-[400px]" dangerouslySetInnerHTML={{ __html: body }} />
          : <textarea className={cn(TW.tarea, "min-h-[300px]", mode === "html" && "font-mono text-[13px]")} value={body} onChange={(e) => setBody(e.target.value)} placeholder={mode === "html" ? "<h1>Hello,</h1>\n<p>Your message here.</p>" : "Hello,\n\nYour message here."} />
        }
      </div>
      <div className="flex justify-end">
        <button className={cn(TW.btn, TW.gold)} onClick={send} disabled={busy}><Send size={11} />{busy ? "Sending..." : "Send Email"}</button>
      </div>
    </div>
  );
}
