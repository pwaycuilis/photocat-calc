const SCHEMES = [
  { id: "basic", label: "Basic Scheme" },
  { id: "s-scheme", label: "S-Scheme" },
  { id: "z-scheme", label: "Z-Scheme" },
];

export default function SchemeSelector({ activeScheme, onChange }) {
  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
      {SCHEMES.map((scheme) => (
        <button
          key={scheme.id}
          onClick={() => onChange(scheme.id)}
          style={{
            padding: "8px 20px",
            border: "2px solid #4a90e2",
            borderRadius: "6px",
            background: activeScheme === scheme.id ? "#4a90e2" : "transparent",
            color: activeScheme === scheme.id ? "white" : "#4a90e2",
            cursor: "pointer",
            fontWeight: activeScheme === scheme.id ? "bold" : "normal",
          }}
        >
          {scheme.label}
        </button>
      ))}
    </div>
  );
}
