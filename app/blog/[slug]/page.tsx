import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts } from "../blog-data";
import { ArticleClient } from "./ArticleClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.en.title} — Faith Journal`,
    description: post.en.excerpt,
    openGraph: {
      title: post.en.title,
      description: post.en.excerpt,
    },
  };
}

export default async function FaithBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();
  return <ArticleClient post={post} />;
}
