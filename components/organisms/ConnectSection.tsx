"use client";

import { SectionLabel } from "@/components/atoms/SectionLabel";
import { ConnectLink } from "@/components/molecules/ConnectLink";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { useLang } from "@/lib/i18n";

const connectLinks = [
  { href: "mailto:impact@samuelgyasi.com",                                                    label: "Email"    },
  { href: "https://www.linkedin.com/in/samuel-k-gyasi/",                                      label: "LinkedIn" },
  { href: "https://www.instagram.com/samuel_gsi?igsh=MWswMzRycjk1dXZ0cw==",                  label: "Instagram"},
  { href: "https://www.tiktok.com/@samuel_gsi?_r=1&_t=ZS-94iqxzPNKqm",                       label: "TikTok"   },
];

const ct = {
  label:  { en: "Get in Touch",     fr: "Prendre Contact"   },
  title:  { en: "Let\u2019s Build\nSomething\nEternal",       fr: "Construisons\nQuelque Chose\nd\u2019\u00c9ternel" },
  body:   {
    en: "Whether you are seeking spiritual counsel, a word of encouragement, prayer partnership, or simply a conversation rooted in faith \u2014 Samuel is open to meaningful connection.",
    fr: "Que vous cherchiez un conseil spirituel, un mot d\u2019encouragement, un partenariat de pri\u00e8re, ou simplement une conversation enracin\u00e9e dans la foi \u2014 Samuel est ouvert \u00e0 une connexion authentique.",
  },
};

export function ConnectSection() {
  const { lang } = useLang();
  const titleLines = ct.title[lang].split("\n");

  return (
    <section id="connect" className="portfolio-section connect-section">
      <div className="section-inner">
        <SectionLabel>{ct.label[lang]}</SectionLabel>

        <div className="connect-layout">
          <ScrollReveal>
            <h2 className="connect-title">
              {titleLines[0]}<br />
              {titleLines[1]}<br />
              <em>{titleLines[2]}</em>
            </h2>
            <p className="connect-body">
              {ct.body[lang]}
            </p>
          </ScrollReveal>

          <ScrollReveal className="connect-links">
            {connectLinks.map((link) => (
              <ConnectLink key={link.label} href={link.href} label={link.label} />
            ))}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
