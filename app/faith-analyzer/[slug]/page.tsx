import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { resolveLocale, pageAlternates } from "@/lib/seo";
import TestPageClient from "./TestPageClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = resolveLocale((await headers()).get("x-locale"));
  const supabase = await createClient();
  const { data: test } = await supabase
    .from("faith_tests")
    .select("name_en, name_fr, description_en, description_fr")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!test) return { title: "Test Not Found" };

  const name = locale === "fr" && test.name_fr ? test.name_fr : test.name_en;
  const description = locale === "fr" && test.description_fr ? test.description_fr : test.description_en;

  return {
    title: `${name} — Faith Analyzer`,
    description: description ?? undefined,
    openGraph: { title: name, description: description ?? undefined },
    alternates: pageAlternates(locale, `/faith-analyzer/${slug}`),
  };
}

export default async function TestPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: test } = await supabase
    .from("faith_tests")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!test) notFound();

  const { data: questions } = await supabase
    .from("faith_test_questions")
    .select("*")
    .eq("test_id", test.id)
    .order("sort_order", { ascending: true });

  return <TestPageClient test={test} questions={questions ?? []} />;
}
