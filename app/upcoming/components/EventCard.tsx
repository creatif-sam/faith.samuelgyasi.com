"use client";

import { useState } from "react";
import { type UpcomingEvent, displayDate, FORMAT_LABEL } from "./types";
import { RegisterModal } from "./RegisterModal";
import { RecordingModal } from "./RecordingModal";
import { Countdown } from "./Countdown";

interface EventCardProps {
  item: UpcomingEvent;
  delay: number;
  isPastEvent: boolean;
}

export function EventCard({ item, delay, isPastEvent }: EventCardProps) {
  const [regOpen, setRegOpen] = useState(false);
  const [recOpen, setRecOpen] = useState(false);

  return (
    <>
      <div
        className={`up-card${isPastEvent ? " up-card--past" : ""}`}
        style={{ transitionDelay: `${delay}s` }}
      >
        {/* Flyer */}
        {item.flyer_url && (
          <div className="up-card-flyer">
            <img src={item.flyer_url} alt={item.title} className="up-card-flyer-img" />
            {isPastEvent && <div className="up-card-past-badge">Past Event</div>}
          </div>
        )}
        {!item.flyer_url && isPastEvent && (
          <div className="up-card-past-badge up-card-past-badge--inline">Past Event</div>
        )}

        <div className="up-card-body-wrap">
          <div className="up-card-meta-row">
            <div className="up-card-date">{displayDate(item)}</div>
            <div className={`up-card-format up-card-format--${item.format}`}>
              {FORMAT_LABEL[item.format] ?? item.format}
            </div>
          </div>

          {item.tag && <div className="up-card-tag">{item.tag}</div>}
          <div className="up-card-title">{item.title}</div>
          {item.description && <div className="up-card-desc">{item.description}</div>}
          {item.location && <div className="up-card-location">{item.location}</div>}
          {item.host_name && (
            <div className="up-card-host">
              Hosted by{" "}
              {item.host_url ? (
                <a
                  href={item.host_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="up-card-host-link"
                >
                  {item.host_name}
                </a>
              ) : (
                <span>{item.host_name}</span>
              )}
            </div>
          )}

          {/* Countdown Timer — only for upcoming events with a date */}
          {!isPastEvent && item.event_date && <Countdown eventDate={item.event_date} />}

          {/* CTA buttons — only for upcoming events */}
          {!isPastEvent && (
            <div className="up-card-actions">
              {item.needs_registration && (
                <button className="up-btn up-btn--gold" onClick={() => setRegOpen(true)}>
                  Register Now
                </button>
              )}
              {(item.format === "online" || item.format === "both") && item.join_url && (
                <a
                  href={item.join_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="up-btn up-btn--outline"
                >
                  Join Us →
                </a>
              )}
              {item.facebook_url && (
                <a
                  href={item.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="up-btn up-btn--ghost"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ marginRight: 5, flexShrink: 0 }}
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
              )}
            </div>
          )}

          {/* Recording signup — shown for both upcoming and past */}
          {item.recording_signup && (
            <button className="up-btn up-btn--rec" onClick={() => setRecOpen(true)}>
              ✦ Get recording / transcription
            </button>
          )}
        </div>
      </div>

      {regOpen && <RegisterModal event={item} onClose={() => setRegOpen(false)} />}
      {recOpen && <RecordingModal event={item} onClose={() => setRecOpen(false)} />}
    </>
  );
}
