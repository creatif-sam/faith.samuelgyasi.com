import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveLocale, pageAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = resolveLocale((await headers()).get("x-locale"));
  return {
    title: "Credo",
    description:
      "Samuel Kobina Gyasi's personal credo — the core convictions, beliefs, and principles that shape his faith and life.",
    openGraph: {
      title: "Credo — Samuel Kobina Gyasi",
      description:
        "The core convictions, beliefs, and principles that shape Samuel's faith and life.",
    },
    alternates: pageAlternates(lang, "/credo"),
  };
}

export default function CredoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
