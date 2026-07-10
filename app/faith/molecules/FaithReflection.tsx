// molecules/FaithReflection.tsx — central reflection quote
"use client";
import React from "react";
import { Sparkle } from "lucide-react";
import { faithTranslations as t } from "../translations";
import type { Lang } from "../translations";

export function FaithReflection({ lang }: { lang: Lang }) {
  const r = t.reflection;
  // Split raw quote into lines, bold the key word
  const rawLines = r.quote[lang].replace(/^[«""]|[»""]$/g, "").split("\n");
  const strong = r.quoteStrong[lang];
  return (
    <section id="reflection">
      <div className="reflection-inner">
        <div className="refl-ornament" style={{ display: "flex", justifyContent: "center", gap: 14, color: "#ffde59" }}>
          <Sparkle size={18} fill="currentColor" />
          <Sparkle size={18} fill="currentColor" />
          <Sparkle size={18} fill="currentColor" />
        </div>
        <blockquote className="refl-quote">
          {rawLines.map((line, i) => {
            const parts = line.split(strong);
            const last = i === rawLines.length - 1;
            return (
              <React.Fragment key={i}>
                {parts.length > 1 ? (
                  <>{parts[0]}<strong>{strong}</strong>{parts[1]}</>
                ) : line}
                {!last && <br />}
              </React.Fragment>
            );
          })}
        </blockquote>
        <div className="refl-ref">{r.ref[lang]}</div>
        <p className="refl-body">{r.body[lang]}</p>
      </div>
    </section>
  );
}
