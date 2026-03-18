"use client";

import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { createClient } from "@/lib/supabase/client";

const css = `
.up-pg {
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  position: relative;
}
.up-pg::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(ellipse at 20% 40%, rgba(201,168,76,.04) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 10%, rgba(201,168,76,.03) 0%, transparent 55%);
  pointer-events: none;
  z-index: 0;
}
.up-pg > * { position: relative; z-index: 1; }

/* ── HERO ── */
.up-hero {
  padding: 140px 8% 80px;
  border-bottom: 1px solid rgba(201,168,76,.12);
  max-width: 1100px;
  margin: 0 auto;
}
.up-eyebrow {
  font-family: var(--font-space-mono),'Space Mono',monospace;
  font-size: 10px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  opacity: 0;
  animation: up-rise .8s .1s ease forwards;
}
.up-headline {
  font-family: var(--font-playfair),'Playfair Display',serif;
  font-size: clamp(52px,8vw,110px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  margin-bottom: 28px;
  opacity: 0;
  animation: up-rise .85s .24s ease forwards;
}
.up-headline em {
  display: block;
  font-style: italic;
  font-weight: 400;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.up-rule {
  width: 56px; height: 2px;
  background: var(--gold-gradient);
  margin: 20px 0 28px;
  opacity: 0;
  animation: up-rise .8s .36s ease forwards;
}
.up-sub {
  font-family: var(--font-cormorant),'Cormorant Garamond',serif;
  font-size: clamp(17px,2vw,21px);
  font-style: italic;
  color: rgba(245,243,239,.6);
  max-width: 560px;
  line-height: 1.7;
  opacity: 0;
  animation: up-rise .8s .48s ease forwards;
}
@keyframes up-rise {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: none; }
}

/* ── SECTION ANCHOR LABELS ── */
.up-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 8% 100px;
}
.up-section {
  padding-top: 80px;
  border-top: 1px solid rgba(201,168,76,.1);
  margin-top: 60px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity .65s ease, transform .65s ease;
}
.up-section:first-child { border-top: none; }
.up-section.up-visible { opacity: 1; transform: none; }

.up-section-label {
  font-family: var(--font-space-mono),'Space Mono',monospace;
  font-size: 9px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}
.up-section-title {
  font-family: var(--font-playfair),'Playfair Display',serif;
  font-size: clamp(28px,4vw,52px);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--white);
  margin-bottom: 48px;
}

/* ── EVENT CARDS ── */
.up-cards {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 2px;
}
.up-card {
  padding: 36px;
  background: rgba(245,243,239,.02);
  border: 1px solid rgba(201,168,76,.1);
  transition: border-color .25s, background .25s;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity .55s ease, transform .55s ease, border-color .25s, background .25s;
}
.up-card.up-visible { opacity: 1; transform: none; }
.up-card:hover { border-color: rgba(201,168,76,.28); background: rgba(245,243,239,.04); }

.up-card-date {
  font-family: var(--font-space-mono),'Space Mono',monospace;
  font-size: 9px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 14px;
}
.up-card-tag {
  display: inline-block;
  font-family: var(--font-space-mono),'Space Mono',monospace;
  font-size: 8px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 4px 10px;
  border: 1px solid rgba(201,168,76,.3);
  color: rgba(201,168,76,.7);
  margin-bottom: 18px;
}
.up-card-title {
  font-family: var(--font-playfair),'Playfair Display',serif;
  font-size: clamp(16px,1.8vw,20px);
  font-weight: 700;
  color: var(--white);
  line-height: 1.3;
  margin-bottom: 12px;
}
.up-card-body {
  font-family: var(--font-cormorant),'Cormorant Garamond',serif;
  font-size: 15px;
  font-style: italic;
  line-height: 1.8;
  color: rgba(245,243,239,.5);
  margin-bottom: 20px;
}
.up-card-location {
  font-family: var(--font-space-mono),'Space Mono',monospace;
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(245,243,239,.3);
}
.up-card-location::before { content: '◎ '; }

/* empty state */
.up-coming-soon {
  grid-column: 1/-1;
  padding: 60px 40px;
  text-align: center;
  border: 1px dashed rgba(201,168,76,.15);
}
.up-coming-soon-icon {
  font-size: 28px;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  animation: up-pulse 4s ease-in-out infinite;
}
@keyframes up-pulse { 0%,100%{opacity:.3;} 50%{opacity:.7;} }
.up-coming-soon p {
  font-family: var(--font-cormorant),'Cormorant Garamond',serif;
  font-size: 18px;
  font-style: italic;
  color: rgba(245,243,239,.3);
}

/* ── NOTIFY STRIP ── */
.up-notify {
  background: rgba(201,168,76,.04);
  border-top: 1px solid rgba(201,168,76,.12);
  border-bottom: 1px solid rgba(201,168,76,.12);
  padding: 72px 8%;
  text-align: center;
}
.up-notify-inner { max-width: 560px; margin: 0 auto; }
.up-notify-eyebrow {
  font-family: var(--font-space-mono),'Space Mono',monospace;
  font-size: 9px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 18px;
}
.up-notify-h {
  font-family: var(--font-playfair),'Playfair Display',serif;
  font-size: clamp(22px,3vw,36px);
  font-style: italic;
  color: var(--white);
  margin-bottom: 14px;
  line-height: 1.2;
}
.up-notify-sub {
  font-family: var(--font-cormorant),'Cormorant Garamond',serif;
  font-size: 18px;
  font-style: italic;
  color: rgba(245,243,239,.45);
  margin-bottom: 32px;
  line-height: 1.6;
}
.up-notify-btn {
  display: inline-block;
  font-family: var(--font-space-mono),'Space Mono',monospace;
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  padding: 13px 30px;
  border: 1px solid rgba(201,168,76,.55);
  color: rgba(201,168,76,.85);
  text-decoration: none;
  transition: all .2s;
}
.up-notify-btn:hover {
  background: rgba(201,168,76,.08);
  border-color: rgba(201,168,76,.9);
  color: #fff;
}

@media(max-width:900px) {
  .up-cards { grid-template-columns: 1fr 1fr; }
}
@media(max-width:600px) {
  .up-hero { padding: 130px 6% 60px; }
  .up-body { padding: 0 6% 80px; }
  .up-notify { padding: 60px 6%; }
  .up-cards { grid-template-columns: 1fr; }
}
`;

/* ── types ── */
interface UpcomingEvent {
  id: string;
  title: string;
  description: string | null;
  date_text: string | null;
  location: string | null;
  tag: string | null;
  category: "intervention" | "masterclass" | "session";
}

function EventCard({ item, delay }: { item: UpcomingEvent; delay: number }) {
  return (
    <div className="up-card" style={{ transitionDelay: `${delay}s` }}>
      <div className="up-card-date">{item.date_text ?? "Coming Soon"}</div>
      {item.tag && <div className="up-card-tag">{item.tag}</div>}
      <div className="up-card-title">{item.title}</div>
      {item.description && <div className="up-card-body">{item.description}</div>}
      {item.location && <div className="up-card-location">{item.location}</div>}
    </div>
  );
}

function EmptySlot({ label }: { label: string }) {
  return (
    <div className="up-coming-soon">
      <div className="up-coming-soon-icon">◆</div>
      <p>No {label} announced yet — check back soon.</p>
    </div>
  );
}

export default function UpcomingPage() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    const db = createClient();
    db.from("upcoming_events")
      .select("id,title,description,date_text,location,tag,category")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setEvents(data); });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("up-visible"); }),
      { threshold: 0.06 }
    );
    document.querySelectorAll(".up-section, .up-card").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [events]);

  const interventions = events.filter((e) => e.category === "intervention");
  const masterclasses = events.filter((e) => e.category === "masterclass");
  const sessions      = events.filter((e) => e.category === "session");

  return (
    <>
      <div className="up-pg">
        <style>{css}</style>

        {/* HERO */}
        <div className="up-hero">
          <p className="up-eyebrow">Samuel Kobina Gyasi · What's Next</p>
          <h1 className="up-headline">
            Up<br /><em>coming</em>
          </h1>
          <div className="up-rule" />
          <p className="up-sub">
            Interventions, masterclasses, and facilitated sessions — spaces where
            ideas become action and individuals become collectives.
          </p>
        </div>

        {/* SECTIONS */}
        <div className="up-body">

          {/* INTERVENTIONS */}
          <div id="interventions" className="up-section">
            <p className="up-section-label">01 · Engagements</p>
            <h2 className="up-section-title">Interventions</h2>
            <div className="up-cards">
              {interventions.length > 0
                ? interventions.map((item, i) => <EventCard key={item.id} item={item} delay={i * 0.1} />)
                : <EmptySlot label="interventions" />}
            </div>
          </div>

          {/* MASTERCLASS */}
          <div id="masterclass" className="up-section">
            <p className="up-section-label">02 · Deep Learning</p>
            <h2 className="up-section-title">Masterclass</h2>
            <div className="up-cards">
              {masterclasses.length > 0
                ? masterclasses.map((item, i) => <EventCard key={item.id} item={item} delay={i * 0.1} />)
                : <EmptySlot label="masterclasses" />}
            </div>
          </div>

          {/* SESSIONS */}
          <div id="sessions" className="up-section">
            <p className="up-section-label">03 · Open Conversations</p>
            <h2 className="up-section-title">Sessions</h2>
            <div className="up-cards">
              {sessions.length > 0
                ? sessions.map((item, i) => <EventCard key={item.id} item={item} delay={i * 0.1} />)
                : <EmptySlot label="sessions" />}
            </div>
          </div>

        </div>

        {/* NOTIFY CTA */}
        <section className="up-notify">
          <div className="up-notify-inner">
            <p className="up-notify-eyebrow">Stay Informed</p>
            <h2 className="up-notify-h">Don&rsquo;t miss the next event.</h2>
            <p className="up-notify-sub">
              Get notified when a new intervention, masterclass, or session is announced.
            </p>
            <a href="mailto:impact@samuelgyasi.com?subject=Notify me of upcoming events" className="up-notify-btn">
              Notify Me
            </a>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
