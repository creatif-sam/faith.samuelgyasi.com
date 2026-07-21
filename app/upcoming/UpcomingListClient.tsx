"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { type UpcomingEvent, isPast } from "./components/types";
import { upcomingStyles } from "./components/styles";
import { EventCard } from "./components/EventCard";
import { EmptySlot } from "./components/EmptySlot";
import { NotifySection } from "./components/NotifySection";
import { ReserveModal } from "./components/ReserveModal";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { useLang } from "@/lib/i18n";
import { upcomingTranslations as t } from "./translations";

export default function UpcomingListClient({ initialEvents }: { initialEvents: UpcomingEvent[] }) {
  const { lang } = useLang();
  const [events, setEvents] = useState<UpcomingEvent[]>(initialEvents);
  const [showReserve, setShowReserve] = useState(false);

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
      {showReserve && <ReserveModal onClose={() => setShowReserve(false)} />}
      <div className="up-pg">
        <style>{upcomingStyles}</style>

        {/* HERO */}
        <div className="up-hero">
          <h1 className="up-headline">
            Up<br /><em>coming</em>
          </h1>
          <div className="up-rule" />
          <p className="up-sub">{t.hero.sub[lang]}</p>
          <div className="up-hero-actions">
            <button className="up-btn up-btn--gold up-hero-reserve-btn" onClick={() => setShowReserve(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {t.hero.reserveBtn[lang]} <ArrowRight size={14} />
            </button>
            <p className="up-hero-reserve-hint">{t.hero.reserveHint[lang]}</p>
          </div>
        </div>

        {/* SECTIONS */}
        <div className="up-body">
          {upInterventions.length > 0 && (
            <div id="interventions" className="up-section">
              <p className="up-section-label">{t.sections.label1[lang]}</p>
              <h2 className="up-section-title">{t.sections.title1[lang]}</h2>
              <div className="up-cards">
                {upInterventions.map((item, i) => (
                  <EventCard key={item.id} item={item} delay={i * 0.08} isPastEvent={false} />
                ))}
              </div>
            </div>
          )}

          {upMasterclasses.length > 0 && (
            <div id="masterclass" className="up-section">
              <p className="up-section-label">{t.sections.label2[lang]}</p>
              <h2 className="up-section-title">{t.sections.title2[lang]}</h2>
              <div className="up-cards">
                {upMasterclasses.map((item, i) => (
                  <EventCard key={item.id} item={item} delay={i * 0.08} isPastEvent={false} />
                ))}
              </div>
            </div>
          )}

          {upSessions.length > 0 && (
            <div id="sessions" className="up-section">
              <p className="up-section-label">{t.sections.label3[lang]}</p>
              <h2 className="up-section-title">{t.sections.title3[lang]}</h2>
              <div className="up-cards">
                {upSessions.map((item, i) => (
                  <EventCard key={item.id} item={item} delay={i * 0.08} isPastEvent={false} />
                ))}
              </div>
            </div>
          )}

          {upcoming.length === 0 && (
            <div className="up-section">
              <EmptySlot label={t.empty.upcoming[lang]} />
            </div>
          )}

          {/* PAST EVENTS */}
          {past.length > 0 && (
            <div className="up-section up-section--past">
              <p className="up-section-label">{t.sections.pastLabel[lang]}</p>
              <h2 className="up-section-title up-section-title--past">{t.sections.pastTitle[lang]}</h2>
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
