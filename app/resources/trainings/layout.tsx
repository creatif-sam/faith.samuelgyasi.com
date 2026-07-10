import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveLocale, pageAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = resolveLocale((await headers()).get("x-locale"));
  return {
    title: "Trainings",
    description:
      "Structured learning journeys on faith, leadership, and personal development from Samuel Kobina Gyasi.",
    openGraph: {
      title: "Trainings — Samuel Kobina Gyasi",
      description: "Structured learning journeys on faith, leadership, and personal development.",
    },
    alternates: pageAlternates(lang, "/resources/trainings"),
  };
}

export default function TrainingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
