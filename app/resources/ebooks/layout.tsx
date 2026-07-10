import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveLocale, pageAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = resolveLocale((await headers()).get("x-locale"));
  return {
    title: "eBooks",
    description:
      "Essays, reflections, and short books written by Samuel Kobina Gyasi on faith, leadership, collective intelligence, and the examined life.",
    openGraph: {
      title: "eBooks — Samuel Kobina Gyasi",
      description: "Essays, reflections, and short books on faith, leadership, and the examined life.",
    },
    alternates: pageAlternates(lang, "/resources/ebooks"),
  };
}

export default function EbooksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
