// lib/i18n/feedback.ts — Feedback widget bilingual content
import type { Lang } from "./types";

export const feedbackTranslations = {
  title: {
    en: "Share Feedback",
    fr: "Partagez vos Commentaires",
  },
  types: {
    bug: {
      en: "Bug Report",
      fr: "Signaler un Bug",
    },
    idea: {
      en: "Idea / Improvement",
      fr: "Idée / Amélioration",
    },
  },
  labels: {
    bugDescription: {
      en: "Describe the bug",
      fr: "Décrivez le bug",
    },
    ideaDescription: {
      en: "Describe your idea",
      fr: "Décrivez votre idée",
    },
    email: {
      en: "Email",
      fr: "Email",
    },
    optional: {
      en: "(optional)",
      fr: "(optionnel)",
    },
  },
  placeholders: {
    bugMessage: {
      en: "What happened? What did you expect?",
      fr: "Que s'est-il passé ? Qu'attendiez-vous ?",
    },
    ideaMessage: {
      en: "What would make this better?",
      fr: "Qu'est-ce qui rendrait cela meilleur ?",
    },
    email: {
      en: "you@example.com",
      fr: "vous@exemple.com",
    },
  },
  buttons: {
    send: {
      en: "Send Feedback",
      fr: "Envoyer",
    },
    sending: {
      en: "Sending…",
      fr: "Envoi…",
    },
  },
  success: {
    title: {
      en: "Thank you!",
      fr: "Merci !",
    },
    message: {
      en: "Your feedback was received",
      fr: "Vos commentaires ont été reçus",
    },
  },
  toasts: {
    bugSuccess: {
      en: "Bug report received — thank you!",
      fr: "Rapport de bug reçu — merci !",
    },
    ideaSuccess: {
      en: "Improvement idea received — thank you!",
      fr: "Idée d'amélioration reçue — merci !",
    },
    error: {
      en: "Failed to send feedback. Please try again.",
      fr: "Échec de l'envoi. Veuillez réessayer.",
    },
  },
} satisfies Record<string, any>;
