"use client";

import { useEffect, useState } from "react";
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
  opacity: 0.06;
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
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
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
@media (prefers-color-scheme: light) {
  .msp { background: #f5f3ef; color: #1a1816; }
  .msp::before { opacity: 0.15; }
  .msp-hero-headline, .msp-title, .msp-narrative-heading, .msp-now-card-title, .msp-now-heading { color: #1a1816; }
  .msp-body, .msp-act-body, .msp-now-card-body { color: rgba(26,24,22,.8); }
  .msp-hero-sub, .msp-narrative-lead { color: rgba(26,24,22,.7); }
}
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
    sub: "Son of a tailor. Third of three brothers. Class Prefect at ten. Scholar across continents. Program Officer. Elder. Mentor. This is the story of a life built chapter by chapter.",
    narrativeEyebrow: "Why I Share This Story",
    narrativeHeading: "Every Story is Part of a Greater Genealogy",
    narrativeLead: "Matthew's Gospel opens not with a miracle but with a genealogy — forty-two generations of flawed, extraordinary, and ordinary people, each one a necessary thread in the fabric of redemption. Rahab the prostitute. Ruth the foreigner. David the adulterer. And yet: from them, through them, for them — the Messiah came. I share my story for the same reason Matthew wrote that genealogy: because personal stories matter, broken stories matter, and no life is too small to be part of something eternal.",
    narrativeActs: [
      {
        num: "Story of Self",
        title: "Why I was called to this work",
        body: "My story begins in Mpohor, Ghana — a tailor's son who found in Scripture the first map of his life. The faith of my mother, the discipline of my father, the prefect badge at ten, the scholarship across continents — these are not personal trivia. They are the making of a person who believes what he teaches.",
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
          "On the 22nd of June 1999, Samuel Kobina Gyasi was born to Mr. Emmanuel Gyasi, a tailor of quiet discipline and industrious hands, and Mrs. Regina Baidoo, a woman whose faith and warmth became the first architecture of his soul. He entered the world as the newest member of a family of brothers — three in all — raised in Mpohor, a town in the Western Region of Ghana that, for all its modesty, would prove to be the first classroom of his life.",
          "His earliest memories are woven with the sound of a sewing machine and the smell of finished cloth. His father's tailoring shop was not merely a trade — it was a lesson in precision, patience, and the dignity of craftsmanship. His mother's quiet prayers at dawn taught him that a life built on faith is a life built on something unshakeable.",
        ],
        quote: "His father's tailoring shop was not merely a trade — it was a lesson in precision, patience, and the dignity of craftsmanship.",
      },
      {
        year: "2009 — 2012",
        title: "Class Prefect — Ghana-China Friendship School, Mpohor",
        body: [
          "At the age of ten, Samuel was appointed Class Prefect at Ghana-China Friendship School, Mpohor — a role he would hold for three years, through to Class 6. It was his first encounter with what it means to lead: to be accountable not only for yourself but for the order, spirit, and progress of those around you.",
          "He learned that authority without relationship is hollow, and that the trust of peers is harder earned — and more precious — than any title. Three years of prefectship sharpened in him a commitment to servant leadership that has never faded.",
        ],
        quote: null,
      },
      {
        year: "2017",
        title: "Managing Director — Cash Washing Bay, Mpohor",
        body: [
          "Before his eighteenth birthday, Samuel founded and ran a car wash business in Mpohor. As Managing Director of Cash Washing Bay, he encountered the full weight of entrepreneurial reality: profit and loss, staff decisions, customer relationships, and the relentless discipline of running a small operation with integrity.",
          "The experience was an education no classroom could replicate. It built in him an understanding that leadership in institutions begins with leadership of self — and that the instincts of a servant are more valuable than any title.",
        ],
        quote: null,
      },
      {
        year: "2018 — 2022",
        title: "University of Ghana, Legon — Political Science & Information Studies",
        body: [
          "Samuel pursued his undergraduate studies at the University of Ghana, Legon, earning a Bachelor's degree. His academic years were marked by intellectual curiosity, student leadership, and a growing conviction that the intersection of knowledge, governance, and collective action held the key to Africa's transformation.",
          "He served in student leadership bodies, led study groups, and developed a reputation as a thinker who could hold complexity without losing clarity — a skill that would serve him well in every season that followed.",
        ],
        quote: null,
      },
      {
        year: "2022",
        title: "Government of Ghana Scholarship — A Commission, Not a Reward",
        body: [
          "The arrival of a Government of Ghana scholarship was, for Samuel, not the end of striving but the beginning of a deeper obligation. He understood — as few do — that a scholarship is a commission: a society's investment in an individual with the expectation that the investment will return, multiplied, to the community.",
          "This conviction carried him across the Mediterranean to Morocco, where he would pursue graduate study and discover a new dimension of leadership in a new culture.",
        ],
        quote: "A scholarship is a commission: a society's investment in an individual with the expectation that the investment will return, multiplied, to the community.",
      },
      {
        year: "2023 — 2025",
        title: "Master's in Collective Intelligence — UM6P, Morocco",
        body: [
          "At the School of Collective Intelligence, University Mohammed VI Polytechnic (UM6P) in Ben Guerir, Morocco, Samuel completed a rigorous Master's programme in Collective Intelligence. The programme fused data science, organisational theory, complexity thinking, and facilitation practice into a discipline with one central question: how do groups think, decide, and create together?",
          "His thesis and coursework deepened his research vocabulary, but it was the living laboratory of Moroccan life — navigating a new language, culture, and community — that sharpened his understanding of transformation as something that begins not with strategies but with the willingness to be made new.",
        ],
        quote: null,
      },
      {
        year: "2025 — Now",
        title: "Building, Serving, Rooting",
        body: [
          "Samuel today inhabits several interconnected spheres of service, each a different expression of the same conviction: that a life worth living is one poured out for others.",
          "As Junior Program Officer at the School of Collective Intelligence (SCI), UM6P, he designs and facilitates programmes that help organisations and communities unlock collective intelligence. In the Eglise Evangelique Au Maroc, he serves as an elder — leading the intercession team and the library team. And beyond institution, Samuel mentors quietly, faithfully, walking alongside individuals who are navigating the questions he once navigated alone.",
        ],
        quote: null,
      },
    ],
    nowCards: [
      {
        num: "01",
        title: "Junior Program Officer · SCI, UM6P",
        body: "At the School of Collective Intelligence, University Mohammed VI Polytechnic (UM6P) in Morocco, Samuel designs and facilitates learning programmes that unlock the collective intelligence of organisations, communities, and teams.",
      },
      {
        num: "02",
        title: "Elder · Eglise Evangelique Au Maroc",
        body: "Samuel serves as a church elder in the Eglise Evangelique Au Maroc, responsible for spiritual formation, community accountability, and pastoral care — leading both the intercession team and the library team.",
      },
      {
        num: "03",
        title: "Mentor",
        body: "Quietly and faithfully, Samuel walks alongside individuals navigating questions of faith, purpose, leadership, and identity — offering the kind of mentorship he once needed himself.",
      },
    ],
  },
  fr: {
    eyebrow: "Samuel Kobina Gyasi · Ne le 22 juin 1999 · Mpohor, Ghana",
    headlineMain: "Mon",
    headlineItalic: "Histoire",
    sub: "Fils d'un tailleur. Troisieme de trois freres. Delegue de classe a dix ans. Chercheur a travers les continents. Programme Officer. Ancien. Mentor. Voici l'histoire d'une vie construite chapitre par chapitre.",
    narrativeEyebrow: "Pourquoi Je Partage Cette Histoire",
    narrativeHeading: "Chaque Histoire fait partie d'une Généalogie plus Grande",
    narrativeLead: "L'Évangile de Matthieu s'ouvre non par un miracle, mais par une généalogie — quarante-deux générations de personnes imparfaites, extraordinaires et ordinaires, chacune un fil nécessaire dans le tissu de la rédemption. Rahab la prostituée. Ruth l'étrangère. David l'adultère. Et pourtant : d'eux, à travers eux, pour eux — le Messie est venu. Je partage mon histoire pour la même raison que Matthieu a écrit cette généalogie : parce que les histoires personnelles comptent, les histoires brisées comptent, et aucune vie n'est trop petite pour faire partie de quelque chose d'éternel.",
    narrativeActs: [
      {
        num: "Histoire de Soi",
        title: "Pourquoi j'ai été appelé à ce travail",
        body: "Mon histoire commence à Mpohor, au Ghana — le fils d'un tailleur qui a trouvé dans l'Écriture la première carte de sa vie. La foi de ma mère, la discipline de mon père, le badge de délégué à dix ans, la bourse à travers les continents — ce ne sont pas des anecdotes personnelles. Ce sont la fabrication d'une personne qui croit ce qu'elle enseigne.",
      },
      {
        num: "Histoire de Nous",
        title: "Ce que nous partageons",
        body: "Vous n'avez peut-être pas grandi au Ghana. Vous n'avez peut-être pas traversé la Méditerranée avec une bourse. Mais vous savez ce que c'est d'être formé par quelque chose de plus grand que soi — famille, communauté, foi, souffrance, grâce. Cette expérience humaine partagée est le terrain sur lequel nous nous rencontrons. Votre histoire et la mienne se recoupent dans les endroits qui comptent vraiment.",
      },
      {
        num: "Histoire de Maintenant",
        title: "Le défi devant nous",
        body: "Nous vivons dans un moment qui a besoin de personnes spirituellement enracinées et intellectuellement aiguisées, capables de tenir la Parole de Dieu dans une main et la complexité du monde dans l'autre. L'invitation de cette page est simple : que ce qui a été construit en moi soit utile à ce que Dieu construit en vous.",
      },
    ],
    nowLabel: "Le Present Chapitre",
    nowHeading: "Ce Que Je Fais Aujourd'hui",
    timeline: [
      {
        year: "1999",
        title: "Une Vie Nait a Mpohor",
        body: [
          "Le 22 juin 1999, Samuel Kobina Gyasi est ne de M. Emmanuel Gyasi, tailleur d'une discipline tranquille et aux mains laborieuses, et de Mme Regina Baidoo, une femme dont la foi et la chaleur ont constitue la premiere architecture de son ame. Il est entre dans le monde en tant que nouveau membre d'une famille de freres — trois au total — elevee a Mpohor, une ville de la Region Occidentale du Ghana qui, malgre sa modestie, allait devenir la premiere salle de classe de sa vie.",
          "Ses premiers souvenirs sont tisses du son d'une machine a coudre et de l'odeur du tissu acheve. L'atelier de couture de son pere n'etait pas simplement un commerce — c'etait une lecon de precision, de patience et de dignite de l'artisanat. Les prieres silencieuses de sa mere a l'aube lui ont appris qu'une vie fondee sur la foi est une vie fondee sur quelque chose d'inebranlable.",
        ],
        quote: "L'atelier de couture de son pere n'etait pas simplement un commerce — c'etait une lecon de precision, de patience et de dignite de l'artisanat.",
      },
      {
        year: "2009 — 2012",
        title: "Delegue de Classe — Ghana-China Friendship School, Mpohor",
        body: [
          "A l'age de dix ans, Samuel a ete nomme delegue de classe a la Ghana-China Friendship School de Mpohor — une fonction qu'il exercerait pendant trois ans, jusqu'en Classe 6. C'etait sa premiere rencontre avec ce que signifie diriger : etre responsable non seulement de soi-meme, mais aussi de l'ordre, de l'esprit et du progres de ceux qui vous entourent.",
          "Il a appris que l'autorite sans relation est creuse, et que la confiance des pairs se merite plus difficilement — et est plus precieuse — que tout titre. Trois annees en tant que delegue ont aiguise en lui un engagement envers le leadership au service des autres, qui n'a jamais faibli.",
        ],
        quote: null,
      },
      {
        year: "2017",
        title: "Directeur General — Cash Washing Bay, Mpohor",
        body: [
          "Avant son dix-huitieme anniversaire, Samuel a fonde et dirige une entreprise de lavage de voitures a Mpohor. En tant que Directeur General de Cash Washing Bay, il a affonte le poids total de la realite entrepreneuriale : profits et pertes, decisions en matiere de personnel, relations clients et la discipline implacable de gerer une petite entreprise avec integrite.",
          "L'experience etait une education qu'aucune salle de classe ne pouvait reproduire. Elle lui a inculque la comprehension que le leadership dans les institutions commence par le leadership de soi — et que les instincts d'un serviteur ont plus de valeur que n'importe quel titre.",
        ],
        quote: null,
      },
      {
        year: "2018 — 2022",
        title: "Universite du Ghana, Legon — Sciences Politiques & Sciences de l'Information",
        body: [
          "Samuel a poursuivi ses etudes de premier cycle a l'Universite du Ghana, Legon, ou il a obtenu une licence. Ses annees academiques ont ete marquees par la curiosite intellectuelle, le leadership etudiant et la conviction croissante que l'intersection de la connaissance, de la gouvernance et de l'action collective detenait la cle de la transformation de l'Afrique.",
          "Il a siege dans des organes de direction etudiante, anime des groupes d'etude et s'est forge une reputation de penseur capable de tenir la complexite sans perdre la clarte — une competence qui allait le servir dans chaque saison qui suivrait.",
        ],
        quote: null,
      },
      {
        year: "2022",
        title: "Bourse du Gouvernement du Ghana — Une Mission, Pas Seulement une Recompense",
        body: [
          "L'obtention d'une bourse du Gouvernement du Ghana representait pour Samuel non pas la fin de l'effort, mais le debut d'une obligation plus profonde. Il comprit — comme peu le font — qu'une bourse est une mission : l'investissement d'une societe dans un individu, avec l'attente que cet investissement retourne a la communaute, multiplie.",
          "Cette conviction l'a porte a travers la Mediterranee jusqu'au Maroc, ou il allait poursuivre des etudes superieures et decouvrir une nouvelle dimension du leadership dans une nouvelle culture.",
        ],
        quote: "Une bourse est une mission : l'investissement d'une societe dans un individu, avec l'attente que cet investissement retourne a la communaute, multiplie.",
      },
      {
        year: "2023 — 2025",
        title: "Master en Intelligence Collective — UM6P, Maroc",
        body: [
          "A la School of Collective Intelligence de l'Universite Mohammed VI Polytechnique (UM6P) a Ben Guerir, Maroc, Samuel a acheve un programme rigoureux de Master en Intelligence Collective. Le programme fusionnait la science des donnees, la theorie organisationnelle, la pensee de la complexite et les pratiques de facilitation en une discipline avec une question centrale : comment les groupes pensent-ils, decident-ils et creent-ils ensemble ?",
          "Sa these et ses cours ont approfondi son vocabulaire de recherche, mais c'est le laboratoire vivant de la vie marocaine — explorer une nouvelle langue, culture et communaute — qui a affine sa comprehension de la transformation comme quelque chose qui ne commence pas par des strategies, mais par la volonte d'etre renouvele.",
        ],
        quote: null,
      },
      {
        year: "2025 — Maintenant",
        title: "Construire, Servir, S'Enraciner",
        body: [
          "Samuel habite aujourd'hui plusieurs spheres de service interconnectees, chacune etant une expression differente de la meme conviction : qu'une vie qui vaut la peine d'etre vecue est une vie offerte aux autres.",
          "En tant que Junior Program Officer a la School of Collective Intelligence (SCI), UM6P, il concoit et anime des programmes qui aident les organisations et les communautes a liberer l'intelligence collective. A l'Eglise Evangelique Au Maroc, il sert comme ancien — dirigeant l'equipe d'intercession et l'equipe de bibliotheque. Et au-dela des institutions, Samuel accompagne discretement et fidelement des individus qui naviguent dans les questions qu'il a lui-meme autrefois traversees.",
        ],
        quote: null,
      },
    ],
    nowCards: [
      {
        num: "01",
        title: "Junior Program Officer · SCI, UM6P",
        body: "A la School of Collective Intelligence de l'Universite Mohammed VI Polytechnique (UM6P) au Maroc, Samuel concoit et anime des programmes d'apprentissage qui liberent l'intelligence collective des organisations, communautes et equipes.",
      },
      {
        num: "02",
        title: "Ancien · Eglise Evangelique Au Maroc",
        body: "Samuel sert comme ancien de l'eglise a l'Eglise Evangelique Au Maroc, responsable de la formation spirituelle, de la responsabilite communautaire et du soin pastoral — dirigeant a la fois l'equipe d'intercession et l'equipe de bibliotheque.",
      },
      {
        num: "03",
        title: "Mentor",
        body: "Discretement et fidelement, Samuel accompagne des individus qui naviguent dans des questions de foi, de vocation, de leadership et d'identite — offrant le type de mentorat dont il avait lui-meme besoin autrefois.",
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

          <div className="msp-lang-toggle" role="group" aria-label="Language">
            <button
              className={`msp-lang-btn${lang === "en" ? " active" : ""}`}
              onClick={() => switchLang("en")}
            >
              EN
            </button>
            <button
              className={`msp-lang-btn${lang === "fr" ? " active" : ""}`}
              onClick={() => switchLang("fr")}
            >
           p className="msp-narrative-eyebrow">{t.narrativeEyebrow}</p>
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