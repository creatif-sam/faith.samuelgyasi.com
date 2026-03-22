// lib/i18n/nav.ts — Navbar bilingual labels
import type { Lang } from "./types";

export const navTranslations = {
  blog:      { en: "Blog",      fr: "Blog"       },
  analyzer:  { en: "Analyzer",  fr: "Analyseur"  },
  story:     { en: "My Story",     fr: "Mon Histoire"   },
  resources: { en: "Resources", fr: "Ressources" },
  credo:     { en: "Credo",     fr: "Credo"      },
  upcoming:  { en: "Upcoming",  fr: "À Venir"    },
  langLabel: { en: "Français",  fr: "English"    },
  openMenu:  { en: "Open menu", fr: "Ouvrir le menu" },
  closeMenu: { en: "Close menu",fr: "Fermer le menu" },
} satisfies Record<string, Record<Lang, string>>;
