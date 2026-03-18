"use client";
import { ThemeProvider } from "next-themes";
import { LangProvider } from "@/lib/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LangProvider>
        {children}
      </LangProvider>
    </ThemeProvider>
  );
}
