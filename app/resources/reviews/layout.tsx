import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveLocale, pageAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = resolveLocale((await headers()).get("x-locale"));
  return {
    title: "Book Reviews",
    description:
      "Honest reflections by Samuel Kobina Gyasi on the books that have shaped, challenged, and deepened his thinking on theology, leadership, and human flourishing.",
    openGraph: {
      title: "Book Reviews — Samuel Kobina Gyasi",
      description: "Honest reflections on books that shape theology, leadership, and human flourishing.",
    },
    alternates: pageAlternates(lang, "/resources/reviews"),
  };
}

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
