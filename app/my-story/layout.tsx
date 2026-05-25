import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Story",
  description:
    "The story of Samuel Kobina Gyasi — a journey of faith, conviction, and purpose rooted in the Word of God.",
  openGraph: {
    title: "My Story — Samuel Kobina Gyasi",
    description:
      "A journey of faith, conviction, and purpose rooted in the Word of God.",
  },
};

export default function MyStoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
