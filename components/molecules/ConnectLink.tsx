interface ConnectLinkProps {
  href: string;
  label: string;
}

export function ConnectLink({ href, label }: ConnectLinkProps) {
  return (
    <a href={href} className="connect-link">
      {label} <span>→</span>
    </a>
  );
}
