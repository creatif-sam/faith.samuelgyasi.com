import { SectionLabel } from "@/components/atoms/SectionLabel";
import { PillarCard } from "@/components/molecules/PillarCard";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";

const pillars = [
  {
    icon: "◯",
    name: "Beliefs",
    href: "/faith",
    description:
      "Samuel's life is anchored in deep spiritual conviction and the wisdom found in sacred scripture. His faith is not passive doctrine but a living, active force that shapes how he thinks, leads, and engages with the world — the quiet centre from which everything else radiates.",
    verse: '"Your word is a lamp to my feet and a light to my path." — Psalm 119:105',
  },
  {
    icon: "▲",
    name: "Leadership",
    href: "/leadership",
    description:
      "Samuel leads as a servant first — drawing from the model of Christ-centred leadership. He inspires, empowers, and calls forth greatness in others, understanding that true authority is born of character, not position.",
    verse: '"Whoever wants to become great among you must be your servant." — Matthew 20:26',
  },
  {
    icon: "◆",
    name: "Intellectuality",
    href: "/intellectuality",
    description:
      "The mind is a gift from God and Samuel wields it with discipline. He pursues deep thinking, rigorous study, and intellectual honesty — believing that faith and reason are not adversaries but partners in the search for truth.",
    verse: '"Love the Lord your God with all your mind." — Matthew 22:37',
  },
  {
    icon: "◎",
    name: "Transformation",
    href: "/transformation",
    description:
      "Change that lasts begins from within and works outward. Samuel is a catalyst — carrying a vision for individuals, communities, and nations to be renewed, restored, and elevated to the fullness of their God-given potential.",
    verse: '"Be transformed by the renewing of your mind." — Romans 12:2',
  },
];

export function PillarsSection() {
  return (
    <section id="pillars" className="portfolio-section pillars-section">
      <div className="section-inner">
        <SectionLabel>Four Pillars</SectionLabel>

        <ScrollReveal className="pillars-header">
          <h2 className="pillars-title">Four Pillars of a Life Well-Lived</h2>
          <p className="pillars-sub">
            Every pillar is a commitment — to belief, to excellence, and to the flourishing of
            humanity.
          </p>
        </ScrollReveal>

        <div className="pillars-grid">
          {pillars.map((pillar) => (
            <ScrollReveal key={pillar.name}>
              <PillarCard
                icon={pillar.icon}
                name={pillar.name}
                href={pillar.href}
                description={pillar.description}
                verse={pillar.verse}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
