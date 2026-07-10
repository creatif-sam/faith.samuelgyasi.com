"use client";
import Link from "next/link";
import { GraduationCap, CheckCircle2, TrendingUp, Award, BookOpen, ArrowRight } from "lucide-react";
import type { Training, EnrollmentWithProgress } from "../types";
import type { Translations } from "../translations";

interface MyTrainingsTabProps {
  myTrainings: Training[];
  enrollments: EnrollmentWithProgress[];
  enrollingId: string | null;
  totalCompleted: number;
  overallPct: number;
  finishedCount: number;
  search: string;
  t: Translations;
  filteredMy: Training[];
}

export default function MyTrainingsTab({
  myTrainings,
  enrollments,
  totalCompleted,
  overallPct,
  finishedCount,
  search,
  t,
  filteredMy,
}: MyTrainingsTabProps) {
  return (
    <>
      <div className="dash-page-header">
        <h1 className="dash-page-title">{t.myTrainings}</h1>
        <p className="dash-page-sub">Your enrolled courses and progress at a glance.</p>
      </div>

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
          <div className="dash-empty">
            {search ? `No results for "${search}"` : t.noEnrolled}
          </div>
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
                  <button className="dash-btn dash-btn-enrolled" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    {t.continueBtn} <ArrowRight size={13} />
                  </button>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
