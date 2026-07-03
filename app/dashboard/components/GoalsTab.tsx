"use client";
import { useState } from "react";
import { Target, Check, Trash2, Plus, Sparkles, Calendar } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { PersonalGoal } from "../types";
import type { Translations } from "../translations";

interface GoalsTabProps {
  user: SupabaseUser;
  t: Translations;
  goals: PersonalGoal[];
  setGoals: React.Dispatch<React.SetStateAction<PersonalGoal[]>>;
}

export default function GoalsTab({ user, t, goals, setGoals }: GoalsTabProps) {
  const db = createClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function saveGoal() {
    if (!title.trim()) return;
    setSaving(true);
    const { data, error } = await db.from("personal_goals").insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      target_date: targetDate || null,
    }).select().single();
    setSaving(false);
    if (error || !data) {
      toast.error("Could not save your goal. Please try again.");
      return;
    }
    toast.success(`Goal "${title.trim()}" set!`);
    setGoals((prev) => [data as PersonalGoal, ...prev]);
    setTitle(""); setDescription(""); setTargetDate("");
    setShowForm(false);
  }

  async function completeGoal(id: string) {
    const now = new Date().toISOString();
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, completed: true, completed_at: now } : g));
    await db.from("personal_goals").update({ completed: true, completed_at: now }).eq("id", id);
  }

  async function deleteGoal(id: string) {
    setConfirmDeleteId(null);
    setGoals((prev) => prev.filter((g) => g.id !== id));
    await db.from("personal_goals").delete().eq("id", id);
  }

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  return (
    <>
      <div className="dash-page-header">
        <h1 className="dash-page-title">{t.goalsTitle}</h1>
        <p className="dash-page-sub">{t.goalsSub}</p>
      </div>

      {!showForm ? (
        <button
          className="dash-btn dash-btn-gold"
          style={{ width: "auto", marginBottom: 24, padding: "10px 20px", gap: 6, display: "inline-flex", alignItems: "center" }}
          onClick={() => setShowForm(true)}
        >
          <Plus size={14} /> {t.goalsNew}
        </button>
      ) : (
        <div className="hb-form">
          <div className="hb-form-grid">
            <div>
              <label className="hb-label">{t.goalsTitle} *</label>
              <input className="hb-input" placeholder={t.goalsTitlePlaceholder} value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="hb-label">{t.goalsTargetDate}</label>
              <input type="date" className="hb-input" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label className="hb-label">{t.habitDesc}</label>
            <input className="hb-input" placeholder={t.goalsDescPlaceholder} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="hb-form-actions">
            <button className="hb-btn-ghost" onClick={() => { setShowForm(false); setTitle(""); setDescription(""); setTargetDate(""); }}>
              {t.habitCancel}
            </button>
            <button className="hb-btn-primary" disabled={saving || !title.trim()} onClick={saveGoal}>
              {saving ? "…" : t.goalsSave}
            </button>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="dash-empty" style={{ marginTop: 24 }}>
          <Sparkles size={32} style={{ margin: "0 auto 12px", color: "rgba(212,168,67,.3)", display: "block" }} />
          {t.goalsEmpty}
        </div>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div className="gl-list" style={{ marginTop: 24 }}>
              {activeGoals.map((g) => (
                <div key={g.id} className="gl-card">
                  <div className="gl-card-icon"><Target size={16} /></div>
                  <div className="gl-card-body">
                    <div className="gl-card-title">{g.title}</div>
                    {g.description && <div className="gl-card-desc">{g.description}</div>}
                    {g.target_date && (
                      <div className="gl-card-date"><Calendar size={11} /> {t.goalsDue} {new Date(g.target_date).toLocaleDateString()}</div>
                    )}
                  </div>
                  <div className="gl-card-actions">
                    <button className="hb-check-btn undone" onClick={() => completeGoal(g.id)}>
                      <Check size={12} /> {t.goalsComplete}
                    </button>
                    {confirmDeleteId === g.id ? (
                      <span style={{ display: "inline-flex", gap: 4 }}>
                        <button className="hb-del-btn" style={{ background: "rgba(239,68,68,.2)", color: "#ef4444" }} onClick={() => deleteGoal(g.id)}>
                          {t.habitDelete}?
                        </button>
                        <button className="hb-btn-ghost" style={{ fontSize: 10, padding: "3px 8px" }} onClick={() => setConfirmDeleteId(null)}>
                          {t.habitCancel}
                        </button>
                      </span>
                    ) : (
                      <button className="hb-del-btn" title={t.habitDelete} onClick={() => setConfirmDeleteId(g.id)}>
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {completedGoals.length > 0 && (
            <>
              <div className="dash-section-head" style={{ marginTop: 32 }}>
                <Check size={13} /> {t.goalsCompleted} ({completedGoals.length})
              </div>
              <div className="gl-list">
                {completedGoals.map((g) => (
                  <div key={g.id} className="gl-card completed">
                    <div className="gl-card-icon done"><Check size={16} /></div>
                    <div className="gl-card-body">
                      <div className="gl-card-title">{g.title}</div>
                      {g.description && <div className="gl-card-desc">{g.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
