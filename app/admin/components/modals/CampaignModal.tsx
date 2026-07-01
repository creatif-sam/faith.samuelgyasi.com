import { useState } from "react";
import { X, Code, AlignLeft, Eye, Send, Save } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { EmailCampaign, EmailTemplate, Subscriber, CampaignRecipientType } from "../types";

interface CampaignModalProps {
  campaign: EmailCampaign | null;
  templates: EmailTemplate[];
  subs: Subscriber[];
  onClose: () => void;
  onSave: () => Promise<void>;
}

const INTERESTS = [
  { value: "all",          label: "All Subscribers" },
  { value: "faith",        label: "Faith & Spirituality" },
  { value: "theology",     label: "Theology" },
  { value: "prayer",       label: "Prayer & Devotion" },
  { value: "scripture",    label: "Scripture Study" },
  { value: "discipleship", label: "Discipleship" },
];

export default function CampaignModal({ campaign, templates, subs, onClose, onSave }: CampaignModalProps) {
  const [subject, setSubject] = useState(campaign?.subject ?? "");
  const [html, setHtml]       = useState(campaign?.body_html ?? "");
  const [text, setText]       = useState(campaign?.body_text ?? "");
  const [bodyTab, setBodyTab] = useState<"html" | "text">("html");
  const [prev, setPrev]       = useState(false);
  const [tplId, setTplId]     = useState(campaign?.template_id ?? "");
  const [recipientType, setRecipientType] = useState<CampaignRecipientType>(campaign?.recipient_type ?? "custom");
  const [interest, setInterest] = useState(campaign?.recipient_filter ?? "all");
  const [emailsText, setEmailsText] = useState((campaign?.recipient_emails ?? []).join("\n"));
  const [busy, setBusy] = useState<"draft" | "send" | null>(null);

  const confirmedSubs = subs.filter((s) => s.confirmed);
  const matchingSubs = interest === "all"
    ? confirmedSubs
    : confirmedSubs.filter((s) => s.interests?.includes(interest));
  const customEmails = Array.from(new Set(emailsText.split(/[\n,]/).map((e) => e.trim()).filter(Boolean)));
  const recipientCount = recipientType === "custom" ? customEmails.length : matchingSubs.length;

  function loadTpl(id: string) {
    const t = templates.find((t) => t.id === id);
    if (t) { setSubject(t.subject); setHtml(t.body_html); setText(t.body_text ?? ""); }
    setTplId(id);
  }

  async function submit(action: "draft" | "send") {
    if (!subject.trim()) { toast.error("Subject required"); return; }
    if (!html.trim())    { toast.error("Email body required"); return; }
    if (action === "send" && recipientCount === 0) { toast.error("No recipients match this campaign"); return; }
    if (action === "send" && !window.confirm(`Send this email to ${recipientCount} recipient${recipientCount === 1 ? "" : "s"} now?`)) return;

    setBusy(action);
    const r = await fetch("/api/mail/campaigns", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: campaign?.id,
        subject, bodyHtml: html, bodyText: text || undefined,
        templateId: tplId || undefined,
        recipientType,
        recipientFilter: recipientType === "subscribers" ? interest : undefined,
        recipientEmails: recipientType === "custom" ? customEmails : undefined,
        action,
      }),
    });
    const d = await r.json();
    setBusy(null);
    if (!r.ok) { toast.error(d.error ?? "Failed"); return; }
    toast.success(action === "draft" ? "Campaign saved as draft" : `Campaign sent to ${d.sent_count ?? recipientCount} recipient(s)`);
    await onSave();
  }

  return (
    <div className={TW.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={TW.modal}>
        <div className="flex justify-between items-center mb-6">
          <div className={TW.fTitle}>{campaign ? "Edit Campaign" : "New Campaign"}</div>
          <button onClick={onClose} className="bg-transparent border-0 text-white/40 cursor-pointer p-0"><X size={16} /></button>
        </div>

        {templates.length > 0 && (
          <div className={TW.field}>
            <label className={TW.label}>Load from Template</label>
            <select className={TW.select} value={tplId} onChange={(e) => loadTpl(e.target.value)}>
              <option value="">— None —</option>
              {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        )}

        <div className={TW.field}>
          <label className={TW.label}>Subject *</label>
          <input className={TW.input} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject line" />
        </div>

        <div className={TW.field}>
          <label className={TW.label}>Recipients *</label>
          <div className="flex gap-1.5 mb-3">
            <button type="button" className={cn(TW.btn, TW.sm, recipientType === "custom" ? TW.gold : TW.ghost)} onClick={() => setRecipientType("custom")}>Custom List</button>
            <button type="button" className={cn(TW.btn, TW.sm, recipientType === "subscribers" ? TW.gold : TW.ghost)} onClick={() => setRecipientType("subscribers")}>Newsletter Subscribers</button>
          </div>
          {recipientType === "custom" ? (
            <textarea className={cn(TW.tarea, "min-h-[100px]")} value={emailsText} onChange={(e) => setEmailsText(e.target.value)} placeholder={"one@email.com\ntwo@email.com"} />
          ) : (
            <select className={TW.select} value={interest} onChange={(e) => setInterest(e.target.value)}>
              {INTERESTS.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
            </select>
          )}
          <p className="font-poppins text-[11px] text-white/35 mt-2">{recipientCount} recipient{recipientCount === 1 ? "" : "s"} will receive this email</p>
        </div>

        <div className="flex gap-1.5 mb-3 items-center">
          <button type="button" className={cn(TW.btn, TW.sm, bodyTab === "html" ? TW.gold : TW.ghost)} onClick={() => setBodyTab("html")}><Code size={9} />HTML Body</button>
          <button type="button" className={cn(TW.btn, TW.sm, bodyTab === "text" ? TW.gold : TW.ghost)} onClick={() => setBodyTab("text")}><AlignLeft size={9} />Plain Text</button>
          {bodyTab === "html" && <button type="button" className={cn(TW.btn, TW.sm, prev ? TW.gold : TW.ghost, "ml-auto")} onClick={() => setPrev(!prev)}><Eye size={9} />Preview</button>}
        </div>
        {bodyTab === "html" ? (
          <div className={TW.field}>
            <label className={TW.label}>Email Body (HTML supported) * <span className="text-white/20">{html.length} chars</span></label>
            {prev
              ? <div className="bg-white text-black rounded-lg p-4 overflow-auto max-h-[400px]" dangerouslySetInnerHTML={{ __html: html }} />
              : <textarea className={cn(TW.tarea, "font-mono text-[13px]")} value={html} onChange={(e) => setHtml(e.target.value)} placeholder="<h1>Hello,</h1><p>Your content here.</p>" />
            }
          </div>
        ) : (
          <div className={TW.field}>
            <label className={TW.label}>Plain Text Fallback <span className="text-white/20">{text.length} chars</span></label>
            <textarea className={TW.tarea} value={text} onChange={(e) => setText(e.target.value)} placeholder={"Hello,\n\nYour content here."} />
          </div>
        )}

        <div className="flex gap-2.5 justify-end mt-6">
          <button type="button" className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
          <button type="button" className={cn(TW.btn, TW.ghost)} disabled={busy !== null} onClick={() => submit("draft")}><Save size={11} />{busy === "draft" ? "Saving..." : "Save Draft"}</button>
          <button type="button" className={cn(TW.btn, TW.gold)} disabled={busy !== null} onClick={() => submit("send")}><Send size={11} />{busy === "send" ? "Sending..." : "Send Now"}</button>
        </div>
      </div>
    </div>
  );
}
