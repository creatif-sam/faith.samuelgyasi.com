interface PillarCardProps {
  icon: string;
  name: string;
  description: string;
  verse: string;
}

export function PillarCard({ icon, name, description, verse }: PillarCardProps) {
  return (
    <div className="pillar-card">
      <span className="pillar-icon">{icon}</span>
      <div className="pillar-name">{name}</div>
      <p className="pillar-desc">{description}</p>
      <div className="pillar-verse">{verse}</div>
    </div>
  );
}
