"use client";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
        gap: "20px",
        fontFamily: "'Poppins', sans-serif",
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
          color: "#7b8ffc",
        }}
      >
        Something went wrong
      </p>
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(28px,5vw,48px)",
          fontWeight: 700,
          margin: 0,
        }}
      >
        Failed to load the journal
      </h2>
      <p style={{ color: "rgba(240,236,228,0.5)", fontSize: "14px", fontWeight: 300, maxWidth: "360px" }}>
        {error.message ?? "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          background: "transparent",
          color: "#7b8ffc",
          border: "1px solid rgba(123,143,252,0.3)",
          padding: "12px 28px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
