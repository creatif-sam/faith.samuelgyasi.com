import { SectionLabel } from "@/components/atoms/SectionLabel";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";

const roles = [
  {
    num: "01",
    title: "Elder & Church Leader",
    org: "Eglise Évangélique Au Maroc",
    description:
      "Serving as a church elder with responsibility for spiritual formation, pastoral care, and community accountability. Samuel leads the intercession team and the library team — two pillars that hold together a congregation's life of prayer and love of learning.",
  },
  {
    num: "02",
    title: "Mentor",
    org: "Personal Ministry",
    description:
      "Quietly and faithfully walking alongside individuals navigating questions of faith, purpose, identity, and calling. Mentorship, for Samuel, is the most personal form of investment — giving what was once given to him.",
  },
  {
    num: "03",
    title: "Faith Writer",
    org: "The Faith Journal",
    description:
      "Writing reflections on Scripture, prayer, and the daily experience of walking with God. Samuel believes that every essay is an act of worship — offering words that might help another soul trust the Lord more deeply.",
  },
  {
    num: "04",
    title: "Scripture Teacher",
    org: "Local Church & Community",
    description:
      "Opening the Word of God in small groups, Bible studies, and one-on-one settings. Samuel is passionate about making Scripture accessible, beautiful, and alive — not just studied, but lived.",
  },
];

export function WhatIDoSection() {
  return (
    <section id="what-i-do" className="portfolio-section what-i-do-section">
      <div className="section-inner">
        <SectionLabel>What I Do</SectionLabel>

        <ScrollReveal className="wid-header">
          <h2 className="wid-title">Serving in<br /><em>His Name</em></h2>
          <p className="wid-sub">
            Faith. Prayer. The Word. Each role Samuel holds is an expression of one conviction: that a life worth living is one poured out in service to God and to others.
          </p>
        </ScrollReveal>

        <div className="wid-grid">
          {roles.map((role, i) => (
            <ScrollReveal key={role.num} delay={`${i * 0.1}s`}>
              <div className="wid-card">
                <div className="wid-card-num">{role.num}</div>
                <h3 className="wid-card-title">{role.title}</h3>
                <div className="wid-card-org">{role.org}</div>
                <p className="wid-card-body">{role.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
