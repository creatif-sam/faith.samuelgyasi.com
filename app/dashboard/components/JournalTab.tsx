"use client";
import { useState } from "react";
import { BookMarked, Share2, Lock, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { JournalEntry } from "../types";
import type { Translations } from "../translations";

interface JournalTabProps {
  user: SupabaseUser;
  t: Translations;
  entries: JournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
}

export default function JournalTab({ user, t, entries, setEntries }: JournalTabProps) {
  const db = createClient();
  const [content, setContent] = useState("");
  const [shareWithMentor, setShareWithMentor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function saveEntry() {
    if (!content.trim()) return;
    setSaving(true);
    const { data, error } = await db.from("journal_entries").insert({
      user_id: user.id,
      content: content.trim(),
      shared_with_mentor: shareWithMentor,
    }).select().single();
    setSaving(false);
    if (error || !data) {
      toast.error("Could not save your entry. Please try again.");
      return;
    }
    toast.success("Journal entry saved");
    setEntries((prev) => [data as JournalEntry, ...prev]);
    setContent("");
    setShareWithMentor(false);
  }

  async function deleteEntry(id: string) {
    setConfirmDeleteId(null);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    await db.from("journal_entries").delete().eq("id", id);
  }

  return (
    <>
      <div className="dash-page-header">
        <h1 className="dash-page-title">{t.journalTitle}</h1>
        <p className="dash-page-sub">{t.journalSub}</p>
      </div>

      <div className="hb-form" style={{ marginBottom: 24 }}>
        <textarea
          className="hb-input jr-textarea"
          placeholder={t.journalPlaceholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="jr-form-actions">
          <label className="jr-share-toggle">
            <input type="checkbox" checked={shareWithMentor} onChange={(e) => setShareWithMentor(e.target.checked)} />
            <Share2 size={12} /> {t.journalShare}
          </label>
          <button
            className="hb-btn-primary"
            disabled={saving || !content.trim()}
            onClick={saveEntry}
          >
            {saving ? "…" : t.journalSave}
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="dash-empty">
          <Sparkles size={32} style={{ margin: "0 auto 12px", color: "rgba(84,108,250,.3)", display: "block" }} />
          {t.journalEmpty}
        </div>
      ) : (
        <div className="jr-list">
          {entries.map((entry) => (
            <div key={entry.id} className="jr-card">
              <div className="jr-card-head">
                <BookMarked size={13} />
                <span className="jr-card-date">{new Date(entry.created_at).toLocaleDateString()}</span>
                <span className={`jr-badge${entry.shared_with_mentor ? " shared" : ""}`}>
                  {entry.shared_with_mentor ? <><Share2 size={10} /> {t.journalShared}</> : <><Lock size={10} /> {t.journalPrivate}</>}
                </span>
                {confirmDeleteId === entry.id ? (
                  <span style={{ display: "inline-flex", gap: 4, marginLeft: "auto" }}>
                    <button className="hb-del-btn" style={{ background: "rgba(239,68,68,.2)", color: "#ef4444" }} onClick={() => deleteEntry(entry.id)}>
                      {t.habitDelete}?
                    </button>
                    <button className="hb-btn-ghost" style={{ fontSize: 10, padding: "3px 8px" }} onClick={() => setConfirmDeleteId(null)}>
                      {t.habitCancel}
                    </button>
                  </span>
                ) : (
                  <button className="hb-del-btn" style={{ marginLeft: "auto" }} title={t.habitDelete} onClick={() => setConfirmDeleteId(entry.id)}>
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              <p className="jr-card-body">{entry.content}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
