import { Send, Inbox, Clock, Mail, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { EmailLog, InboundEmail, EmailTemplate, EmailCampaign, MailSubTab } from "../types";
import ComposeView from "../mail/ComposeView";
import InboxView from "../mail/InboxView";
import SentView from "../mail/SentView";
import TplsView from "../mail/TplsView";
import CampaignsView from "../mail/CampaignsView";

interface MailTabProps {
  sub: MailSubTab;
  setSub: (t: MailSubTab) => void;
  logs: EmailLog[];
  inbox: InboundEmail[];
  templates: EmailTemplate[];
  campaigns: EmailCampaign[];
  onReload: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any;
  onEditTpl: (t: EmailTemplate) => void;
  onNewTpl: () => void;
  onDeleteTpl: (id: string, name: string) => void;
  onNewCampaign: () => void;
  onEditCampaign: (c: EmailCampaign) => void;
  onDeleteCampaign: (id: string, subject: string) => void;
}

export default function MailTab({ sub, setSub, logs, inbox, templates, campaigns, onReload, db, onEditTpl, onNewTpl, onDeleteTpl, onNewCampaign, onEditCampaign, onDeleteCampaign }: MailTabProps) {
  const unread = inbox.filter((e) => !e.read).length;
  const UTILS: { id: MailSubTab; label: string; Icon: React.ComponentType<{ size?: number }>; badge?: number }[] = [
    { id: "compose", label: "Compose", Icon: Send  },
    { id: "inbox",   label: "Inbox",   Icon: Inbox, badge: unread },
    { id: "sent",    label: "Sent",    Icon: Clock  },
  ];

  const draftCampaigns = campaigns.filter((c) => c.status === "draft").length;
  const sentCampaigns  = campaigns.filter((c) => c.status === "sent").length;
  const totalEmailsSent = logs.length + campaigns.reduce((sum, c) => sum + c.sent_count, 0);

  const STATS = [
    { num: campaigns.length,  label: "Total Campaigns" },
    { num: draftCampaigns,    label: "Draft Campaigns" },
    { num: sentCampaigns,     label: "Sent Campaigns"  },
    { num: totalEmailsSent,   label: "Total Emails Sent" },
  ];

  return (
    <>
      <div className="flex flex-wrap justify-between items-start gap-3 mb-10 pb-7 border-b border-white/[.05]">
        <div><div className={TW.pgTitle}>Mail</div><p className={TW.pgSub}>impact@samuelgyasi.com · via Resend</p></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {STATS.map(({ num, label }) => (
          <div key={label} className={TW.stat}>
            <div className={TW.statNum}>{num}</div>
            <div className={TW.statLbl}>{label}</div>
          </div>
        ))}
      </div>

      <div className={TW.mSeg}>
        <button className={cn(TW.mSegTab, sub === "campaigns" && TW.mSegAct)} onClick={() => setSub("campaigns")}>
          <Mail size={14} />Email Campaigns
        </button>
        <button className={cn(TW.mSegTab, sub === "templates" && TW.mSegAct)} onClick={() => setSub("templates")}>
          <FileText size={14} />Email Templates ({templates.length})
        </button>
      </div>

      <div className={TW.mNav}>
        {UTILS.map(({ id, label, Icon, badge }) => (
          <button key={id} className={cn(TW.mTab, sub === id && TW.mAct)} onClick={() => setSub(id)}>
            <Icon size={12} />{label}
            {badge ? <span className="bg-[#d4a843] text-[#09090d] font-mono text-[7px] px-1.5 py-0.5 rounded-full font-bold">{badge}</span> : null}
          </button>
        ))}
      </div>

      {sub === "campaigns" && <CampaignsView campaigns={campaigns} onNew={onNewCampaign} onEdit={onEditCampaign} onDelete={onDeleteCampaign} />}
      {sub === "templates" && <TplsView templates={templates} onNew={onNewTpl} onEdit={onEditTpl} onDelete={onDeleteTpl} />}
      {sub === "compose"   && <ComposeView templates={templates} onReload={onReload} />}
      {sub === "inbox"     && <InboxView emails={inbox} db={db} onReload={onReload} templates={templates} />}
      {sub === "sent"      && <SentView logs={logs} />}
    </>
  );
}
