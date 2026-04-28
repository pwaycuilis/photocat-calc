import { useState } from "react";
import SchemeSelector from "./components/SchemeSelector";
import BasicScheme from "./schemes/basic/BasicScheme";
import SScheme from "./schemes/s-scheme/SScheme";
import ZScheme from "./schemes/z-scheme/ZScheme";

export default function App() {
  const [activeScheme, setActiveScheme] = useState("basic");

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "4px" }}>Photocatalytic Systems Energetics Calculator</h1>
      <p style={{ color: "#666", marginTop: 0, marginBottom: "32px" }}>
        Screen semiconductor–reaction combinations for CO₂ reduction using solar energy.
      </p>

      <SchemeSelector activeScheme={activeScheme} onChange={setActiveScheme} />

      {activeScheme === "basic" && <BasicScheme />}
      {activeScheme === "s-scheme" && <SScheme />}
      {activeScheme === "z-scheme" && <ZScheme />}
    </div>
  );
}
