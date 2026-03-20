// lib/i18n/hero.ts — Landing page HeroSection bilingual content
import type { Lang } from "./types";

export const heroTranslations = {
  eyebrow: {
    en: "Thinker · Leader · Innovator · Grounded in Purpose",
    fr: "Penseur · Leader · Innovateur · Ancré dans le But",
  },
  tagline: {
    en: "Rooted in Purpose.\nDriven by Vision.\nLiving with Intention.",
    fr: "Ancré dans le But.\nAnimé par la Vision.\nVivant avec Intention.",
  },
  badgeLine: {
    en: "Living with Purpose · Leading with Vision",
    fr: "Vivre avec But · Diriger avec Vision",
  },
  badgeSub: {
    en: "Explore",
    fr: "Explorer",
  },
  ctaFaith:   { en: "Explore Values",   fr: "Explorer les Valeurs"  },
  ctaJournal: { en: "Read Journal",    fr: "Lire le Journal"  },
  scroll:     { en: "Scroll",          fr: "Défiler"          },
  pillars: {
    faith:   { en: "Values & Beliefs", fr: "Valeurs & Convictions" },
    journal: { en: "Thought Journal",   fr: "Journal de Pensée"    },
    story:   { en: "My Story",        fr: "Mon Histoire"      },
  },
} satisfies Record<string, Record<Lang, string> | Record<string, Record<Lang, string>>>;
