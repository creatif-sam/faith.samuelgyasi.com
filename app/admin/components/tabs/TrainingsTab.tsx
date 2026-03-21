import { useState } from "react";
import { Plus, Pencil, Trash2, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { Training, TrainingLesson } from "../types";
import { createClient } from "@/lib/supabase/client";

interface TrainingsTabProps {
  trainings: Training[];
  onNew: () => void;
  onEdit: (t: Training) => void;
  onDelete: (id: string, title: string) => void;
  onToggle: (id: string, val: boolean) => Promise<void>;
}

export default function TrainingsTab({ trainings, onNew, onEdit, onDelete, onToggle }: TrainingsTabProps) {
  const published = trainings.filter((t) => t.published).length;

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Trainings</div>
          <p className={TW.pgSub}>{published} published · {trainings.length} total</p>
        </div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}>
          <Plus size={12} /> New Training
        </button>
      </div>

      {trainings.length === 0 ? (
        <p className={TW.empty}>No trainings yet. Create one to get started.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {trainings.map((t) => (
            <TrainingRow
              key={t.id}
              training={t}
              onEdit={() => onEdit(t)}
              onDelete={() => onDelete(t.id, t.title)}
              onToggle={(val) => onToggle(t.id, val)}
            />
          ))}
        </div>
      )}
    </>
  );
}

function TrainingRow({
  training,
  onEdit,
  onDelete,
  onToggle,
}: {
  training: Training;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (val: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [lessons, setLessons] = useState<TrainingLesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonVideo, setLessonVideo] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const [savingLesson, setSavingLesson] = useState(false);

  const db = createClient();

  async function loadLessons() {
    if (open) { setOpen(false); return; }
    setOpen(true);
    setLoadingLessons(true);
    const { data } = await db
      .from("training_lessons")
      .select("*")
      .eq("training_id", training.id)
      .order("sort_order", { ascending: true });
    setLessons(data ?? []);
    setLoadingLessons(false);
  }

  async function addLesson() {
    if (!lessonTitle.trim()) return;
    setSavingLesson(true);
    await db.from("training_lessons").insert({
      training_id: training.id,
      title: lessonTitle.trim(),
      video_url: lessonVideo.trim() || null,
      duration: lessonDuration.trim() || null,
      sort_order: lessons.length,
    });
    const { data } = await db
      .from("training_lessons")
      .select("*")
      .eq("training_id", training.id)
      .order("sort_order", { ascending: true });
    setLessons(data ?? []);
    setLessonTitle("");
    setLessonVideo("");
    setLessonDuration("");
    setShowLessonForm(false);
    setSavingLesson(false);
  }

  async function deleteLesson(id: string) {
    await db.from("training_lessons").delete().eq("id", id);
    setLessons((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="bg-[#0b0c12] border border-white/[.06] rounded-lg overflow-hidden transition-all hover:border-white/[.1]">
      {/* Header row */}
      <div className="flex items-center gap-4 px-5 py-4">
        {training.thumbnail_url ? (
          <img src={training.thumbnail_url} alt={training.title} className="w-14 h-10 object-cover rounded flex-shrink-0" />
        ) : (
          <div className="w-14 h-10 rounded bg-white/[.04] flex items-center justify-center flex-shrink-0">
            <BookOpen size={18} className="text-white/20" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="font-poppins text-[14px] font-semibold text-[#eef0f5] truncate">{training.title}</div>
          <div className="font-poppins text-[11px] text-white/35 mt-0.5">
            {training.category} · {training.total_lessons ?? 0} lessons
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            className={cn(TW.badge, training.published ? TW.bPub : TW.bDft, "cursor-pointer bg-transparent border-none")}
            onClick={() => onToggle(!training.published)}
          >
            {training.published ? "Published" : "Draft"}
          </button>
          <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={onEdit}><Pencil size={10} /></button>
          <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={onDelete}><Trash2 size={10} /></button>
          <button
            className={cn(TW.btn, TW.ghost, TW.sm)}
            onClick={loadLessons}
            title="Manage Lessons"
          >
            {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Lessons panel */}
      {open && (
        <div className="border-t border-white/[.05] px-5 pb-4 pt-3">
          <div className="flex justify-between items-center mb-3">
            <span className="font-poppins text-[11px] font-semibold text-white/40 uppercase tracking-widest">Lessons</span>
            <button
              className={cn(TW.btn, TW.ghost, TW.sm)}
              onClick={() => setShowLessonForm((p) => !p)}
            >
              <Plus size={10} /> Add Lesson
            </button>
          </div>

          {loadingLessons ? (
            <p className="font-poppins text-xs text-white/25 py-4 text-center">Loading…</p>
          ) : lessons.length === 0 ? (
            <p className="font-poppins text-xs text-white/25 py-4 text-center">No lessons yet.</p>
          ) : (
            <div className="space-y-1.5 mb-3">
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 bg-white/[.025] border border-white/[.05] rounded-lg px-4 py-2.5"
                >
                  <span className="font-mono text-[10px] text-white/25 w-5 flex-shrink-0">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-poppins text-[12px] text-[#eef0f5] truncate">{lesson.title}</div>
                    {lesson.duration && (
                      <div className="font-poppins text-[10px] text-white/30">{lesson.duration}</div>
                    )}
                  </div>
                  {lesson.video_url && (
                    <a
                      href={lesson.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-poppins text-[10px] text-[#c9a84c] hover:text-[#ffde59] transition-colors"
                    >
                      ▶ Video
                    </a>
                  )}
                  <button
                    className={cn(TW.btn, TW.danger, TW.sm)}
                    onClick={() => deleteLesson(lesson.id)}
                  >
                    <Trash2 size={9} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showLessonForm && (
            <div className="bg-white/[.02] border border-white/[.07] rounded-lg p-4 space-y-3">
              <input
                className={TW.input}
                placeholder="Lesson title *"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className={TW.input}
                  placeholder="Video URL (YouTube…)"
                  value={lessonVideo}
                  onChange={(e) => setLessonVideo(e.target.value)}
                />
                <input
                  className={TW.input}
                  placeholder="Duration (e.g. 12 min)"
                  value={lessonDuration}
                  onChange={(e) => setLessonDuration(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button className={cn(TW.btn, TW.ghost)} onClick={() => setShowLessonForm(false)}>Cancel</button>
                <button className={cn(TW.btn, TW.gold)} onClick={addLesson} disabled={savingLesson}>
                  {savingLesson ? "Saving…" : "Add Lesson"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
