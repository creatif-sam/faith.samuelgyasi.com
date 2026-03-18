// molecules/FaithBlogStrip.tsx — blog call-to-action strip
"use client";
import React from "react";
import Link from "next/link";
import { faithTranslations as t } from "../translations";
import type { Lang } from "../translations";

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
        <Link href="/blog" className="bs-btn">{b.btnBlog[lang]}</Link>
        <Link href="/my-story" className="bs-btn ghost">{b.btnCredo[lang]}</Link>
      </div>
    </div>
  );
}
