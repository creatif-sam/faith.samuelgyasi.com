import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ArticleClient } from "./ArticleClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — Faith Journal`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
    },
  };
}

export default async function FaithBlogPostPage({ params }: Props) {
  const { slug } = await params;
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

  return <ArticleClient post={post} related={relatedPosts} />;
}
