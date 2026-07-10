import type { Metadata } from "next";
import { headers } from "next/headers";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { SiteToaster } from "@/components/organisms/SiteToaster";
import { CookieBanner } from "@/components/organisms/CookieBanner";
import { Analytics } from "@/components/Analytics";
import { Providers } from "./providers";
import { NavWrapper } from "@/components/organisms/NavWrapper";
import { FeedbackWidget } from "@/components/organisms/FeedbackWidget";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { resolveLocale, pageAlternates, SITE_URL } from "@/lib/seo";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const lang = resolveLocale((await headers()).get("x-locale"));

  return {
    metadataBase: new URL(SITE_URL),
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
    authors: [{ name: "Samuel Kobina Gyasi", url: SITE_URL }],
    creator: "Samuel Kobina Gyasi",
    publisher: "Samuel Kobina Gyasi",
    openGraph: {
      type: "profile",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      url: `${SITE_URL}/${lang}`,
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
    alternates: pageAlternates(lang, ""),
  };
}

const personJsonLd = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Samuel Kobina Gyasi",
  alternateName: ["Samuel Gyasi", "Samuel K. Gyasi"],
  url: SITE_URL,
  image: `${SITE_URL}/photo-hero.png`,
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

const websiteJsonLd = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Faith — Samuel Kobina Gyasi",
  description:
    "A bilingual (EN/FR) space of faith, scripture, and sacred conviction.",
  publisher: { "@id": `${SITE_URL}/#person` },
  inLanguage: ["en", "fr"],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [personJsonLd, websiteJsonLd],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lang = resolveLocale((await headers()).get("x-locale"));

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${poppins.variable}`}
      >
        <Providers initialLang={lang}>
          <Analytics />
          <NavWrapper />
          {children}
          <ThemeSwitcher />
          <FeedbackWidget />
          <CookieBanner />
          <SiteToaster />
        </Providers>
      </body>
    </html>
  );
}


