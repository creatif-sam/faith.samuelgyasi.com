"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  // Hide on pages that manage their own theme toggle
  if (!mounted) return null;
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) return null;

  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="site-theme-float"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Moon size={17} strokeWidth={1.6} /> : <Sun size={17} strokeWidth={1.6} />}
    </button>
  );
};

export { ThemeSwitcher };
