"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { type UpcomingEvent, isPast } from "./components/types";
import { upcomingStyles } from "./components/styles";
import { EventCard } from "./components/EventCard";
import { EmptySlot } from "./components/EmptySlot";
import { NotifySection } from "./components/NotifySection";
import { SiteFooter } from "@/components/organisms/SiteFooter";

export default function UpcomingPage() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    const db = createClient();
    db.from("upcoming_events")
      .select(
        "id,title,description,date_text,event_date,location,tag,category,format,needs_registration,join_url,facebook_url,host_name,host_url,flyer_url,recording_signup"
      )
      .eq("published", true)
      .then(({ data }) => {
        if (data) setEvents(data as UpcomingEvent[]);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("up-visible"); }),
      { threshold: 0.05 }
    );
    document.querySelectorAll(".up-section, .up-card").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [events]);

  // Sort: upcoming (soonest first), then past (most recent first)
  const upcoming = events
    .filter((e) => !isPast(e))
    .sort((a, b) => {
      if (!a.event_date && !b.event_date) return 0;
      if (!a.event_date) return 1;
      if (!b.event_date) return -1;
      return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
    });
  const past = events
    .filter((e) => isPast(e))
    .sort((a, b) => new Date(b.event_date!).getTime() - new Date(a.event_date!).getTime());

  const upInterventions = upcoming.filter((e) => e.category === "intervention");
  const upMasterclasses = upcoming.filter((e) => e.category === "masterclass");
  const upSessions = upcoming.filter((e) => e.category === "session");

  return (
    <>
      <div className="up-pg">
        <style>{upcomingStyles}</style>

        {/* HERO */}
        <div className="up-hero">
          <p className="up-eyebrow">Samuel Kobina Gyasi · What's Next</p>
          <h1 className="up-headline">
            Up<br /><em>coming</em>
          </h1>
          <div className="up-rule" />
          <p className="up-sub">
            Interventions, masterclasses, and facilitated sessions — spaces where ideas become
            action and individuals become collectives.
          </p>
        </div>

        {/* SECTIONS */}
        <div className="up-body">
          {upInterventions.length > 0 && (
            <div id="interventions" className="up-section">
              <p className="up-section-label">01 · Engagements</p>
              <h2 className="up-section-title">Interventions</h2>
              <div className="up-cards">
                {upInterventions.map((item, i) => (
                  <EventCard key={item.id} item={item} delay={i * 0.08} isPastEvent={false} />
                ))}
              </div>
            </div>
          )}

          {upMasterclasses.length > 0 && (
            <div id="masterclass" className="up-section">
              <p className="up-section-label">02 · Deep Learning</p>
              <h2 className="up-section-title">Masterclass</h2>
              <div className="up-cards">
                {upMasterclasses.map((item, i) => (
                  <EventCard key={item.id} item={item} delay={i * 0.08} isPastEvent={false} />
                ))}
              </div>
            </div>
          )}

          {upSessions.length > 0 && (
            <div id="sessions" className="up-section">
              <p className="up-section-label">03 · Open Conversations</p>
              <h2 className="up-section-title">Sessions</h2>
              <div className="up-cards">
                {upSessions.map((item, i) => (
                  <EventCard key={item.id} item={item} delay={i * 0.08} isPastEvent={false} />
                ))}
              </div>
            </div>
          )}

          {upcoming.length === 0 && (
            <div className="up-section">
              <EmptySlot label="upcoming events" />
            </div>
          )}

          {/* PAST EVENTS */}
          {past.length > 0 && (
            <div className="up-section up-section--past">
              <p className="up-section-label">Past Events</p>
              <h2 className="up-section-title up-section-title--past">Recent Gatherings</h2>
              <div className="up-cards up-cards--past">
                {past.map((item, i) => (
                  <EventCard key={item.id} item={item} delay={i * 0.06} isPastEvent={true} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* NOTIFY CTA */}
        <NotifySection />
      </div>

      {/* FOOTER */}
      <SiteFooter />
    </>
  );
}
