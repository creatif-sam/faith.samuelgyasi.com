import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale";
import { SITE_URL } from "@/lib/seo";

const STATIC_PATHS: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
  { path: "/faith", changeFrequency: "monthly", priority: 0.8 },
  { path: "/my-story", changeFrequency: "monthly", priority: 0.7 },
  { path: "/credo", changeFrequency: "monthly", priority: 0.7 },
  { path: "/resources", changeFrequency: "weekly", priority: 0.7 },
  { path: "/resources/ebooks", changeFrequency: "weekly", priority: 0.6 },
  { path: "/resources/reviews", changeFrequency: "weekly", priority: 0.6 },
  { path: "/resources/audio", changeFrequency: "weekly", priority: 0.6 },
  { path: "/resources/visual", changeFrequency: "weekly", priority: 0.6 },
  { path: "/resources/trainings", changeFrequency: "weekly", priority: 0.6 },
  { path: "/upcoming", changeFrequency: "weekly", priority: 0.6 },
  { path: "/faith-analyzer", changeFrequency: "monthly", priority: 0.5 },
  { path: "/testimonials", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SITE_URL;
  const supabase = await createClient();

  const [
    { data: posts },
    { data: events },
    { data: libraryItems },
    { data: faithTests },
  ] = await Promise.all([
    supabase.from("blog_posts").select("slug, created_at").eq("published", true),
    supabase.from("upcoming_events").select("id, event_date").eq("published", true),
    supabase.from("library_items").select("id, created_at").eq("published", true),
    supabase.from("faith_tests").select("slug, created_at").eq("published", true),
  ]);

  const languages = (path: string) =>
    Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, `${siteUrl}/${l}${path}`]));

  const staticRoutes: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    STATIC_PATHS.map(({ path, changeFrequency, priority }) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: { languages: languages(path) },
    })),
  );

  const postRoutes: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    (posts ?? []).map((post) => ({
      url: `${siteUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages: languages(`/blog/${post.slug}`) },
    })),
  );

  const eventRoutes: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    (events ?? []).map((event) => ({
      url: `${siteUrl}/${locale}/upcoming/${event.id}`,
      lastModified: event.event_date ? new Date(event.event_date) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
      alternates: { languages: languages(`/upcoming/${event.id}`) },
    })),
  );

  const libraryRoutes: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    (libraryItems ?? []).map((item) => ({
      url: `${siteUrl}/${locale}/resources/${item.id}`,
      lastModified: new Date(item.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.5,
      alternates: { languages: languages(`/resources/${item.id}`) },
    })),
  );

  const faithTestRoutes: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    (faithTests ?? []).map((test) => ({
      url: `${siteUrl}/${locale}/faith-analyzer/${test.slug}`,
      lastModified: new Date(test.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.4,
      alternates: { languages: languages(`/faith-analyzer/${test.slug}`) },
    })),
  );

  return [...staticRoutes, ...postRoutes, ...eventRoutes, ...libraryRoutes, ...faithTestRoutes];
}
