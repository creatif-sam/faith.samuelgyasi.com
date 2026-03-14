import { GeoBg } from "@/components/atoms/GeoBg";
import { ScrollIndicator } from "@/components/atoms/ScrollIndicator";

const heroPillars = [
  { num: "01", label: "Faith & Beliefs"  },
  { num: "02", label: "Leadership"       },
  { num: "03", label: "Intellectuality"  },
  { num: "04", label: "Transformation"   },
];

export function HeroSection() {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-left">
        <div className="hero-eyebrow">Faith · Leadership · Thinker · Transformer</div>
        <h1 className="hero-name">
          Samuel<br />
          <span>Gyasi</span>
        </h1>
        <div className="hero-divider" />
        <p className="hero-tagline">
          &ldquo;Rooted in the Word. Refined by Purpose. Rising to Transform.&rdquo;
        </p>
      </div>

      <div className="hero-right">
        <GeoBg />
        <ul className="pillar-list">
          {heroPillars.map((p) => (
            <li key={p.num}>
              <span className="pillar-num">{p.num}</span>
              {p.label}
            </li>
          ))}
        </ul>
        <ScrollIndicator />
      </div>
    </section>
  );
}
