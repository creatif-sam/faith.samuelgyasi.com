"use client";
import Link from "next/link";
import {
  GraduationCap, CheckCircle2, TrendingUp, Award,
  Flame, BookOpen, ArrowRight, Sparkles, Newspaper, Circle, CheckCircle, Hand,
} from "lucide-react";
import type { Training, EnrollmentWithProgress, SpiritualHabit } from "../types";
import type { Translations } from "../translations";

interface OverviewTabProps {
  displayName: string;
  initials: string;
  avatarUrl: string | null;
  myTrainings: Training[];
  enrollments: EnrollmentWithProgress[];
  totalCompleted: number;
  overallPct: number;
  finishedCount: number;
  habits: SpiritualHabit[];
  habitsCheckedToday: number;
  longestStreak: number;
  blogsReadCount: number;
  available: Training[];
  journalCount: number;
  t: Translations;
  onTabChange: (tab: import("../types").DashTab) => void;
}

export default function OverviewTab({
  displayName,
  initials,
  avatarUrl,
  myTrainings,
  enrollments,
  totalCompleted,
  overallPct,
  finishedCount,
  habits,
  habitsCheckedToday,
  longestStreak,
  blogsReadCount,
  available,
  journalCount,
  t,
  onTabChange,
}: OverviewTabProps) {
  const recentTrainings = myTrainings.slice(0, 3);
  const suggestedTrainings = available.slice(0, 2);

  const onboardingSteps = [
    { done: habits.length > 0, label: t.onboardingHabit, tab: "habits" as const },
    { done: myTrainings.length > 0, label: t.onboardingTraining, tab: "browse" as const },
    { done: journalCount > 0, label: t.onboardingJournal, tab: "growth" as const },
  ];
  const showOnboarding = onboardingSteps.some((s) => !s.done);

  return (
    <>
      {showOnboarding && (
        <div className="ob-checklist">
          <div className="ob-checklist-title">{t.onboardingTitle}</div>
          <div className="ob-steps">
            {onboardingSteps.map((step) => (
              <button
                key={step.tab}
                type="button"
                className={`ob-step${step.done ? " done" : ""}`}
                onClick={() => onTabChange(step.tab)}
                disabled={step.done}
              >
                {step.done ? <CheckCircle size={15} /> : <Circle size={15} />}
                <span>{step.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Welcome hero */}
      <div className="ov-hero">
        <div className="ov-hero-avatar">
          {avatarUrl
            ? <img src={avatarUrl} alt={displayName} className="ov-hero-avatar-img" />
            : <span>{initials}</span>
          }
        </div>
        <div>
          <h1 className="ov-hero-greeting">
            {t.overviewGreeting}, <span className="ov-hero-name">{displayName}</span>{" "}
            <Hand size={22} style={{ display: "inline", verticalAlign: "-3px", color: "#546cfa" }} />
          </h1>
          <p className="ov-hero-sub">{t.overviewSub}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="dash-stats" style={{ marginBottom: 28 }}>
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
            <div className="dash-stat-lbl">{t.statsCompleted} {t.lessons}</div>
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
        <div className="dash-stat">
          <div className="dash-stat-icon" style={{ background: "rgba(249,115,22,.1)", color: "#f97316" }}>
            <Flame size={20} />
          </div>
          <div>
            <div className="dash-stat-num">{habitsCheckedToday}/{habits.length}</div>
            <div className="dash-stat-lbl">{t.overviewHabitsToday}</div>
          </div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon" style={{ background: "rgba(234,179,8,.1)", color: "#eab308" }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div className="dash-stat-num">{longestStreak}</div>
            <div className="dash-stat-lbl">{t.overviewStreak}</div>
          </div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon" style={{ background: "rgba(56,189,248,.1)", color: "#38bdf8" }}>
            <Newspaper size={20} />
          </div>
          <div>
            <div className="dash-stat-num">{blogsReadCount}</div>
            <div className="dash-stat-lbl">{t.statsBlogsRead}</div>
          </div>
        </div>
      </div>

      {/* In-progress trainings */}
      {recentTrainings.length > 0 && (
        <>
          <div className="dash-section-head">
            <GraduationCap size={13} /> {t.overviewInProgress} ({myTrainings.length})
            <button className="ov-see-all" onClick={() => onTabChange("my-trainings")}>
              {t.overviewSeeAll} <ArrowRight size={11} />
            </button>
          </div>
          <div className="dash-grid" style={{ marginBottom: 32 }}>
            {recentTrainings.map((tr) => {
              const enr = enrollments.find((e) => e.training_id === tr.id);
              const completed = enr?.completedCount ?? 0;
              const total = tr.total_lessons ?? 0;
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
              return (
                <Link key={tr.id} href={`/dashboard/training/${tr.id}`} className="dash-card">
                  <div className="dash-card-thumb">
                    {tr.thumbnail_url
                      ? <img src={tr.thumbnail_url} alt={tr.title} />
                      : <GraduationCap size={40} className="dash-card-placeholder" />}
                  </div>
                  <div className="dash-card-body">
                    <div className="dash-card-cat">{tr.category}</div>
                    <div className="dash-card-title">{tr.title}</div>
                    <div className="dash-card-meta">
                      <span>{completed}/{total} {t.lessons}</span>
                      <span>{pct}% {t.complete}</span>
                    </div>
                    <div className="dash-progress-label">
                      <span>{t.statsProgress}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="dash-progress-bar">
                      <div className="dash-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* Habits today */}
      {habits.length > 0 && (
        <>
          <div className="dash-section-head">
            <Flame size={13} /> {t.overviewHabitsSection}
            <button className="ov-see-all" onClick={() => onTabChange("habits")}>
              {t.overviewSeeAll} <ArrowRight size={11} />
            </button>
          </div>
          <div className="ov-habits-row" style={{ marginBottom: 32 }}>
            {habits.map((h) => (
              <div key={h.id} className={`ov-habit-chip${habitsCheckedToday > 0 ? " done" : ""}`}>
                <span className="ov-habit-icon">{h.icon}</span>
                <span className="ov-habit-name">{h.name}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Suggested trainings */}
      {suggestedTrainings.length > 0 && (
        <>
          <div className="dash-section-head">
            <BookOpen size={13} /> {t.overviewSuggested}
            <button className="ov-see-all" onClick={() => onTabChange("browse")}>
              {t.overviewSeeAll} <ArrowRight size={11} />
            </button>
          </div>
          <div className="dash-grid">
            {suggestedTrainings.map((tr) => (
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
                  <button className="dash-btn dash-btn-gold" onClick={() => onTabChange("browse")}>
                    {t.enrollBtn}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
