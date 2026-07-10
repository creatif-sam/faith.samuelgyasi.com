"use client";
import { useState } from "react";
import {
  Flame, Check, BarChart2, Plus, Sparkles, Sparkle, Trash2,
  HandHeart, BookOpen, Cross, Feather, Dumbbell, Sunrise, Wind, Heart, Leaf, Star, Target,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { SpiritualHabit, HabitLog } from "../types";
import type { Translations } from "../translations";

// Habits are stored as a semantic key (e.g. "pray"), not a raw emoji glyph.
// Legacy rows created before this change may still hold an emoji string, so
// the lookup below accepts both.
const HABIT_ICON_OPTIONS: { key: string; Icon: LucideIcon }[] = [
  { key: "pray",     Icon: HandHeart },
  { key: "book",     Icon: BookOpen },
  { key: "cross",    Icon: Cross },
  { key: "dove",     Icon: Feather },
  { key: "strength", Icon: Dumbbell },
  { key: "sunrise",  Icon: Sunrise },
  { key: "meditate", Icon: Wind },
  { key: "love",     Icon: Heart },
  { key: "nature",   Icon: Leaf },
  { key: "fire",     Icon: Flame },
  { key: "star",     Icon: Star },
  { key: "target",   Icon: Target },
];
const HABIT_ICON_MAP: Record<string, LucideIcon> = {
  ...Object.fromEntries(HABIT_ICON_OPTIONS.map(({ key, Icon }) => [key, Icon])),
  "🙏": HandHeart, "📖": BookOpen, "✝️": Cross, "🕊️": Feather, "💪": Dumbbell,
  "🌅": Sunrise, "🧘": Wind, "❤️": Heart, "🌿": Leaf, "🔥": Flame, "⭐": Star, "🎯": Target,
};
function getHabitIcon(key: string): LucideIcon {
  return HABIT_ICON_MAP[key] ?? Sparkle;
}

interface HabitsTabProps {
  user: SupabaseUser;
  t: Translations;
  habits: SpiritualHabit[];
  habitLogs: HabitLog[];
  setHabits: React.Dispatch<React.SetStateAction<SpiritualHabit[]>>;
  setHabitLogs: React.Dispatch<React.SetStateAction<HabitLog[]>>;
}

export default function HabitsTab({ user, t, habits, habitLogs, setHabits, setHabitLogs }: HabitsTabProps) {
  const db = createClient();
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [habitDesc, setHabitDesc] = useState("");
  const [habitIcon, setHabitIcon] = useState("pray");
  const [habitSaving, setHabitSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  async function createHabit() {
    if (!habitName.trim()) return;
    setHabitSaving(true);
    const { data, error } = await db.from("spiritual_habits").insert({
      user_id: user.id,
      name: habitName.trim(),
      description: habitDesc.trim() || null,
      icon: habitIcon,
    }).select().single();
    setHabitSaving(false);
    if (error || !data) {
      toast.error("Could not create habit. Please try again.");
      return;
    }
    toast.success(`Habit "${habitName.trim()}" created!`);
    setHabits((prev) => [...prev, data as SpiritualHabit]);
    setHabitName(""); setHabitDesc(""); setHabitIcon("pray");
    setShowHabitForm(false);
  }

  async function deleteHabit(id: string) {
    const habit = habits.find((h) => h.id === id);
    setConfirmDeleteId(null);
    // Optimistic removal
    setHabits(prev => prev.filter(h => h.id !== id));
    setHabitLogs(prev => prev.filter(l => l.habit_id !== id));
    await db.from("spiritual_habits").delete().eq("id", id);
    toast.success(`"${habit?.name ?? "Habit"}" deleted.`);
  }

  async function toggleHabitLog(habitId: string) {
    const existing = habitLogs.find((l) => l.habit_id === habitId && l.logged_date === today);
    const habit = habits.find((h) => h.id === habitId);
    const HabitIcon = getHabitIcon(habit?.icon ?? "");
    if (existing) {
      // Optimistic unmark
      setHabitLogs(prev => prev.filter(l => l.id !== existing.id));
      toast(`${habit?.name ?? "Habit"} unmarked for today.`, { icon: <HabitIcon size={16} /> });
      await db.from("habit_logs").delete().eq("id", existing.id);
    } else {
      // Streak as of yesterday (today isn't logged yet at this point), so the
      // streak this mark produces is always exactly one more than that.
      const priorStreak = getHabitStreak(habitId);
      const newStreak = priorStreak + 1;
      const milestone = [7, 14, 30].includes(newStreak);

      // Optimistic mark
      const tempId = `temp-${Date.now()}`;
      setHabitLogs(prev => [...prev, { id: tempId, habit_id: habitId, logged_date: today }]);
      if (milestone) {
        toast.success(`${newStreak}-day streak on "${habit?.name ?? "this habit"}"! Keep going.`, { duration: 5000, icon: <Flame size={16} /> });
      } else {
        toast.success(`${habit?.name ?? "Habit"} done today!`, { icon: <Check size={16} /> });
      }
      const { data } = await db
        .from("habit_logs")
        .insert({ habit_id: habitId, user_id: user.id, logged_date: today })
        .select("id")
        .single();
      if (data) {
        setHabitLogs(prev => prev.map(l => l.id === tempId ? { ...l, id: data.id } : l));
      }
    }
  }

  function getHabitStreak(habitId: string): number {
    const logDates = habitLogs
      .filter((l) => l.habit_id === habitId)
      .map((l) => l.logged_date)
      .sort((a, b) => b.localeCompare(a));
    if (logDates.length === 0) return 0;
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    // Streak is valid if the most recent log is today or yesterday
    if (logDates[0] !== todayStr && logDates[0] !== yesterdayStr) return 0;
    const startOffset = logDates[0] === todayStr ? 0 : 1;
    let streak = 0;
    for (let i = startOffset; i < 31; i++) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      if (logDates.includes(ds)) { streak++; } else { break; }
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
              {HABIT_ICON_OPTIONS.map(({ key, Icon }) => (
                <button
                  key={key}
                  type="button"
                  aria-label={key}
                  className={`hb-icon-pick${habitIcon === key ? " sel" : ""}`}
                  onClick={() => setHabitIcon(key)}
                ><Icon size={16} /></button>
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
          <div style={{ marginBottom: 16 }}>{t.habitEmpty}</div>
          <button
            className="dash-btn dash-btn-gold"
            style={{ width: "auto", display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px" }}
            onClick={() => setShowHabitForm(true)}
          >
            <Plus size={14} /> {t.newHabit}
          </button>
        </div>
      ) : (
        <div className="hb-list">
          {habits.map((h) => {
            const doneToday = habitLogs.some((l) => l.habit_id === h.id && l.logged_date === today);
            const streak = getHabitStreak(h.id);
            const last30 = getLast30Days();
            const logDates = new Set(habitLogs.filter((l) => l.habit_id === h.id).map((l) => l.logged_date));
            const HabitIcon = getHabitIcon(h.icon);
            return (
              <div key={h.id} className="hb-card">
                <div className="hb-card-icon" style={{ background: `${h.color}22` }}>
                  <HabitIcon size={16} />
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
                    {confirmDeleteId === h.id ? (
                      <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                        <button
                          className="hb-del-btn"
                          style={{ background: "rgba(239,68,68,.2)", color: "#ef4444" }}
                          onClick={() => deleteHabit(h.id)}
                          title="Confirm delete"
                        >
                          {t.habitDelete}?
                        </button>
                        <button
                          className="hb-btn-ghost"
                          style={{ fontSize: 10, padding: "3px 8px" }}
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          {t.habitCancel}
                        </button>
                      </span>
                    ) : (
                      <button className="hb-del-btn" title={t.habitDelete} onClick={() => setConfirmDeleteId(h.id)}>
                        <Trash2 size={12} />
                      </button>
                    )}
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
