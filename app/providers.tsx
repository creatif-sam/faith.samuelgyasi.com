"use client";
import { ThemeProvider } from "next-themes";
import { LangProvider } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

interface ProvidersProps {
  children: React.ReactNode;
  initialLang?: Lang;
  urlControlled?: boolean;
}

export function Providers({ children, initialLang, urlControlled }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LangProvider initialLang={initialLang} urlControlled={urlControlled}>
        {children}
      </LangProvider>
    </ThemeProvider>
  );
}
