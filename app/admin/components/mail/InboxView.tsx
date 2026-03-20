import { useState } from "react";
import { CheckCheck, Reply, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { InboundEmail, EmailTemplate } from "../types";
import QuickReply from "./QuickReply";

interface InboxViewProps {
  emails: InboundEmail[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any;
  onReload: () => Promise<void>;
  templates: EmailTemplate[];
}

export default function InboxView({ emails, db, onReload, templates }: InboxViewProps) {
  const [exp, setExp]         = useState<string | null>(null);
  const [rply, setRply]       = useState<InboundEmail | null>(null);
  const [showHtml, setShowHtml] = useState<string | null>(null);

  async function markRead(id: string) {
    await db.from("inbound_emails").update({ read: true }).eq("id", id);
    await onReload();
  }

  return emails.length === 0 ? (
    <div>
      <p className={TW.empty}>No inbound emails yet.</p>
      <p className="font-mono text-[9px] text-white/20 text-center tracking-[.08em] leading-[2.2] max-w-[440px] mx-auto">
        To receive emails here, configure Resend inbound routing<br />
        with webhook → /api/mail/inbound
      </p>
    </div>
  ) : (
    <div className="flex flex-col gap-0.5">
      {emails.map((e) => (
        <div key={e.id} className={cn(TW.msgCard, !e.read && TW.msgNew)}>
          <div className={TW.msgHead}>
            <div>
              <div className={TW.msgName}>{e.from_name ?? e.from_email}{!e.read && <span className={cn(TW.badge, TW.bNew, "ml-2")}>NEW</span>}</div>
              <div className={TW.msgMeta}>{e.from_email} · {new Date(e.received_at).toLocaleDateString("en-GB")}</div>
              {e.subject && <div className={TW.msgSubj}>{e.subject}</div>}
            </div>
            <div className={cn(TW.actRow, "flex-shrink-0")}>
              <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => setExp(exp === e.id ? null : e.id)}>{exp === e.id ? "Collapse" : "Read"}</button>
              {e.body_html && <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => setShowHtml(showHtml === e.id ? null : e.id)}><Code size={9} /></button>}
              {!e.read && <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => markRead(e.id)}><CheckCheck size={9} /></button>}
              <button className={cn(TW.btn, TW.gold, TW.sm)} onClick={() => setRply(rply?.id === e.id ? null : e)}>
                <Reply size={9} />Reply
              </button>
            </div>
          </div>
          {exp === e.id && (
            <div className={TW.msgBody}>
              {showHtml === e.id
                ? <div dangerouslySetInnerHTML={{ __html: e.body_html ?? "" }} />
                : (e.body_text ?? e.body_html ?? "(empty)")}
            </div>
          )}
          {rply?.id === e.id && (
            <QuickReply to={e.from_email} subject={`Re: ${e.subject ?? "Your email"}`} templates={templates} onClose={() => setRply(null)} />
          )}
        </div>
      ))}
    </div>
  );
}
