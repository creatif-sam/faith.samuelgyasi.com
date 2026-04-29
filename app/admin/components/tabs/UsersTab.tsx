import { TW } from "../constants";
import { TrainingEnrollment } from "../types";

interface UsersTabProps {
  enrollments: TrainingEnrollment[];
}

type UserSummary = {
  userId: string;
  enrollmentsCount: number;
  lastActiveAt: string;
};

export default function UsersTab({ enrollments }: UsersTabProps) {
  const map = new Map<string, UserSummary>();

  for (const item of enrollments) {
    if (!item.user_id) continue;
    const prev = map.get(item.user_id);
    if (!prev) {
      map.set(item.user_id, {
        userId: item.user_id,
        enrollmentsCount: 1,
        lastActiveAt: item.enrolled_at,
      });
      continue;
    }
    map.set(item.user_id, {
      userId: item.user_id,
      enrollmentsCount: prev.enrollmentsCount + 1,
      lastActiveAt:
        new Date(item.enrolled_at).getTime() > new Date(prev.lastActiveAt).getTime()
          ? item.enrolled_at
          : prev.lastActiveAt,
    });
  }

  const users = [...map.values()].sort(
    (a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()
  );

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Users</div>
          <p className={TW.pgSub}>
            {users.length} active dashboard user{users.length !== 1 ? "s" : ""} from enrollments
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <p className={TW.empty}>No users yet.</p>
      ) : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={TW.th}>User ID</th>
                <th className={TW.th}>Enrollments</th>
                <th className={TW.th}>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.userId} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                  <td className={TW.td} style={{ color: "#f0ece4", fontFamily: "monospace", fontSize: 12 }}>
                    {u.userId}
                  </td>
                  <td className={TW.td}>{u.enrollmentsCount}</td>
                  <td className={TW.td}>{new Date(u.lastActiveAt).toLocaleString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
