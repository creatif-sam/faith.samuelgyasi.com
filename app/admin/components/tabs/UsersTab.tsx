import { useState } from "react";
import { Bell, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { TW } from "../constants";
import { AuthUserRow } from "../types";

interface UsersTabProps {
  users: AuthUserRow[];
}

export default function UsersTab({ users }: UsersTabProps) {
  const [notifyTarget, setNotifyTarget] = useState<AuthUserRow | null>(null);

  const sorted = [...users].sort(
    (a, b) =>
      new Date(b.last_sign_in_at ?? b.created_at).getTime() -
      new Date(a.last_sign_in_at ?? a.created_at).getTime()
  );

  return (
    <>
      <div className="flex flex-wrap justify-between items-start gap-3 mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Users</div>
          <p className={TW.pgSub}>
            {sorted.length} user{sorted.length !== 1 ? "s" : ""} from auth
          </p>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className={TW.empty}>No users yet.</p>
      ) : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={TW.th}>User ID</th>
                <th className={TW.th}>Email</th>
                <th className={TW.th}>Joined</th>
                <th className={TW.th}>Last Sign In</th>
                <th className={TW.th}>Confirmed</th>
                <th className={TW.th}></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((u) => (
                <tr key={u.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                  <td className={TW.td} style={{ color: "#f0ece4", fontFamily: "monospace", fontSize: 12 }}>
                    {u.id}
                  </td>
                  <td className={TW.td}>{u.email ?? "-"}</td>
                  <td className={TW.td}>{new Date(u.created_at).toLocaleString("en-GB")}</td>
                  <td className={TW.td}>{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString("en-GB") : "-"}</td>
                  <td className={TW.td}>{u.email_confirmed_at ? "Yes" : "No"}</td>
                  <td className={TW.td}>
                    <button
                      className={cn(TW.btn, TW.sm, TW.ghost)}
                      onClick={() => setNotifyTarget(u)}
                      title="Send a notification to this user"
                    >
                      <Bell size={11} /> Notify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {notifyTarget && (
        <NotifyModal user={notifyTarget} onClose={() => setNotifyTarget(null)} />
      )}
    </>
  );
}

function NotifyModal({ user, onClose }: { user: AuthUserRow; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error("Title required"); return; }
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("user_notifications").insert({
      user_id: user.id,
      title: title.trim(),
      body: body.trim() || null,
    });
    setBusy(false);
    if (error) {
      toast.error("Could not send notification. Check your connection and try again.");
      console.error("send notification error:", error);
      return;
    }
    toast.success(`Notification sent to ${user.email ?? "user"}`);
    onClose();
  }

  return (
    <div className={TW.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={TW.modal}>
        <div className="flex justify-between items-center mb-6">
          <div className={TW.fTitle}>Notify {user.email ?? "User"}</div>
          <button onClick={onClose} className="bg-transparent border-0 text-white/40 cursor-pointer p-0"><X size={16} /></button>
        </div>
        <form onSubmit={send}>
          <div className={TW.field}>
            <label className={TW.label}>Title *</label>
            <input className={TW.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. New training added" required />
          </div>
          <div className={TW.field}>
            <label className={TW.label}>Message</label>
            <textarea className={TW.tarea} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Optional details for the notification" style={{ minHeight: 120 }} />
          </div>
          <div className="flex gap-2.5 justify-end mt-6">
            <button type="button" className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
            <button type="submit" className={cn(TW.btn, TW.gold)} disabled={busy}>{busy ? "Sending..." : "Send Notification"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
