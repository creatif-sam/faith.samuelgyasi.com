import { useState, useEffect } from "react";
import { X, Plus, Calendar, Link2, Send, Flame, GraduationCap, BookOpen, BookMarked, Target, MessageCircle, CheckCircle2, Circle, AlertTriangle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { Disciple, DiscipleProgress } from "../types";
import { createClient } from "@/lib/supabase/client";

interface DiscipleProgressModalProps {
  disciple: Disciple;
  onClose: () => void;
  db: ReturnType<typeof createClient>;
  load?: () => Promise<void>;
}

interface Engagement {
  habitCount: number;
  logsLast30Days: number;
  lastLoggedDate: string | null;
  enrollmentCount: number;
  lessonsCompleted: number;
}

interface SharedJournalEntry { id: string; content: string; created_at: string; }
interface Goal { id: string; title: string; description: string | null; target_date: string | null; completed: boolean; }
interface RecentMessage { id: string; title: string; body: string | null; reply: string | null; created_at: string; }

export default function DiscipleProgressModal({ disciple, onClose, db, load }: DiscipleProgressModalProps) {
  const [progressEntries, setProgressEntries] = useState<DiscipleProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [changesObserved, setChangesObserved] = useState("");
  const [challenges, setChallenges] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [courseMilestone, setCourseMilestone] = useState("");
  const [noteToDisciple, setNoteToDisciple] = useState("");
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState<string | null>(disciple.user_id);
  const [linking, setLinking] = useState(false);
  const [engagement, setEngagement] = useState<Engagement | null>(null);
  const [engagementLoading, setEngagementLoading] = useState(false);
  const [sharedJournal, setSharedJournal] = useState<SharedJournalEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);

  useEffect(() => {
    loadProgress();
  }, [disciple.id]);

  useEffect(() => {
    if (userId) {
      loadEngagement(userId);
      loadAccompanimentData(userId);
    }
  }, [userId]);

  async function loadEngagement(uid: string) {
    setEngagementLoading(true);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
    const [habitsRes, logsRes, enrollRes, lessonsRes] = await Promise.all([
      db.from("spiritual_habits").select("id").eq("user_id", uid),
      db.from("habit_logs").select("logged_date").eq("user_id", uid).gte("logged_date", thirtyDaysAgo).order("logged_date", { ascending: false }),
      db.from("training_enrollments").select("training_id").eq("user_id", uid),
      db.from("lesson_progress").select("lesson_id").eq("user_id", uid).eq("completed", true),
    ]);
    setEngagement({
      habitCount: habitsRes.data?.length ?? 0,
      logsLast30Days: logsRes.data?.length ?? 0,
      lastLoggedDate: logsRes.data?.[0]?.logged_date ?? null,
      enrollmentCount: enrollRes.data?.length ?? 0,
      lessonsCompleted: lessonsRes.data?.length ?? 0,
    });
    setEngagementLoading(false);
  }

  async function loadAccompanimentData(uid: string) {
    const [journalRes, goalsRes, messagesRes] = await Promise.all([
      db.from("journal_entries").select("id,content,created_at").eq("user_id", uid).eq("shared_with_mentor", true).order("created_at", { ascending: false }),
      db.from("personal_goals").select("id,title,description,target_date,completed").eq("user_id", uid).order("created_at", { ascending: false }),
      db.from("user_notifications").select("id,title,body,reply,created_at").eq("user_id", uid).order("created_at", { ascending: false }).limit(5),
    ]);
    setSharedJournal((journalRes.data as SharedJournalEntry[]) ?? []);
    setGoals((goalsRes.data as Goal[]) ?? []);
    setRecentMessages((messagesRes.data as RecentMessage[]) ?? []);
  }

  async function handleLink() {
    if (!disciple.email) {
      toast.error("This disciple has no email on file to match against.");
      return;
    }
    setLinking(true);
    const { data, error } = await db.rpc("admin_link_disciple_by_email", { p_disciple_id: disciple.id });
    setLinking(false);
    if (error) {
      toast.error("Could not check for a matching account.");
      console.error("admin_link_disciple_by_email error:", error);
      return;
    }
    if (!data) {
      toast.error(`No account found yet for ${disciple.email}.`);
      return;
    }
    setUserId(data as string);
    toast.success("Account linked — engagement data is now visible.");
    await load?.();
  }

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
    if (!changesObserved.trim() && !challenges.trim() && !nextSteps.trim() && !courseMilestone.trim() && !noteToDisciple.trim()) {
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

    if (error) {
      setSaving(false);
      toast.error("Failed to save progress");
      return;
    }

    if (noteToDisciple.trim() && userId) {
      const { error: notifError } = await db.from("user_notifications").insert({
        user_id: userId,
        title: "A note from Samuel",
        body: noteToDisciple.trim(),
      });
      if (notifError) {
        toast.error("Progress saved, but the note to the disciple failed to send.");
        console.error("send disciple note error:", notifError);
      } else {
        toast.success("Progress entry added and note sent to disciple");
        loadAccompanimentData(userId);
      }
    } else {
      toast.success("Progress entry added");
    }

    setSaving(false);
    setChangesObserved("");
    setChallenges("");
    setNextSteps("");
    setCourseMilestone("");
    setNoteToDisciple("");
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
          {/* Account & Engagement */}
          <div className="mb-6 p-5 bg-white/[.02] border border-white/[.06] rounded-lg">
            {!userId ? (
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Link2 size={14} /> No linked dashboard account yet
                </div>
                <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={handleLink} disabled={linking}>
                  {linking ? "Checking..." : "Link Account"}
                </button>
              </div>
            ) : engagementLoading || !engagement ? (
              <div className="text-white/30 text-sm">Loading engagement data...</div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-green-400 text-xs mb-3">
                  <Link2 size={14} /> Linked to dashboard account
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white/[.03] rounded-lg">
                    <div className="flex items-center gap-1.5 text-[#d4a843] mb-1"><Flame size={13} /><span className="text-[10px] uppercase tracking-wider">Habits</span></div>
                    <div className="text-white/90 text-sm">{engagement.habitCount} active</div>
                    <div className="text-white/40 text-xs">{engagement.logsLast30Days} logs / 30d</div>
                  </div>
                  <div className="p-3 bg-white/[.03] rounded-lg">
                    <div className="flex items-center gap-1.5 text-[#d4a843] mb-1"><Calendar size={13} /><span className="text-[10px] uppercase tracking-wider">Last Logged</span></div>
                    <div className="text-white/90 text-sm">
                      {engagement.lastLoggedDate ? new Date(engagement.lastLoggedDate).toLocaleDateString() : "Never"}
                    </div>
                  </div>
                  <div className="p-3 bg-white/[.03] rounded-lg">
                    <div className="flex items-center gap-1.5 text-[#d4a843] mb-1"><GraduationCap size={13} /><span className="text-[10px] uppercase tracking-wider">Trainings</span></div>
                    <div className="text-white/90 text-sm">{engagement.enrollmentCount} enrolled</div>
                  </div>
                  <div className="p-3 bg-white/[.03] rounded-lg">
                    <div className="flex items-center gap-1.5 text-[#d4a843] mb-1"><BookOpen size={13} /><span className="text-[10px] uppercase tracking-wider">Lessons</span></div>
                    <div className="text-white/90 text-sm">{engagement.lessonsCompleted} completed</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Goals, shared journal, and recent messages — only meaningful once linked */}
          {userId && (goals.length > 0 || sharedJournal.length > 0 || recentMessages.length > 0) && (
            <div className="mb-6 grid sm:grid-cols-2 gap-4">
              {goals.length > 0 && (
                <div className="p-4 bg-white/[.02] border border-white/[.06] rounded-lg">
                  <div className="flex items-center gap-1.5 text-[#d4a843] text-xs uppercase tracking-wider mb-3">
                    <Target size={13} /> Goals ({goals.filter(g => !g.completed).length} active)
                  </div>
                  <div className="space-y-2">
                    {goals.slice(0, 5).map((g) => (
                      <div key={g.id} className="text-sm flex items-start gap-2">
                        <span className={cn("mt-0.5", g.completed ? "text-green-400" : "text-white/30")}>
                          {g.completed ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                        </span>
                        <span className={g.completed ? "text-white/40 line-through" : "text-white/80"}>{g.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sharedJournal.length > 0 && (
                <div className="p-4 bg-white/[.02] border border-white/[.06] rounded-lg">
                  <div className="flex items-center gap-1.5 text-[#d4a843] text-xs uppercase tracking-wider mb-3">
                    <BookMarked size={13} /> Shared Journal ({sharedJournal.length})
                  </div>
                  <div className="space-y-3 max-h-[180px] overflow-y-auto">
                    {sharedJournal.map((entry) => (
                      <div key={entry.id}>
                        <div className="text-white/30 text-[10px] mb-0.5">{new Date(entry.created_at).toLocaleDateString()}</div>
                        <div className="text-white/70 text-sm leading-relaxed">{entry.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recentMessages.length > 0 && (
                <div className="p-4 bg-white/[.02] border border-white/[.06] rounded-lg sm:col-span-2">
                  <div className="flex items-center gap-1.5 text-[#d4a843] text-xs uppercase tracking-wider mb-3">
                    <MessageCircle size={13} /> Recent Messages
                  </div>
                  <div className="space-y-3">
                    {recentMessages.map((m) => (
                      <div key={m.id} className="text-sm border-l-2 border-[rgba(212,168,67,.25)] pl-3">
                        <div className="text-white/80 font-medium">{m.title}</div>
                        {m.body && <div className="text-white/50 text-xs mt-0.5">{m.body}</div>}
                        {m.reply && (
                          <div className="mt-1.5 text-xs">
                            <span className="text-[#d4a843]">{disciple.name} replied: </span>
                            <span className="text-white/70">{m.reply}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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

              <div className={cn(TW.field, "pt-4 border-t border-white/[.06]")}>
                <label className={TW.label}>
                  <span className="inline-flex items-center gap-1.5"><Send size={11} /> Note to {disciple.name} (optional)</span>
                </label>
                {userId ? (
                  <textarea
                    className={cn(TW.tarea, "min-h-[60px]")}
                    value={noteToDisciple}
                    onChange={(e) => setNoteToDisciple(e.target.value)}
                    placeholder="Written to them directly — shows up in their dashboard notifications."
                  />
                ) : (
                  <p className="text-white/30 text-xs italic">Link their account above to send them a note.</p>
                )}
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
                    setNoteToDisciple("");
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
                          <div className="text-xs font-medium text-green-400 mb-1 inline-flex items-center gap-1.5">
                            <CheckCircle2 size={12} /> Changes Observed
                          </div>
                          <div className="text-sm text-white/70 leading-relaxed">
                            {entry.changes_observed}
                          </div>
                        </div>
                      )}

                      {entry.challenges && (
                        <div>
                          <div className="text-xs font-medium text-orange-400 mb-1 inline-flex items-center gap-1.5">
                            <AlertTriangle size={12} /> Challenges
                          </div>
                          <div className="text-sm text-white/70 leading-relaxed">
                            {entry.challenges}
                          </div>
                        </div>
                      )}

                      {entry.next_steps && (
                        <div>
                          <div className="text-xs font-medium text-blue-400 mb-1 inline-flex items-center gap-1.5">
                            <ArrowRight size={12} /> Next Steps
                          </div>
                          <div className="text-sm text-white/70 leading-relaxed">
                            {entry.next_steps}
                          </div>
                        </div>
                      )}

                      {entry.course_milestone && (
                        <div>
                          <div className="text-xs font-medium text-[#d4a843] mb-1 inline-flex items-center gap-1.5">
                            <BookMarked size={12} /> Course Milestone
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
