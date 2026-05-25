import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credo",
  description:
    "Samuel Kobina Gyasi's personal credo — the core convictions, beliefs, and principles that shape his faith and life.",
  openGraph: {
    title: "Credo — Samuel Kobina Gyasi",
    description:
      "The core convictions, beliefs, and principles that shape Samuel's faith and life.",
  },
};

export default function CredoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
