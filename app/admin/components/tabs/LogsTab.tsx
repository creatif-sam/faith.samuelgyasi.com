import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { EmailLog } from "../types";

interface LogsTabProps {
  logs: EmailLog[];
}

export default function LogsTab({ logs }: LogsTabProps) {
  return (
    <>
      <div className="flex flex-wrap justify-between items-start gap-3 mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Logs</div>
          <p className={TW.pgSub}>{logs.length} delivery log entr{logs.length === 1 ? "y" : "ies"}</p>
        </div>
      </div>

      {logs.length === 0 ? (
        <p className={TW.empty}>No logs yet.</p>
      ) : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={TW.th}>When</th>
                <th className={TW.th}>To</th>
                <th className={TW.th}>Subject</th>
                <th className={TW.th}>Status</th>
                <th className={TW.th}>Opened</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => {
                const statusClass =
                  l.status === "sent"
                    ? TW.bSent
                    : l.status === "opened"
                    ? TW.bOpen
                    : TW.bDft;

                return (
                  <tr key={l.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                    <td className={TW.td}>{new Date(l.sent_at).toLocaleString("en-GB")}</td>
                    <td className={TW.td} style={{ color: "#f0ece4" }}>{l.to_email}</td>
                    <td className={TW.td}>{l.subject || "-"}</td>
                    <td className={TW.td}>
                      <span className={cn(TW.badge, statusClass)}>{l.status || "pending"}</span>
                    </td>
                    <td className={TW.td}>{l.opened_at ? new Date(l.opened_at).toLocaleString("en-GB") : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
