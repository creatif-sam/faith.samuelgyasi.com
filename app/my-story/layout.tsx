import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveLocale, pageAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = resolveLocale((await headers()).get("x-locale"));
  return {
    title: "My Story",
    description:
      "The story of Samuel Kobina Gyasi — a journey of faith, conviction, and purpose rooted in the Word of God.",
    openGraph: {
      title: "My Story — Samuel Kobina Gyasi",
      description:
        "A journey of faith, conviction, and purpose rooted in the Word of God.",
    },
    alternates: pageAlternates(lang, "/my-story"),
  };
}

export default function MyStoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
