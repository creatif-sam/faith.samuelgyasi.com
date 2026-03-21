// components/hero/translations.ts - Bilingual content for Hero section
import type { Lang } from "@/lib/i18n/types";

export const heroModernTranslations = {
  greeting: {
    en: "Hello!",
    fr: "Bonjour!",
  },
  intro: {
    en: "I'm",
    fr: "Je suis",
  },
  name: {
    en: "Samuel",
    fr: "Samuel",
  },
  tagline: {
    en: "Minister, Facilitator and Leader",
    fr: "Ministre, Facilitateur et Leader",
  },
  description: {
    en: "I help you find your PURPOSE, maximize your POTENTIAL and develop CHRISTLIKE MIND.",
    fr: "Je vous aide à trouver votre BUT, maximiser votre POTENTIEL et développer un ESPRIT CHRISTIQUE.",
  },
  quote: {
    text: {
      en: "\"Walking by faith, not by sight. Rooted in the Word, living for His glory.\"",
      fr: "\"Marchant par la foi, pas par la vue. Enraciné dans la Parole, vivant pour Sa gloire.\"",
    },
    attribution: {
      en: "2 Corinthians 5:7",
      fr: "2 Corinthiens 5:7",
    },
  },
  experience: {
    label: {
      en: "Years Of Practice",
      fr: "Années de Pratique",
    },
    years: {
      en: "10+",
      fr: "10+",
    },
  },
  cta: {
    follow: {
      en: "Follow me",
      fr: "Me suivre",
    },
    explore: {
      en: "Explore Faith",
      fr: "Explorer la Foi",
    },
  },
} satisfies Record<string, any>;
