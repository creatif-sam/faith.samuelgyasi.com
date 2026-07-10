import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveLocale, pageAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = resolveLocale((await headers()).get("x-locale"));
  return {
    title: "Audio Library",
    description:
      "Spoken teachings, sermons, and reflections on faith, Scripture, and the Christian walk from Samuel Kobina Gyasi.",
    openGraph: {
      title: "Audio Library — Samuel Kobina Gyasi",
      description: "Spoken teachings, sermons, and reflections on faith, Scripture, and the Christian walk.",
    },
    alternates: pageAlternates(lang, "/resources/audio"),
  };
}

export default function AudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
