import type { Metadata } from "next";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { resolveLocale, pageAlternates } from "@/lib/seo";
import BookViewClient from "./BookViewClient";

export const dynamic = "force-dynamic";

interface Params {
  params: { id: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = params;
  const lang = resolveLocale((await headers()).get("x-locale"));
  const db = await createClient();
  const { data: item } = await db
    .from("library_items")
    .select("title, author, description, cover_url")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (!item) return { title: "Not Found" };

  const description = item.description ?? undefined;
  const images = item.cover_url ? [{ url: item.cover_url }] : undefined;

  return {
    title: item.author ? `${item.title} by ${item.author}` : item.title,
    description,
    openGraph: { title: item.title, description, images },
    twitter: { card: "summary_large_image", title: item.title, description, images },
    alternates: pageAlternates(lang, `/resources/${id}`),
  };
}

export default async function BookViewPage({ params }: Params) {
  const { id } = params;
  const db = await createClient();

  const { data: item } = await db
    .from("library_items")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (!item) notFound();

  return <BookViewClient item={item} />;
}
