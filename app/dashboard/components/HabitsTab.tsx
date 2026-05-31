"use client";
import { useState, useCallback, useEffect } from "react";
import { Flame, Check, BarChart2, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { SpiritualHabit, HabitLog } from "../types";
import type { Translations } from "../translations";

const HABIT_ICONS = ["🙏", "📖", "✝️", "🕊️", "💪", "🌅", "🧘", "❤️", "🌿", "🔥", "⭐", "🎯"];

interface HabitsTabProps {
  user: SupabaseUser;
  t: Translations;
}

export default function HabitsTab({ user, t }: HabitsTabProps) {
  const db = createClient();
  const [habits, setHabits] = useState<SpiritualHabit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [habitDesc, setHabitDesc] = useState("");
  const [habitIcon, setHabitIcon] = useState("🙏");
  const [habitSaving, setHabitSaving] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const loadHabits = useCallback(async () => {
    const [hRes, lRes] = await Promise.all([
      db.from("spiritual_habits").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
      db.from("habit_logs").select("id,habit_id,logged_date").eq("user_id", user.id)
        .gte("logged_date", new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)),
    ]);
    setHabits((hRes.data as SpiritualHabit[]) ?? []);
    setHabitLogs((lRes.data as HabitLog[]) ?? []);
  }, [db, user.id]);

  useEffect(() => { loadHabits(); }, [loadHabits]);

  async function createHabit() {
    if (!habitName.trim()) return;
    setHabitSaving(true);
    const { error } = await db.from("spiritual_habits").insert({
      user_id: user.id,
      name: habitName.trim(),
      description: habitDesc.trim() || null,
      icon: habitIcon,
    });
    setHabitSaving(false);
    if (error) {
      toast.error("Could not create habit. Please try again.");
      return;
    }
    toast.success(`Habit "${habitName.trim()}" created!`);
    setHabitName(""); setHabitDesc(""); setHabitIcon("🙏");
    setShowHabitForm(false);
    await loadHabits();
  }

  async function deleteHabit(id: string) {
    const habit = habits.find((h) => h.id === id);
    await db.from("spiritual_habits").delete().eq("id", id);
    toast.success(`"${habit?.name ?? "Habit"}" deleted.`);
    await loadHabits();
  }

  async function toggleHabitLog(habitId: string) {
    const existing = habitLogs.find((l) => l.habit_id === habitId && l.logged_date === today);
    const habit = habits.find((h) => h.id === habitId);
    if (existing) {
      await db.from("habit_logs").delete().eq("id", existing.id);
      toast(`${habit?.icon ?? ""} ${habit?.name ?? "Habit"} unmarked for today.`);
    } else {
      await db.from("habit_logs").insert({ habit_id: habitId, user_id: user.id, logged_date: today });
      toast.success(`${habit?.icon ?? ""} ${habit?.name ?? "Habit"} done today! 🎉`);
    }
    await loadHabits();
  }

  function getHabitStreak(habitId: string): number {
    const logs = habitLogs
      .filter((l) => l.habit_id === habitId)
      .map((l) => l.logged_date)
      .sort((a, b) => b.localeCompare(a));
    if (logs.length === 0) return 0;
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      if (logs.includes(ds)) { streak++; } else { break; }
    }
    return streak;
  }

  function getLast30Days(): string[] {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (29 - i));
      return d.toISOString().slice(0, 10);
    });
  }

  const totalHabitsDoneToday = habits.filter(
    (h) => habitLogs.some((l) => l.habit_id === h.id && l.logged_date === today)
  ).length;
  const maxStreak = habits.reduce((max, h) => Math.max(max, getHabitStreak(h.id)), 0);
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });
  const weekDoneCount = habitLogs.filter((l) => last7Days.includes(l.logged_date)).length;

  return (
    <>
      <div className="dash-page-header">
        <h1 className="dash-page-title">{t.habitsTitle}</h1>
        <p className="dash-page-sub">{t.habitsSub}</p>
      </div>

      <div className="hb-stats">
        <div className="hb-stat">
          <div className="hb-stat-icon" style={{ background: "rgba(249,115,22,.1)" }}>
            <Flame size={18} style={{ color: "#f97316" }} />
          </div>
          <div>
            <div className="hb-stat-num">{maxStreak}</div>
            <div className="hb-stat-lbl">{t.habitStreak}</div>
          </div>
        </div>
        <div className="hb-stat">
          <div className="hb-stat-icon" style={{ background: "rgba(34,197,94,.1)" }}>
            <Check size={18} style={{ color: "#22c55e" }} />
          </div>
          <div>
            <div className="hb-stat-num">{totalHabitsDoneToday}/{habits.length}</div>
            <div className="hb-stat-lbl">{t.habitToday}</div>
          </div>
        </div>
        <div className="hb-stat">
          <div className="hb-stat-icon" style={{ background: "rgba(96,165,250,.1)" }}>
            <BarChart2 size={18} style={{ color: "#60a5fa" }} />
          </div>
          <div>
            <div className="hb-stat-num">{weekDoneCount}</div>
            <div className="hb-stat-lbl">{t.habitRate}</div>
          </div>
        </div>
      </div>

      {!showHabitForm ? (
        <button
          className="dash-btn dash-btn-gold"
          style={{ width: "auto", marginBottom: 24, padding: "10px 20px", gap: 6, display: "inline-flex", alignItems: "center" }}
          onClick={() => setShowHabitForm(true)}
        >
          <Plus size={14} /> {t.newHabit}
        </button>
      ) : (
        <div className="hb-form">
          <div className="hb-form-grid">
            <div>
              <label className="hb-label">{t.habitName} *</label>
              <input
                className="hb-input"
                placeholder="e.g. Morning Prayer"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
              />
            </div>
            <div>
              <label className="hb-label">{t.habitDesc}</label>
              <input
                className="hb-input"
                placeholder="e.g. 15 min quiet time"
                value={habitDesc}
                onChange={(e) => setHabitDesc(e.target.value)}
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label className="hb-label">{t.habitIcon}</label>
            <div className="hb-icon-row">
              {HABIT_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  className={`hb-icon-pick${habitIcon === ic ? " sel" : ""}`}
                  onClick={() => setHabitIcon(ic)}
                >{ic}</button>
              ))}
            </div>
          </div>
          <div className="hb-form-actions">
            <button className="hb-btn-ghost" onClick={() => { setShowHabitForm(false); setHabitName(""); setHabitDesc(""); setHabitIcon("🙏"); }}>
              {t.habitCancel}
            </button>
            <button className="hb-btn-primary" disabled={habitSaving || !habitName.trim()} onClick={createHabit}>
              {habitSaving ? "…" : t.habitSave}
            </button>
          </div>
        </div>
      )}

      <div className="dash-section-head">
        <Flame size={13} /> {t.habitsTitle} ({habits.length})
      </div>

      {habits.length === 0 ? (
        <div className="dash-empty" style={{ marginBottom: 32 }}>
          <Sparkles size={32} style={{ margin: "0 auto 12px", color: "rgba(212,168,67,.3)", display: "block" }} />
          {t.habitEmpty}
        </div>
      ) : (
        <div className="hb-list">
          {habits.map((h) => {
            const doneToday = habitLogs.some((l) => l.habit_id === h.id && l.logged_date === today);
            const streak = getHabitStreak(h.id);
            const last30 = getLast30Days();
            const logDates = new Set(habitLogs.filter((l) => l.habit_id === h.id).map((l) => l.logged_date));
            return (
              <div key={h.id} className="hb-card">
                <div className="hb-card-icon" style={{ background: `${h.color}22` }}>
                  <span>{h.icon}</span>
                </div>
                <div className="hb-card-body">
                  <div className="hb-card-name">{h.name}</div>
                  {h.description && <div className="hb-card-desc">{h.description}</div>}
                  <div style={{ margin: "10px 0 4px" }}>
                    <div style={{ fontSize: 10, color: "var(--d-muted)", marginBottom: 5 }}>{t.habitHistory}</div>
                    <div className="hb-heatmap">
                      {last30.map((d) => (
                        <div
                          key={d}
                          className={`hb-day${logDates.has(d) ? " done" : ""}${d === today ? " today" : ""}`}
                          title={d}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="hb-card-actions">
                    <button
                      className={`hb-check-btn ${doneToday ? "done" : "undone"}`}
                      onClick={() => toggleHabitLog(h.id)}
                    >
                      <Check size={12} />
                      {doneToday ? t.habitDone : t.habitMark}
                    </button>
                    {streak > 0 && (
                      <span className="hb-streak-badge">
                        <Flame size={10} /> {streak}d
                      </span>
                    )}
                    <button className="hb-del-btn" title={t.habitDelete} onClick={() => deleteHabit(h.id)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
