"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { BookOpen, GraduationCap, LogOut, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useLang } from "@/lib/i18n";

const translations = {
  en: {
    brand: "Training Hub",
    signOut: "Sign out",
    eyebrow: "Samuel Kobina Gyasi · Training Hub",
    heroTitle: "Your Learning Dashboard",
    heroSub: "Track your progress across all enrolled trainings.",
    loadingMsg: "Loading your trainings…",
    myTrainings: "My Trainings",
    available: "Available Trainings",
    noEnrolled: "You have not enrolled in any trainings yet.",
    lessons: "lessons",
    complete: "complete",
    continueBtn: "Continue Training →",
    enrollBtn: "Enroll Now",
    enrolling: "Enrolling…",
  },
  fr: {
    brand: "Espace Formation",
    signOut: "Se déconnecter",
    eyebrow: "Samuel Kobina Gyasi · Espace Formation",
    heroTitle: "Votre Tableau de Bord",
    heroSub: "Suivez votre progression dans toutes vos formations.",
    loadingMsg: "Chargement de vos formations…",
    myTrainings: "Mes Formations",
    available: "Formations Disponibles",
    noEnrolled: "Vous n'êtes inscrit à aucune formation pour l'instant.",
    lessons: "leçons",
    complete: "complété",
    continueBtn: "Continuer →",
    enrollBtn: "S'inscrire",
    enrolling: "Inscription…",
  },
};

interface Training {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string;
  total_lessons: number;
  published: boolean;
  sort_order: number;
}

interface EnrollmentWithProgress {
  training_id: string;
  enrolled_at: string;
  completedCount: number;
}

const css = `
.db-pg {
  background: #07080c;
  color: #eef0f5;
  min-height: 100vh;
  font-family: var(--font-poppins), 'Poppins', sans-serif;
}

/* NAV */
.db-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  height: 64px;
  background: rgba(11,12,18,.97);
  border-bottom: 1px solid rgba(255,255,255,.06);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px;
  backdrop-filter: blur(20px);
}
.db-nav-brand {
  font-family: var(--font-playfair), serif;
  font-size: 18px; font-weight: 700;
  color: #eef0f5; text-decoration: none;
  display: flex; align-items: center; gap: 10px;
}
.db-nav-brand-dot {
  width: 32px; height: 32px; border-radius: 8px;
  background: linear-gradient(135deg,#d4a843,#c49838);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-poppins), sans-serif;
  font-size: 11px; font-weight: 700; color: #09090d;
}
.db-nav-right {
  display: flex; align-items: center; gap: 16px;
}
.db-nav-user {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; color: rgba(255,255,255,.45);
}
.db-nav-logout {
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.09);
  border-radius: 8px;
  color: rgba(255,255,255,.45);
  font-family: var(--font-poppins), sans-serif;
  font-size: 11px; font-weight: 500;
  padding: 8px 14px; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  transition: all .2s;
  text-decoration: none;
}
.db-nav-logout:hover { color: #eef0f5; border-color: rgba(255,255,255,.2); }
.db-lang-toggle {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 8px;
  color: rgba(255,255,255,.4);
  font-family: var(--font-space-mono), monospace;
  font-size: 9px; font-weight: 500; letter-spacing: .15em;
  padding: 8px 12px; cursor: pointer;
  display: flex; align-items: center; gap: 4px;
  transition: all .2s; text-transform: uppercase;
}
.db-lang-toggle:hover { color: #d4a843; border-color: rgba(201,168,76,.3); }
.db-lang-active { color: #d4a843; }

/* BODY */
.db-body { padding: 100px 5% 60px; max-width: 1200px; margin: 0 auto; }

/* HERO */
.db-hero { margin-bottom: 56px; }
.db-hero-eyebrow {
  font-family: var(--font-space-mono), monospace;
  font-size: 9px; letter-spacing: .35em; text-transform: uppercase;
  background: linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  margin-bottom: 12px;
}
.db-hero-title {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: clamp(28px,4vw,48px); font-weight: 700;
  color: #eef0f5; line-height: 1.15; margin-bottom: 10px;
}
.db-hero-sub {
  font-size: 14px; color: rgba(255,255,255,.4); font-weight: 300;
}

/* SECTION HEADERS */
.db-section-title {
  font-size: 13px; font-weight: 600; letter-spacing: .15em; text-transform: uppercase;
  color: rgba(255,255,255,.35); margin-bottom: 20px;
  display: flex; align-items: center; gap: 10px;
}
.db-section-title::after {
  content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.06);
}

/* TRAINING CARDS */
.db-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 56px;
}
.db-card {
  background: #0b0c12;
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 6px;
  overflow: hidden;
  transition: border-color .3s, box-shadow .3s, transform .3s;
  text-decoration: none; color: inherit;
  display: flex; flex-direction: column;
}
.db-card:hover {
  border-color: rgba(201,168,76,.35);
  box-shadow: 0 12px 32px rgba(0,0,0,.4);
  transform: translateY(-3px);
}
.db-card-thumb {
  width: 100%; aspect-ratio: 16/9;
  background: rgba(201,168,76,.07);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; position: relative;
}
.db-card-thumb img { width: 100%; height: 100%; object-fit: cover; }
.db-card-thumb-placeholder {
  color: rgba(201,168,76,.25);
}
.db-card-body {
  padding: 20px 22px;
  flex: 1; display: flex; flex-direction: column; gap: 8px;
}
.db-card-cat {
  font-family: var(--font-space-mono), monospace;
  font-size: 9px; letter-spacing: .25em; text-transform: uppercase;
  background: linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.db-card-title {
  font-size: 16px; font-weight: 600; color: #eef0f5; line-height: 1.3; flex: 1;
}
.db-card-desc {
  font-size: 12px; color: rgba(255,255,255,.4); line-height: 1.65; font-weight: 300;
}
.db-card-meta {
  font-family: var(--font-space-mono), monospace;
  font-size: 9px; letter-spacing: .1em; text-transform: uppercase;
  color: rgba(255,255,255,.22);
  display: flex; gap: 12px; margin-top: 6px;
  border-top: 1px solid rgba(255,255,255,.05); padding-top: 12px;
}

/* PROGRESS BAR */
.db-progress-wrap { margin-top: 6px; }
.db-progress-label {
  font-size: 10px; color: rgba(255,255,255,.35);
  display: flex; justify-content: space-between; margin-bottom: 5px;
}
.db-progress-bar {
  height: 4px; background: rgba(255,255,255,.07); border-radius: 2px; overflow: hidden;
}
.db-progress-fill {
  height: 100%; background: linear-gradient(90deg,#ffde59,#ff914d);
  border-radius: 2px; transition: width .5s ease;
}

/* ENROLL BUTTON */
.db-enroll-btn {
  margin-top: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
  padding: 10px 16px;
  background: linear-gradient(135deg,#d4a843,#c49838);
  color: #09090d; border-radius: 4px; border: none; cursor: pointer;
  transition: opacity .2s, transform .2s; width: 100%;
}
.db-enroll-btn:hover { opacity: .88; transform: translateY(-1px); }
.db-enroll-btn.enrolled {
  background: rgba(201,168,76,.12);
  color: #c9a84c;
  border: 1px solid rgba(201,168,76,.25);
}

/* EMPTY */
.db-empty {
  font-size: 15px; color: rgba(255,255,255,.25); padding: 60px; text-align: center;
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .db-nav { padding: 0 20px; }
  .db-body { padding: 88px 5% 40px; }
  .db-grid { grid-template-columns: 1fr; }
}
`;

export default function DashboardPage() {
  const router = useRouter();
  const { lang, toggleLang } = useLang();
  const t = translations[lang];
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const db = createClient();

  const load = useCallback(async () => {
    const { data: { session } } = await db.auth.getSession();
    if (!session) { router.push("/auth/login?next=/dashboard"); return; }
    setUser(session.user);

    const [tRes, eRes] = await Promise.all([
      db.from("trainings").select("*").eq("published", true).order("sort_order", { ascending: true }),
      db.from("training_enrollments").select("training_id,enrolled_at").eq("user_id", session.user.id),
    ]);

    const ts: Training[] = tRes.data ?? [];
    const rawEnrollments = eRes.data ?? [];

    // Fetch progress counts for each enrolled training
    const withProgress: EnrollmentWithProgress[] = await Promise.all(
      rawEnrollments.map(async (e) => {
        const training = ts.find((t) => t.id === e.training_id);
        if (!training || !training.total_lessons) return { ...e, completedCount: 0 };

        // Get lesson IDs for this training
        const { data: lessonIds } = await db
          .from("training_lessons")
          .select("id")
          .eq("training_id", e.training_id);

        if (!lessonIds || lessonIds.length === 0) return { ...e, completedCount: 0 };

        const { count } = await db
          .from("lesson_progress")
          .select("*", { count: "exact", head: true })
          .eq("user_id", session.user.id)
          .eq("completed", true)
          .in("lesson_id", lessonIds.map((l: { id: string }) => l.id));

        return { ...e, completedCount: count ?? 0 };
      })
    );

    setTrainings(ts);
    setEnrollments(withProgress);
    setLoading(false);
  }, [db, router]);

  useEffect(() => { load(); }, [load]);

  async function enroll(trainingId: string) {
    if (!user) return;
    setEnrollingId(trainingId);
    await db.from("training_enrollments").insert({ user_id: user.id, training_id: trainingId });
    await load();
    setEnrollingId(null);
  }

  const enrolledIds = new Set(enrollments.map((e) => e.training_id));
  const myTrainings = trainings.filter((t) => enrolledIds.has(t.id));
  const available = trainings.filter((t) => !enrolledIds.has(t.id));

  async function handleLogout() {
    await db.auth.signOut();
    router.push("/");
  }

  return (
    <div className="db-pg">
      <style>{css}</style>

      {/* NAV */}
      <nav className="db-nav">
        <Link href="/" className="db-nav-brand">
          <div className="db-nav-brand-dot">SG</div>
          <span>{t.brand}</span>
        </Link>
        <div className="db-nav-right">
          <button className="db-lang-toggle" onClick={toggleLang} aria-label="Toggle language">
            <span className={lang === "en" ? "db-lang-active" : ""}>EN</span>
            <span style={{ opacity: .3 }}>|</span>
            <span className={lang === "fr" ? "db-lang-active" : ""}>FR</span>
          </button>
          <div className="db-nav-user">
            <User size={13} />
            <span>{user?.email?.split("@")[0] ?? "Student"}</span>
          </div>
          <button className="db-nav-logout" onClick={handleLogout}>
            <LogOut size={12} /> {t.signOut}
          </button>
        </div>
      </nav>

      {/* BODY */}
      <div className="db-body">
        <div className="db-hero">
          <p className="db-hero-eyebrow">{t.eyebrow}</p>
          <h1 className="db-hero-title">{t.heroTitle}</h1>
          <p className="db-hero-sub">{t.heroSub}</p>
        </div>

        {loading ? (
          <div style={{ display: "flex", gap: 8, justifyContent: "center", padding: "80px 0" }}>
            {[0, 200, 400].map((d) => (
              <div
                key={d}
                style={{
                  width: 8, height: 8, background: "#d4a843", borderRadius: "50%",
                  animation: "pulse 1.2s ease-in-out infinite",
                  animationDelay: `${d}ms`,
                }}
              />
            ))}
            <style>{`@keyframes pulse { 0%,100%{opacity:.2;transform:scale(.8)} 50%{opacity:1;transform:scale(1.1)} }`}</style>
          </div>
        ) : (
          <>
            {/* MY TRAININGS */}
            <div className="db-section-title">
              <GraduationCap size={14} /> {t.myTrainings} ({myTrainings.length})
            </div>
            <div className="db-grid">
              {myTrainings.length === 0 ? (
                <p className="db-empty">{t.noEnrolled}</p>
              ) : (
                myTrainings.map((tr) => {
                  const enr = enrollments.find((e) => e.training_id === tr.id);
                  const completed = enr?.completedCount ?? 0;
                  const total = tr.total_lessons ?? 0;
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

                  return (
                    <Link key={tr.id} href={`/dashboard/training/${tr.id}`} className="db-card">
                      <div className="db-card-thumb">
                        {tr.thumbnail_url ? (
                          <img src={tr.thumbnail_url} alt={tr.title} />
                        ) : (
                          <BookOpen size={40} className="db-card-thumb-placeholder" />
                        )}
                      </div>
                      <div className="db-card-body">
                        <div className="db-card-cat">{tr.category}</div>
                        <div className="db-card-title">{tr.title}</div>
                        {tr.description && <div className="db-card-desc">{tr.description.slice(0, 90)}{tr.description.length > 90 ? "…" : ""}</div>}
                        <div className="db-card-meta">
                          <span>{total} {t.lessons}</span>
                          <span>{pct}% {t.complete}</span>
                        </div>
                        <div className="db-progress-wrap">
                          <div className="db-progress-bar">
                            <div className="db-progress-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <div className="db-enroll-btn enrolled">{t.continueBtn}</div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {/* AVAILABLE */}
            {available.length > 0 && (
              <>
                <div className="db-section-title">
                  <BookOpen size={14} /> {t.available} ({available.length})
                </div>
                <div className="db-grid">
                  {available.map((tr) => (
                    <div key={tr.id} className="db-card" style={{ cursor: "default" }}>
                      <div className="db-card-thumb">
                        {tr.thumbnail_url ? (
                          <img src={tr.thumbnail_url} alt={tr.title} />
                        ) : (
                          <BookOpen size={40} className="db-card-thumb-placeholder" />
                        )}
                      </div>
                      <div className="db-card-body">
                        <div className="db-card-cat">{tr.category}</div>
                        <div className="db-card-title">{tr.title}</div>
                        {tr.description && <div className="db-card-desc">{tr.description.slice(0, 90)}{tr.description.length > 90 ? "…" : ""}</div>}
                        <div className="db-card-meta">
                          <span>{tr.total_lessons ?? 0} {t.lessons}</span>
                        </div>
                        <button
                          className="db-enroll-btn"
                          onClick={() => enroll(tr.id)}
                          disabled={enrollingId === tr.id}
                        >
                          {enrollingId === tr.id ? t.enrolling : t.enrollBtn}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
