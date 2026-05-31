"use client";
import { useState } from "react";
import { Flame, Check, BarChart2, ChevronDown, ChevronRight } from "lucide-react";

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

interface Props {
  selectedSummary: UserSummary | undefined;
  selectedUserHabits: HabitRow[];
  selectedUserLogs: HabitLogRow[];
  today: string;
  last30: string[];
  weeklyGrid: string[][];
}

export default function HabitUserDetail({ selectedSummary, selectedUserHabits, selectedUserLogs, today, last30, weeklyGrid }: Props) {
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null);
  return (
    <div>
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/[.05]">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: "rgba(212,168,67,.15)", color: "#d4a843" }}>
          {selectedSummary?.email[0].toUpperCase()}
        </div>
        <div>
          <div className="text-lg font-semibold text-white">{selectedSummary?.email}</div>
          <div className="text-xs text-white/40 mt-1">{selectedSummary?.habitCount} active habits · {selectedSummary?.totalLogs} total check-ins</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: <Flame size={16} className="text-orange-400" />, bg: "rgba(249,115,22,.1)", value: selectedSummary?.streak ?? 0, label: "Day Streak" },
          { icon: <Check size={16} className="text-green-400" />, bg: "rgba(34,197,94,.1)", value: selectedSummary?.totalLogs ?? 0, label: "Total Check-ins" },
          { icon: <BarChart2 size={16} className="text-blue-400" />, bg: "rgba(96,165,250,.1)", value: selectedUserLogs.filter(l => last30.includes(l.logged_date)).length, label: "Last 30 Days" },
        ].map(({ icon, bg, value, label }) => (
          <div key={label} className="p-4 bg-white/[.02] border border-white/[.06] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: bg }}>{icon}</div>
              <div><div className="text-xl font-bold text-white">{value}</div><div className="text-[10px] text-white/40">{label}</div></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-8">
        <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Activity — Last 7 Weeks</div>
        <div className="flex gap-2">
          {weeklyGrid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1.5">
              {week.map((day) => {
                const count = selectedUserLogs.filter(l => l.logged_date === day).length;
                return (
                  <div key={day} title={`${day}: ${count} check-in${count !== 1 ? "s" : ""}`} className="w-5 h-5 rounded-sm transition-all"
                    style={{ background: count===0?"rgba(255,255,255,.04)":count===1?"rgba(212,168,67,.25)":count===2?"rgba(212,168,67,.5)":"rgba(212,168,67,.85)", border: day===today?"2px solid rgba(212,168,67,.8)":"1px solid rgba(255,255,255,.06)" }}
                  />
                );
              })}
            </div>
          ))}
          <div className="flex flex-col gap-1.5 justify-end ml-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d} className="h-5 text-[9px] text-white/25 flex items-center">{d}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Habits ({selectedUserHabits.length})</div>
      <div className="flex flex-col gap-3">
        {selectedUserHabits.map((h) => {
          const hLogs = selectedUserLogs.filter(l => l.habit_id === h.id);
          const hLogDates = hLogs.map(l => l.logged_date);
          const hStreak = calcStreak(hLogDates);
          const doneToday = hLogDates.includes(today);
          const last30Count = hLogs.filter(l => last30.includes(l.logged_date)).length;
          const completionRate = Math.round((last30Count / 30) * 100);
          const expanded = expandedHabit === h.id;
          return (
            <div key={h.id} className="border rounded-lg overflow-hidden" style={{ borderColor: "rgba(255,255,255,.07)", background: "rgba(255,255,255,.02)" }}>
              <button className="w-full p-4 flex items-center gap-4 text-left" onClick={() => setExpandedHabit(expanded ? null : h.id)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${h.color}22` }}>{h.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white">{h.name}</div>
                  {h.description && <div className="text-xs text-white/40 mt-0.5 truncate">{h.description}</div>}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${doneToday?"bg-green-500/10 text-green-400 border-green-500/20":"bg-white/[.04] text-white/30 border-white/[.07]"}`}>{doneToday?"Done today":"Not today"}</span>
                  {hStreak > 0 && <span className="flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-400/10 border border-orange-400/20 rounded-full px-2 py-0.5"><Flame size={9} /> {hStreak}d</span>}
                  <span className="text-xs text-white/30">{completionRate}%</span>
                  {expanded ? <ChevronDown size={14} className="text-white/30" /> : <ChevronRight size={14} className="text-white/30" />}
                </div>
              </button>
              {expanded && (
                <div className="px-4 pb-4 border-t border-white/[.05] pt-4">
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] text-white/40 mb-2"><span>30-day completion</span><span>{last30Count}/30 days ({completionRate}%)</span></div>
                    <div className="h-1.5 bg-white/[.06] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${completionRate}%`, background: "linear-gradient(90deg,#d4a843,#f0cc7a)" }} /></div>
                  </div>
                  <div className="text-[10px] text-white/40 mb-2">Last 30 days</div>
                  <div className="flex flex-wrap gap-1">
                    {last30.map((d) => (
                      <div key={d} title={d} className="w-5 h-5 rounded" style={{ background: hLogDates.includes(d)?"rgba(212,168,67,.5)":"rgba(255,255,255,.04)", border: d===today?"2px solid rgba(212,168,67,.8)":"1px solid rgba(255,255,255,.06)" }} />
                    ))}
                  </div>
                  {hLogs.length > 0 && (
                    <div className="mt-4">
                      <div className="text-[10px] text-white/40 mb-2">Recent Check-ins</div>
                      <div className="flex flex-wrap gap-1.5">
                        {hLogs.slice(0, 10).map(l => <span key={l.id} className="text-[10px] bg-white/[.04] border border-white/[.07] rounded px-2 py-0.5 text-white/50">{l.logged_date}</span>)}
                        {hLogs.length > 10 && <span className="text-[10px] text-white/30">+{hLogs.length - 10} more</span>}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
