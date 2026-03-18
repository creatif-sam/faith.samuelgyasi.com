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

  const { data: related } = await supabase
    .from("blog_posts")
    .select("id,title,slug,category,read_time_minutes,created_at")
    .eq("published", true)
    .eq("category", post.category)
    .neq("slug", slug)
    .order("created_at", { ascending: false })
    .limit(3);

  return <ArticleClient post={post} related={related ?? []} />;
}
