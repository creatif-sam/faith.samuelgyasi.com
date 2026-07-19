import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080807",
        color: "#f0ece4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
        gap: "24px",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "9px",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          background: "linear-gradient(90deg,#546cfa,#546cfa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        404 · Not Found
      </p>
      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(52px, 10vw, 120px)",
          fontWeight: 900,
          lineHeight: 0.9,
          color: "#f0ece4",
          margin: 0,
        }}
      >
        Lost in the{" "}
        <em
          style={{
            fontStyle: "italic",
            display: "block",
            background: "linear-gradient(90deg,#546cfa,#546cfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Wilderness
        </em>
      </h1>
      <p
        style={{
          color: "rgba(240,236,228,0.5)",
          fontSize: "16px",
          fontWeight: 300,
          maxWidth: "400px",
          lineHeight: 1.7,
        }}
      >
        This page does not exist. Perhaps it moved, or was never here to begin
        with.
      </p>
      <Link
        href="/"
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#c9a84c",
          textDecoration: "none",
          border: "1px solid rgba(201,168,76,0.3)",
          padding: "12px 28px",
          borderRadius: "4px",
          transition: "all 0.3s ease",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <ArrowLeft size={14} /> Back to Home
      </Link>
    </div>
  );
}
