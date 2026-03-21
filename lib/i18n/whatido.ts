// lib/i18n/whatido.ts — What I Do section bilingual content
import type { Lang } from "./types";

export const whatidoTranslations = {
  label: {
    en: "What I Do",
    fr: "Ce Que Je Fais",
  },
  title: {
    line1: {
      en: "Serving in",
      fr: "Servir au",
    },
    line2: {
      en: "His Name",
      fr: "Nom de Dieu",
    },
  },
  subtitle: {
    en: "Faith. Prayer. The Word. Each role Samuel holds is an expression of one conviction: that a life worth living is one poured out in service to God and to others.",
    fr: "Foi. Prière. La Parole. Chaque rôle que Samuel occupe est l'expression d'une conviction : qu'une vie qui vaut la peine d'être vécue est celle versée au service de Dieu et des autres.",
  },
  roles: [
    {
      num: "01",
      title: {
        en: "Elder & Church Leader",
        fr: "Ancien & Responsable d'Église",
      },
      org: {
        en: "Eglise Évangélique Au Maroc",
        fr: "Eglise Évangélique Au Maroc",
      },
      description: {
        en: "I serve on a nine-member board of presiding elders, leading church affairs and ministry alongside our pastors for a community of 400+ believers in Rabat, Morocco.",
        fr: "Je fais partie conseil Presbytere, assurant la direction des affaires de l’Église et du ministère aux côtés de nos pasteurs, pour une communauté de plus de 400 fidèles à Rabat, au Maroc",
      },
    },
    {
      num: "02",
      title: {
        en: "Mentor",
        fr: "Mentor",
      },
      org: {
        en: "Personal Ministry",
        fr: "Ministère Personnel",
      },
      description: {
        en: "Quietly and faithfully walking alongside individuals navigating questions of faith, purpose, identity, and calling. Mentorship, for Samuel, is the most personal form of investment — giving what was once given to him.",
        fr: "Marchant tranquillement et fidèlement aux côtés de personnes qui naviguent dans des questions de foi, de but, d'identité et d'appel. Le mentorat, pour Samuel, est la forme d'investissement la plus personnelle — donner ce qui lui a été donné autrefois.",
      },
    },
    {
      num: "03",
      title: {
        en: "Faith Writer",
        fr: "Écrivain de Foi",
      },
      org: {
        en: "The Faith Journal",
        fr: "Le Journal de Foi",
      },
      description: {
        en: "Writing reflections on Scripture, prayer, and the daily experience of walking with God. Samuel believes that every essay is an act of worship — offering words that might help another soul trust the Lord more deeply.",
        fr: "Écrire des réflexions sur les Écritures, la prière et l'expérience quotidienne de marcher avec Dieu. Samuel croit que chaque essai est un acte d'adoration — offrant des mots qui pourraient aider une autre âme à faire davantage confiance au Seigneur.",
      },
    },
    {
      num: "04",
      title: {
        en: "Scripture Teacher",
        fr: "Enseignant des Écritures",
      },
      org: {
        en: "Local Church & Community",
        fr: "Église Locale & Communauté",
      },
      description: {
        en: "Opening the Word of God in small groups, Bible studies, and one-on-one settings. Samuel is passionate about making Scripture accessible, beautiful, and alive — not just studied, but lived.",
        fr: "Ouvrir la Parole de Dieu dans de petits groupes, des études bibliques et des contextes en tête-à-tête. Samuel est passionné par rendre les Écritures accessibles, belles et vivantes — non seulement étudiées, mais vécues.",
      },
    },
  ],
} satisfies Record<string, any>;
