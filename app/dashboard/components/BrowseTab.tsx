"use client";
import { BookOpen } from "lucide-react";
import type { Training } from "../types";
import type { Translations } from "../translations";

interface BrowseTabProps {
  filteredAvail: Training[];
  enrollingId: string | null;
  search: string;
  t: Translations;
  onEnroll: (id: string) => Promise<void>;
}

export default function BrowseTab({
  filteredAvail,
  enrollingId,
  search,
  t,
  onEnroll,
}: BrowseTabProps) {
  return (
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
          <div className="dash-empty">
            {search ? `No results for "${search}"` : t.noAvailable}
          </div>
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
                  onClick={() => onEnroll(tr.id)}
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
  );
}
