"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      const sb = createClient();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) {
        router.push("/auth/login?next=/dashboard");
        return;
      }
      setChecking(false);
    };
    check();
  }, [router]);

  if (checking) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#07080c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      }}>
        {[0, 200, 400].map((d) => (
          <div
            key={d}
            style={{
              width: 8, height: 8,
              background: "#d4a843", borderRadius: "50%",
              animation: "pulse 1.2s ease-in-out infinite",
              animationDelay: `${d}ms`,
            }}
          />
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:.2;transform:scale(.8)} 50%{opacity:1;transform:scale(1.1)} }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
