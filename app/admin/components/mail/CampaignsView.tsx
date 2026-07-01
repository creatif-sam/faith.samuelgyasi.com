import { useState, Fragment } from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { EmailCampaign, CampaignStatus } from "../types";

interface CampaignsViewProps {
  campaigns: EmailCampaign[];
  onNew: () => void;
  onEdit: (c: EmailCampaign) => void;
  onDelete: (id: string, subject: string) => void;
}

const FILTERS: { id: "all" | "draft" | "sent"; label: string }[] = [
  { id: "all",   label: "All"    },
  { id: "draft", label: "Drafts" },
  { id: "sent",  label: "Sent"   },
];

function statusBadge(status: CampaignStatus) {
  if (status === "draft")   return <span className={cn(TW.badge, TW.bDft)}>Draft</span>;
  if (status === "sending") return <span className={cn(TW.badge, TW.bSending)}>Sending</span>;
  if (status === "failed")  return <span className={cn(TW.badge, TW.bFailed)}>Failed</span>;
  return <span className={cn(TW.badge, TW.bPub)}>Sent</span>;
}

export default function CampaignsView({ campaigns, onNew, onEdit, onDelete }: CampaignsViewProps) {
  const [filter, setFilter] = useState<"all" | "draft" | "sent">("all");
  const [exp, setExp] = useState<string | null>(null);

  const filtered = campaigns.filter((c) => {
    if (filter === "draft") return c.status === "draft";
    if (filter === "sent")  return c.status === "sent" || c.status === "sending" || c.status === "failed";
    return true;
  });

  return (
    <>
      <div className={cn(TW.sHead, "flex-wrap gap-3")}>
        <div className={TW.chipRow}>
          {FILTERS.map((f) => (
            <button key={f.id} className={cn(TW.chip, filter === f.id && TW.chipAct)} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}><Plus size={10} />New Campaign</button>
      </div>

      {filtered.length === 0 ? <p className={TW.empty}>No campaigns yet. Create one to email a group of recipients at once.</p> : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={TW.th}>Subject</th>
                <th className={TW.th}>Recipient Type</th>
                <th className={TW.th}>Status</th>
                <th className={TW.th}>Recipients</th>
                <th className={TW.th}>Created</th>
                <th className={TW.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <Fragment key={c.id}>
                  <tr className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                    <td className={TW.td} style={{ color: "#f0ece4", maxWidth: 320 }}>{c.subject}</td>
                    <td className={TW.td}>
                      <span className={cn(TW.badge, TW.bDft, "capitalize")}>{c.recipient_type}</span>
                      {c.recipient_filter && c.recipient_filter !== "all" && (
                        <span className="text-white/30 text-[11px] ml-1.5 capitalize">{c.recipient_filter}</span>
                      )}
                    </td>
                    <td className={TW.td}>{statusBadge(c.status)}</td>
                    <td className={TW.td} style={{ minWidth: 110 }}>
                      <span className="font-mono text-[12px]">{c.sent_count} / {c.total_recipients}</span>
                      <div className={TW.progWrap}>
                        <div className={TW.progBar} style={{ width: `${c.total_recipients ? Math.round((c.sent_count / c.total_recipients) * 100) : 0}%` }} />
                      </div>
                    </td>
                    <td className={TW.td}>{new Date(c.created_at).toLocaleDateString("en-GB")}</td>
                    <td className={TW.td}>
                      <div className={TW.actRow}>
                        {c.status === "draft" ? (
                          <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onEdit(c)}><Pencil size={9} /></button>
                        ) : (
                          <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => setExp(exp === c.id ? null : c.id)}><Eye size={9} /></button>
                        )}
                        <button className={cn(TW.btn, TW.danger, TW.sm)} disabled={c.status === "sending"} onClick={() => onDelete(c.id, c.subject)}><Trash2 size={9} /></button>
                      </div>
                    </td>
                  </tr>
                  {exp === c.id && (
                    <tr>
                      <td colSpan={6} className={cn(TW.td, "bg-white/[.015]")}>
                        <div className="font-poppins text-[11px] text-white/40 mb-2">
                          Sent {c.sent_count} · Failed {c.failed_count} · Total {c.total_recipients}
                          {c.sent_at && ` · ${new Date(c.sent_at).toLocaleString("en-GB")}`}
                        </div>
                        <div className="bg-white text-black rounded-lg p-4 overflow-auto max-h-[320px]" dangerouslySetInnerHTML={{ __html: c.body_html }} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
