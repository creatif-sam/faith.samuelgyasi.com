// molecules/FaithBlogStrip.tsx — blog call-to-action strip
"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { faithTranslations as t } from "../translations";
import type { Lang } from "../translations";
import { localizedHref } from "@/lib/i18n/locale";

export function FaithBlogStrip({ lang }: { lang: Lang }) {
  const b = t.blogStrip;
  return (
    <div className="blog-strip">
      <div className="bs-eyebrow">{b.eyebrow[lang]}</div>
      <h2 className="bs-title">
        {b.title[lang]}<br />
        <em>{b.titleEm[lang]}</em>
      </h2>
      <p className="bs-sub">{b.sub[lang]}</p>
      <div className="bs-btns">
        <Link href={localizedHref(lang, "/blog")} className="bs-btn" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {b.btnBlog[lang]} <ArrowRight size={14} />
        </Link>
        <Link href={localizedHref(lang, "/my-story")} className="bs-btn ghost" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {b.btnCredo[lang]} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
