import { Suspense } from "react";
import { SiteFooter } from "@/components/organisms/SiteFooter";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-svh w-full flex-col">
      <div className="flex flex-1 w-full items-center justify-center p-6 md:p-10">
        {children}
      </div>
      <Suspense fallback={null}>
        <SiteFooter />
      </Suspense>
    </div>
  );
}
