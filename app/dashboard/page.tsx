"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, BookOpen, Flame, Newspaper, User, Search, Bell, Sun, Moon, Globe, LayoutDashboard, LogOut } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useLang } from "@/lib/i18n";
import { translations } from "./translations";
import type { DashTab, Training, EnrollmentWithProgress, SpiritualHabit, HabitLog, TrainingLesson, DashNotification, BlogPostSummary } from "./types";
import { layoutStyles } from "./styles/layoutStyles";
import { tabStyles } from "./styles/tabStyles";
import DashSidebar from "./components/DashSidebar";
import OverviewTab from "./components/OverviewTab";
import MyTrainingsTab from "./components/MyTrainingsTab";
import BrowseTab from "./components/BrowseTab";
import HabitsTab from "./components/HabitsTab";
import BlogsTab from "./components/BlogsTab";
import ProfileTab from "./components/ProfileTab";

const NOTIF_READ_KEY = "sg-dash-notif-read";
const NOTIF_WINDOW_MS = 14 * 86400000; // only surface content notifications from the last 14 days

function getReadKeys(): Set<string> {
  try {
    const raw = window.localStorage.getItem(NOTIF_READ_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function addReadKeys(keys: string[]) {
  try {
    const merged = new Set([...getReadKeys(), ...keys]);
    window.localStorage.setItem(NOTIF_READ_KEY, JSON.stringify([...merged]));
  } catch { /* ignore */ }
}

function buildNotifications({
  adminRows,
  trainings,
  lessons,
  habits,
  habitLogs,
}: {
  adminRows: { id: string; title: string; body: string | null; read: boolean; created_at: string }[];
  trainings: Training[];
  lessons: TrainingLesson[];
  habits: SpiritualHabit[];
  habitLogs: HabitLog[];
}): DashNotification[] {
  const readKeys = getReadKeys();
  const cutoff = Date.now() - NOTIF_WINDOW_MS;

  const admin: DashNotification[] = adminRows.map((r) => ({
    id: r.id,
    kind: "admin",
    title: r.title,
    body: r.body,
    created_at: r.created_at,
    read: r.read,
  }));

  const newTrainings: DashNotification[] = trainings
    .filter((tr) => new Date(tr.created_at).getTime() > cutoff)
    .map((tr) => ({
      id: `training:${tr.id}`,
      kind: "training",
      title: "New training available",
      body: tr.title,
      created_at: tr.created_at,
      read: readKeys.has(`training:${tr.id}`),
    }));

  // `lessons` is already scoped to trainings the user is enrolled in (see load()).
  const newLessons: DashNotification[] = lessons
    .filter((l) => new Date(l.created_at).getTime() > cutoff)
    .map((l) => ({
      id: `lesson:${l.id}`,
      kind: "lesson",
      title: "New lesson added",
      body: l.title,
      created_at: l.created_at,
      read: readKeys.has(`lesson:${l.id}`),
    }));

  const today = new Date().toISOString().slice(0, 10);
  const loggedToday = new Set(habitLogs.filter((l) => l.logged_date === today).map((l) => l.habit_id));
  const habitReminder: DashNotification[] =
    habits.length > 0 && habits.some((h) => !loggedToday.has(h.id))
      ? [{
          id: `habit:${today}`,
          kind: "habit",
          title: "Log today's habit",
          body: "You haven't logged a spiritual habit today — keep the streak going.",
          created_at: new Date().toISOString(),
          read: true, // a standing nudge, not counted toward the unread badge
        }]
      : [];

  return [...admin, ...newTrainings, ...newLessons, ...habitReminder].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, toggleLang } = useLang();
  const t = translations[lang];
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<DashTab>(() => {
    const tab = searchParams.get("tab") as DashTab;
    const valid: DashTab[] = ["overview", "my-trainings", "browse", "habits", "blogs", "profile"];
    return valid.includes(tab) ? tab : "overview";
  });
  const [navOpen, setNavOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null);
  const [overviewHabits, setOverviewHabits] = useState<SpiritualHabit[]>([]);
  const [overviewHabitLogs, setOverviewHabitLogs] = useState<HabitLog[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostSummary[]>([]);
  const [readPostIds, setReadPostIds] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<DashNotification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
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
    if (!session) return; // layout handles redirect
    setUser(session.user);

    const [tRes, eRes] = await Promise.all([
      db.from("trainings").select("*").eq("published", true).order("sort_order", { ascending: true }),
      db.from("training_enrollments").select("training_id,enrolled_at").eq("user_id", session.user.id),
    ]);

    const ts: Training[] = tRes.data ?? [];
    const rawEnrollments = eRes.data ?? [];

    // Batch fetch all lesson IDs + all progress in 2 queries (avoids N+1)
    const enrolledIds = rawEnrollments
      .filter(e => ts.find(tr => tr.id === e.training_id)?.total_lessons)
      .map(e => e.training_id);

    const [allLessonsRes, allProgressRes] = await Promise.all([
      enrolledIds.length > 0
        ? db.from("training_lessons").select("id,training_id,title,created_at").in("training_id", enrolledIds)
        : Promise.resolve({ data: [] as TrainingLesson[] }),
      db.from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", session.user.id)
        .eq("completed", true),
    ]);

    const allLessons = (allLessonsRes.data ?? []) as TrainingLesson[];
    const completedSet = new Set((allProgressRes.data ?? []).map((p: { lesson_id: string }) => p.lesson_id));

    const withProgress: EnrollmentWithProgress[] = rawEnrollments.map((e) => {
      const training = ts.find((tr) => tr.id === e.training_id);
      if (!training || !training.total_lessons) return { ...e, completedCount: 0 };
      const trainingLessonIds = allLessons
        .filter(l => l.training_id === e.training_id)
        .map(l => l.id);
      return { ...e, completedCount: trainingLessonIds.filter(id => completedSet.has(id)).length };
    });

    // Pre-load profile name + avatar + habits for overview
    const [profileData, habitsRes, logsRes, notifRes, blogReadsRes, blogPostsRes] = await Promise.all([
      db.from("profiles").select("full_name,avatar_url").eq("id", session.user.id).single(),
      db.from("spiritual_habits").select("*").eq("user_id", session.user.id).order("created_at", { ascending: true }),
      db.from("habit_logs").select("id,habit_id,logged_date").eq("user_id", session.user.id)
        .gte("logged_date", new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)),
      db.from("user_notifications").select("id,title,body,read,created_at").eq("user_id", session.user.id)
        .order("created_at", { ascending: false }).limit(50),
      db.from("blog_reads").select("blog_post_id").eq("user_id", session.user.id),
      db.from("blog_posts")
        .select("id,title,title_fr,slug,category,excerpt,excerpt_fr,read_time_minutes,featured_image_url,created_at")
        .eq("published", true).order("created_at", { ascending: false }),
    ]);
    setReadPostIds(new Set((blogReadsRes.data ?? []).map((r: { blog_post_id: string }) => r.blog_post_id)));
    setBlogPosts((blogPostsRes.data as BlogPostSummary[]) ?? []);
    if (profileData.data?.full_name) {
      setProfileName(profileData.data.full_name);
    } else {
      // First login after sign-up: profiles has no full_name yet, but the name
      // entered at sign-up lives in auth user_metadata. Hydrate it once so it
      // shows up immediately instead of waiting for a manual profile edit.
      const metaName = (session.user.user_metadata?.full_name as string | undefined)?.trim();
      if (metaName) {
        setProfileName(metaName);
        void db.from("profiles").upsert({ id: session.user.id, full_name: metaName });
      }
    }
    if (profileData.data?.avatar_url) setProfileAvatarUrl(profileData.data.avatar_url);
    const loadedHabits = (habitsRes.data as SpiritualHabit[]) ?? [];
    const loadedLogs = (logsRes.data as HabitLog[]) ?? [];
    setOverviewHabits(loadedHabits);
    setOverviewHabitLogs(loadedLogs);
    setNotifications(buildNotifications({
      adminRows: notifRes.data ?? [],
      trainings: ts,
      lessons: allLessons,
      habits: loadedHabits,
      habitLogs: loadedLogs,
    }));

    setTrainings(ts);
    setEnrollments(withProgress);
    setLoading(false);
  }, [db, router]);

  useEffect(() => { load(); }, [load]);

  async function enroll(trainingId: string) {
    if (!user) return;
    setEnrollingId(trainingId);
    const { error } = await db.from("training_enrollments").insert({ user_id: user.id, training_id: trainingId });
    if (error) {
      toast.error("Could not enroll. Please try again.");
    } else {
      const tr = trainings.find((t) => t.id === trainingId);
      toast.success(`Enrolled in ${tr?.title ?? "training"}!`);
    }
    await load();
    setEnrollingId(null);
  }

  async function handleLogout() {
    toast("Signing out…");
    await db.auth.signOut();
    router.push("/");
  }

  async function markAllNotificationsRead() {
    const unreadAdminIds = notifications.filter((n) => n.kind === "admin" && !n.read).map((n) => n.id);
    const unreadComputedKeys = notifications
      .filter((n) => n.kind !== "admin" && n.kind !== "habit" && !n.read)
      .map((n) => n.id);

    if (unreadComputedKeys.length > 0) addReadKeys(unreadComputedKeys);
    if (unreadAdminIds.length > 0) {
      await db.from("user_notifications").update({ read: true }).in("id", unreadAdminIds);
    }
    setNotifications((prev) => prev.map((n) => (n.kind === "habit" ? n : { ...n, read: true })));
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
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const today = new Date().toISOString().slice(0, 10);
  const habitsCheckedToday = overviewHabits.filter((h) =>
    overviewHabitLogs.some((l) => l.habit_id === h.id && l.logged_date === today)
  ).length;
  // Best streak: max consecutive days any habit was logged in last 30 days
  const longestStreak = (() => {
    if (!overviewHabitLogs.length) return 0;
    const days = [...new Set(overviewHabitLogs.map((l) => l.logged_date))].sort();
    let max = 1, cur = 1;
    for (let i = 1; i < days.length; i++) {
      const diff = (new Date(days[i]).getTime() - new Date(days[i - 1]).getTime()) / 86400000;
      cur = diff === 1 ? cur + 1 : 1;
      if (cur > max) max = cur;
    }
    return max;
  })();

  function handleTabChange(tab: DashTab) {
    setActiveTab(tab);
    setNavOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  }

  const NAV_ITEMS: { id: DashTab; label: string; Icon: React.ComponentType<{ size?: number }>; count?: number }[] = [
    { id: "overview",     label: t.overview,    Icon: LayoutDashboard                          },
    { id: "my-trainings", label: t.myTrainings, Icon: GraduationCap, count: myTrainings.length },
    { id: "browse",       label: t.browse,      Icon: BookOpen,      count: available.length   },
    { id: "habits",       label: t.habits,      Icon: Flame,         count: undefined           },
    { id: "blogs",        label: t.blogs,       Icon: Newspaper,     count: undefined           },
  ];

  return (
    <div className={`dash-root h-screen overflow-hidden flex${theme === "dark" ? " dash-dark" : " dash-light"}`}>
      <style>{layoutStyles}{tabStyles}</style>

      {/* Mobile header */}
      <div className="dash-mobile-header">
        <button className="dash-mobile-ham" onClick={() => setNavOpen((v) => !v)} aria-label={navOpen ? "Close menu" : "Open menu"} aria-expanded={navOpen}>
          <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
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
          <button className="dash-icon-btn" onClick={handleLogout} aria-label="Log out" title="Log out">
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <DashSidebar
        navOpen={navOpen}
        activeTab={activeTab}
        t={t}
        navItems={NAV_ITEMS}
        onTabChange={handleTabChange}
      />

      {/* Mobile overlay */}
      {navOpen && <div className="dash-overlay" onClick={() => setNavOpen(false)} />}

      {/* Bottom nav (mobile) */}
      <nav className="dash-bottom-nav">
        {NAV_ITEMS.map(({ id, label, Icon, count }) => (
          <button
            key={id}
            className={`dash-bottom-nav-item${activeTab === id ? " active" : ""}`}
            onClick={() => handleTabChange(id)}
            aria-label={label}
          >
            {count !== undefined && count > 0 && (
              <span className="dash-bottom-nav-badge">{count}</span>
            )}
            <span className="bn-icon-wrap"><Icon size={22} /></span>
            <span>{label}</span>
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
            <div className="dash-notif-wrap">
              <button
                className="dash-icon-btn"
                onClick={() => setNotifOpen((v) => !v)}
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell size={14} />
                {unreadNotifCount > 0 && (
                  <span className="dash-notif-badge">{unreadNotifCount > 9 ? "9+" : unreadNotifCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className="dash-notif-panel">
                  <div className="dash-notif-panel-head">
                    <span className="dash-notif-panel-title">Notifications</span>
                    <button
                      className="dash-notif-mark-read"
                      onClick={markAllNotificationsRead}
                      disabled={unreadNotifCount === 0}
                    >
                      Mark all read
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="dash-notif-empty">No notifications yet.</p>
                  ) : notifications.map((n) => (
                    <div key={n.id} className={`dash-notif-item${n.read ? "" : " unread"}`}>
                      <p className="dash-notif-title-row">{n.title}</p>
                      {n.body && <p className="dash-notif-body">{n.body}</p>}
                      <p className="dash-notif-time">{new Date(n.created_at).toLocaleString("en-GB")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              className="dash-icon-btn"
              onClick={() => setTheme((v) => v === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button className="dash-icon-btn" onClick={toggleLang} aria-label="Switch language" title="Switch language">
              <Globe size={14} />
            </button>
            <div className="dash-profile-wrap">
              <button type="button" className="dash-profile" onClick={() => setProfileMenuOpen((v) => !v)} aria-label="Account menu">
                <span className="dash-avatar">{initials}</span>
                <div>
                  <p className="dash-pname">{displayName}</p>
                  <p className="dash-pmail">{user?.email ?? ""}</p>
                </div>
              </button>
              {profileMenuOpen && (
                <div className="dash-profile-menu">
                  <button
                    type="button"
                    className="dash-profile-menu-item"
                    onClick={() => { setProfileMenuOpen(false); handleTabChange("profile"); }}
                  >
                    <User size={14} /> Profile
                  </button>
                  <button
                    type="button"
                    className="dash-profile-menu-item"
                    onClick={() => { setProfileMenuOpen(false); handleLogout(); }}
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="dash-content">
          {loading ? (
            <>
              {/* Skeleton hero */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                <div className="sk-block" style={{ width: 64, height: 64, borderRadius: "50%", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="sk-block sk-title" style={{ marginBottom: 8 }} />
                  <div className="sk-block sk-sub" />
                </div>
              </div>
              {/* Skeleton stats */}
              <div className="dash-stats" style={{ marginBottom: 28 }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="sk-stat">
                    <div className="sk-block sk-stat-icon" />
                    <div style={{ flex: 1 }}>
                      <div className="sk-block sk-stat-num" />
                      <div className="sk-block sk-stat-lbl" />
                    </div>
                  </div>
                ))}
              </div>
              {/* Skeleton cards */}
              <div className="dash-grid">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="sk-card">
                    <div className="sk-block sk-thumb" />
                    <div className="sk-body">
                      <div className="sk-block sk-sub" />
                      <div className="sk-block sk-title" />
                      <div className="sk-block sk-sub" />
                      <div className="sk-block sk-bar" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {activeTab === "overview" && (
                <OverviewTab
                  displayName={displayName}
                  initials={initials}
                  avatarUrl={profileAvatarUrl}
                  myTrainings={myTrainings}
                  enrollments={enrollments}
                  totalCompleted={totalCompleted}
                  overallPct={overallPct}
                  finishedCount={finishedCount}
                  habits={overviewHabits}
                  habitsCheckedToday={habitsCheckedToday}
                  longestStreak={longestStreak}
                  blogsReadCount={readPostIds.size}
                  available={available}
                  t={t}
                  onTabChange={handleTabChange}
                />
              )}
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
              {activeTab === "blogs" && (
                <BlogsTab
                  posts={blogPosts}
                  readPostIds={readPostIds}
                  userId={user?.id ?? null}
                  t={t}
                  onMarkRead={(postId) => setReadPostIds((prev) => new Set(prev).add(postId))}
                />
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
                  initialName={profileName}
                  initialAvatarUrl={profileAvatarUrl}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
