import type { Metadata } from "next";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { resolveLocale, pageAlternates } from "@/lib/seo";
import BlogListClient from "./BlogListClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = resolveLocale((await headers()).get("x-locale"));
  const title = lang === "fr" ? "Journal de Foi" : "Faith Journal";
  const description =
    lang === "fr"
      ? "Réflexions sur les Écritures, la conviction sacrée et la pratique quotidienne de faire confiance à Dieu à chaque pas."
      : "Reflections on scripture, sacred conviction, and the daily practice of trusting God with every step.";
  return {
    title,
    description,
    openGraph: { title: `${title} — Samuel Kobina Gyasi`, description },
    alternates: pageAlternates(lang, "/blog"),
  };
}

export default async function FaithBlogPage() {
  const supabase = await createClient();
  const [{ data: posts }, { data: seriesList }] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("id,title,title_fr,slug,category,excerpt,excerpt_fr,read_time_minutes,featured_image_url,youtube_url,created_at,series_id,series_order")
      .eq("published", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("blog_series")
      .select("id,name_en,name_fr,slug,description_en,description_fr,image_url,show_dates,sort_order")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
  ]);

  return <BlogListClient initialPosts={posts ?? []} initialSeriesList={seriesList ?? []} />;
}
