import type { Metadata } from "next";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { resolveLocale, pageAlternates } from "@/lib/seo";
import TestimonialsPageClient from "./TestimonialsPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = resolveLocale((await headers()).get("x-locale"));
  const title = "Testimonials";
  const description =
    lang === "fr"
      ? "Témoignages de ceux qui ont marché aux côtés de Samuel Kobina Gyasi, été encadrés par lui, ou collaboré avec lui à travers continents et vocations."
      : "Words from those who have walked alongside, been mentored by, or collaborated with Samuel Kobina Gyasi across continents and callings.";
  return {
    title,
    description,
    openGraph: { title: `${title} — Samuel Kobina Gyasi`, description },
    alternates: pageAlternates(lang, "/testimonials"),
  };
}

export default async function TestimonialsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("id,name,role,company,avatar_url,quote,rating")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(12);

  return <TestimonialsPageClient initialItems={data ?? []} />;
}
