const links = [
  { href: "#about",   label: "About"   },
  { href: "#pillars", label: "Pillars" },
  { href: "#vision",  label: "Vision"  },
  { href: "#connect", label: "Connect" },
];

export function NavLinks() {
  return (
    <ul className="nav-links">
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href}>{link.label}</a>
        </li>
      ))}
    </ul>
  );
}
