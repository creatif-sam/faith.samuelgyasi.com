import { SectionLabel } from "@/components/atoms/SectionLabel";
import { ConnectLink } from "@/components/molecules/ConnectLink";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";

const connectLinks = [
  { href: "mailto:impact@samuelgyasi.com",                                                    label: "Email"    },
  { href: "https://www.linkedin.com/in/samuel-k-gyasi/",                                      label: "LinkedIn" },
  { href: "https://www.instagram.com/samuel_gsi?igsh=MWswMzRycjk1dXZ0cw==",                  label: "Instagram"},
  { href: "https://www.tiktok.com/@samuel_gsi?_r=1&_t=ZS-94iqxzPNKqm",                       label: "TikTok"   },
];

export function ConnectSection() {
  return (
    <section id="connect" className="portfolio-section connect-section">
      <div className="section-inner">
        <SectionLabel>Get in Touch</SectionLabel>

        <div className="connect-layout">
          <ScrollReveal>
            <h2 className="connect-title">
              Let&apos;s Build<br />
              Something<br />
              <em>Eternal</em>
            </h2>
            <p className="connect-body">
              Whether you are seeking spiritual counsel, a word of encouragement, prayer
              partnership, or simply a conversation rooted in faith — Samuel is open to
              meaningful connection.
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
