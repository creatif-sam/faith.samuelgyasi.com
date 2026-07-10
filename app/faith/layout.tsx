import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveLocale, pageAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = resolveLocale((await headers()).get("x-locale"));
  return {
    title: "Faith",
    description:
      "Core beliefs, spiritual journey, and scripture that anchor Samuel Kobina Gyasi's walk with God — faith over fear, rooted in the Word.",
    openGraph: {
      title: "Faith — Samuel Kobina Gyasi",
      description:
        "Core beliefs, spiritual journey, and scripture that anchor Samuel Kobina Gyasi's walk with God.",
    },
    alternates: pageAlternates(lang, "/faith"),
  };
}

export default function FaithLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
