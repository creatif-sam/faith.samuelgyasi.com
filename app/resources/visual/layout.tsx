import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveLocale, pageAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = resolveLocale((await headers()).get("x-locale"));
  return {
    title: "Visual Library",
    description:
      "Video teachings, talks, and photo galleries from Samuel Kobina Gyasi exploring the depths of faith and theology.",
    openGraph: {
      title: "Visual Library — Samuel Kobina Gyasi",
      description: "Video teachings, talks, and photo galleries exploring faith and theology.",
    },
    alternates: pageAlternates(lang, "/resources/visual"),
  };
}

export default function VisualLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
