// molecules/FaithNav.tsx — fixed navigation bar for the faith page
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LangToggle } from "../atoms/LangToggle";
import type { Lang } from "../translations";
import { faithTranslations as t } from "../translations";
import { localizedHref } from "@/lib/i18n/locale";

interface FaithNavProps {
  lang: Lang;
  onToggleLang: () => void;
}

const NAV_LINKS = [
  { path: "/blog",      label: { en: "Journal",     fr: "Journal"      } },
  { path: "/my-story", label: { en: "My Story",   fr: "Mon Histoire"  } },
  { path: "/#connect", label: { en: "Connect",    fr: "Connexion"     } },
];

export function FaithNav({ lang, onToggleLang }: FaithNavProps) {
  const pathname = usePathname();

  return (
    <nav>
      <Link href={localizedHref(lang, "/faith")} className="nav-back">{t.nav.back[lang]}</Link>
      <div className="nav-links">
        {NAV_LINKS.map(({ path, label }) => (
          <Link
            key={path}
            href={path.startsWith("/#") ? `/${lang}${path.slice(1)}` : localizedHref(lang, path)}
            className={`nav-link${pathname.startsWith(path) && path !== "/faith#connect" ? " nav-link--active" : ""}`}
          >
            {label[lang]}
          </Link>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <LangToggle lang={lang} onToggle={onToggleLang} />
        <div className="nav-tag">{t.nav.tag[lang]}</div>
      </div>
    </nav>
  );
}
