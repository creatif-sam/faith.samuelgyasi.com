// lib/i18n/values.ts — Values section bilingual content
import type { Lang } from "./types";

export const valuesTranslations = {
  values: [
    {
      letter: "F",
      word: {
        en: "Faith",
        fr: "Foi",
      },
      number: "01",
      body: {
        en: "Not a feeling but a decision — to trust God with every chapter of life. Faith is the foundation on which Samuel stands: confident in what is not yet seen, anchored in what God has already promised.",
        fr: "Pas un sentiment mais une décision — faire confiance à Dieu avec chaque chapitre de la vie. La foi est la fondation sur laquelle Samuel se tient : confiant en ce qui n'est pas encore vu, ancré dans ce que Dieu a déjà promis.",
      },
      glyph: "◆",
    },
    {
      letter: "G",
      word: {
        en: "Grace",
        fr: "Grâce",
      },
      number: "02",
      body: {
        en: "Everything good in Samuel's life is unearned gift. He receives grace daily and strives to extend it generously — in forgiveness, in patience, in the refusal to reduce any person to their worst moment.",
        fr: "Tout ce qui est bon dans la vie de Samuel est un don non mérité. Il reçoit la grâce quotidiennement et s'efforce de l'étendre généreusement — dans le pardon, dans la patience, dans le refus de réduire toute personne à son pire moment.",
      },
      glyph: "✦",
    },
    {
      letter: "W",
      word: {
        en: "The Word",
        fr: "La Parole",
      },
      number: "03",
      body: {
        en: "Scripture is not a rule book — it is a living encounter with God. Samuel reads, meditates on, and lives by the Bible, believing that the Word of God is the surest light in every kind of darkness.",
        fr: "L'Écriture n'est pas un livre de règles — c'est une rencontre vivante avec Dieu. Samuel lit, médite sur et vit selon la Bible, croyant que la Parole de Dieu est la lumière la plus sûre dans tout type de ténèbres.",
      },
      glyph: "◎",
    },
  ],
} satisfies Record<string, any>;
