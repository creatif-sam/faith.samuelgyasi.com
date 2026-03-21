"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n";

type Lang = "en" | "fr";

interface MyStoryContent {
  id: string;
  title_en: string;
  title_fr: string;
  content_en: string;
  content_fr: string;
  images: string[];
  updated_at: string;
  created_at: string;
}

const css = `
.msp {
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}
.msp::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('/mystorybackground.jpg');
  background-size: cover;
  background-position: center top;
  background-attachment: fixed;
  opacity: 0.96;
  background-color: rgba(0, 0, 0, 0.96);
  background-blend-mode: multiply;
  pointer-events: none;
  z-index: 0;
}
.msp > * { position: relative; z-index: 1; }

.msp-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
.msp-particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,.3) 0%, transparent 70%);
  animation: msp-float linear infinite;
}
@keyframes msp-float {
  0%   { transform: translateY(0) scale(1);   opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: .5; }
  100% { transform: translateY(-110px) scale(1.25); opacity: 0; }
}
.msp-hero-glow {
  position: absolute;
  top: 50%; left: -80px;
  transform: translateY(-50%);
  width: 440px; height: 440px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,.07) 0%, transparent 70%);
  pointer-events: none;
  animation: msp-glow-pulse 7s ease-in-out infinite;
}
@keyframes msp-glow-pulse {
  0%,100% { transform: translateY(-50%) scale(1);    opacity: .6; }
  50%      { transform: translateY(-50%) scale(1.18); opacity: 1; }
}
.msp-hero {
  position: relative;
  padding: 140px 8% 90px;
  border-bottom: 1px solid rgba(201,168,76,.18);
  max-width: 1100px;
  margin: 0 auto;
  overflow: hidden;
}
.msp-hero-eyebrow {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  animation: msp-rise .8s .15s ease both;
}
.msp-hero-headline {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(52px,8vw,108px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  margin-bottom: 30px;
  animation: msp-rise .85s .28s ease both;
  position: relative;
}
.msp-hero-headline::after {
  content: '';
  display: block;
  width: 0;
  height: 2px;
  background: var(--gold-gradient);
  margin-top: 10px;
  animation: msp-underline 1.2s .9s ease forwards;
}
@keyframes msp-underline { to { width: 80px; } }
.msp-hl-gold {
  display: block;
  font-style: italic;
  font-weight: 400;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.msp-hero-rule {
  width: 56px; height: 2px;
  background: var(--gold-gradient);
  margin: 20px 0 28px;
  animation: msp-rise .8s .44s ease both;
}
.msp-hero-sub {
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-size: clamp(17px, 2vw, 21px);
  font-style: italic;
  color: rgba(245,243,239,.65);
  max-width: 560px;
  line-height: 1.7;
  animation: msp-rise .8s .58s ease both;
}
@keyframes msp-rise {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: none; }
}

/* ── PHOTO MOSAIC ── */
.msp-mosaic {
  width: 100%;
  padding: 100px 8% 0;
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.msp-mosaic-label {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px; letter-spacing: .32em; text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  margin-bottom: 18px;
  opacity: 0; animation: msp-rise .7s .05s ease both;
}
.msp-mosaic-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 240px 240px;
  gap: 10px;
  border-radius: 10px;
  overflow: hidden;
}
.msp-photo {
  overflow: hidden;
  position: relative;
  opacity: 0;
  transform: scale(0.97) translateY(14px);
  animation: msp-photo-in .85s ease both;
}
@keyframes msp-photo-in {
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.msp-photo img {
  width: 100%; height: 100%; 
  object-fit: cover;
  object-position: top center;
  transition: transform .7s ease;
  display: block;
}
.msp-photo:hover img { transform: scale(1.07); }
.msp-photo::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(160deg, transparent 55%, rgba(0,0,0,.35));
  pointer-events: none;
}
/* Layouting: p1 large left (row 1+2, col 1+2), p2 top col3, p3 top col4, p4 bottom col3, p5 bottom col4 */
.msp-photo--1 { grid-column: 1 / 3; grid-row: 1 / 3; animation-delay: .1s; }
.msp-photo--2 { grid-column: 3; grid-row: 1;    animation-delay: .22s; }
.msp-photo--3 { grid-column: 4; grid-row: 1;    animation-delay: .34s; }
.msp-photo--4 { grid-column: 3; grid-row: 2;    animation-delay: .46s; }
.msp-photo--5 { grid-column: 4; grid-row: 2;    animation-delay: .58s; }

@media (max-width: 768px) {
  .msp-mosaic { padding: 90px 6% 0; }
  .msp-mosaic-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 180px 120px 120px;
  }
  .msp-photo--1 { grid-column: 1 / 3; grid-row: 1; }
  .msp-photo--2 { grid-column: 1; grid-row: 2; }
  .msp-photo--3 { grid-column: 2; grid-row: 2; }
  .msp-photo--4 { grid-column: 1; grid-row: 3; }
  .msp-photo--5 { grid-column: 2; grid-row: 3; }
}
.msp-section {
  padding: 80px 8% 100px;
  max-width: 1100px;
  margin: 0 auto;
}

/* ── PUBLIC NARRATIVE ── */
.msp-narrative {
  padding: 72px 8%;
  max-width: 1100px;
  margin: 0 auto;
  border-bottom: 1px solid rgba(201,168,76,.12);
}
.msp-narrative-eyebrow {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
}
.msp-narrative-heading {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(22px, 3vw, 36px);
  font-weight: 700;
  color: var(--white);
  line-height: 1.2;
  margin-bottom: 24px;
}
.msp-narrative-lead {
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-size: clamp(17px, 1.9vw, 20px);
  font-style: italic;
  color: rgba(245,243,239,.72);
  line-height: 1.75;
  max-width: 780px;
  margin-bottom: 48px;
}
.msp-three-acts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-top: 16px;
}
.msp-act {
  border-top: 2px solid rgba(201,168,76,.45);
  padding-top: 20px;
}
.msp-act-num {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.28em;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}
.msp-act-title {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(16px, 1.8vw, 20px);
  font-weight: 700;
  color: var(--white);
  margin-bottom: 10px;
}
.msp-act-body {
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-size: 15px;
  font-style: italic;
  line-height: 1.8;
  color: rgba(245,243,239,.6);
}
@media (max-width: 768px) {
  .msp-narrative { padding: 56px 6%; }
  .msp-three-acts { grid-template-columns: 1fr; gap: 24px; }
}

.msp-timeline {
  position: relative;
  padding-left: 0;
}
.msp-timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 16px;
  bottom: 16px;
  width: 1px;
  background: rgba(201,168,76,.25);
}
.msp-item {
  display: flex;
  gap: 0;
  margin-bottom: 64px;
  position: relative;
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
.msp-item.msp-visible { opacity: 1; transform: none; }
.msp-dot-col {
  position: relative;
  flex-shrink: 0;
  width: 44px;
  padding-top: 4px;
}
.msp-dot {
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--black);
  border: 2px solid rgba(201,168,76,.55);
  position: relative; z-index: 2;
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
}
.msp-item:hover .msp-dot {
  background: linear-gradient(135deg,#ffde59,#ff914d);
  border-color: #ffde59;
  box-shadow: 0 0 14px rgba(201,168,76,.5);
}
.msp-text {
  padding-left: 24px;
  flex: 1;
}
.msp-item-head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 14px;
}
.msp-year {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #c9a84c;
  flex-shrink: 0;
  background: rgba(201,168,76,.12);
  border: 1px solid rgba(201,168,76,.3);
  padding: 4px 12px;
  border-radius: 4px;
  display: inline-block;
  align-self: flex-start;
  margin-top: 2px;
}
.msp-title {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(18px, 2.2vw, 24px);
  font-weight: 700;
  color: var(--white);
  line-height: 1.2;
}
.msp-body {
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-size: 17px;
  line-height: 1.88;
  color: rgba(245,243,239,.75);
}
:root:not(.dark) .msp { background: #f5f3ef; color: #1a1816; }
:root:not(.dark) .msp::before { opacity: 0.15; }
:root:not(.dark) .msp-year {
  background: rgba(201,168,76,.15);
  border-color: rgba(201,168,76,.4);
  color: #8a5c1a;
}
:root:not(.dark) .msp-hero-headline,
:root:not(.dark) .msp-title,
:root:not(.dark) .msp-narrative-heading,
:root:not(.dark) .msp-now-card-title,
:root:not(.dark) .msp-act-title,
:root:not(.dark) .msp-now-heading { color: #1a1816; }
:root:not(.dark) .msp-body,
:root:not(.dark) .msp-act-body,
:root:not(.dark) .msp-now-card-body { color: rgba(26,24,22,.8); }
:root:not(.dark) .msp-hero-sub,
:root:not(.dark) .msp-narrative-lead { color: rgba(26,24,22,.7); }
:root:not(.dark) .msp-pullquote { color: rgba(26,24,22,.9); background: rgba(201,168,76,.06); }
.msp-body p + p { margin-top: 14px; }
.msp-pullquote {
  margin: 22px 0 4px;
  padding: 18px 24px;
  border-left: 3px solid rgba(201,168,76,.5);
  background: rgba(201,168,76,.05);
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 17px;
  line-height: 1.7;
  color: var(--white);
}
.msp-now {
  background: rgba(201,168,76,.04);
  border-top: 1px solid rgba(201,168,76,.18);
  border-bottom: 1px solid rgba(201,168,76,.18);
  padding: 72px 8%;
}
.msp-now-inner { max-width: 1100px; margin: 0 auto; }
.msp-now-label {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}
.msp-now-heading {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(28px, 4vw, 52px);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--white);
  margin-bottom: 48px;
}
.msp-now-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 36px;
}
.msp-now-card {
  border-top: 2px solid rgba(201,168,76,.6);
  padding-top: 22px;
  opacity: 0;
  transform: translateY(14px);
  transition: opacity .6s ease, transform .6s ease;
}
.msp-now-card.msp-visible { opacity: 1; transform: none; }
.msp-now-num {
  font-family: var(--font-space-mono), 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.28em;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}
.msp-now-card-title {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 12px;
  line-height: 1.3;
}
.msp-now-card-body {
  font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
  font-size: 15px;
  font-style: italic;
  line-height: 1.8;
  color: rgba(245,243,239,.6);
}
@media (max-width: 768px) {
  .msp-hero { padding: 130px 6% 60px; }
  .msp-section { padding: 60px 6% 80px; }
  .msp-now { padding: 60px 6%; }
  .msp-now-grid { grid-template-columns: 1fr; gap: 32px; }
  .msp-hero-glow { display: none; }
}
`;

const translations = {
  en: {
    eyebrow: "Samuel Kobina Gyasi · Born 22 June 1999 · Mpohor, Ghana",
    headlineMain: "My",
    headlineItalic: "Story",
    sub: "Second child of three brothers. Dining Hall Prefect. Scholar across continents. Program Officer. Elder. Mentor. This is the story of a life built chapter by chapter.",
    narrativeEyebrow: "Why I Share This Story",
    narrativeHeading: "Every Story is Part of a Greater Genealogy",
    narrativeLead: "Matthew's Gospel opens not with a miracle but with a genealogy — forty-two generations of flawed, extraordinary, and ordinary people, each one a necessary thread in the fabric of redemption. Rahab the prostitute. Ruth the foreigner. David the adulterer. And yet: from them, through them, for them — the Messiah came. I share my story for the same reason Matthew wrote that genealogy: because personal stories matter, broken stories matter, and no life is too small to be part of something eternal.",
    narrativeActs: [
      {
        num: "Story of Self",
        title: "Why I was called to this work",
        body: "My story begins in Mpohor, Ghana — a tailor's son who found in Scripture the first map of his life. The faith of my mother, the discipline of my father, the prefect badge at ten, the science labs of Saint John's, the scholarship across continents — these are not personal trivia. They are the making of a person who believes what he teaches.",
      },
      {
        num: "Story of Us",
        title: "What we share",
        body: "You may not have grown up in Ghana. You may not have crossed the Mediterranean on a scholarship. But you know what it is to be formed by something larger than yourself — family, community, faith, suffering, grace. That shared human experience is the ground on which we meet. Your story and mine overlap in the places that truly matter.",
      },
      {
        num: "Story of Now",
        title: "The challenge before us",
        body: "We live in a moment that needs people who are spiritually rooted and intellectually sharp, who can hold the Word of God in one hand and the complexity of the world in the other. The invitation of this page is simple: let what has been built in me be of use to what God is building in you.",
      },
    ],
    nowLabel: "The Present Chapter",
    nowHeading: "What I Do Now",
    timeline: [
      {
        year: "1999",
        title: "A Life Begins in Mpohor",
        body: [
          "On the 22nd of June 1999, Samuel Kobina Gyasi was born to Mr. Emmanuel Gyasi, a tailor, and Mrs. Regina Baidoo, a woman whose faith and warmth became the first architecture of his soul. He entered the world as the newest member of a family of brothers — three in all — raised in Mpohor, a town in the Western Region of Ghana that, for all its modesty, would prove to be the first classroom of his life.",
        ],
      },
      {
        year: "2009 — 2012",
        title: "Class Prefect — Ghana-China Friendship School, Mpohor",
        body: [
          "At the age of ten, Samuel was elected Class Prefect at Ghana-China Friendship School, Mpohor — a role he would hold for three years. It was his first encounter with what it means to lead: to be accountable not only for yourself but for the order, coordination, and progress of those around you.",
        ],
      },
      {
        year: "2014 — 2017",
        title: "Dining Hall Prefect — Saint John’s School, Sekondi-Takoradi",
        body: [
          "Samuel attended the prestigious Saint John’s School, where he pursued a General Science curriculum. This period solidified his analytical thinking and scientific rigor, providing a foundation for his future technical studies.",
          "He was elected Dining Hall Prefect, a role of significant logistical and disciplinary weight. Managing the sustenance and order of the entire student body further refined his ability to coordinate complex systems and serve a large community with integrity.",
        ],
      },
      {
        year: "2017",
        title: "Manager — Cash Washing Bay, Mpohor",
        body: [
          "Before his eighteenth birthday, Samuel worked as a managing staff for a new car wash business in Mpohor. As Manager of Cash Washing Bay, he encountered the full weight of entrepreneurial reality: profit and loss, staff decisions, and customer relationships.",
          "The experience was an education no classroom could replicate. It built in him an understanding that leadership in institutions begins with leadership of self.",
        ],
      },
      {
        year: "2020 — 2023",
        title: "SUP Management Fès, Morocco — Computer Science",
        body: [
          "Samuel pursued his undergraduate studies at the Ecole Supérieure de Management, de Commerce et d'Informatique (SUP Management) in Fès, Morocco. His academic years were marked by intellectual curiosity and student leadership.",
          "He graduated with distinction and the Highest GPA in the entire school, developing a reputation as a thinker who could hold complexity without losing clarity.",
        ],
      },
      {
        year: "2023",
        title: "Excellence Scholarship — UM6P, Morocco",
        body: [
          "The arrival of an Excellence Scholarship was a recognition of his academic merits. This prestigious award is granted to top students based on entrance exam results and complemented by need-based support.",
        ],
        quote: "A scholarship is a commission: a society's investment in an individual with the expectation that the investment will return, multiplied, to the community.",
      },
      {
        year: "2023 — 2025",
        title: "Master's in Collective Intelligence — UM6P, Morocco",
        body: [
          "At the School of Collective Intelligence (SCI) in Rabat, Samuel completed a rigorous Master's programme. The curriculum fused data science, organisational theory, and facilitation into a discipline focused on how groups think and create together.",
        ],
      },
      {
        year: "2025 — Now",
        title: "Building, Serving, Rooting",
        body: [
          "Samuel today inhabits several interconnected spheres of service. As Junior Program Officer at SCI, UM6P, he helps students navigate their careers and facilitates programs that unlock group potential.",
          "In the Église Évangélique Au Maroc, he serves as an elder — mentoring teams with faith. Beyond institutions, he mentors individuals navigating questions of purpose and leadership.",
        ],
      },
    ],
    nowCards: [
      {
        num: "01",
        title: "Junior Program Officer · SCI, UM6P",
        body: "At the School of Collective Intelligence, Samuel helps students navigate their careers, internship search, events logistics, and community building.Helping run the the world's first accredited masters' program in collective intelligence",
      },
      {
        num: "02",
        title: "Elder · Église Évangélique Au Maroc",
        body: "Samuel contributes to decision-making, big church events and mentoring the intercession and library team.",
      },
      {
        num: "03",
        title: "Mentor",
        body: "Quietly and faithfully, Samuel walks alongside individuals navigating questions of faith, purpose, leadership, and identity — offering the guidance he once sought.",
      },
    ],
  },
  fr: {
    eyebrow: "Samuel Kobina Gyasi · Né le 22 juin 1999 · Mpohor, Ghana",
    headlineMain: "Mon",
    headlineItalic: "Histoire",
    sub: "Deuxième de trois frères. Leader depuis l'âge de 10 ans. Program Officer. Ancien. Mentor. Voici l'histoire d'une vie construite chapitre par chapitre.",
    narrativeEyebrow: "Pourquoi je partage cette histoire",
    narrativeHeading: "Chaque histoire fait partie d'une généalogie plus grande",
    narrativeLead: "L'Évangile de Matthieu ne s'ouvre pas sur un miracle, mais sur une généalogie — quarante-deux générations de personnes imparfaites, extraordinaires et ordinaires, chacune étant un fil nécessaire au tissu de la rédemption. Rahab la prostituée. Ruth l'étrangère. David l'adultère. Et pourtant : d'eux, par eux, pour eux — le Messie est venu. Je partage mon histoire pour la même raison : parce que les histoires personnelles comptent, les parcours brisés comptent, et aucune vie n'est trop petite pour s'inscrire dans l'éternité.",
    narrativeActs: [
      {
        num: "Histoire de Soi",
        title: "Pourquoi j'ai été appelé à ce travail",
        body: "Mon histoire commence à Mpohor, au Ghana — fils d'un tailleur qui a trouvé dans les Écritures la première carte de sa vie. La foi de ma mère, la discipline de mon père, ce badge de délégué à dix ans, les laboratoires de sciences de Saint John's, les bourses d'excellence — ce ne sont pas des détails anodins. C'est la forge d'un homme qui croit en ce qu'il enseigne.",
      },
      {
        num: "Histoire de Nous",
        title: "Ce que nous partageons",
        body: "Vous n'avez peut-être pas grandi au Ghana, ni traversé la Méditerranée pour vos études. Mais vous savez ce que c'est d'être façonné par plus grand que soi — la famille, la foi, l'épreuve, la grâce. Cette expérience humaine commune est le terrain de notre rencontre. Nos histoires se rejoignent là où cela compte vraiment.",
      },
      {
        num: "Histoire de Maintenant",
        title: "Le défi devant nous",
        body: "Nous vivons une époque qui réclame des leaders spirituellement enracinés et intellectuellement aiguisés, capables de tenir la Parole de Dieu d'une main et la complexité du monde de l'autre. Mon invitation est simple : que ce qui a été bâti en moi serve à ce que Dieu bâtit en vous.",
      },
    ],
    nowLabel: "Le Chapitre Actuel",
    nowHeading: "Ce que je fais aujourd'hui",
    timeline: [
      {
        year: "1999",
        title: "Une vie commence à Mpohor",
        body: [
          "Le 22 juin 1999, Samuel Kobina Gyasi naît de M. Emmanuel Gyasi, tailleur, et de Mme Regina Baidoo, une femme dont la foi et la chaleur ont constitué la première architecture de son âme. Il rejoint une fratrie de trois garçons à Mpohor, une ville de la région occidentale du Ghana qui deviendra sa toute première salle de classe.",
        ],
      },
      {
        year: "2009 — 2012",
        title: "Délégué de Classe — Ghana-China Friendship School, Mpohor",
        body: [
          "À dix ans, Samuel est élu délégué de classe, un rôle qu'il tiendra pendant trois ans. C'est son premier contact avec la responsabilité : être garant non seulement de soi, mais de l'ordre et du progrès d'un collectif.",
        ],
      },
      {
        year: "2014 — 2017",
        title: "Préfet du Réfectoire — Saint John’s School, Sekondi-Takoradi",
        body: [
          "Samuel a fréquenté la prestigieuse Saint John’s School, où il a suivi un cursus en Sciences Générales. Cette période a consolidé sa pensée analytique et sa rigueur scientifique, posant les bases de ses futures études techniques.",
          "Il a été nommé Préfet du Réfectoire, une fonction d'une grande importance logistique et disciplinaire. Gérer les besoins alimentaires et l'ordre de l'ensemble du corps étudiant a affiné sa capacité à coordonner des systèmes complexes et à servir une large communauté avec intégrité.",
        ],
      },
      {
        year: "2017",
        title: "Gérant — Cash Washing Bay, Mpohor",
        body: [
          "Avant ses dix-huit ans, Samuel gère une station de lavage automobile à Mpohor. En tant que gérant de Cash Washing Bay, il se confronte aux réalités entrepreneuriales : gestion des pertes et profits, décisions d'équipe et relation client.",
        ],
      },
      {
        year: "2020 — 2023",
        title: "SUP Management Fès, Maroc — Informatique",
        body: [
          "Samuel poursuit son premier cycle à l'Ecole Supérieure de Management, de Commerce et d'Informatique (SUP Management) à Fès. Ses années académiques sont marquées par une curiosité intellectuelle et un leadership étudiant reconnu.",
          "Il obtient son diplôme avec distinction, affichant la moyenne la plus élevée de tout l'établissement, et se forge une réputation de penseur capable de naviguer dans la complexité.",
        ],
      },
      {
        year: "2023",
        title: "Bourse d'Excellence — UM6P, Maroc",
        body: [
          "L'obtention d'une bourse d'excellence vient couronner son parcours académique. Cette distinction, basée sur les résultats aux concours d'entrée, lui permet d'intégrer l'écosystème de l'Université Mohammed VI Polytechnique.",
        ],
        quote: "Une bourse est une mission : l'investissement d'une societe dans un individu, avec l'attente que cet investissement retourne a la communaute, multiplie.",
      },
      {
        year: "2023 — 2025",
        title: "Master en Intelligence Collective — UM6P, Maroc",
        body: [
          "À la School of Collective Intelligence (SCI) à Rabat, Samuel suit un programme rigoureux fusionnant science des données, théorie des organisations et facilitation. La question centrale : comment les groupes pensent-ils et créent-ils ensemble ?",
        ],
      },
      {
        year: "2025 — Maintenant",
        title: "Bâtir, Servir, S'enraciner",
        body: [
          "Aujourd'hui, Samuel habite plusieurs sphères de service interconnectées. En tant que Junior Program Officer à la SCI (UM6P), il accompagne les étudiants dans leur carrière et anime des programmes de réflexion collective.",
          "À l'Église Évangélique Au Maroc, il sert comme ancien, guidant les équipes avec foi. Dans l'ombre, il continue de mentorer ceux qui cherchent leur voie.",
        ],
      },
    ],
    nowCards: [
      {
        num: "01",
        title: "Junior Program Officer · SCI, UM6P",
        body: "À la School of Collective Intelligence, Samuel conçoit des programmes d'apprentissage pour libérer le potentiel collectif des organisations et des équipes.",
      },
      {
        num: "02",
        title: "Ancien · Église Évangélique Au Maroc",
        body: "Samuel participe à la formation spirituelle et au soin pastoral, dirigeant notamment les équipes d'intercession et de bibliothèque.",
      },
      {
        num: "03",
        title: "Mentor",
        body: "Avec fidélité, Samuel accompagne des individus sur les questions de foi, de vocation et d'identité, offrant le soutien qu'il a lui-même reçu autrefois.",
      },
    ],
  },
};

const PARTICLES = [
  { id: 0, size: 90,  left: 8,  top: 15, dur: 10, delay: 0 },
  { id: 1, size: 140, left: 22, top: 55, dur: 14, delay: 2 },
  { id: 2, size: 70,  left: 38, top: 30, dur: 9,  delay: 4 },
  { id: 3, size: 110, left: 48, top: 70, dur: 12, delay: 1 },
  { id: 4, size: 80,  left: 15, top: 80, dur: 11, delay: 3 },
  { id: 5, size: 60,  left: 30, top: 20, dur: 8,  delay: 5 },
  { id: 6, size: 100, left: 5,  top: 45, dur: 13, delay: 2 },
  { id: 7, size: 75,  left: 42, top: 10, dur: 9,  delay: 6 },
];

export default function MyStoryPage() {
  const { lang } = useLang();
  const [dbContent, setDbContent] = useState<MyStoryContent | null>(null);
  const [loading, setLoading] = useState(true);
  const t = translations[lang];

  useEffect(() => {
    const fetchContent = async () => {
      const db = createClient();
      const { data } = await db.from("my_story").select("*").single();
      setDbContent(data);
      setLoading(false);
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("msp-visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".msp-item, .msp-now-card").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [lang]);

  return (
    <>
      <div className="msp">
        <style>{css}</style>

        {/* PHOTO MOSAIC */}
        <div className="msp-mosaic">
          <p className="msp-mosaic-label">Samuel Kobina Gyasi</p>
          <div className="msp-mosaic-grid">
            {[1,2,3,4,5].map((n) => (
              <div key={n} className={`msp-photo msp-photo--${n}`}>
                <img src={`/my-story/my-story${n}.jpg`} alt={`Photo ${n}`} loading={n === 1 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </div>

        {/* HERO */}
        <div className="msp-hero">
          <div className="msp-hero-glow" aria-hidden />

          <div className="msp-particles" aria-hidden>
            {PARTICLES.map((p) => (
              <div
                key={p.id}
                className="msp-particle"
                style={{
                  width: p.size,
                  height: p.size,
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  animationDuration: `${p.dur}s`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}
          </div>

          <p className="msp-hero-eyebrow">{t.eyebrow}</p>
          <h1 className="msp-hero-headline">
            {t.headlineMain}
            <span className="msp-hl-gold">{t.headlineItalic}</span>
          </h1>
          <div className="msp-hero-rule" />
          <p className="msp-hero-sub">{t.sub}</p>
        </div>

        {/* PUBLIC NARRATIVE */}
        <div className="msp-narrative">
          <p className="msp-narrative-eyebrow">{t.narrativeEyebrow}</p>
          <h2 className="msp-narrative-heading">{t.narrativeHeading}</h2>
          <p className="msp-narrative-lead">{t.narrativeLead}</p>
          <div className="msp-three-acts">
            {t.narrativeActs.map((act, i) => (
              <div key={`${lang}-act-${i}`} className="msp-act">
                <div className="msp-act-num">{act.num}</div>
                <div className="msp-act-title">{act.title}</div>
                <div className="msp-act-body">{act.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TIMELINE */}
        <div className="msp-section">
          <div className="msp-timeline">
            {t.timeline.map((entry, i) => (
              <div
                key={`${lang}-${i}`}
                className="msp-item"
                style={{ transitionDelay: `${i * 0.04}s` }}
              >
                <div className="msp-dot-col">
                  <div className="msp-dot" />
                </div>
                <div className="msp-text">
                  <div className="msp-item-head">
                    <span className="msp-year">{entry.year}</span>
                    <span className="msp-title">{entry.title}</span>
                  </div>
                  <div className="msp-body">
                    {entry.body.map((p, j) => <p key={j}>{p}</p>)}
                  </div>
                  {entry.quote && (
                    <div className="msp-pullquote">&ldquo;{entry.quote}&rdquo;</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WHAT I DO NOW */}
        <section className="msp-now">
          <div className="msp-now-inner">
            <p className="msp-now-label">{t.nowLabel}</p>
            <h2 className="msp-now-heading">{t.nowHeading}</h2>
            <div className="msp-now-grid">
              {t.nowCards.map((card, i) => (
                <div
                  key={`${lang}-nc-${i}`}
                  className="msp-now-card"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="msp-now-num">{card.num}</div>
                  <div className="msp-now-card-title">{card.title}</div>
                  <div className="msp-now-card-body">{card.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DATABASE-DRIVEN CONTENT */}
        {dbContent && (
          <section style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '100px 8% 80px',
            borderTop: '1px solid rgba(201,168,76,.18)',
          }}>
            <div style={{
              fontFamily: "var(--font-space-mono),'Space Mono',monospace",
              fontSize: '10px',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              background: 'var(--gold-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px',
              animation: 'msp-rise .8s .05s ease both',
            }}>
              {lang === "fr" && dbContent.title_fr ? "Mon Histoire" : "My Story"}
            </div>
            <h2 style={{
              fontFamily: "var(--font-cormorant),'Cormorant Garamond',serif",
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 500,
              lineHeight: 1.2,
              color: 'var(--white)',
              marginBottom: '32px',
              animation: 'msp-rise .8s .1s ease both',
            }}>
              {lang === "fr" && dbContent.title_fr ? dbContent.title_fr : dbContent.title_en}
            </h2>
            <div style={{
              fontFamily: "var(--font-poppins),Poppins,sans-serif",
              fontSize: 'clamp(15px, 1.8vw, 18px)',
              lineHeight: 1.75,
              color: 'rgba(245,243,239,.72)',
              marginBottom: dbContent.images.length > 0 ? '60px' : '0',
              maxWidth: '840px',
              whiteSpace: 'pre-wrap',
              animation: 'msp-rise .8s .15s ease both',
            }}>
              {lang === "fr" && dbContent.content_fr ? dbContent.content_fr : dbContent.content_en}
            </div>

            {/* IMAGE GALLERY */}
            {dbContent.images.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginTop: '40px',
                animation: 'msp-rise .8s .2s ease both',
              }}>
                {dbContent.images.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      aspectRatio: '4/3',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid rgba(201,168,76,.2)',
                      background: 'rgba(0,0,0,.3)',
                    }}
                  >
                    <img
                      src={img}
                      alt={`${lang === "fr" && dbContent.title_fr ? dbContent.title_fr : dbContent.title_en} - ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <SiteFooter />
    </>
  );
}