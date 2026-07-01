"use client";
import { ThemeProvider } from "next-themes";
import { LangProvider } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

interface ProvidersProps {
  children: React.ReactNode;
  initialLang?: Lang;
}

export function Providers({ children, initialLang }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LangProvider initialLang={initialLang}>
        {children}
      </LangProvider>
    </ThemeProvider>
  );
}
