import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveLocale, pageAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = resolveLocale((await headers()).get("x-locale"));
  return {
    title: { default: "Resources", template: "%s | Samuel Kobina Gyasi" },
    description:
      "Books, teachings, and tools curated by Samuel Kobina Gyasi to strengthen faith, deepen scripture study, and nurture spiritual growth.",
    openGraph: {
      title: "Resources — Samuel Kobina Gyasi",
      description:
        "Books, teachings, and tools to strengthen faith, deepen scripture study, and nurture spiritual growth.",
    },
    alternates: pageAlternates(lang, "/resources"),
  };
}

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
