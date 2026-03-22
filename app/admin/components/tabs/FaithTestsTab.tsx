import { useState } from "react";
import { Plus, Pencil, Trash2, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { FaithTest, FaithTestQuestion } from "../types";
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
  const [showQuestions, setShowQuestions] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState<FaithTestQuestion | null>(null);

  async function loadQuestions(testId: string) {
    const { data } = await db.from("faith_test_questions")
      .select("*")
      .eq("test_id", testId)
      .order("sort_order", { ascending: true });
    setQuestions((data as FaithTestQuestion[]) ?? []);
    setSelectedTest(testId);
    setShowQuestions(true);
  }

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
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
                    <th className={TW.th}>Total Takes</th>
                    <th className={TW.th}>Status</th>
                    <th className={TW.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((t) => (
                    <tr key={t.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                      <td className={TW.td} style={{ color: "#f0ece4", maxWidth: "250px" }}>
                        <div className="font-semibold">{t.name_en}</div>
                        <div className="text-[11px] text-white/40 mt-0.5">{t.name_fr}</div>
                      </td>
                      <td className={TW.td} style={{ fontSize: "12px", fontFamily: "monospace", color: "#c9a84c" }}>
                        /{t.slug}
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
                          <button className={cn(TW.btn, TW.gold, TW.sm)} onClick={() => loadQuestions(t.id)} title="Manage Questions">
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
          {/* Questions View */}
          <div className="mb-6">
            <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => setShowQuestions(false)}>
              ← Back to Tests
            </button>
          </div>
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className={TW.sTitle}>Test Questions</div>
              <p className={TW.pgSub}>{questions.length} questions</p>
            </div>
            <button className={cn(TW.btn, TW.gold)} onClick={() => { setEditQuestion(null); setShowQuestionModal(true); }}>
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
                        <span className={cn(TW.badge, 
                          q.correct_option === 'A' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                          q.correct_option === 'B' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                          "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        )}>
                          Correct: {q.correct_option}
                        </span>
                      </div>
                      <div className="font-semibold text-white/90 mb-1">{q.question_en}</div>
                      <div className="text-sm text-white/50 mb-3">{q.question_fr}</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div className="p-2 bg-white/5 rounded border border-white/10">
                          <div className="text-[10px] text-white/40 mb-1">A) English</div>
                          <div className="text-white/70">{q.option_a_en}</div>
                        </div>
                        <div className="p-2 bg-white/5 rounded border border-white/10">
                          <div className="text-[10px] text-white/40 mb-1">B) English</div>
                          <div className="text-white/70">{q.option_b_en}</div>
                        </div>
                        <div className="p-2 bg-white/5 rounded border border-white/10">
                          <div className="text-[10px] text-white/40 mb-1">C) English</div>
                          <div className="text-white/70">{q.option_c_en}</div>
                        </div>
                      </div>
                      {q.explanation_en && (
                        <div className="mt-3 p-2 bg-[rgba(212,168,67,.05)] border-l-2 border-[#d4a843] rounded text-sm text-white/60">
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
                        loadQuestions(selectedTest!);
                      }}>
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Question Modal - Inline for now (can be extracted later) */}
          {showQuestionModal && selectedTest && (
            <QuestionModal
              question={editQuestion}
              testId={selectedTest}
              onClose={() => setShowQuestionModal(false)}
              onSave={async () => {
                setShowQuestionModal(false);
                loadQuestions(selectedTest);
              }}
              db={db}
            />
          )}
        </>
      )}
    </>
  );
}

// Inline Question Modal Component
function QuestionModal({ 
  question, 
  testId, 
  onClose, 
  onSave, 
  db 
}: { 
  question: FaithTestQuestion | null; 
  testId: string; 
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
      correct_option: correctOption,
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

  return (
    <div className={TW.overlay} onClick={onClose}>
      <div className={TW.panel} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "900px" }}>
        <div className={TW.pHead}>
          <div className={TW.fTitle}>{question ? "Edit Question" : "New Question"}</div>
          <button className={TW.iconBtn} onClick={onClose}>×</button>
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
                    className="accent-[#c9a84c]"
                  />
                  <span className="text-white/70">Option {opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={TW.field}>
            <label className={TW.label}>Explanation (English)</label>
            <textarea className={cn(TW.tarea, "min-h-[80px]")} value={explanationEn} onChange={(e) => setExplanationEn(e.target.value)} placeholder="Explain why this is the correct answer..." />
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
