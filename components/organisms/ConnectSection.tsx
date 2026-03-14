import { SectionLabel } from "@/components/atoms/SectionLabel";
import { ConnectLink } from "@/components/molecules/ConnectLink";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";

const connectLinks = [
  { href: "mailto:samuel.gyasi@email.com", label: "Email"    },
  { href: "#",                              label: "LinkedIn" },
  { href: "#",                              label: "Speaking" },
  { href: "#",                              label: "Ministry" },
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
              Whether you&apos;re seeking spiritual counsel, leadership collaboration,
              intellectual dialogue, or transformational partnership — Samuel is open to
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
