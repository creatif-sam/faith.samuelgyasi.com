// lib/i18n/vision.ts — Vision section bilingual content
import type { Lang } from "./types";

export const visionTranslations = {
  label: {
    en: "Vision & Calling",
    fr: "Vision & Appel",
  },
  bgText: {
    en: "FAITHFUL",
    fr: "FIDÈLE",
  },
  statement: {
    line1: {
      en: "To live a life fully surrendered —",
      fr: "Vivre une vie pleinement abandonnée —",
    },
    line2: {
      en: "rooted in the Word,",
      fr: "enracinée dans la Parole,",
    },
    line3: {
      en: "sustained by prayer, and",
      fr: "soutenue par la prière, et",
    },
    line4: {
      en: "walking in the purpose",
      fr: "marchant dans le but",
    },
    line5: {
      en: "God has written for me.",
      fr: "que Dieu a écrit pour moi.",
    },
  },
  transformation: {
    title: {
      en: "Transforming the",
      fr: "Transformer les",
    },
    stages: [
      {
        from: { en: "Frustrated", fr: "Égarés" },
        to: { en: "Followers", fr: "Engagés" },
      },
      {
        from: { en: "Followers", fr: "Engagés" },
        to: { en: "Fathers", fr: "Établis" },
      },
      {
        from: { en: "Fathers", fr: "Établis" },
        to: { en: "Figures", fr: "Élevés" },
      },
    ],
  },
} satisfies Record<string, any>;
