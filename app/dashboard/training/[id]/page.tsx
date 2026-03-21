"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, Circle, Play, ArrowLeft, BookOpen } from "lucide-react";

interface Training {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string;
  total_lessons: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration: string | null;
  sort_order: number;
}

interface Props {
  params: { id: string };
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/^.*(youtu\.be\/|v\/|embed\/|watch\?v=|&v=)([^#&?]{11})/);
  return m ? m[2] : null;
}

const css = `
.tn-pg {
  background: #07080c; color: #eef0f5; min-height: 100vh;
  font-family: var(--font-poppins), 'Poppins', sans-serif;
}
.tn-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  height: 64px; background: rgba(11,12,18,.97);
  border-bottom: 1px solid rgba(255,255,255,.06);
  display: flex; align-items: center; padding: 0 40px; gap: 16px;
  backdrop-filter: blur(20px);
}
.tn-back {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
  color: rgba(255,255,255,.4); text-decoration: none; transition: color .2s;
}
.tn-back:hover { color: #d4a843; }
.tn-body { max-width: 1100px; margin: 0 auto; padding: 88px 5% 80px; }

/* HERO */
.tn-hero {
  display: grid; grid-template-columns: 1fr 2fr; gap: 40px;
  margin-bottom: 56px; align-items: start;
}
.tn-thumb {
  width: 100%; aspect-ratio: 16/9; border-radius: 6px; overflow: hidden;
  background: rgba(201,168,76,.07);
  display: flex; align-items: center; justify-content: center;
}
.tn-thumb img { width: 100%; height: 100%; object-fit: cover; }
.tn-hero-content { display: flex; flex-direction: column; gap: 12px; }
.tn-cat {
  font-family: var(--font-space-mono), monospace;
  font-size: 9px; letter-spacing: .3em; text-transform: uppercase;
  background: linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.tn-title {
  font-family: var(--font-playfair), serif;
  font-size: clamp(24px,3.5vw,40px); font-weight: 800; line-height: 1.15; color: #eef0f5;
}
.tn-desc { font-size: 14px; color: rgba(255,255,255,.45); line-height: 1.7; font-weight: 300; }

/* PROGRESS */
.tn-progress-row {
  display: flex; align-items: center; gap: 12px; margin-top: 8px;
}
.tn-progress-bar {
  flex: 1; height: 6px; background: rgba(255,255,255,.07); border-radius: 3px; overflow: hidden;
}
.tn-progress-fill {
  height: 100%; background: linear-gradient(90deg,#ffde59,#ff914d);
  border-radius: 3px; transition: width .5s ease;
}
.tn-progress-label {
  font-size: 11px; color: #d4a843; font-weight: 600; white-space: nowrap;
}

/* LESSONS */
.tn-section-title {
  font-size: 11px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase;
  color: rgba(255,255,255,.3); margin-bottom: 16px;
  display: flex; align-items: center; gap: 10px;
}
.tn-section-title::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.06); }

.tn-lessons { display: flex; flex-direction: column; gap: 10px; }

.tn-lesson {
  background: #0b0c12; border: 1px solid rgba(255,255,255,.06); border-radius: 6px;
  overflow: hidden; transition: border-color .3s;
}
.tn-lesson.completed { border-color: rgba(201,168,76,.2); }
.tn-lesson-header {
  display: flex; align-items: center; gap: 14px; padding: 16px 20px; cursor: pointer;
}
.tn-lesson-check {
  flex-shrink: 0; cursor: pointer; color: rgba(255,255,255,.2);
  background: transparent; border: none; display: flex; transition: color .2s;
}
.tn-lesson.completed .tn-lesson-check { color: #d4a843; }
.tn-lesson-title {
  flex: 1; font-size: 14px; font-weight: 500; color: #eef0f5; line-height: 1.3;
  transition: color .2s;
}
.tn-lesson.completed .tn-lesson-title { color: rgba(255,255,255,.55); text-decoration: line-through; text-decoration-color: rgba(201,168,76,.4); }
.tn-lesson-dur {
  font-family: var(--font-space-mono), monospace;
  font-size: 9px; letter-spacing: .12em; text-transform: uppercase;
  color: rgba(255,255,255,.2);
}
.tn-lesson-play {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; color: #c9a84c; text-decoration: none;
  font-weight: 500; transition: color .2s;
  flex-shrink: 0;
}
.tn-lesson-play:hover { color: #ffde59; }

/* VIDEO EMBED */
.tn-video-wrap {
  border-top: 1px solid rgba(255,255,255,.05);
  padding: 0 20px 20px; background: rgba(0,0,0,.3);
}
.tn-video-frame {
  width: 100%; aspect-ratio: 16/9; border-radius: 4px; overflow: hidden; margin-top: 16px;
}
.tn-video-frame iframe { width: 100%; height: 100%; border: none; }
.tn-video-desc { font-size: 13px; color: rgba(255,255,255,.4); line-height: 1.65; margin-top: 12px; }

@media (max-width: 768px) {
  .tn-nav { padding: 0 20px; }
  .tn-body { padding: 80px 5% 60px; }
  .tn-hero { grid-template-columns: 1fr; }
}
`;

export default function TrainingDetailPage({ params }: Props) {
  const { id } = params;
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [training, setTraining] = useState<Training | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const db = createClient();

  const load = useCallback(async () => {
    const { data: { session } } = await db.auth.getSession();
    if (!session) { router.push("/auth/login?next=/dashboard"); return; }
    setUserId(session.user.id);

    const [tRes, lRes, pRes] = await Promise.all([
      db.from("trainings").select("*").eq("id", id).single(),
      db.from("training_lessons").select("*").eq("training_id", id).order("sort_order", { ascending: true }),
      db.from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", session.user.id)
        .eq("completed", true),
    ]);

    setTraining(tRes.data);
    setLessons(lRes.data ?? []);
    setCompletedIds(new Set((pRes.data ?? []).map((p: { lesson_id: string }) => p.lesson_id)));
    setLoading(false);
  }, [db, id, router]);

  useEffect(() => { load(); }, [load]);

  async function toggleLesson(lessonId: string) {
    if (!userId) return;
    const isCompleted = completedIds.has(lessonId);
    if (isCompleted) {
      await db.from("lesson_progress")
        .update({ completed: false, completed_at: null })
        .eq("user_id", userId)
        .eq("lesson_id", lessonId);
      setCompletedIds((prev) => { const n = new Set(prev); n.delete(lessonId); return n; });
    } else {
      await db.from("lesson_progress")
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        }, { onConflict: "user_id,lesson_id" });
      setCompletedIds((prev) => new Set([...prev, lessonId]));
    }
  }

  const completedCount = completedIds.size;
  const totalCount = lessons.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#07080c", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {[0, 200, 400].map((d) => (
          <div key={d} style={{ width: 8, height: 8, background: "#d4a843", borderRadius: "50%", animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${d}ms` }} />
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:.2;transform:scale(.8)} 50%{opacity:1;transform:scale(1.1)} }`}</style>
      </div>
    );
  }

  if (!training) {
    return (
      <div style={{ minHeight: "100vh", background: "#07080c", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,.4)", fontFamily: "Poppins,sans-serif" }}>
          <p>Training not found.</p>
          <Link href="/dashboard" style={{ color: "#d4a843", textDecoration: "none", fontSize: 13 }}>← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tn-pg">
      <style>{css}</style>

      <nav className="tn-nav">
        <Link href="/dashboard" className="tn-back">
          <ArrowLeft size={13} /> Dashboard
        </Link>
      </nav>

      <div className="tn-body">
        {/* HERO */}
        <div className="tn-hero">
          <div className="tn-thumb">
            {training.thumbnail_url ? (
              <img src={training.thumbnail_url} alt={training.title} />
            ) : (
              <BookOpen size={48} style={{ color: "rgba(201,168,76,.25)" }} />
            )}
          </div>
          <div className="tn-hero-content">
            <div className="tn-cat">{training.category}</div>
            <h1 className="tn-title">{training.title}</h1>
            {training.description && <p className="tn-desc">{training.description}</p>}
            <div className="tn-progress-row">
              <div className="tn-progress-bar">
                <div className="tn-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="tn-progress-label">{completedCount}/{totalCount} lessons · {pct}%</span>
            </div>
          </div>
        </div>

        {/* LESSONS */}
        <div className="tn-section-title">Course Content</div>

        {lessons.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,.25)", fontFamily: "Poppins,sans-serif", fontSize: 14, textAlign: "center", padding: "60px 0" }}>
            No lessons have been added yet.
          </p>
        ) : (
          <div className="tn-lessons">
            {lessons.map((lesson, idx) => {
              const done = completedIds.has(lesson.id);
              const expanded = openLesson === lesson.id;
              const ytId = lesson.video_url ? getYouTubeId(lesson.video_url) : null;

              return (
                <div key={lesson.id} className={`tn-lesson${done ? " completed" : ""}`}>
                  <div className="tn-lesson-header" onClick={() => setOpenLesson(expanded ? null : lesson.id)}>
                    <button
                      className="tn-lesson-check"
                      onClick={(e) => { e.stopPropagation(); toggleLesson(lesson.id); }}
                      aria-label={done ? "Mark incomplete" : "Mark complete"}
                    >
                      {done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>

                    <span style={{ color: "rgba(255,255,255,.2)", fontFamily: "monospace", fontSize: 11, flexShrink: 0 }}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    <div className="tn-lesson-title">{lesson.title}</div>

                    {lesson.duration && <span className="tn-lesson-dur">{lesson.duration}</span>}

                    {lesson.video_url && (
                      <span className="tn-lesson-play" onClick={(e) => e.stopPropagation()}>
                        <Play size={12} /> Watch
                      </span>
                    )}
                  </div>

                  {expanded && (
                    <div className="tn-video-wrap">
                      {ytId ? (
                        <div className="tn-video-frame">
                          <iframe
                            src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                            title={lesson.title}
                            allowFullScreen
                          />
                        </div>
                      ) : lesson.video_url ? (
                        <div style={{ paddingTop: 16 }}>
                          <a href={lesson.video_url} target="_blank" rel="noopener noreferrer"
                            style={{ color: "#c9a84c", fontSize: 13, textDecoration: "none" }}>
                            ▶ Open video link
                          </a>
                        </div>
                      ) : null}
                      {lesson.description && <p className="tn-video-desc">{lesson.description}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
