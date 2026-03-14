import { NavLogo } from "@/components/atoms/NavLogo";
import { NavLinks } from "@/components/molecules/NavLinks";

export function Navbar() {
  return (
    <nav className="portfolio-nav">
      <NavLogo />
      <NavLinks />
    </nav>
  );
}
