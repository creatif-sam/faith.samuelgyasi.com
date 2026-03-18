import { Toaster } from "sonner";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${poppins.variable} font-poppins`}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0b0c12",
            border: "1px solid rgba(255,255,255,.1)",
            color: "#eef0f5",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "13px",
            fontWeight: 500,
          },
        }}
        richColors
      />
      {children}
    </div>
  );
}
