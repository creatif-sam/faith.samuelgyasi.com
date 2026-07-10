"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

export function SiteToaster() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) return null;

  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: { background: "#13141a", border: "1px solid #2a2b35", color: "#e8e8ec" },
      }}
    />
  );
}
