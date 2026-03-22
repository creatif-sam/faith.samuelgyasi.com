import { useState, useEffect } from "react";
import { X, Plus, Calendar } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { Disciple, DiscipleProgress } from "../types";
import { createClient } from "@/lib/supabase/client";

interface DiscipleProgressModalProps {
  disciple: Disciple;
  onClose: () => void;
  db: ReturnType<typeof createClient>;
}

export default function DiscipleProgressModal({ disciple, onClose, db }: DiscipleProgressModalProps) {
  const [progressEntries, setProgressEntries] = useState<DiscipleProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [changesObserved, setChangesObserved] = useState("");
  const [challenges, setChallenges] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [courseMilestone, setCourseMilestone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProgress();
  }, [disciple.id]);

  async function loadProgress() {
    setLoading(true);
    const { data, error } = await db
      .from("disciple_progress")
      .select("*")
      .eq("disciple_id", disciple.id)
      .order("entry_date", { ascending: false });

    if (!error && data) {
      setProgressEntries(data as DiscipleProgress[]);
    }
    setLoading(false);
  }

  async function handleAddEntry() {
    if (!changesObserved.trim() && !challenges.trim() && !nextSteps.trim() && !courseMilestone.trim()) {
      toast.error("Please fill in at least one field");
      return;
    }

    setSaving(true);
    const { error } = await db.from("disciple_progress").insert({
      disciple_id: disciple.id,
      changes_observed: changesObserved.trim() || null,
      challenges: challenges.trim() || null,
      next_steps: nextSteps.trim() || null,
      course_milestone: courseMilestone.trim() || null,
    });

    setSaving(false);
    if (error) {
      toast.error("Failed to save progress");
      return;
    }

    toast.success("Progress entry added");
    setChangesObserved("");
    setChallenges("");
    setNextSteps("");
    setCourseMilestone("");
    setShowAddForm(false);
    loadProgress();
  }

  return (
    <div className={TW.overlay} onClick={onClose}>
      <div 
        className={cn(TW.panel, "max-w-[900px]")} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={TW.pHead}>
          <div>
            <div className={TW.fTitle}>Progress Tracking: {disciple.name}</div>
            <div className="text-sm text-white/40 mt-1">
              Current: {disciple.current_course || "No course"} • Status: {disciple.status}
            </div>
          </div>
          <button className={TW.iconBtn} onClick={onClose}><X size={16} /></button>
        </div>

        <div className={TW.pBody} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Add New Entry Section */}
          {!showAddForm ? (
            <button 
              className={cn(TW.btn, TW.gold, "w-full mb-6")}
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={14} /> Add Progress Entry
            </button>
          ) : (
            <div className="mb-6 p-6 bg-white/[.02] border border-[rgba(212,168,67,.2)] rounded-lg">
              <h3 className="font-poppins text-sm font-semibold text-[#d4a843] mb-4">
                New Progress Entry
              </h3>

              <div className={TW.field}>
                <label className={TW.label}>Changes Observed</label>
                <textarea
                  className={cn(TW.tarea, "min-h-[60px]")}
                  value={changesObserved}
                  onChange={(e) => setChangesObserved(e.target.value)}
                  placeholder="Positive changes, breakthroughs, growth areas..."
                />
              </div>

              <div className={TW.field}>
                <label className={TW.label}>Challenges / Struggles</label>
                <textarea
                  className={cn(TW.tarea, "min-h-[60px]")}
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  placeholder="Areas of difficulty, questions, concerns..."
                />
              </div>

              <div className={TW.field}>
                <label className={TW.label}>Next Steps / Action Items</label>
                <textarea
                  className={cn(TW.tarea, "min-h-[60px]")}
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  placeholder="Recommended actions, follow-up items..."
                />
              </div>

              <div className={TW.field}>
                <label className={TW.label}>Course Milestone</label>
                <input
                  className={TW.input}
                  value={courseMilestone}
                  onChange={(e) => setCourseMilestone(e.target.value)}
                  placeholder="Completed Module 3, Attended retreat, etc."
                />
              </div>

              <div className="flex gap-2">
                <button 
                  className={cn(TW.btn, TW.ghost, "flex-1")}
                  onClick={() => {
                    setShowAddForm(false);
                    setChangesObserved("");
                    setChallenges("");
                    setNextSteps("");
                    setCourseMilestone("");
                  }}
                >
                  Cancel
                </button>
                <button 
                  className={cn(TW.btn, TW.gold, "flex-1")}
                  onClick={handleAddEntry}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Entry"}
                </button>
              </div>
            </div>
          )}

          {/* Progress Timeline */}
          <div>
            <h3 className="font-poppins text-sm font-semibold text-white/70 mb-4">
              Progress History ({progressEntries.length} {progressEntries.length === 1 ? 'entry' : 'entries'})
            </h3>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="flex gap-2">
                  {[0, 200, 400].map((delay) => (
                    <div
                      key={delay}
                      className="w-2 h-2 bg-[#d4a843] rounded-full animate-pulse"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            ) : progressEntries.length === 0 ? (
              <div className="text-center py-12 text-white/30 text-sm">
                No progress entries yet. Add the first one above!
              </div>
            ) : (
              <div className="space-y-4">
                {progressEntries.map((entry) => (
                  <div 
                    key={entry.id}
                    className="p-4 bg-white/[.02] border border-white/[.06] rounded-lg hover:border-white/[.12] transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(212,168,67,.1)] flex items-center justify-center flex-shrink-0">
                        <Calendar size={14} className="text-[#d4a843]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white/90">
                          {new Date(entry.entry_date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-xs text-white/40">
                          {new Date(entry.entry_date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pl-11">
                      {entry.changes_observed && (
                        <div>
                          <div className="text-xs font-medium text-green-400 mb-1">
                            ✓ Changes Observed
                          </div>
                          <div className="text-sm text-white/70 leading-relaxed">
                            {entry.changes_observed}
                          </div>
                        </div>
                      )}

                      {entry.challenges && (
                        <div>
                          <div className="text-xs font-medium text-orange-400 mb-1">
                            ⚠ Challenges
                          </div>
                          <div className="text-sm text-white/70 leading-relaxed">
                            {entry.challenges}
                          </div>
                        </div>
                      )}

                      {entry.next_steps && (
                        <div>
                          <div className="text-xs font-medium text-blue-400 mb-1">
                            → Next Steps
                          </div>
                          <div className="text-sm text-white/70 leading-relaxed">
                            {entry.next_steps}
                          </div>
                        </div>
                      )}

                      {entry.course_milestone && (
                        <div>
                          <div className="text-xs font-medium text-[#d4a843] mb-1">
                            📚 Course Milestone
                          </div>
                          <div className="text-sm text-white/70 leading-relaxed">
                            {entry.course_milestone}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
