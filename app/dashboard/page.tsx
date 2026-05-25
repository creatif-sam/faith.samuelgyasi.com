"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Award, Bell, BookOpen, CheckCircle2, GraduationCap, Globe,
  LogOut, Mail, Menu, Moon, Search, Sun, TrendingUp, User, X,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useLang } from "@/lib/i18n";

const translations = {
  en: {
    brand: "Mastery Hub",
    searchPlaceholder: "Search trainings…",
    signOut: "Sign out",
    myTrainings: "My Trainings",
    browse: "Browse",
    profile: "Profile",
    statsEnrolled: "Enrolled",
    statsCompleted: "Completed",
    statsProgress: "Progress",
    statsDone: "Finished",
    noEnrolled: "You haven't enrolled in any trainings yet.",
    available: "Available Trainings",
    noAvailable: "No new trainings to explore right now.",
    lessons: "lessons",
    complete: "complete",
    continueBtn: "Continue →",
    enrollBtn: "Enroll Now",
    enrolling: "Enrolling…",
    profileTitle: "My Profile",
    profileSub: "Your account details",
    email: "Email",
    memberSince: "Member Since",
    language: "Language",
    theme: "Theme",
    dark: "Dark",
    light: "Light",
  },
  fr: {
    brand: "Mastery Hub",
    searchPlaceholder: "Rechercher des formations…",
    signOut: "Se déconnecter",
    myTrainings: "Mes Formations",
    browse: "Explorer",
    profile: "Profil",
    statsEnrolled: "Inscrit",
    statsCompleted: "Complétées",
    statsProgress: "Progression",
    statsDone: "Terminées",
    noEnrolled: "Vous n'êtes inscrit à aucune formation.",
    available: "Formations Disponibles",
    noAvailable: "Aucune nouvelle formation disponible.",
    lessons: "leçons",
    complete: "complété",
    continueBtn: "Continuer →",
    enrollBtn: "S'inscrire",
    enrolling: "Inscription…",
    profileTitle: "Mon Profil",
    profileSub: "Vos informations de compte",
    email: "E-mail",
    memberSince: "Membre depuis",
    language: "Langue",
    theme: "Thème",
    dark: "Sombre",
    light: "Clair",
  },
};

type DashTab = "my-trainings" | "browse" | "profile";

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

const dashCss = `
/* â”€â”€ THEME TOKENS â”€â”€ */
.dash-root {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  transition: background .24s, color .24s;
}
.dash-root.dash-dark {
  --d-page:   #07080c;
  --d-surf:   #0b0c12;
  --d-soft:   rgba(255,255,255,.04);
  --d-border: rgba(255,255,255,.09);
  --d-text:   #eef0f5;
  --d-muted:  rgba(255,255,255,.42);
  --d-gold:   #d4a843;
}
.dash-root.dash-light {
  --d-page:   #f3f6fb;
  --d-surf:   #ffffff;
  --d-soft:   #eef2f7;
  --d-border: rgba(15,23,42,.14);
  --d-text:   #111827;
  --d-muted:  #475569;
  --d-gold:   #b8900a;
}

/* â”€â”€ LAYOUT â”€â”€ */
.dash-root { background: var(--d-page); color: var(--d-text); }
.dash-main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  min-width: 0;
}

/* â”€â”€ SIDEBAR â”€â”€ */
.dash-sidebar {
  width: 240px;
  flex-shrink: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--d-surf);
  border-right: 1px solid var(--d-border);
  overflow-y: auto;
  padding: 20px 12px 24px;
  gap: 6px;
  transition: transform .25s cubic-bezier(.4,0,.2,1);
  z-index: 300;
}
@media (max-width: 768px) {
  .dash-sidebar {
    position: fixed;
    left: 0; top: 0; bottom: 0;
    transform: translateX(-100%);
    box-shadow: 4px 0 32px rgba(0,0,0,.5);
  }
  .dash-sidebar.open { transform: translateX(0); }
}
.dash-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.55);
  z-index: 290;
  backdrop-filter: blur(2px);
}
@media (max-width: 768px) { .dash-overlay { display: block; } }

/* Sidebar brand */
.dash-brand {
  display: flex; align-items: center; gap: 10px;
  padding: 6px 8px 18px;
  border-bottom: 1px solid var(--d-border);
  margin-bottom: 8px;
  text-decoration: none; color: var(--d-text);
}
.dash-brand-dot {
  width: 34px; height: 34px; border-radius: 10px;
  background: linear-gradient(135deg,#d4a843,#c49838);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #09090d; flex-shrink: 0;
}
.dash-brand-name {
  font-size: 14px; font-weight: 700; letter-spacing: -.01em;
}

/* Sidebar user card */
.dash-sidebar-user {
  display: flex; align-items: center; gap: 10px;
  background: var(--d-soft);
  border: 1px solid var(--d-border);
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 10px;
}
.dash-sidebar-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg,#d4a843,#c49838);
  color: #09090d; font-size: 13px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.dash-user-name { font-size: 12px; font-weight: 600; color: var(--d-text); line-height: 1.2; }
.dash-user-email { font-size: 10px; color: var(--d-muted); line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }

/* Sidebar nav */
.dash-nav-item {
  width: 100%;
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--d-muted);
  font-family: var(--font-poppins), sans-serif;
  font-size: 13px; font-weight: 500;
  cursor: pointer;
  transition: background .18s, color .18s;
  text-align: left;
}
.dash-nav-item:hover {
  background: var(--d-soft);
  color: var(--d-text);
}
.dash-nav-item.active {
  background: rgba(212,168,67,.12);
  color: var(--d-gold);
  font-weight: 600;
}
.dash-nav-item .dash-nav-badge {
  margin-left: auto;
  background: var(--d-gold);
  color: #09090d;
  font-size: 10px; font-weight: 700;
  border-radius: 999px;
  padding: 1px 7px;
  min-width: 20px; text-align: center;
}
.dash-nav-section {
  font-family: var(--font-space-mono), monospace;
  font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
  color: var(--d-muted);
  padding: 14px 12px 6px;
}
.dash-sidebar-spacer { flex: 1; }
.dash-logout {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--d-border);
  background: var(--d-soft);
  color: var(--d-muted);
  font-family: var(--font-poppins), sans-serif;
  font-size: 12px; font-weight: 500;
  cursor: pointer;
  transition: all .18s;
  width: 100%;
}
.dash-logout:hover { border-color: rgba(212,168,67,.4); color: var(--d-gold); }

/* -- MOBILE HEADER (fixed, md:hidden) -- */
.dash-mobile-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 600;
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px;
  background: var(--d-surf);
  border-bottom: 1px solid var(--d-border);
  box-shadow: 0 2px 20px rgba(0,0,0,.4);
}
@media (min-width: 769px) { .dash-mobile-header { display: none; } }
.dash-mobile-ham {
  background: var(--d-soft); border: 1px solid var(--d-border);
  border-radius: 8px; color: var(--d-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center; padding: 6px;
  transition: all .18s;
}
.dash-mobile-ham:hover { background: var(--d-border); color: var(--d-text); }
.dash-mobile-brand {
  font-size: 14px; font-weight: 600; color: var(--d-text);
  display: flex; align-items: center; gap: 8px;
}
.dash-mobile-brand-dot {
  width: 28px; height: 28px; border-radius: 8px;
  background: linear-gradient(135deg,#d4a843,#c49838);
  color: #09090d; font-size: 9px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
/* -- TOPBAR (floating, exactly like admin) -- */
.dash-topbar {
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: space-between;
  gap: 14px; padding: 10px 12px;
  margin: 62px 16px 0;
  border-radius: 16px;
  border: 1px solid var(--d-border);
  background: var(--d-surf);
  box-shadow: 0 10px 26px rgba(0,0,0,.16);
}
@media (min-width: 769px) { .dash-topbar { margin: 24px 48px 0; } }
.dash-topbar-left { display: flex; align-items: center; gap: 10px; min-width: 0; position: relative; }
.dash-topbar-right { display: flex; align-items: center; gap: 10px; }
.dash-search-wrap {
  min-width: 220px; width: min(48vw, 520px); height: 40px;
  border: 1px solid var(--d-border); border-radius: 12px;
  display: flex; align-items: center; gap: 8px; padding: 0 10px;
  background: var(--d-soft);
}
.dash-search-wrap svg { color: var(--d-muted); }
.dash-search {
  flex: 1; border: 0; outline: 0; background: transparent;
  color: var(--d-text); font-size: 13px;
  font-family: var(--font-poppins), sans-serif;
}
.dash-search::placeholder { color: var(--d-muted); }
.dash-icon-btn {
  width: 36px; height: 36px; border-radius: 999px;
  border: 1px solid var(--d-border); background: var(--d-soft);
  color: var(--d-muted);
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; transition: border-color .18s, color .18s;
}
.dash-icon-btn:hover { border-color: rgba(212,168,67,.42); color: var(--d-text); }
.dash-profile {
  border: 1px solid var(--d-border); background: var(--d-soft);
  border-radius: 12px; padding: 6px 10px;
  display: flex; align-items: center; gap: 8px;
}
.dash-avatar {
  width: 30px; height: 30px; border-radius: 50%;
  background: linear-gradient(135deg,#d4a843,#c49838);
  color: #09090d; font-size: 12px; font-weight: 700;
  display: inline-flex; align-items: center; justify-content: center;
}
.dash-pname { color: var(--d-text); font-size: 12px; font-weight: 600; line-height: 1.1; }
.dash-pmail { color: var(--d-muted); font-size: 11px; line-height: 1.1; }
.dash-notif-wrap { position: relative; }
.dash-notif-badge {
  position: absolute; top: -5px; right: -5px;
  min-width: 16px; height: 16px; border-radius: 999px;
  background: #d4a843; color: #09090d; font-size: 9px; font-weight: 700;
  display: inline-flex; align-items: center; justify-content: center; padding: 0 4px;
}
@media (max-width: 768px) {
  .dash-search-wrap { width: 44vw; min-width: 140px; }
  .dash-profile { display: none; }
}

/* â”€â”€ MAIN CONTENT â”€â”€ */
.dash-content {
  flex: 1;
  overflow-y: auto;
  padding: 22px 22px 40px;
}
.dash-content::-webkit-scrollbar { width: 6px; }
.dash-content::-webkit-scrollbar-track { background: transparent; }
.dash-content::-webkit-scrollbar-thumb { background: var(--d-border); border-radius: 3px; }

/* Page header */
.dash-page-header { margin-bottom: 28px; }
.dash-page-title {
  font-size: 26px; font-weight: 700; color: var(--d-text);
  letter-spacing: -.02em; line-height: 1.2;
}
.dash-page-sub { font-size: 13px; color: var(--d-muted); margin-top: 4px; }

/* â”€â”€ STATS ROW â”€â”€ */
.dash-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 32px;
}
.dash-stat {
  background: var(--d-surf);
  border: 1px solid var(--d-border);
  border-radius: 14px;
  padding: 18px 20px;
  display: flex; align-items: center; gap: 14px;
  transition: border-color .2s, box-shadow .2s;
}
.dash-stat:hover {
  border-color: rgba(212,168,67,.3);
  box-shadow: 0 6px 20px rgba(0,0,0,.15);
}
.dash-stat-icon {
  width: 42px; height: 42px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.dash-stat-icon.gold   { background: rgba(212,168,67,.12); color: #d4a843; }
.dash-stat-icon.green  { background: rgba(34,197,94,.1);  color: #22c55e; }
.dash-stat-icon.blue   { background: rgba(96,165,250,.1); color: #60a5fa; }
.dash-stat-icon.purple { background: rgba(167,139,250,.1); color: #a78bfa; }
.dash-stat-num {
  font-size: 24px; font-weight: 700;
  background: linear-gradient(135deg,#d4a843,#f0cc7a);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  line-height: 1;
}
.dash-stat-lbl { font-size: 11px; color: var(--d-muted); margin-top: 3px; font-weight: 500; }

/* Section header */
.dash-section-head {
  display: flex; align-items: center; gap: 10px;
  font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase;
  color: var(--d-muted);
  margin-bottom: 18px;
}
.dash-section-head::after { content: ''; flex: 1; height: 1px; background: var(--d-border); }

/* â”€â”€ TRAINING CARDS â”€â”€ */
.dash-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(288px, 1fr));
  gap: 18px;
  margin-bottom: 40px;
}
.dash-card {
  background: var(--d-surf);
  border: 1px solid var(--d-border);
  border-radius: 14px;
  overflow: hidden;
  display: flex; flex-direction: column;
  transition: border-color .25s, box-shadow .25s, transform .25s;
  text-decoration: none; color: inherit;
}
.dash-card:hover {
  border-color: rgba(212,168,67,.4);
  box-shadow: 0 14px 36px rgba(0,0,0,.3);
  transform: translateY(-3px);
}
.dash-card-thumb {
  width: 100%; aspect-ratio: 16/9;
  background: rgba(212,168,67,.06);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.dash-card-thumb img { width: 100%; height: 100%; object-fit: cover; }
.dash-card-placeholder { color: rgba(212,168,67,.2); }
.dash-card-body { padding: 18px 20px; flex: 1; display: flex; flex-direction: column; gap: 7px; }
.dash-card-cat {
  font-family: var(--font-space-mono), monospace;
  font-size: 9px; letter-spacing: .25em; text-transform: uppercase;
  background: linear-gradient(90deg,#ffde59,#ff914d);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.dash-card-title { font-size: 15px; font-weight: 600; color: var(--d-text); line-height: 1.35; flex: 1; }
.dash-card-desc { font-size: 12px; color: var(--d-muted); line-height: 1.6; font-weight: 300; }
.dash-card-meta {
  font-family: var(--font-space-mono), monospace;
  font-size: 9px; letter-spacing: .1em; text-transform: uppercase;
  color: var(--d-muted);
  display: flex; gap: 12px;
  border-top: 1px solid var(--d-border); padding-top: 10px; margin-top: 4px;
}

/* Progress */
.dash-progress-label {
  font-size: 10px; color: var(--d-muted);
  display: flex; justify-content: space-between; margin-bottom: 5px;
}
.dash-progress-bar {
  height: 4px; background: color-mix(in srgb, var(--d-text) 10%, transparent);
  border-radius: 2px; overflow: hidden;
}
.dash-progress-fill {
  height: 100%; background: linear-gradient(90deg,#ffde59,#ff914d);
  border-radius: 2px; transition: width .5s ease;
}

/* Buttons */
.dash-btn {
  margin-top: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
  padding: 10px 16px;
  border-radius: 8px; border: none; cursor: pointer;
  transition: opacity .18s, transform .18s; width: 100%;
  font-family: var(--font-poppins), sans-serif;
}
.dash-btn-gold {
  background: linear-gradient(135deg,#d4a843,#c49838);
  color: #09090d;
}
.dash-btn-gold:hover { opacity: .88; transform: translateY(-1px); }
.dash-btn-enrolled {
  background: rgba(212,168,67,.1);
  color: var(--d-gold);
  border: 1px solid rgba(212,168,67,.22) !important;
}

/* Empty */
.dash-empty {
  grid-column: 1 / -1;
  font-size: 14px; color: var(--d-muted);
  padding: 56px; text-align: center;
  border: 1px dashed var(--d-border);
  border-radius: 14px;
}

/* â”€â”€ PROFILE TAB â”€â”€ */
.dash-profile-card {
  background: var(--d-surf);
  border: 1px solid var(--d-border);
  border-radius: 16px;
  padding: 32px 36px;
  max-width: 560px;
}
.dash-profile-hero {
  display: flex; align-items: center; gap: 20px;
  margin-bottom: 32px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--d-border);
}
.dash-profile-avatar-lg {
  width: 64px; height: 64px; border-radius: 50%;
  background: linear-gradient(135deg,#d4a843,#c49838);
  color: #09090d; font-size: 22px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(212,168,67,.3);
}
.dash-profile-name-big { font-size: 20px; font-weight: 700; color: var(--d-text); }
.dash-profile-role {
  font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
  color: var(--d-gold); margin-top: 4px;
}
.dash-profile-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--d-border);
  gap: 16px;
}
.dash-profile-row:last-child { border-bottom: none; }
.dash-profile-label { font-size: 12px; color: var(--d-muted); font-weight: 500; }
.dash-profile-value { font-size: 13px; color: var(--d-text); font-weight: 600; text-align: right; }
.dash-toggle-row {
  display: flex; gap: 4px;
  background: var(--d-soft);
  border: 1px solid var(--d-border);
  border-radius: 8px;
  padding: 3px;
}
.dash-toggle-btn {
  padding: 5px 14px;
  border-radius: 6px;
  border: none; background: transparent;
  font-size: 12px; font-weight: 600;
  color: var(--d-muted); cursor: pointer;
  font-family: var(--font-poppins), sans-serif;
  transition: all .15s;
}
.dash-toggle-btn.active {
  background: var(--d-surf);
  color: var(--d-gold);
  box-shadow: 0 1px 6px rgba(0,0,0,.15);
}

/* Loading */
@keyframes db-pulse { 0%,100%{opacity:.2;transform:scale(.8)} 50%{opacity:1;transform:scale(1.1)} }
.dash-dot {
  width: 8px; height: 8px; background: #d4a843; border-radius: 50%;
  animation: db-pulse 1.2s ease-in-out infinite;
}

@media (max-width: 640px) {
  .dash-stats { grid-template-columns: repeat(2, 1fr); }
  .dash-content { padding: 16px 14px 32px; }
  .dash-grid { grid-template-columns: 1fr; }
  .dash-profile-card { padding: 22px 18px; }
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
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<DashTab>("my-trainings");
  const [navOpen, setNavOpen] = useState(false);
  const [search, setSearch] = useState("");
  const db = createClient();

  useEffect(() => {
    const saved = window.localStorage.getItem("sg-dashboard-theme");
    if (saved === "light" || saved === "dark") setTheme(saved as "dark" | "light");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("sg-dashboard-theme", theme);
  }, [theme]);

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

    const withProgress: EnrollmentWithProgress[] = await Promise.all(
      rawEnrollments.map(async (e) => {
        const training = ts.find((tr) => tr.id === e.training_id);
        if (!training || !training.total_lessons) return { ...e, completedCount: 0 };

        const { data: lessonIds } = await db
          .from("training_lessons").select("id").eq("training_id", e.training_id);

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

  async function handleLogout() {
    await db.auth.signOut();
    router.push("/");
  }

  const enrolledIds = new Set(enrollments.map((e) => e.training_id));
  const myTrainings = trainings.filter((tr) => enrolledIds.has(tr.id));
  const available = trainings.filter((tr) => !enrolledIds.has(tr.id));

  // Stats
  const totalLessons = myTrainings.reduce((s, tr) => s + (tr.total_lessons ?? 0), 0);
  const totalCompleted = enrollments.reduce((s, e) => s + (e.completedCount ?? 0), 0);
  const overallPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
  const finishedCount = myTrainings.filter((tr) => {
    const enr = enrollments.find((e) => e.training_id === tr.id);
    const pct = (tr.total_lessons ?? 0) > 0
      ? Math.round(((enr?.completedCount ?? 0) / tr.total_lessons) * 100)
      : 0;
    return pct === 100;
  }).length;

  // Search filter
  const searchLc = search.toLowerCase();
  const filteredMy = myTrainings.filter((tr) =>
    !search || tr.title.toLowerCase().includes(searchLc) || (tr.category ?? "").toLowerCase().includes(searchLc)
  );
  const filteredAvail = available.filter((tr) =>
    !search || tr.title.toLowerCase().includes(searchLc) || (tr.category ?? "").toLowerCase().includes(searchLc)
  );

  const NAV_ITEMS: { id: DashTab; label: string; Icon: React.ComponentType<{ size?: number }>; count?: number }[] = [
    { id: "my-trainings", label: t.myTrainings, Icon: GraduationCap, count: myTrainings.length },
    { id: "browse",       label: t.browse,      Icon: BookOpen,      count: available.length   },
    { id: "profile",      label: t.profile,     Icon: User                                     },
  ];

  const displayName = user?.email?.split("@")[0] ?? "Student";
  const initials = (user?.email?.[0] ?? "S").toUpperCase();

  return (
    <div className={`dash-root h-screen overflow-hidden flex ${theme === "light" ? "dash-light" : "dash-dark"}`}>
      <style>{dashCss}</style>

      {/* Mobile header */}
      <div className="dash-mobile-header">
        <button className="dash-mobile-ham" onClick={() => setNavOpen(!navOpen)} aria-label="Menu">
          {navOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <span className="dash-mobile-brand">
          <span className="dash-mobile-brand-dot">SG</span>
          {t.brand}
        </span>
        <Link href="/" style={{ color: "var(--d-muted)", display: "flex", lineHeight: 1 }}><Globe size={16} /></Link>
      </div>
      {/* â”€â”€ SIDEBAR â”€â”€ */}
      <aside className={`dash-sidebar${navOpen ? " open" : ""}`}>
        <Link href="/" className="dash-brand" style={{ textDecoration: "none" }}>
          <div className="dash-brand-dot">SG</div>
          <span className="dash-brand-name">{t.brand}</span>
        </Link>

        <div className="dash-sidebar-user">
          <div className="dash-sidebar-avatar">{initials}</div>
          <div style={{ minWidth: 0 }}>
            <p className="dash-user-name">{displayName}</p>
            <p className="dash-user-email">{user?.email ?? ""}</p>
          </div>
        </div>

        <div className="dash-nav-section">Navigation</div>

        {NAV_ITEMS.map(({ id, label, Icon, count }) => (
          <button
            key={id}
            className={`dash-nav-item${activeTab === id ? " active" : ""}`}
            onClick={() => { setActiveTab(id); setNavOpen(false); }}
          >
            <Icon size={16} />
            <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
            {count !== undefined && count > 0 && (
              <span className="dash-nav-badge">{count}</span>
            )}
          </button>
        ))}

        <div className="dash-sidebar-spacer" />


        <button className="dash-logout" onClick={handleLogout}>
          <LogOut size={14} />
          <span>{t.signOut}</span>
        </button>
      </aside>

      {/* Mobile overlay */}
      {navOpen && (
        <div className="dash-overlay" onClick={() => setNavOpen(false)} />
      )}

      {/* â”€â”€ MAIN AREA â”€â”€ */}
      <div className="dash-main-area">
        {/* Topbar */}
        <div className="dash-topbar">
          <div className="dash-topbar-left">
            <div className="dash-search-wrap">
              <Search size={15} />
              <input
                className="dash-search"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="dash-topbar-right">
            <span className="dash-icon-btn"><Mail size={14} /></span>
            <button className="dash-icon-btn" aria-label="Notifications">
              <Bell size={14} />
            </button>
            <button
              type="button"
              className="dash-icon-btn"
              onClick={() => setTheme((v) => v === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to light" : "Switch to dark"}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              type="button"
              className="dash-icon-btn"
              onClick={toggleLang}
              aria-label="Switch language"
              title={lang === "en" ? "Passer en Français" : "Switch to English"}
            >
              <Globe size={14} />
            </button>
            <div className="dash-profile">
              <span className="dash-avatar">{initials}</span>
              <div>
                <p className="dash-pname">{displayName}</p>
                <p className="dash-pmail">{user?.email ?? ""}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="dash-content">
          {loading ? (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", padding: "100px 0" }}>
              {[0, 200, 400].map((d) => (
                <div key={d} className="dash-dot" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          ) : (
            <>
              {/* â”€â”€ MY TRAININGS â”€â”€ */}
              {activeTab === "my-trainings" && (
                <>
                  <div className="dash-page-header">
                    <h1 className="dash-page-title">{t.myTrainings}</h1>
                    <p className="dash-page-sub">Your enrolled courses and progress at a glance.</p>
                  </div>

                  {/* Stats */}
                  <div className="dash-stats">
                    <div className="dash-stat">
                      <div className="dash-stat-icon gold"><GraduationCap size={20} /></div>
                      <div>
                        <div className="dash-stat-num">{myTrainings.length}</div>
                        <div className="dash-stat-lbl">{t.statsEnrolled}</div>
                      </div>
                    </div>
                    <div className="dash-stat">
                      <div className="dash-stat-icon green"><CheckCircle2 size={20} /></div>
                      <div>
                        <div className="dash-stat-num">{totalCompleted}</div>
                        <div className="dash-stat-lbl">{t.statsCompleted} Lessons</div>
                      </div>
                    </div>
                    <div className="dash-stat">
                      <div className="dash-stat-icon blue"><TrendingUp size={20} /></div>
                      <div>
                        <div className="dash-stat-num">{overallPct}%</div>
                        <div className="dash-stat-lbl">{t.statsProgress}</div>
                      </div>
                    </div>
                    <div className="dash-stat">
                      <div className="dash-stat-icon purple"><Award size={20} /></div>
                      <div>
                        <div className="dash-stat-num">{finishedCount}</div>
                        <div className="dash-stat-lbl">{t.statsDone}</div>
                      </div>
                    </div>
                  </div>

                  <div className="dash-section-head">
                    <GraduationCap size={13} /> {t.myTrainings} ({filteredMy.length})
                  </div>
                  <div className="dash-grid">
                    {filteredMy.length === 0 ? (
                      <div className="dash-empty">{search ? `No results for "${search}"` : t.noEnrolled}</div>
                    ) : (
                      filteredMy.map((tr) => {
                        const enr = enrollments.find((e) => e.training_id === tr.id);
                        const completed = enr?.completedCount ?? 0;
                        const total = tr.total_lessons ?? 0;
                        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                        return (
                          <Link key={tr.id} href={`/dashboard/training/${tr.id}`} className="dash-card">
                            <div className="dash-card-thumb">
                              {tr.thumbnail_url
                                ? <img src={tr.thumbnail_url} alt={tr.title} />
                                : <BookOpen size={40} className="dash-card-placeholder" />}
                            </div>
                            <div className="dash-card-body">
                              <div className="dash-card-cat">{tr.category}</div>
                              <div className="dash-card-title">{tr.title}</div>
                              {tr.description && (
                                <div className="dash-card-desc">
                                  {tr.description.slice(0, 90)}{tr.description.length > 90 ? "…" : ""}
                                </div>
                              )}
                              <div className="dash-card-meta">
                                <span>{total} {t.lessons}</span>
                                <span>{pct}% {t.complete}</span>
                              </div>
                              <div>
                                <div className="dash-progress-label">
                                  <span>{completed}/{total} lessons</span>
                                  <span style={{ color: pct === 100 ? "#22c55e" : undefined }}>{pct}%</span>
                                </div>
                                <div className="dash-progress-bar">
                                  <div className="dash-progress-fill" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                              <button className="dash-btn dash-btn-enrolled">{t.continueBtn}</button>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                </>
              )}

              {/* â”€â”€ BROWSE â”€â”€ */}
              {activeTab === "browse" && (
                <>
                  <div className="dash-page-header">
                    <h1 className="dash-page-title">{t.available}</h1>
                    <p className="dash-page-sub">Discover new trainings and grow your skills.</p>
                  </div>
                  <div className="dash-section-head">
                    <BookOpen size={13} /> {t.available} ({filteredAvail.length})
                  </div>
                  <div className="dash-grid">
                    {filteredAvail.length === 0 ? (
                      <div className="dash-empty">{search ? `No results for "${search}"` : t.noAvailable}</div>
                    ) : (
                      filteredAvail.map((tr) => (
                        <div key={tr.id} className="dash-card" style={{ cursor: "default" }}>
                          <div className="dash-card-thumb">
                            {tr.thumbnail_url
                              ? <img src={tr.thumbnail_url} alt={tr.title} />
                              : <BookOpen size={40} className="dash-card-placeholder" />}
                          </div>
                          <div className="dash-card-body">
                            <div className="dash-card-cat">{tr.category}</div>
                            <div className="dash-card-title">{tr.title}</div>
                            {tr.description && (
                              <div className="dash-card-desc">
                                {tr.description.slice(0, 90)}{tr.description.length > 90 ? "…" : ""}
                              </div>
                            )}
                            <div className="dash-card-meta">
                              <span>{tr.total_lessons ?? 0} {t.lessons}</span>
                            </div>
                            <button
                              className="dash-btn dash-btn-gold"
                              onClick={() => enroll(tr.id)}
                              disabled={enrollingId === tr.id}
                            >
                              {enrollingId === tr.id ? t.enrolling : t.enrollBtn}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

              {/* â”€â”€ PROFILE â”€â”€ */}
              {activeTab === "profile" && (
                <>
                  <div className="dash-page-header">
                    <h1 className="dash-page-title">{t.profileTitle}</h1>
                    <p className="dash-page-sub">{t.profileSub}</p>
                  </div>
                  <div className="dash-profile-card">
                    <div className="dash-profile-hero">
                      <div className="dash-profile-avatar-lg">{initials}</div>
                      <div>
                        <div className="dash-profile-name-big">{displayName}</div>
                        <div className="dash-profile-role">Student</div>
                      </div>
                    </div>
                    <div className="dash-profile-row">
                      <span className="dash-profile-label">{t.email}</span>
                      <span className="dash-profile-value">{user?.email ?? "—"}</span>
                    </div>
                    <div className="dash-profile-row">
                      <span className="dash-profile-label">{t.memberSince}</span>
                      <span className="dash-profile-value">
                        {user?.created_at
                          ? new Date(user.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                          : "—"}
                      </span>
                    </div>
                    <div className="dash-profile-row">
                      <span className="dash-profile-label">{t.statsEnrolled} Trainings</span>
                      <span className="dash-profile-value">{myTrainings.length}</span>
                    </div>
                    <div className="dash-profile-row">
                      <span className="dash-profile-label">{t.statsDone} Trainings</span>
                      <span className="dash-profile-value">{finishedCount}</span>
                    </div>
                    <div className="dash-profile-row">
                      <span className="dash-profile-label">{t.language}</span>
                      <div className="dash-toggle-row">
                        <button className={`dash-toggle-btn${lang === "en" ? " active" : ""}`} onClick={() => lang !== "en" && toggleLang()}>EN</button>
                        <button className={`dash-toggle-btn${lang === "fr" ? " active" : ""}`} onClick={() => lang !== "fr" && toggleLang()}>FR</button>
                      </div>
                    </div>
                    <div className="dash-profile-row">
                      <span className="dash-profile-label">{t.theme}</span>
                      <div className="dash-toggle-row">
                        <button className={`dash-toggle-btn${theme === "dark" ? " active" : ""}`} onClick={() => setTheme("dark")}>{t.dark}</button>
                        <button className={`dash-toggle-btn${theme === "light" ? " active" : ""}`} onClick={() => setTheme("light")}>{t.light}</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
