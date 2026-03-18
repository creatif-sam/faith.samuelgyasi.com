import { SectionLabel } from "@/components/atoms/SectionLabel";
import { PillarCard } from "@/components/molecules/PillarCard";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";

const pillars = [
  {
    icon: "◆",
    name: "Faith & Beliefs",
    href: "/faith",
    description:
      "Samuel's life is anchored in deep spiritual conviction and the living Word of God. His faith is not passive doctrine but an active force — shaping how he thinks, serves, and walks through every season. Christ is the quiet centre from which everything else radiates.",
    verse: '"Your word is a lamp to my feet and a light to my path." — Psalm 119:105',
  },
  {
    icon: "✦",
    name: "Scripture & Prayer",
    href: "/faith",
    description:
      "Daily engagement with Scripture and a consistent discipline of prayer are the pillars of Samuel's spiritual life. He believes that the Bible is both a love letter and a blueprint — and that prayer is the conversation that builds every relationship with God.",
    verse: '"Pray without ceasing." — 1 Thessalonians 5:17',
  },
  {
    icon: "◎",
    name: "The Word Made Life",
    href: "/blog",
    description:
      "In the Faith Journal, Samuel reflects on how Scripture speaks into modern life — from doubt and certainty, to gratitude and calling. Every reflection is an invitation to encounter the living God through the written Word.",
    verse: '"The Word became flesh and dwelt among us." — John 1:14',
  },
  {
    icon: "◎",
    name: "My Story",
    href: "/my-story",
    description:
      "Every life is a testimony. Samuel's journey — from Ghana to Morocco and beyond — is the story of a man learning to trust God in every chapter. His story is not about him; it is about the God who authored it.",
    verse: '"For we are God\'s masterpiece, created in Christ Jesus to do good works." — Ephesians 2:10',
  },
];

export function PillarsSection() {
  return (
    <section id="pillars" className="portfolio-section pillars-section">
      <div className="section-inner">
        <SectionLabel>Four Pillars</SectionLabel>

        <ScrollReveal className="pillars-header">
          <h2 className="pillars-title">Four Foundations of Faith</h2>
          <p className="pillars-sub">
            Every pillar is a commitment — to the Word, to prayer, to testimony, and to walking in the fullness of what God has called.
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
