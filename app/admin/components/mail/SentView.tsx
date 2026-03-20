import { useState } from "react";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { EmailLog } from "../types";

interface SentViewProps {
  logs: EmailLog[];
}

export default function SentView({ logs }: SentViewProps) {
  const [exp, setExp] = useState<string | null>(null);

  function statusBadge(l: EmailLog) {
    if (l.opened_at)           return <span className={cn(TW.badge, TW.bOpen)}><Eye size={8} className="inline mr-0.5" />Opened</span>;
    if (l.status === "failed") return <span className={cn(TW.badge, TW.bDft)}>Failed</span>;
    return <span className={cn(TW.badge, TW.bSent)}>Sent</span>;
  }

  return logs.length === 0 ? <p className={TW.empty}>No emails sent yet.</p> : (
    <div className="flex flex-col gap-0.5">
      {logs.map((l) => (
        <div key={l.id} className={TW.msgCard}>
          <div className={TW.msgHead}>
            <div>
              <div className={cn(TW.msgName, "gap-2.5 flex-wrap")}>
                {l.subject}{statusBadge(l)}
              </div>
              <div className={TW.msgMeta}>
                To: {l.to_email} · {new Date(l.sent_at).toLocaleDateString("en-GB")}
                {l.opened_at && ` · Opened ${new Date(l.opened_at).toLocaleDateString("en-GB")}`}
              </div>
            </div>
            <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => setExp(exp === l.id ? null : l.id)}>{exp === l.id ? "Collapse" : "View"}</button>
          </div>
          {exp === l.id && (
            <div className={TW.msgBody}>
              {l.body_html ? <div dangerouslySetInnerHTML={{ __html: l.body_html }} /> : (l.body_text ?? "(no body)")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
