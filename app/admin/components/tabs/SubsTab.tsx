import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { Subscriber } from "../types";

interface SubsTabProps {
  subs: Subscriber[];
  onDelete: (id: string, email: string) => void;
}

export default function SubsTab({ subs, onDelete }: SubsTabProps) {
  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div><div className={TW.pgTitle}>Newsletter</div><p className={TW.pgSub}>{subs.length} subscriber{subs.length !== 1 ? "s" : ""}</p></div>
      </div>
      {subs.length === 0 ? <p className={TW.empty}>No subscribers yet.</p> : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead><tr><th className={TW.th}>Email</th><th className={TW.th}>Name</th><th className={TW.th}>Interests</th><th className={TW.th}>Confirmed</th><th className={TW.th}>Joined</th><th className={TW.th}></th></tr></thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                  <td className={TW.td} style={{ color: "#f0ece4" }}>{s.email}</td>
                  <td className={TW.td}>{s.name ?? "—"}</td>
                  <td className={TW.td} style={{ maxWidth: 220 }}>
                    {s.interests && s.interests.length > 0
                      ? s.interests.map((i) => (
                          <span key={i} className={cn(TW.badge, TW.bDft, "mr-1 mb-0.5 capitalize")}>{i.replace(/_/g, " ")}</span>
                        ))
                      : <span className="text-white/30">—</span>}
                  </td>
                  <td className={TW.td}><span className={cn(TW.badge, s.confirmed ? TW.bPub : TW.bDft)}>{s.confirmed ? "Yes" : "Pending"}</span></td>
                  <td className={TW.td}>{new Date(s.created_at).toLocaleDateString("en-GB")}</td>
                  <td className={TW.td}><button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(s.id, s.email)}><Trash2 size={9} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
