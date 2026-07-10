import Link from "next/link";
import { Diamond, Sparkle, Target, type LucideIcon } from "lucide-react";

const PILLAR_ICONS: Record<string, LucideIcon> = {
  diamond: Diamond,
  sparkle: Sparkle,
  ring: Target,
};

interface PillarCardProps {
  icon: string;
  name: string;
  description: string;
  verse: string;
  href: string;
}

export function PillarCard({ icon, name, description, verse, href }: PillarCardProps) {
  const Icon = PILLAR_ICONS[icon] ?? Sparkle;
  return (
    <Link href={href} className="pillar-card">
      <span className="pillar-card-icon"><Icon size={40} /></span>
      <div className="pillar-card-name">{name}</div>
      <p className="pillar-card-description">{description}</p>
      <div className="pillar-verse">{verse}</div>
    </Link>
  );
}
