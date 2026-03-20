import { ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  dark?: boolean;
}

export function SectionLabel({ children, dark = false }: SectionLabelProps) {
  return (
    <div className={`section-label-modern${dark ? " section-label--dark" : ""}`}>
      {children}
    </div>
  );
}
