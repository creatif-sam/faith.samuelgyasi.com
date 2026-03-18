// lib/i18n/about.ts — About / My Story section bilingual content
import type { Lang } from "./types";

export const aboutTranslations = {
  eyebrow: { en: "My Story",   fr: "Mon Histoire" },
  mainTitle: {
    en: "A Life Built on Purpose, Faith & Collective Growth",
    fr: "Une Vie Bâtie sur le But, la Foi et la Croissance Collective",
  },

  // ── Transformation tagline ────────────────────────────────────
  transforming: {
    label:    { en: "The Journey",          fr: "Le Parcours"       },
    heading:  { en: "The Transformation",   fr: "La Transformation" },
    steps: [
      { en: "Frustrated",  fr: "Égarés"    },
      { en: "Followers",   fr: "Engagés"   },
      { en: "Fathers",     fr: "Établis"   },
      { en: "Figures",     fr: "Élevés"    },
    ],
    description: {
      en: "Transforming the Frustrated into Followers, Followers into Fathers, Fathers into Figures.",
      fr: "Transformer les Égarés en Engagés, les Engagés en Établis, les Établis en Élevés.",
    },
  },

  // ── 4 Cardinal Points ─────────────────────────────────────────
  cardinalPoints: {
    label:   { en: "The 4 Cardinal Points", fr: "Les 4 Points Cardinaux" },
    points: [
      { en: "Faith and Beliefs",          fr: "Foi et Convictions"           },
      { en: "Scripture and Prayer",       fr: "Écriture et Prière"           },
      { en: "Technology and Productivity",fr: "Technologie et Productivité"  },
      { en: "Mentorship",                 fr: "Mentorat"                     },
    ],
  },

  // ── 7 Mountains of Culture section ──────────────────────────
  mountains: {
    intro: {
      en: "Equipping believers with the wisdom and power to influence the 7 Mountains of Culture:",
      fr: "Équiper les croyants avec la sagesse et le pouvoir d'influencer les 7 Montagnes de la Culture :",
    },
    list: [
      { en: "Family",             fr: "Famille"           },
      { en: "Religion",           fr: "Religion"          },
      { en: "Education",          fr: "Éducation"         },
      { en: "Media",              fr: "Médias"            },
      { en: "Arts & Entertainment", fr: "Arts & Divertissement" },
      { en: "Business",           fr: "Commerce"          },
      { en: "Government",         fr: "Gouvernement"      },
    ],
  },

  // ── Timeline entries ─────────────────────────────────────────
  timeline: [
    {
      year: { en: "The Beginning",  fr: "Le Début"         },
      title: { en: "Foundations of Faith", fr: "Fondements de la Foi" },
      body: {
        en: "Born and raised with deep roots in Christian faith, Samuel's earliest formation came through Scripture, community, and a conviction that every life carries divine purpose. These foundations never left him.",
        fr: "Né et élevé avec de profondes racines dans la foi chrétienne, la première formation de Samuel est passée par l'Écriture, la communauté et la conviction que chaque vie porte un dessein divin. Ces fondements ne l'ont jamais quitté.",
      },
    },
    {
      year: { en: "The Formation", fr: "La Formation" },
      title: { en: "Education & Early Leadership", fr: "Éducation et Leadership Initial" },
      body: {
        en: "Samuel pursued academic and leadership development with the same intentionality he brought to faith. Early in his journey he began understanding that knowledge without service is incomplete — a lesson that would shape every season ahead.",
        fr: "Samuel a poursuivi son développement académique et son leadership avec la même intentionnalité qu'il apportait à la foi. Tôt dans son parcours, il a compris que la connaissance sans le service est incomplète — une leçon qui allait façonner chaque saison à venir.",
      },
    },
    {
      year: { en: "The Field", fr: "Le Terrain" },
      title: { en: "Fifteen Years of Practice", fr: "Quinze Ans de Pratique" },
      body: {
        en: "Over fifteen years, Samuel worked across sectors — education, governance, civil society, and the private sector — facilitating groups, building leadership culture, and contributing to institutional transformation across Africa and beyond.",
        fr: "Pendant quinze ans, Samuel a travaillé dans divers secteurs — éducation, gouvernance, société civile et secteur privé — animant des groupes, construisant une culture de leadership et contribuant à la transformation institutionnelle à travers l'Afrique et au-delà.",
      },
    },
    {
      year: { en: "2023 – 2025", fr: "2023 – 2025" },
      title: { en: "Master's in Collective Intelligence", fr: "Master en Intelligence Collective" },
      body: {
        en: "At UM6P — University Mohammed VI Polytechnic in Morocco — Samuel completed a rigorous Master's programme in Collective Intelligence, fusing his leadership experience with data science, organisational theory, and systems thinking.",
        fr: "À l'UM6P — Université Mohammed VI Polytechnique au Maroc — Samuel a complété un rigoureux programme de Master en Intelligence Collective, fusionnant son expérience en leadership avec la science des données, la théorie organisationnelle et la pensée systémique.",
      },
    },
    {
      year: { en: "Now", fr: "Maintenant" },
      title: { en: "School of Collective Intelligence", fr: "École d'Intelligence Collective" },
      body: {
        en: "Today Samuel serves as Junior Program Officer at the School of Collective Intelligence, UM6P — designing programmes, facilitating strategic learning, and working to unlock the potential already present in people, teams, and institutions.",
        fr: "Aujourd'hui Samuel est Junior Program Officer à l'École d'Intelligence Collective, UM6P — concevant des programmes, facilitant l'apprentissage stratégique et travaillant à libérer le potentiel déjà présent dans les personnes, les équipes et les institutions.",
      },
    },
  ],

  // ── Closing scripture quote ───────────────────────────────────
  quote: {
    text: {
      en: "\"For I know the plans I have for you,\" declares the Lord, \"plans to prosper you and not to harm you, plans to give you hope and a future.\"",
      fr: "« Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance. »",
    },
    cite: { en: "— Jeremiah 29:11", fr: "— Jérémie 29:11" },
  },
} satisfies Record<string, unknown>;
