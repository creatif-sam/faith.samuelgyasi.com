// lib/i18n/hero.ts — Landing page HeroSection bilingual content
import type { Lang } from "./types";

export const heroTranslations = {
  eyebrow: {
    en: "Christian · Thinker · Servant · Rooted in the Word",
    fr: "Chrétien · Penseur · Serviteur · Ancré dans la Parole",
  },
  tagline: {
    en: "Rooted in the Word.\nWalking by Faith.\nLiving for His Glory.",
    fr: "Ancré dans la Parole.\nMarchant par la Foi.\nVivant pour Sa Gloire.",
  },
  badgeLine: {
    en: "Walking by Faith · Not by Sight",
    fr: "Marchant par la Foi · Non par la Vue",
  },
  badgeSub: {
    en: "2 Corinthians 5:7",
    fr: "2 Corinthiens 5:7",
  },
  ctaFaith:   { en: "Explore Faith",   fr: "Explorer la Foi"  },
  ctaJournal: { en: "Read Journal",    fr: "Lire le Journal"  },
  scroll:     { en: "Scroll",          fr: "Défiler"          },
  pillars: {
    faith:   { en: "Faith & Beliefs", fr: "Foi & Convictions" },
    journal: { en: "Faith Journal",   fr: "Journal de Foi"    },
    story:   { en: "My Story",        fr: "Mon Histoire"      },
  },
} satisfies Record<string, Record<Lang, string> | Record<string, Record<Lang, string>>>;
