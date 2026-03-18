"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

/** Renders the global Navbar on every route except /admin */
export function NavWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <Navbar />;
}
