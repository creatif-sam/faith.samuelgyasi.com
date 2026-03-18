// molecules/FaithConnect.tsx — connect / contact section
"use client";
import React from "react";
import Link from "next/link";
import { faithTranslations as t } from "../translations";
import type { Lang } from "../translations";

export function FaithConnect({ lang }: { lang: Lang }) {
  const c = t.connect;
  return (
    <section id="connect">
      <div>
        <h2 className="connect-title">
          {c.title1[lang]}<br />
          {c.title2[lang]}<br />
          <em>{c.titleEm[lang]}</em>
        </h2>
        <p className="connect-body">{c.body[lang]}</p>
      </div>
      <div className="connect-links">
        <a href="mailto:samuel.gyasi@um6p.ma" className="c-link">
          {c.links.email[lang]} <span>→</span>
        </a>
        <Link href="/my-story" className="c-link">
          {c.links.credo[lang]} <span>→</span>
        </Link>
        <Link href="/blog" className="c-link">
          {c.links.blog[lang]} <span>→</span>
        </Link>
      </div>
    </section>
  );
}
