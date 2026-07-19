"use client";
import { useState, useEffect, useCallback } from "react";
import { Flame, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { TW } from "../constants";
import HabitUserDetail from "./HabitUserDetail";

interface HabitRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  frequency: string;
  created_at: string;
}

interface HabitLogRow {
  id: string;
  habit_id: string;
  user_id: string;
  logged_date: string;
}

interface UserSummary {
  user_id: string;
  email: string;
  habitCount: number;
  totalLogs: number;
  streak: number;
}

function calcStreak(logs: string[]): number {
  if (!logs.length) return 0;
  const sorted = [...logs].sort((a, b) => b.localeCompare(a));
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    if (sorted.includes(ds)) streak++; else break;
  }
  return streak;
}

function getLast30(): string[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });
}

export default function HabitsTab() {
  const db = createClient();
  const [habits, setHabits] = useState<HabitRow[]>([]);
  const [logs, setLogs] = useState<HabitLogRow[]>([]);
  const [users, setUsers] = useState<{ id: string; email: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [hRes, lRes, uRes] = await Promise.all([
      db.from("spiritual_habits").select("*").order("created_at", { ascending: false }),
      db.from("habit_logs").select("id,habit_id,user_id,logged_date").order("logged_date", { ascending: false }),
      fetch("/api/admin/users", { cache: "no-store" }),
    ]);
    setHabits((hRes.data as HabitRow[]) ?? []);
    setLogs((lRes.data as HabitLogRow[]) ?? []);
    if (uRes.ok) {
      const body = await uRes.json() as { users?: { id: string; email: string }[] };
      setUsers(body.users ?? []);
    }
    setLoading(false);
  }, [db]);

  useEffect(() => { load(); }, [load]);

  const userSummaries: UserSummary[] = (() => {
    const byUser = new Map<string, { habits: HabitRow[]; logs: HabitLogRow[] }>();
    habits.forEach((h) => {
      if (!byUser.has(h.user_id)) byUser.set(h.user_id, { habits: [], logs: [] });
      byUser.get(h.user_id)!.habits.push(h);
    });
    logs.forEach((l) => {
      if (!byUser.has(l.user_id)) byUser.set(l.user_id, { habits: [], logs: [] });
      byUser.get(l.user_id)!.logs.push(l);
    });
    return [...byUser.entries()].map(([uid, data]) => {
      const userInfo = users.find((u) => u.id === uid);
      const allLogDates = data.logs.map((l) => l.logged_date);
      return {
        user_id: uid,
        email: userInfo?.email ?? uid.slice(0, 8) + "…",
        habitCount: data.habits.length,
        totalLogs: data.logs.length,
        streak: calcStreak(allLogDates),
      };
    }).sort((a, b) => b.totalLogs - a.totalLogs);
  })();

  const selectedUserHabits = selectedUser ? habits.filter((h) => h.user_id === selectedUser) : [];
  const selectedUserLogs = selectedUser ? logs.filter((l) => l.user_id === selectedUser) : [];
  const today = new Date().toISOString().slice(0, 10);
  const last30 = getLast30();
  const selectedSummary = userSummaries.find((u) => u.user_id === selectedUser);
  const weeklyGrid = Array.from({ length: 7 }, (_, wi) =>
    Array.from({ length: 7 }, (_, di) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - wi) * 7 - (6 - di));
      return d.toISOString().slice(0, 10);
    })
  );

  return (
    <div>
      <div className="flex items-start justify-between mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Participant Habits</div>
          <p className={TW.pgSub}>View spiritual habits and evolution for each participant.</p>
        </div>
        <button className={`${TW.btn} ${TW.ghost}`} onClick={load}>Refresh</button>
      </div>
      {loading ? (
        <p className={TW.empty}>Loading…</p>
      ) : (
        <div className="flex gap-6" style={{ alignItems: "flex-start" }}>
          <div style={{ width: 300, flexShrink: 0 }}>
            <div className="mb-4 text-xs font-semibold text-white/40 uppercase tracking-widest">Participants ({userSummaries.length})</div>
            {userSummaries.length === 0 ? (
              <p className={TW.empty}>No habits recorded yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {userSummaries.map((u) => (
                  <button key={u.user_id} onClick={() => setSelectedUser(selectedUser === u.user_id ? null : u.user_id)}
                    className="w-full text-left p-4 rounded-lg border transition-all"
                    style={{ background: selectedUser===u.user_id?"rgba(84,108,250,.08)":"rgba(255,255,255,.02)", borderColor: selectedUser===u.user_id?"rgba(84,108,250,.4)":"rgba(255,255,255,.07)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "rgba(84,108,250,.15)", color: "#546cfa" }}>
                        {u.email[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white/80 truncate">{u.email}</div>
                        <div className="text-[10px] text-white/40 mt-0.5">{u.habitCount} habit{u.habitCount !== 1 ? "s" : ""} · {u.totalLogs} logs</div>
                      </div>
                      {u.streak > 0 && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-400/10 border border-orange-400/20 rounded-full px-2 py-0.5 flex-shrink-0">
                          <Flame size={9} /> {u.streak}d
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {!selectedUser ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/20">
                <User size={40} className="mb-4" />
                <p className="text-sm">Select a participant to view their habits</p>
              </div>
            ) : (
              <HabitUserDetail
                selectedSummary={selectedSummary}
                selectedUserHabits={selectedUserHabits}
                selectedUserLogs={selectedUserLogs}
                today={today}
                last30={last30}
                weeklyGrid={weeklyGrid}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
