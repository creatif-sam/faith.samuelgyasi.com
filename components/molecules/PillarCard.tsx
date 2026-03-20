import Link from "next/link";

interface PillarCardProps {
  icon: string;
  name: string;
  description: string;
  verse: string;
  href: string;
}

export function PillarCard({ icon, name, description, verse, href }: PillarCardProps) {
  return (
    <Link href={href} className="pillar-card">
      <span className="pillar-card-icon">{icon}</span>
      <div className="pillar-card-name">{name}</div>
      <p className="pillar-card-description">{description}</p>
      <div className="pillar-verse">{verse}</div>
    </Link>
  );
}
