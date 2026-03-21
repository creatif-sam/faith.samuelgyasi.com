// lib/i18n/hero.ts — Landing page HeroSection bilingual content
import type { Lang } from "./types";

export const heroTranslations = {
  imageLabel: {
    en: "THINK LIKE CHRIST · LIVE LIKE CHRIST",
    fr: "PENSER COMME CHRIST · VIVRE COMME CHRIST",
  },
  eyebrow: {
    en: "CHRISTIAN · THINKER · SERVANT",
    fr: "CHRÉTIEN · PENSEUR · SERVITEUR",
  },
  firstName: {
    en: "FIND YOUR PURPOSE,MAXIMIZE YOUR POTENTIAL,THINK LIKE CHRIST",
    fr: "TROUVEZ VOTRE BUT DE VIE,MAXIMISEZ VOTRE POTENTIEL,PENSEZ COMME CHRIST",
  },
  lastName: {
    en: "",
    fr: "",
  },
  description: {
    en: "Rooted in the Word. Walking by Faith. Living for His Glory.",
    fr: "Enraciné dans la Parole. Marchant par la Foi. Vivant pour Sa Gloire.",
  },
  values: {
    influence: { en: "Kingdom Influence", fr: "Influence du Royaume" },
    power: { en: "Power", fr: "Puissance" },
    wisdom: { en: "Wisdom", fr: "Sagesse" },
    pragmatism: { en: "Pragmatism", fr: "Pragmatisme" },
  },
  ctaFaith: { en: "Explore Faith", fr: "Explorer la Foi" },
  ctaJournal: { en: "Read Journal", fr: "Lire le Journal" },
  quickNav: {
    faith: {
      number: { en: "01", fr: "01" },
      label: { en: "Faith & Beliefs", fr: "Foi & Convictions" },
    },
    journal: {
      number: { en: "02", fr: "02" },
      label: { en: "Faith Journal", fr: "Journal de Foi" },
    },
    story: {
      number: { en: "03", fr: "03" },
      label: { en: "My Story", fr: "Mon Histoire" },
    },
  },
} satisfies Record<string, any>;
