import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Space_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/organisms/CustomCursor";

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

export const metadata: Metadata = {
  title: "Samuel Gyasi — Spirituality · Leadership · Transformation",
  description: "Rooted in the Word. Refined by Purpose. Rising to Transform.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${cormorant.variable} ${spaceMono.variable}`}
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}

