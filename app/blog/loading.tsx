export default function BlogLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080807",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      {[0, 200, 400].map((d) => (
        <div
          key={d}
          style={{
            width: 8,
            height: 8,
            background: "#7b8ffc",
            borderRadius: "50%",
            animation: "pulse 1.2s ease-in-out infinite",
            animationDelay: `${d}ms`,
          }}
        />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:.2;transform:scale(.8)} 50%{opacity:1;transform:scale(1.1)} }`}</style>
    </div>
  );
}
