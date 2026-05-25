import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Books, teachings, and tools curated by Samuel Kobina Gyasi to strengthen faith, deepen scripture study, and nurture spiritual growth.",
  openGraph: {
    title: "Resources — Samuel Kobina Gyasi",
    description:
      "Books, teachings, and tools to strengthen faith, deepen scripture study, and nurture spiritual growth.",
  },
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
