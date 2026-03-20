import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BookViewClient from "./BookViewClient";

export const dynamic = "force-dynamic";

interface Params {
  params: { id: string };
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
