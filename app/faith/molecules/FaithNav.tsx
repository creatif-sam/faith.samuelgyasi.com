// molecules/FaithNav.tsx — fixed navigation bar for the faith page
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LangToggle } from "../atoms/LangToggle";
import type { Lang } from "../translations";
import { faithTranslations as t } from "../translations";

interface FaithNavProps {
  lang: Lang;
  onToggleLang: () => void;
}

const NAV_LINKS = [
  { href: "/faith/blog", label: { en: "Journal",     fr: "Journal"      } },
  { href: "/my-story",   label: { en: "My Story",   fr: "Mon Histoire"  } },
  { href: "/faith#connect", label: { en: "Connect",  fr: "Connexion"   } },
];

export function FaithNav({ lang, onToggleLang }: FaithNavProps) {
  const pathname = usePathname();

  return (
    <nav>
      <Link href="/faith" className="nav-back">{t.nav.back[lang]}</Link>
      <div className="nav-links">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`nav-link${pathname.startsWith(href) && href !== "/faith#connect" ? " nav-link--active" : ""}`}
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
