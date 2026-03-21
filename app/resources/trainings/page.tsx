"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { createAnonClient } from "@/lib/supabase/anon";
import { useLang } from "@/lib/i18n";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import Breadcrumbs from "@/components/atoms/Breadcrumbs";

interface Training {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string;
  total_lessons: number;
  sort_order: number;
}

const css = `
.trp {
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  position: relative;
}
.trp > * { position: relative; z-index: 1; }

/* ── HERO ── */
.trp-hero {
  padding: 140px 8% 72px;
  border-bottom: 1px solid rgba(201,168,76,.12);
  max-width: 1100px;
  margin: 0 auto;
}
.trp-eyebrow {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  opacity: 0;
  animation: trp-rise .9s .1s ease forwards;
}
.trp-headline {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: clamp(44px, 7vw, 90px);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: var(--white);
  text-transform: uppercase;
  margin-bottom: 28px;
  opacity: 0;
  animation: trp-rise .9s .25s ease forwards;
}
.trp-headline em {
  font-style: italic;
  font-weight: 400;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
}
.trp-rule {
  width: 56px; height: 2px;
  background: linear-gradient(90deg, #ffde59, #ff914d);
  margin: 24px 0;
  opacity: 0;
  animation: trp-rise .8s .4s ease forwards;
}
.trp-sub {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: clamp(16px,1.8vw,20px);
  font-weight: 300;
  color: rgba(245,243,239,.62);
  max-width: 580px;
  line-height: 1.7;
  opacity: 0;
  animation: trp-rise .9s .5s ease forwards;
}
@keyframes trp-rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}

/* ── GRID ── */
.trp-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 72px 8% 100px;
}
.trp-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.trp-card {
  background: rgba(14,13,11,.9);
  border: 1px solid rgba(201,168,76,.1);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity .65s ease, transform .65s ease, border-color .3s, box-shadow .3s;
}
.trp-card.trp-visible { opacity: 1; transform: none; }
.trp-card:hover { border-color: rgba(201,168,76,.3); box-shadow: 0 8px 32px rgba(0,0,0,.4); }
.trp-card-thumb {
  aspect-ratio: 16/9;
  overflow: hidden;
  background: rgba(20,18,14,1);
  position: relative;
  flex-shrink: 0;
}
.trp-card-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
.trp-card:hover .trp-card-thumb img { transform: scale(1.04); }
.trp-card-thumb-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, rgba(201,168,76,.06), rgba(201,168,76,.02));
  font-size: 40px;
}
.trp-card-body { padding: 24px 24px 28px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
.trp-card-cat {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.trp-card-title {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: clamp(16px, 1.6vw, 20px);
  font-weight: 700;
  color: var(--white);
  line-height: 1.25;
}
.trp-card-desc {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: rgba(245,243,239,.55);
  line-height: 1.75;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.trp-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid rgba(201,168,76,.1);
  margin-top: 4px;
}
.trp-card-lessons {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(245,243,239,.35);
}
.trp-card-cta {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── EMPTY / LOADING ── */
.trp-empty {
  text-align: center;
  padding: 80px 20px;
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 16px;
  font-weight: 300;
  color: rgba(245,243,239,.35);
}

/* ── ENROLL STRIP ── */
.trp-enroll-strip {
  background: rgba(201,168,76,.04);
  border-top: 1px solid rgba(201,168,76,.1);
  border-bottom: 1px solid rgba(201,168,76,.1);
  padding: 64px 8%;
  text-align: center;
}
.trp-enroll-inner { max-width: 540px; margin: 0 auto; }
.trp-enroll-eyebrow {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}
.trp-enroll-h {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: clamp(22px, 3vw, 36px);
  font-weight: 800;
  color: var(--white);
  margin-bottom: 14px;
  line-height: 1.2;
}
.trp-enroll-sub {
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 16px;
  font-weight: 300;
  color: rgba(245,243,239,.45);
  margin-bottom: 32px;
  line-height: 1.6;
}
.trp-enroll-btn {
  display: inline-block;
  font-family: var(--font-poppins),'Poppins',sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 14px 36px;
  background: var(--gold-gradient);
  color: #08080a;
  text-decoration: none;
  transition: opacity .2s, transform .2s;
  border-radius: 2px;
}
.trp-enroll-btn:hover { opacity: .88; transform: translateY(-2px); }

@media (max-width: 900px) {
  .trp-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .trp-hero { padding: 130px 6% 56px; }
  .trp-body { padding: 56px 6% 80px; }
  .trp-grid { grid-template-columns: 1fr; }
}
`;

export default function TrainingsPreviewPage() {
  const { lang } = useLang();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createAnonClient();
    supabase
      .from("trainings")
      .select("id,title,description,thumbnail_url,category,total_lessons,sort_order")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setTrainings(data ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("trp-visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".trp-card").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [trainings]);

  return (
    <>
      <div className="trp">
        <style>{css}</style>

        {/* ── HERO ── */}
        <div className="trp-hero">
          <div style={{ marginBottom: 24 }}>
            <Breadcrumbs
              items={[
                { label: lang === "fr" ? "Accueil" : "Home", href: "/" },
                { label: lang === "fr" ? "Ressources" : "Resources", href: "/resources" },
                { label: lang === "fr" ? "Formations" : "Trainings" },
              ]}
            />
          </div>
          <p className="trp-eyebrow">
            {lang === "en" ? "Samuel Kobina Gyasi · Learning" : "Samuel Kobina Gyasi · Apprentissage"}
          </p>
          <h1 className="trp-headline">
            {lang === "en" ? <>Our<br /><em>Trainings</em></> : <>Nos<br /><em>Formations</em></>}
          </h1>
          <div className="trp-rule" />
          <p className="trp-sub">
            {lang === "en"
              ? "Structured courses on faith, leadership, and personal growth. Each training is designed to take you deeper — equipping you with the knowledge and conviction to lead well and live fully."
              : "Des formations structurées sur la foi, le leadership et la croissance personnelle. Chaque formation est conçue pour vous approfondir — vous équipant des connaissances et de la conviction pour bien diriger et vivre pleinement."}
          </p>
        </div>

        {/* ── TRAINING CARDS ── */}
        <div className="trp-body">
          {loading ? (
            <p className="trp-empty">
              {lang === "fr" ? "Chargement des formations..." : "Loading trainings..."}
            </p>
          ) : trainings.length === 0 ? (
            <p className="trp-empty">
              {lang === "fr" ? "Aucune formation disponible pour le moment." : "No trainings available yet. Check back soon."}
            </p>
          ) : (
            <div className="trp-grid">
              {trainings.map((tr, i) => (
                <Link
                  key={tr.id}
                  href="/auth/login"
                  className="trp-card"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className="trp-card-thumb">
                    {tr.thumbnail_url ? (
                      <img src={tr.thumbnail_url} alt={tr.title} />
                    ) : (
                      <div className="trp-card-thumb-placeholder">🎓</div>
                    )}
                  </div>
                  <div className="trp-card-body">
                    <span className="trp-card-cat">{tr.category}</span>
                    <h2 className="trp-card-title">{tr.title}</h2>
                    {tr.description && (
                      <p className="trp-card-desc">{tr.description}</p>
                    )}
                    <div className="trp-card-footer">
                      <span className="trp-card-lessons">
                        {tr.total_lessons} {lang === "fr" ? "leçon(s)" : "lesson(s)"}
                      </span>
                      <span className="trp-card-cta">
                        {lang === "fr" ? "En savoir plus →" : "Learn more →"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── ENROLL CTA STRIP ── */}
        <div className="trp-enroll-strip">
          <div className="trp-enroll-inner">
            <p className="trp-enroll-eyebrow">
              {lang === "fr" ? "Commencer" : "Get Started"}
            </p>
            <h2 className="trp-enroll-h">
              {lang === "en" ? "Ready to Grow?" : "Prêt à Grandir ?"}
            </h2>
            <p className="trp-enroll-sub">
              {lang === "en"
                ? "Sign in to access the full training content, track your progress, and join a community of learners on the same journey."
                : "Connectez-vous pour accéder au contenu complet des formations, suivre votre progression et rejoindre une communauté d'apprenants sur le même chemin."}
            </p>
            <Link href="/auth/login" className="trp-enroll-btn">
              {lang === "en" ? "Sign in to Enroll" : "Se connecter pour s'inscrire"}
            </Link>
          </div>
        </div>
      </div>
      <Suspense fallback={null}><SiteFooter /></Suspense>
    </>
  );
}
