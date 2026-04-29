import { TW } from "../constants";
import { AuthUserRow } from "../types";

interface UsersTabProps {
  users: AuthUserRow[];
}

export default function UsersTab({ users }: UsersTabProps) {
  const sorted = [...users].sort(
    (a, b) =>
      new Date(b.last_sign_in_at ?? b.created_at).getTime() -
      new Date(a.last_sign_in_at ?? a.created_at).getTime()
  );

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
