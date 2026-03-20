// lib/i18n/pillars.ts — Four Pillars section bilingual content
import type { Lang } from "./types";

export const pillarsTranslations = {
  label: {
    en: "Four Pillars",
    fr: "Quatre Piliers",
  },
  title: {
    en: "Four Cardinals",
    fr: "Quatre Cardinaux",
  },
  subtitle: {
    en: "Every pillar is a commitment — to the Word, to prayer, to testimony, and to walking in the fullness of what God has called.",
    fr: "Chaque pilier est un engagement — envers la Parole, la prière, le témoignage, et marcher dans la plénitude de ce à quoi Dieu a appelé.",
  },
  pillars: [
    {
      icon: "◆",
      name: {
        en: "Faith & Beliefs",
        fr: "Foi & Convictions",
      },
      href: "/faith",
      description: {
        en: "Samuel's life is anchored in deep spiritual conviction and the living Word of God. His faith is not passive doctrine but an active force — shaping how he thinks, serves, and walks through every season. Christ is the quiet centre from which everything else radiates.",
        fr: "La vie de Samuel est ancrée dans une profonde conviction spirituelle et la Parole vivante de Dieu. Sa foi n'est pas une doctrine passive mais une force active — façonnant sa façon de penser, de servir et de marcher à travers chaque saison. Christ est le centre silencieux d'où tout rayonne.",
      },
      verse: {
        en: '"Your word is a lamp to my feet and a light to my path." — Psalm 119:105',
        fr: '"Ta parole est une lampe à mes pieds, et une lumière sur mon sentier." — Psaume 119:105',
      },
    },
    {
      icon: "✦",
      name: {
        en: "Scripture & Prayer",
        fr: "Écriture & Prière",
      },
      href: "/faith",
      description: {
        en: "Daily engagement with Scripture and a consistent discipline of prayer are the pillars of Samuel's spiritual life. He believes that the Bible is both a love letter and a blueprint — and that prayer is the conversation that builds every relationship with God.",
        fr: "L'engagement quotidien avec les Écritures et une discipline constante de prière sont les piliers de la vie spirituelle de Samuel. Il croit que la Bible est à la fois une lettre d'amour et un plan — et que la prière est la conversation qui construit toute relation avec Dieu.",
      },
      verse: {
        en: '"Pray without ceasing." — 1 Thessalonians 5:17',
        fr: '"Priez sans cesse." — 1 Thessaloniciens 5:17',
      },
    },
    {
      icon: "◎",
      name: {
        en: "The Word Made Life",
        fr: "La Parole Faite Vie",
      },
      href: "/blog",
      description: {
        en: "In the Faith Journal, Samuel reflects on how Scripture speaks into modern life — from doubt and certainty, to gratitude and calling. Every reflection is an invitation to encounter the living God through the written Word.",
        fr: "Dans le Journal de Foi, Samuel réfléchit sur la façon dont les Écritures parlent à la vie moderne — du doute à la certitude, de la gratitude à l'appel. Chaque réflexion est une invitation à rencontrer le Dieu vivant à travers la Parole écrite.",
      },
      verse: {
        en: '"The Word became flesh and dwelt among us." — John 1:14',
        fr: '"La Parole a été faite chair, et elle a habité parmi nous." — Jean 1:14',
      },
    },
    {
      icon: "◎",
      name: {
        en: "My Story",
        fr: "Mon Histoire",
      },
      href: "/my-story",
      description: {
        en: "Every life is a testimony. Samuel's journey — from Ghana to Morocco and beyond — is the story of a man learning to trust God in every chapter. His story is not about him; it is about the God who authored it.",
        fr: "Chaque vie est un témoignage. Le voyage de Samuel — du Ghana au Maroc et au-delà — est l'histoire d'un homme apprenant à faire confiance à Dieu dans chaque chapitre. Son histoire ne parle pas de lui ; elle parle du Dieu qui l'a écrite.",
      },
      verse: {
        en: '"For we are God\'s masterpiece, created in Christ Jesus to do good works." — Ephesians 2:10',
        fr: '"Car nous sommes son ouvrage, ayant été créés en Jésus-Christ pour de bonnes œuvres." — Éphésiens 2:10',
      },
    },
  ],
} satisfies Record<string, any>;
