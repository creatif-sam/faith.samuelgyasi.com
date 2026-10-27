import { useState } from "react";
import { Plus, Pencil, Trash2, List, X, ArrowLeft, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { FaithTest, FaithTestQuestion, FaithTestProfile } from "../types";
import { createClient } from "@/lib/supabase/client";

interface FaithTestsTabProps {
  tests: FaithTest[];
  onNew: () => void;
  onEdit: (t: FaithTest) => void;
  onDelete: (id: string, name: string) => void;
  onToggle: (id: string, val: boolean) => Promise<void>;
  db: ReturnType<typeof createClient>;
}

export default function FaithTestsTab({ tests, onNew, onEdit, onDelete, onToggle, db }: FaithTestsTabProps) {
  const published = tests.filter((t) => t.published).length;
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [questions, setQuestions] = useState<FaithTestQuestion[]>([]);
  const [profiles, setProfiles] = useState<FaithTestProfile[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [manageView, setManageView] = useState<"questions" | "profiles">("questions");
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState<FaithTestQuestion | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editProfile, setEditProfile] = useState<FaithTestProfile | null>(null);

  const activeTest = tests.find((t) => t.id === selectedTest) ?? null;
  const isReflection = activeTest?.test_type === "reflection";

  async function loadProfiles(testId: string) {
    const { data } = await db.from("faith_test_profiles")
      .select("*")
      .eq("test_id", testId)
      .order("sort_order", { ascending: true });
    setProfiles((data as FaithTestProfile[]) ?? []);
  }

  async function loadQuestions(test: FaithTest) {
    const { data } = await db.from("faith_test_questions")
      .select("*")
      .eq("test_id", test.id)
      .order("sort_order", { ascending: true });
    setQuestions((data as FaithTestQuestion[]) ?? []);
    setSelectedTest(test.id);
    if (test.test_type === "reflection") await loadProfiles(test.id);
    setManageView("questions");
    setShowQuestions(true);
  }

  return (
    <>
      <div className="flex flex-wrap justify-between items-start gap-3 mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Faith Analyzer Tests</div>
          <p className={TW.pgSub}>{published} published · {tests.length} total</p>
        </div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}><Plus size={12} />Add Test</button>
      </div>

      {!showQuestions ? (
        <>
          {tests.length === 0 ? <p className={TW.empty}>No faith tests yet. Create the first one.</p> : (
            <div className={TW.tWrap}>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className={TW.th}>Name (EN / FR)</th>
                    <th className={TW.th}>Slug</th>
                    <th className={TW.th}>Type</th>
                    <th className={TW.th}>Total Takes</th>
                    <th className={TW.th}>Status</th>
                    <th className={TW.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((t) => (
                    <tr key={t.id} className="hover:[&>td]:bg-[rgba(84,108,250,.04)]">
                      <td className={TW.td} style={{ color: "#f0ece4", maxWidth: "250px" }}>
                        <div className="font-semibold">{t.name_en}</div>
                        <div className="text-[11px] text-white/40 mt-0.5">{t.name_fr}</div>
                      </td>
                      <td className={TW.td} style={{ fontSize: "12px", fontFamily: "monospace", color: "#7b8ffc" }}>
                        /{t.slug}
                      </td>
                      <td className={TW.td}>
                        <span className={cn(TW.badge, t.test_type === "reflection" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : TW.bDft)}>
                          {t.test_type === "reflection" ? "Reflection" : "Quiz"}
                        </span>
                      </td>
                      <td className={TW.td}>
                        <span className={cn(TW.badge, TW.bPub)}>
                          {t.total_takes} attempts
                        </span>
                      </td>
                      <td className={TW.td}>
                        <button className={cn(TW.badge, t.published ? TW.bPub : TW.bDft, "cursor-pointer bg-transparent border-none")}
                          onClick={() => onToggle(t.id, !t.published)} title={t.published ? "Click to unpublish" : "Click to publish"}>
                          {t.published ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td className={TW.td}>
                        <div className={TW.actRow}>
                          <button className={cn(TW.btn, TW.gold, TW.sm)} onClick={() => loadQuestions(t)} title="Manage Questions">
                            <List size={10} />Questions
                          </button>
                          <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onEdit(t)}><Pencil size={10} /></button>
                          <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(t.id, t.name_en)}><Trash2 size={10} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Questions / Profiles View */}
          <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
            <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => setShowQuestions(false)}>
              <ArrowLeft size={12} /> Back to Tests
            </button>
            {isReflection && (
              <div className="flex gap-1 bg-white/[.03] border border-white/[.06] rounded-lg p-1">
                <button
                  className={cn(
                    "px-3.5 py-1.5 font-poppins text-[11px] font-medium rounded-md transition-all",
                    manageView === "questions" ? "bg-[rgba(84,108,250,.16)] text-[#7b8ffc]" : "text-white/45 hover:text-white/75"
                  )}
                  onClick={() => setManageView("questions")}
                >
                  Questions
                </button>
                <button
                  className={cn(
                    "px-3.5 py-1.5 font-poppins text-[11px] font-medium rounded-md transition-all",
                    manageView === "profiles" ? "bg-[rgba(84,108,250,.16)] text-[#7b8ffc]" : "text-white/45 hover:text-white/75"
                  )}
                  onClick={() => setManageView("profiles")}
                >
                  Result Profiles ({profiles.length})
                </button>
              </div>
            )}
          </div>

          {isReflection && manageView === "profiles" ? (
            <>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className={TW.sTitle}>Result Profiles</div>
                  <p className={TW.pgSub}>The outcomes a person can land on (e.g. the three islands). Each question option below will point at one of these.</p>
                </div>
                <button className={cn(TW.btn, TW.gold)} onClick={() => { setEditProfile(null); setShowProfileModal(true); }}>
                  <Plus size={12} />Add Profile
                </button>
              </div>

              {profiles.length === 0 ? (
                <p className={TW.empty}>No result profiles yet. Add at least two before writing questions.</p>
              ) : (
                <div className="space-y-4">
                  {profiles.map((p) => (
                    <div key={p.id} className={cn(TW.msgCard)}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Layers size={12} className="text-[#7b8ffc]" />
                            <span className="font-semibold text-white/90">{p.name_en}</span>
                            <span className="text-sm text-white/40">· {p.name_fr}</span>
                          </div>
                          {p.interpretation_en && (
                            <p className="text-sm text-white/55 mb-1.5">{p.interpretation_en}</p>
                          )}
                          {p.advice_en && (
                            <div className="mt-2 p-2 bg-[rgba(84,108,250,.05)] border-l-2 border-[#546cfa] rounded text-sm text-white/60">
                              <div className="text-[10px] text-white/40 mb-1">Advice:</div>
                              {p.advice_en}
                            </div>
                          )}
                        </div>
                        <div className={TW.actRow}>
                          <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => { setEditProfile(p); setShowProfileModal(true); }}>
                            <Pencil size={10} />
                          </button>
                          <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={async () => {
                            if (!confirm(`Delete "${p.name_en}"? Questions pointing at it will fall back to no profile.`)) return;
                            const { error } = await db.from("faith_test_profiles").delete().eq("id", p.id);
                            if (error) { alert("Delete failed"); return; }
                            loadProfiles(selectedTest!);
                          }}>
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showProfileModal && selectedTest && (
                <ProfileModal
                  profile={editProfile}
                  testId={selectedTest}
                  onClose={() => setShowProfileModal(false)}
                  onSave={async () => {
                    setShowProfileModal(false);
                    await loadProfiles(selectedTest);
                  }}
                  db={db}
                />
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className={TW.sTitle}>Test Questions</div>
                  <p className={TW.pgSub}>{questions.length} questions</p>
                </div>
                <button
                  className={cn(TW.btn, TW.gold)}
                  disabled={isReflection && profiles.length < 2}
                  title={isReflection && profiles.length < 2 ? "Add at least two result profiles first" : undefined}
                  onClick={() => { setEditQuestion(null); setShowQuestionModal(true); }}
                >
                  <Plus size={12} />Add Question
                </button>
              </div>

              {questions.length === 0 ? (
                <p className={TW.empty}>No questions yet. Add the first question.</p>
              ) : (
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={q.id} className={cn(TW.msgCard)}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={cn(TW.badge, TW.bPub)}>Q{idx + 1}</span>
                            {!isReflection && (
                              <span className={cn(TW.badge,
                                q.correct_option === 'A' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                q.correct_option === 'B' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              )}>
                                Correct: {q.correct_option}
                              </span>
                            )}
                          </div>
                          <div className="font-semibold text-white/90 mb-1">{q.question_en}</div>
                          <div className="text-sm text-white/50 mb-3">{q.question_fr}</div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            {([
                              ["A", q.option_a_en, q.option_a_profile_id],
                              ["B", q.option_b_en, q.option_b_profile_id],
                              ["C", q.option_c_en, q.option_c_profile_id],
                            ] as const).map(([letter, text, profileId]) => (
                              <div key={letter} className="p-2 bg-white/5 rounded border border-white/10">
                                <div className="text-[10px] text-white/40 mb-1">{letter}) English</div>
                                <div className="text-white/70">{text}</div>
                                {isReflection && (
                                  <div className="text-[10px] text-[#7b8ffc] mt-1">
                                    → {profiles.find((p) => p.id === profileId)?.name_en ?? "No profile set"}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          {q.explanation_en && (
                            <div className="mt-3 p-2 bg-[rgba(84,108,250,.05)] border-l-2 border-[#546cfa] rounded text-sm text-white/60">
                              <div className="text-[10px] text-white/40 mb-1">Explanation:</div>
                              {q.explanation_en}
                            </div>
                          )}
                        </div>
                        <div className={TW.actRow}>
                          <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => { setEditQuestion(q); setShowQuestionModal(true); }}>
                            <Pencil size={10} />
                          </button>
                          <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={async () => {
                            if (!confirm("Delete this question?")) return;
                            const { error } = await db.from("faith_test_questions").delete().eq("id", q.id);
                            if (error) { alert("Delete failed"); return; }
                            loadQuestions(activeTest!);
                          }}>
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showQuestionModal && selectedTest && (
                <QuestionModal
                  question={editQuestion}
                  testId={selectedTest}
                  isReflection={isReflection}
                  profiles={profiles}
                  onClose={() => setShowQuestionModal(false)}
                  onSave={async () => {
                    setShowQuestionModal(false);
                    await loadQuestions(activeTest!);
                  }}
                  db={db}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

// Inline Profile Modal (result profiles for reflection-type tests, e.g. "islands")
function ProfileModal({
  profile,
  testId,
  onClose,
  onSave,
  db,
}: {
  profile: FaithTestProfile | null;
  testId: string;
  onClose: () => void;
  onSave: () => Promise<void>;
  db: ReturnType<typeof createClient>;
}) {
  const [nameEn, setNameEn] = useState(profile?.name_en ?? "");
  const [nameFr, setNameFr] = useState(profile?.name_fr ?? "");
  const [interpretationEn, setInterpretationEn] = useState(profile?.interpretation_en ?? "");
  const [interpretationFr, setInterpretationFr] = useState(profile?.interpretation_fr ?? "");
  const [adviceEn, setAdviceEn] = useState(profile?.advice_en ?? "");
  const [adviceFr, setAdviceFr] = useState(profile?.advice_fr ?? "");
  const [sortOrder, setSortOrder] = useState(profile?.sort_order ?? 0);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!nameEn.trim() || !nameFr.trim()) {
      alert("Name (EN and FR) are required");
      return;
    }
    setSaving(true);
    const payload = {
      test_id: testId,
      name_en: nameEn.trim(),
      name_fr: nameFr.trim(),
      interpretation_en: interpretationEn.trim() || null,
      interpretation_fr: interpretationFr.trim() || null,
      advice_en: adviceEn.trim() || null,
      advice_fr: adviceFr.trim() || null,
      sort_order: sortOrder,
    };

    const { error } = profile
      ? await db.from("faith_test_profiles").update(payload).eq("id", profile.id)
      : await db.from("faith_test_profiles").insert(payload);

    setSaving(false);
    if (error) { alert("Save failed: " + error.message); return; }
    await onSave();
  }

  return (
    <div className={TW.overlay} onClick={onClose}>
      <div className={TW.panel} onClick={(e) => e.stopPropagation()}>
        <div className={TW.pHead}>
          <div className={TW.fTitle}>{profile ? "Edit Profile" : "New Profile"}</div>
          <button className={TW.iconBtn} onClick={onClose}><X size={14} /></button>
        </div>
        <div className={TW.pBody}>
          <div className={TW.field}>
            <label className={TW.label}>Name (English) *</label>
            <input className={TW.input} value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="e.g. Good Intentions" />
          </div>
          <div className={TW.field}>
            <label className={TW.label}>Name (French) *</label>
            <input className={TW.input} value={nameFr} onChange={(e) => setNameFr(e.target.value)} placeholder="e.g. Bonnes intentions" />
          </div>
          <div className={TW.field}>
            <label className={TW.label}>Interpretation (English)</label>
            <textarea className={cn(TW.tarea, "min-h-[80px]")} value={interpretationEn} onChange={(e) => setInterpretationEn(e.target.value)} placeholder="Shown on the results screen when this profile wins." />
          </div>
          <div className={TW.field}>
            <label className={TW.label}>Interpretation (French)</label>
            <textarea className={cn(TW.tarea, "min-h-[80px]")} value={interpretationFr} onChange={(e) => setInterpretationFr(e.target.value)} />
          </div>
          <div className={TW.field}>
            <label className={TW.label}>Advice / Next Step (English)</label>
            <textarea className={cn(TW.tarea, "min-h-[80px]")} value={adviceEn} onChange={(e) => setAdviceEn(e.target.value)} />
          </div>
          <div className={TW.field}>
            <label className={TW.label}>Advice / Next Step (French)</label>
            <textarea className={cn(TW.tarea, "min-h-[80px]")} value={adviceFr} onChange={(e) => setAdviceFr(e.target.value)} />
          </div>
          <div className={TW.field}>
            <label className={TW.label}>Sort Order</label>
            <input className={TW.input} type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
          </div>
        </div>
        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
          <button className={cn(TW.btn, TW.gold)} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : profile ? "Update" : "Add Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline Question Modal Component — branches between "quiz" (correct_option)
// and "reflection" (each option points at a result profile) question shapes.
function QuestionModal({
  question,
  testId,
  isReflection,
  profiles,
  onClose,
  onSave,
  db
}: {
  question: FaithTestQuestion | null;
  testId: string;
  isReflection: boolean;
  profiles: FaithTestProfile[];
  onClose: () => void;
  onSave: () => Promise<void>;
  db: ReturnType<typeof createClient>;
}) {
  const [questionEn, setQuestionEn] = useState(question?.question_en ?? "");
  const [questionFr, setQuestionFr] = useState(question?.question_fr ?? "");
  const [optionAEn, setOptionAEn] = useState(question?.option_a_en ?? "");
  const [optionAFr, setOptionAFr] = useState(question?.option_a_fr ?? "");
  const [optionBEn, setOptionBEn] = useState(question?.option_b_en ?? "");
  const [optionBFr, setOptionBFr] = useState(question?.option_b_fr ?? "");
  const [optionCEn, setOptionCEn] = useState(question?.option_c_en ?? "");
  const [optionCFr, setOptionCFr] = useState(question?.option_c_fr ?? "");
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C'>(question?.correct_option ?? 'A');
  const [profileA, setProfileA] = useState(question?.option_a_profile_id ?? "");
  const [profileB, setProfileB] = useState(question?.option_b_profile_id ?? "");
  const [profileC, setProfileC] = useState(question?.option_c_profile_id ?? "");
  const [explanationEn, setExplanationEn] = useState(question?.explanation_en ?? "");
  const [explanationFr, setExplanationFr] = useState(question?.explanation_fr ?? "");
  const [sortOrder, setSortOrder] = useState(question?.sort_order ?? 0);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!questionEn.trim() || !questionFr.trim()) {
      alert("Question (EN and FR) are required");
      return;
    }
    if (!optionAEn.trim() || !optionBEn.trim() || !optionCEn.trim()) {
      alert("All options (A, B, C) in English are required");
      return;
    }
    if (isReflection && (!profileA || !profileB || !profileC)) {
      alert("Every option needs a result profile for a reflection test");
      return;
    }

    setSaving(true);
    const payload = {
      test_id: testId,
      question_en: questionEn.trim(),
      question_fr: questionFr.trim(),
      option_a_en: optionAEn.trim(),
      option_a_fr: optionAFr.trim() || optionAEn.trim(),
      option_b_en: optionBEn.trim(),
      option_b_fr: optionBFr.trim() || optionBEn.trim(),
      option_c_en: optionCEn.trim(),
      option_c_fr: optionCFr.trim() || optionCEn.trim(),
      correct_option: isReflection ? null : correctOption,
      option_a_profile_id: isReflection ? profileA : null,
      option_b_profile_id: isReflection ? profileB : null,
      option_c_profile_id: isReflection ? profileC : null,
      explanation_en: explanationEn.trim() || null,
      explanation_fr: explanationFr.trim() || null,
      sort_order: sortOrder,
    };

    const { error } = question
      ? await db.from("faith_test_questions").update(payload).eq("id", question.id)
      : await db.from("faith_test_questions").insert(payload);

    setSaving(false);
    if (error) {
      alert("Save failed: " + error.message);
      return;
    }

    await onSave();
  }

  const profileSelect = (value: string, onChange: (v: string) => void) => (
    <select className={TW.select} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select profile…</option>
      {profiles.map((p) => <option key={p.id} value={p.id}>{p.name_en}</option>)}
    </select>
  );

  return (
    <div className={TW.overlay} onClick={onClose}>
      <div className={TW.panel} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "900px" }}>
        <div className={TW.pHead}>
          <div className={TW.fTitle}>{question ? "Edit Question" : "New Question"}</div>
          <button className={TW.iconBtn} onClick={onClose}><X size={14} /></button>
        </div>
        <div className={TW.pBody}>
          <div className={TW.field}>
            <label className={TW.label}>Question (English) *</label>
            <textarea className={cn(TW.tarea, "min-h-[80px]")} value={questionEn} onChange={(e) => setQuestionEn(e.target.value)} />
          </div>

          <div className={TW.field}>
            <label className={TW.label}>Question (French) *</label>
            <textarea className={cn(TW.tarea, "min-h-[80px]")} value={questionFr} onChange={(e) => setQuestionFr(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className={TW.field}>
              <label className={TW.label}>Option A (English) *</label>
              <input className={TW.input} value={optionAEn} onChange={(e) => setOptionAEn(e.target.value)} />
            </div>
            <div className={TW.field}>
              <label className={TW.label}>Option A (French)</label>
              <input className={TW.input} value={optionAFr} onChange={(e) => setOptionAFr(e.target.value)} />
            </div>
          </div>
          {isReflection && (
            <div className={cn(TW.field, "max-w-xs")}>
              <label className={TW.label}>Option A counts toward *</label>
              {profileSelect(profileA, setProfileA)}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className={TW.field}>
              <label className={TW.label}>Option B (English) *</label>
              <input className={TW.input} value={optionBEn} onChange={(e) => setOptionBEn(e.target.value)} />
            </div>
            <div className={TW.field}>
              <label className={TW.label}>Option B (French)</label>
              <input className={TW.input} value={optionBFr} onChange={(e) => setOptionBFr(e.target.value)} />
            </div>
          </div>
          {isReflection && (
            <div className={cn(TW.field, "max-w-xs")}>
              <label className={TW.label}>Option B counts toward *</label>
              {profileSelect(profileB, setProfileB)}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className={TW.field}>
              <label className={TW.label}>Option C (English) *</label>
              <input className={TW.input} value={optionCEn} onChange={(e) => setOptionCEn(e.target.value)} />
            </div>
            <div className={TW.field}>
              <label className={TW.label}>Option C (French)</label>
              <input className={TW.input} value={optionCFr} onChange={(e) => setOptionCFr(e.target.value)} />
            </div>
          </div>
          {isReflection && (
            <div className={cn(TW.field, "max-w-xs")}>
              <label className={TW.label}>Option C counts toward *</label>
              {profileSelect(profileC, setProfileC)}
            </div>
          )}

          {!isReflection && (
            <div className={TW.field}>
              <label className={TW.label}>Correct Option *</label>
              <div className="flex gap-4">
                {(['A', 'B', 'C'] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="correct"
                      checked={correctOption === opt}
                      onChange={() => setCorrectOption(opt)}
                      className="accent-[#7b8ffc]"
                    />
                    <span className="text-white/70">Option {opt}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className={TW.field}>
            <label className={TW.label}>Explanation (English)</label>
            <textarea className={cn(TW.tarea, "min-h-[80px]")} value={explanationEn} onChange={(e) => setExplanationEn(e.target.value)} placeholder={isReflection ? "Optional note shown after submitting (if you add result review)." : "Explain why this is the correct answer..."} />
          </div>

          <div className={TW.field}>
            <label className={TW.label}>Explanation (French)</label>
            <textarea className={cn(TW.tarea, "min-h-[80px]")} value={explanationFr} onChange={(e) => setExplanationFr(e.target.value)} />
          </div>

          <div className={TW.field}>
            <label className={TW.label}>Sort Order</label>
            <input className={TW.input} type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
          </div>
        </div>
        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
          <button className={cn(TW.btn, TW.gold)} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : question ? "Update" : "Add Question"}
          </button>
        </div>
      </div>
    </div>
  );
}
