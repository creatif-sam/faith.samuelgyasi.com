import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ArticleClient } from "./ArticleClient";
import { resolveLocale, pageAlternates, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = resolveLocale((await headers()).get("x-locale"));
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, title_fr, excerpt, excerpt_fr, featured_image_url")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (!post) return { title: "Not Found" };
  const title = locale === "fr" && post.title_fr ? post.title_fr : post.title;
  const excerpt = locale === "fr" && post.excerpt_fr ? post.excerpt_fr : post.excerpt;
  const images = post.featured_image_url ? [{ url: post.featured_image_url }] : undefined;
  return {
    title: `${title} — Faith Journal`,
    description: excerpt ?? undefined,
    openGraph: {
      title,
      description: excerpt ?? undefined,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: excerpt ?? undefined,
      images,
    },
    alternates: pageAlternates(locale, `/blog/${slug}`),
  };
}

export default async function FaithBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const locale = resolveLocale((await headers()).get("x-locale"));
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (!post) notFound();

  // Get tags for this post
  const { data: postTags } = await supabase
    .from("blog_post_tags")
    .select("blog_tag_id")
    .eq("blog_post_id", post.id);
  
  const tagIds = postTags?.map(pt => pt.blog_tag_id) ?? [];
  
  // Get related posts based on shared tags
  let relatedPosts: any[] = [];
  
  if (tagIds.length > 0) {
    // Find posts that share at least one tag
    const { data: tagRelated } = await supabase
      .from("blog_post_tags")
      .select("blog_post_id")
      .in("blog_tag_id", tagIds)
      .neq("blog_post_id", post.id);
    
    if (tagRelated && tagRelated.length > 0) {
      // Count shared tags per post and get post details
      const postIdCounts = tagRelated.reduce((acc, item) => {
        acc[item.blog_post_id] = (acc[item.blog_post_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const sortedPostIds = Object.entries(postIdCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([id]) => id)
        .slice(0, 6);
      
      if (sortedPostIds.length > 0) {
        const { data } = await supabase
          .from("blog_posts")
          .select("id,title,title_fr,slug,category,excerpt,excerpt_fr,read_time_minutes,created_at,featured_image_url")
          .eq("published", true)
          .in("id", sortedPostIds)
          .limit(6);
        
        relatedPosts = data ?? [];
      }
    }
  }
  
  // If we don't have enough related posts, fill with category-based recommendations
  if (relatedPosts.length < 3) {
    const { data: categoryRelated } = await supabase
      .from("blog_posts")
      .select("id,title,title_fr,slug,category,excerpt,excerpt_fr,read_time_minutes,created_at,featured_image_url")
      .eq("published", true)
      .eq("category", post.category)
      .neq("slug", slug)
      .order("created_at", { ascending: false })
      .limit(6);

    // Merge and deduplicate
    const existingIds = new Set(relatedPosts.map(p => p.id));
    const additionalPosts = (categoryRelated ?? []).filter(p => !existingIds.has(p.id));
    relatedPosts = [...relatedPosts, ...additionalPosts].slice(0, 6);
  }

  // Chronological navigation to the closest newer / older published post.
  // Ties on created_at (e.g. bulk-seeded posts) are broken by id so every
  // post still has a well-defined neighbour instead of missing one.
  const [{ data: newerPost }, { data: olderPost }] = await Promise.all([
    supabase.from("blog_posts")
      .select("title,title_fr,slug")
      .eq("published", true)
      .or(`created_at.gt.${post.created_at},and(created_at.eq.${post.created_at},id.gt.${post.id})`)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase.from("blog_posts")
      .select("title,title_fr,slug")
      .eq("published", true)
      .or(`created_at.lt.${post.created_at},and(created_at.eq.${post.created_at},id.lt.${post.id})`)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const title = locale === "fr" && post.title_fr ? post.title_fr : post.title;
  const excerpt = locale === "fr" && post.excerpt_fr ? post.excerpt_fr : post.excerpt;
  const postUrl = `${SITE_URL}/${locale}/blog/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt ?? undefined,
    image: post.featured_image_url ?? undefined,
    datePublished: post.created_at,
    dateModified: post.created_at,
    inLanguage: locale,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    url: postUrl,
    author: { "@type": "Person", name: "Samuel Kobina Gyasi", url: SITE_URL },
    publisher: {
      "@type": "Person",
      name: "Samuel Kobina Gyasi",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleClient post={post} related={relatedPosts} newerPost={newerPost} olderPost={olderPost} />
    </>
  );
}
