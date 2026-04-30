"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

/** Renders the global Navbar on every route except /admin and /dashboard */
export function NavWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) return null;
  return <Navbar />;
}
