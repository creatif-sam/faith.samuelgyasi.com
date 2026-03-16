"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Silently tracks page views. Drop into the root layout. */
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let vid = localStorage.getItem("_sg_vid");
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem("_sg_vid", vid);
    }

    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        visitorId: vid,
        referrer: document.referrer,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
