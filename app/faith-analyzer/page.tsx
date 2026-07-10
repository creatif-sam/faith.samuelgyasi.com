import type { Metadata } from "next";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { resolveLocale, pageAlternates } from "@/lib/seo";
import AnalyzerListClient from "./AnalyzerListClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = resolveLocale((await headers()).get("x-locale"));
  const title = lang === "fr" ? "Analyseur de Foi" : "Faith Analyzer";
  const description =
    lang === "fr"
      ? "Évaluez votre foi à travers des tests bibliques conçus pour vous aider à grandir spirituellement."
      : "Assess your faith through biblical tests designed to help you grow spiritually.";
  return {
    title,
    description,
    openGraph: { title: `${title} — Samuel Kobina Gyasi`, description },
    alternates: pageAlternates(lang, "/faith-analyzer"),
  };
}

export default async function AnalyzerPage() {
  const supabase = await createClient();
  const { data: tests } = await supabase
    .from("faith_tests")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return <AnalyzerListClient initialTests={tests ?? []} />;
}
