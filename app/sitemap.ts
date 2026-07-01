import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale";

const STATIC_PATHS: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
  { path: "/faith", changeFrequency: "monthly", priority: 0.8 },
  { path: "/my-story", changeFrequency: "monthly", priority: 0.7 },
  { path: "/credo", changeFrequency: "monthly", priority: 0.7 },
  { path: "/resources", changeFrequency: "weekly", priority: 0.7 },
  { path: "/upcoming", changeFrequency: "weekly", priority: 0.6 },
  { path: "/testimonials", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://faith.samuelgyasi.com";
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, created_at")
    .eq("published", true);

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

  return [...staticRoutes, ...postRoutes];
}
