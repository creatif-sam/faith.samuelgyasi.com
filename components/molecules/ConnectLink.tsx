import { ArrowRight } from "lucide-react";

interface ConnectLinkProps {
  href: string;
  label: string;
}

export function ConnectLink({ href, label }: ConnectLinkProps) {
  return (
    <a href={href} className="connect-link">
      {label} <span><ArrowRight size={16} /></span>
    </a>
  );
}
