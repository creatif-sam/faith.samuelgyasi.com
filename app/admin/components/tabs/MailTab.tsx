import { Send, Inbox, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { EmailLog, InboundEmail, EmailTemplate, MailSubTab } from "../types";
import ComposeView from "../mail/ComposeView";
import InboxView from "../mail/InboxView";
import SentView from "../mail/SentView";
import TplsView from "../mail/TplsView";

interface MailTabProps {
  sub: MailSubTab;
  setSub: (t: MailSubTab) => void;
  logs: EmailLog[];
  inbox: InboundEmail[];
  templates: EmailTemplate[];
  onReload: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any;
  onEditTpl: (t: EmailTemplate) => void;
  onNewTpl: () => void;
  onDeleteTpl: (id: string, name: string) => void;
}

export default function MailTab({ sub, setSub, logs, inbox, templates, onReload, db, onEditTpl, onNewTpl, onDeleteTpl }: MailTabProps) {
  const unread = inbox.filter((e) => !e.read).length;
  const SUBS: { id: MailSubTab; label: string; Icon: React.ComponentType<{ size?: number }>; badge?: number }[] = [
    { id: "compose",   label: "Compose",   Icon: Send     },
    { id: "inbox",     label: "Inbox",     Icon: Inbox,    badge: unread },
    { id: "sent",      label: "Sent",      Icon: Clock    },
    { id: "templates", label: "Templates", Icon: BookOpen },
  ];

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div><div className={TW.pgTitle}>Mail</div><p className={TW.pgSub}>impact@samuelgyasi.com · via Resend</p></div>
      </div>
      <div className={TW.mNav}>
        {SUBS.map(({ id, label, Icon, badge }) => (
          <button key={id} className={cn(TW.mTab, sub === id && TW.mAct)} onClick={() => setSub(id)}>
            <Icon size={12} />{label}
            {badge ? <span className="bg-[#d4a843] text-[#09090d] font-mono text-[7px] px-1.5 py-0.5 rounded-full font-bold">{badge}</span> : null}
          </button>
        ))}
      </div>
      {sub === "compose"   && <ComposeView templates={templates} onReload={onReload} />}
      {sub === "inbox"     && <InboxView emails={inbox} db={db} onReload={onReload} templates={templates} />}
      {sub === "sent"      && <SentView logs={logs} />}
      {sub === "templates" && <TplsView templates={templates} onNew={onNewTpl} onEdit={onEditTpl} onDelete={onDeleteTpl} />}
    </>
  );
}
