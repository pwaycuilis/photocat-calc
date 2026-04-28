import { useState } from "react";
import SchemeSelector from "./components/SchemeSelector";
import BasicScheme from "./schemes/basic/BasicScheme";
import SScheme from "./schemes/s-scheme/SScheme";
import ZScheme from "./schemes/z-scheme/ZScheme";

export default function App() {
  const [activeScheme, setActiveScheme] = useState("basic");
  const [pH, setPH] = useState(0);

  function handlePHChange(e) {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0 && val <= 14) setPH(val);
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "4px" }}>Photocatalytic Systems Energetics Calculator</h1>
      <p style={{ color: "#666", marginTop: 0, marginBottom: "32px" }}>
        Screen semiconductor–reaction combinations for CO₂ reduction using solar energy.
      </p>

      <SchemeSelector activeScheme={activeScheme} onChange={setActiveScheme} />

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <label style={{ fontWeight: "bold" }}>System pH:</label>
        <input
          type="number"
          min="0" max="14" step="0.5"
          value={pH}
          onChange={handlePHChange}
          style={{ width: "70px", padding: "6px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px" }}
        />
        <span style={{ fontSize: "13px", color: pH === 0 ? "#aaa" : "#555" }}>
          {pH === 0
            ? "pH 0 — reference conditions, no adjustment applied"
            : `Band edges shifted by ${(-0.059 * pH).toFixed(3)} V from pH 0 reference`
          }
        </span>
      </div>

      {activeScheme === "basic" && <BasicScheme pH={pH} />}
      {activeScheme === "s-scheme" && <SScheme pH={pH} />}
      {activeScheme === "z-scheme" && <ZScheme pH={pH} />}
    </div>
  );
}
