// Rewrite dashboard page.tsx via Node script
const fs = require("fs");

const newPage = `"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, Flame, User, Search, Mail, Bell, Sun, Moon, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useLang } from "@/lib/i18n";
import { translations } from "./translations";
import type { DashTab, Training, EnrollmentWithProgress } from "./types";
import { layoutStyles } from "./styles/layoutStyles";
import { tabStyles } from "./styles/tabStyles";
import DashSidebar from "./components/DashSidebar";
import MyTrainingsTab from "./components/MyTrainingsTab";
import BrowseTab from "./components/BrowseTab";
import HabitsTab from "./components/HabitsTab";
import ProfileTab from "./components/ProfileTab";

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
  const [profileName, setProfileName] = useState("");
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

    // Pre-load profile name for topbar display
    const { data: profileData } = await db
      .from("user_profiles").select("full_name").eq("id", session.user.id).single();
    if (profileData?.full_name) setProfileName(profileData.full_name);

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

  const totalLessons   = myTrainings.reduce((s, tr) => s + (tr.total_lessons ?? 0), 0);
  const totalCompleted = enrollments.reduce((s, e) => s + (e.completedCount ?? 0), 0);
  const overallPct     = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
  const finishedCount  = myTrainings.filter((tr) => {
    const enr = enrollments.find((e) => e.training_id === tr.id);
    return (tr.total_lessons ?? 0) > 0 &&
      Math.round(((enr?.completedCount ?? 0) / tr.total_lessons!) * 100) === 100;
  }).length;

  const searchLc    = search.toLowerCase();
  const filteredMy  = myTrainings.filter((tr) =>
    !search || tr.title.toLowerCase().includes(searchLc) || (tr.category ?? "").toLowerCase().includes(searchLc)
  );
  const filteredAvail = available.filter((tr) =>
    !search || tr.title.toLowerCase().includes(searchLc) || (tr.category ?? "").toLowerCase().includes(searchLc)
  );

  const displayName = profileName.trim() || user?.email?.split("@")[0] || "Student";
  const initials    = (displayName[0] ?? "S").toUpperCase();

  const NAV_ITEMS: { id: DashTab; label: string; Icon: React.ComponentType<{ size?: number }>; count?: number }[] = [
    { id: "my-trainings", label: t.myTrainings, Icon: GraduationCap, count: myTrainings.length },
    { id: "browse",       label: t.browse,      Icon: BookOpen,      count: available.length   },
    { id: "habits",       label: t.habits,      Icon: Flame,         count: undefined           },
    { id: "profile",      label: t.profile,     Icon: User                                     },
  ];

  return (
    <div className={\`dash-root\${theme === "dark" ? " dash-dark" : " dash-light"}\`}>
      <style>{layoutStyles}{tabStyles}</style>

      {/* Mobile header */}
      <div className="dash-mobile-header">
        <button className="dash-mobile-ham" onClick={() => setNavOpen((v) => !v)} aria-label="Menu">
          <span /><span /><span />
        </button>
        <div className="dash-mobile-brand">
          <span className="dash-mobile-brand-dot" />
          <span>{t.brand}</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            className="dash-icon-btn"
            onClick={() => setTheme((v) => v === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button className="dash-icon-btn" onClick={toggleLang} aria-label="Switch language">
            <Globe size={14} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <DashSidebar
        navOpen={navOpen}
        activeTab={activeTab}
        displayName={displayName}
        initials={initials}
        email={user?.email ?? ""}
        t={t}
        navItems={NAV_ITEMS}
        onTabChange={(tab) => { setActiveTab(tab); setNavOpen(false); }}
        onLogout={handleLogout}
      />

      {/* Mobile overlay */}
      {navOpen && <div className="dash-overlay" onClick={() => setNavOpen(false)} />}

      {/* Bottom nav (mobile) */}
      <nav className="dash-bottom-nav">
        {NAV_ITEMS.map(({ id, label, Icon, count }) => (
          <button
            key={id}
            className={\`dash-bottom-nav-item\${activeTab === id ? " active" : ""}\`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={20} />
            <span>{label}</span>
            {count !== undefined && count > 0 && (
              <span className="dash-bottom-nav-badge">{count}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Main area */}
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
            <button className="dash-icon-btn" aria-label="Notifications"><Bell size={14} /></button>
            <button
              className="dash-icon-btn"
              onClick={() => setTheme((v) => v === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button className="dash-icon-btn" onClick={toggleLang} aria-label="Switch language">
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
                <div key={d} className="dash-dot" style={{ animationDelay: \`\${d}ms\` }} />
              ))}
            </div>
          ) : (
            <>
              {activeTab === "my-trainings" && (
                <MyTrainingsTab
                  myTrainings={myTrainings}
                  enrollments={enrollments}
                  enrollingId={enrollingId}
                  totalCompleted={totalCompleted}
                  overallPct={overallPct}
                  finishedCount={finishedCount}
                  search={search}
                  t={t}
                  filteredMy={filteredMy}
                />
              )}
              {activeTab === "browse" && (
                <BrowseTab
                  filteredAvail={filteredAvail}
                  enrollingId={enrollingId}
                  search={search}
                  t={t}
                  onEnroll={enroll}
                />
              )}
              {activeTab === "habits" && user && (
                <HabitsTab user={user} t={t} />
              )}
              {activeTab === "profile" && user && (
                <ProfileTab
                  user={user}
                  t={t}
                  lang={lang}
                  toggleLang={toggleLang}
                  theme={theme}
                  setTheme={setTheme}
                  myTrainingsCount={myTrainings.length}
                  finishedCount={finishedCount}
                  handleLogout={handleLogout}
                  onNameChange={setProfileName}
                  initials={initials}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
`;

fs.writeFileSync("app/dashboard/page.tsx", newPage.replace(/\r\n/g, "\n"));
console.log("page.tsx lines:", newPage.split("\n").length);
console.log("Done");
