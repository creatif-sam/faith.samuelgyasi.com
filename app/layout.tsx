import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Space_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/organisms/CustomCursor";
import { CookieBanner } from "@/components/organisms/CookieBanner";
import { Analytics } from "@/components/Analytics";
import { Providers } from "./providers";
import { NavWrapper } from "@/components/organisms/NavWrapper";
import { FeedbackWidget } from "@/components/organisms/FeedbackWidget";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://faith.samuelgyasi.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Faith — Samuel Kobina Gyasi",
    template: "%s | Samuel Kobina Gyasi",
  },
  description:
    "A bilingual (EN/FR) space of faith, scripture, and sacred conviction. Samuel Kobina Gyasi — anchored in the Word, walking in purpose.",
  keywords: [
    "Samuel Gyasi faith",
    "Samuel Kobina Gyasi",
    "biblical faith",
    "Christian blog",
    "foi chrétienne",
    "Samuel Gyasi Ghana",
    "faith and scripture",
    "spiritual reflections",
    "theology blog bilingual",
    "Ghanaian Christian writer",
    "faith over fear",
    "foi et conviction",
  ],
  authors: [{ name: "Samuel Kobina Gyasi", url: siteUrl }],
  creator: "Samuel Kobina Gyasi",
  publisher: "Samuel Kobina Gyasi",
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: siteUrl,
    siteName: "Samuel Kobina Gyasi — Faith",
    title: "Faith — Samuel Kobina Gyasi",
    description:
      "Bilingual reflections on faith, scripture, and the sacred journey of trusting God.",
    images: [
      {
        url: "/photo-hero.png",
        width: 1200,
        height: 630,
        alt: "Samuel Kobina Gyasi",
      },
    ],
    firstName: "Samuel",
    lastName: "Gyasi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Faith — Samuel Kobina Gyasi",
    description: "Bilingual reflections on faith, scripture, and the sacred journey of trusting God.",
    images: ["/photo-hero.png"],
    creator: "@samuel_gsi",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: siteUrl },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Samuel Kobina Gyasi",
  alternateName: ["Samuel Gyasi", "Samuel K. Gyasi"],
  url: siteUrl,
  image: `${siteUrl}/photo-hero.png`,
  jobTitle: "Scholar · Leader · Speaker",
  description:
    "Samuel Kobina Gyasi is a scholar, leader, and speaker rooted in faith, dedicated to transformative leadership and community impact.",
  nationality: { "@type": "Country", name: "Ghana" },
  sameAs: [
    "https://www.linkedin.com/in/samuel-k-gyasi/",
    "https://web.facebook.com/samuel.kobinagyasi/",
    "https://www.instagram.com/samuel_gsi",
    "https://www.tiktok.com/@samuel_gsi",
  ],
  knowsAbout: [
    "Faith",
    "Leadership",
    "Collective Intelligence",
    "Transformation",
    "Intellectuality",
    "Community Development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${cormorant.variable} ${spaceMono.variable}`}
      >
        <Providers>
          <CustomCursor />
          <Analytics />
          <NavWrapper />
          {children}
          <FeedbackWidget />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}


