import { useState } from "react";
import { CheckCheck, Reply } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { Message, EmailTemplate } from "../types";
import QuickReply from "../mail/QuickReply";

interface MsgsTabProps {
  msgs: Message[];
  templates: EmailTemplate[];
  onRead: (id: string) => Promise<void>;
}

export default function MsgsTab({ msgs, templates, onRead }: MsgsTabProps) {
  const [exp, setExp]   = useState<string | null>(null);
  const [rply, setRply] = useState<Message | null>(null);

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div><div className={TW.pgTitle}>Messages</div><p className={TW.pgSub}>{msgs.filter((m) => !m.read).length} unread</p></div>
      </div>
      {msgs.length === 0 ? <p className={TW.empty}>No messages yet.</p> : (
        <div className="flex flex-col gap-0.5">
          {msgs.map((m) => (
            <div key={m.id} className={cn(TW.msgCard, !m.read && TW.msgNew)}>
              <div className={TW.msgHead}>
                <div>
                  <div className={TW.msgName}>{m.name}{!m.read && <span className={cn(TW.badge, TW.bNew, "ml-2")}>NEW</span>}</div>
                  <div className={TW.msgMeta}>{m.email} · {new Date(m.created_at).toLocaleDateString("en-GB")}</div>
                  {m.subject && <div className={TW.msgSubj}>Re: {m.subject}</div>}
                </div>
                <div className={cn(TW.actRow, "flex-shrink-0")}>
                  <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => setExp(exp === m.id ? null : m.id)}>{exp === m.id ? "Collapse" : "Read"}</button>
                  {!m.read && <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onRead(m.id)}><CheckCheck size={9} /></button>}
                  <button className={cn(TW.btn, TW.gold, TW.sm)} onClick={() => setRply(rply?.id === m.id ? null : m)}>
                    <Reply size={9} />Reply
                  </button>
                </div>
              </div>
              {exp === m.id && <div className={TW.msgBody}>{m.message}</div>}
              {rply?.id === m.id && (
                <QuickReply to={m.email} subject={`Re: ${m.subject ?? "Your message"}`} templates={templates} onClose={() => setRply(null)} />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
