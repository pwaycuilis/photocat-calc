import { useState } from "react";
import SemiconductorPicker from "../../components/SemiconductorPicker";
import RedoxPicker from "../../components/RedoxPicker";
import BandDiagram from "../../components/BandDiagram";
import ResultsPanel from "../../components/ResultsPanel";
import { assessBasicScheme, adjustForPH } from "../../lib/energetics";

function PHInput({ value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "8px 0 16px" }}>
      <label style={{ fontSize: "13px", fontWeight: "bold", color: "#555" }}>pH:</label>
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        style={{ width: "30px", height: "30px", fontSize: "18px", border: "1px solid #ccc", borderRadius: "4px", background: "#f5f5f5", cursor: "pointer", lineHeight: 1 }}
      >−</button>
      <input
        type="number" min="0" max="14" step="1"
        value={value}
        onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v) && v >= 0 && v <= 14) onChange(v); }}
        style={{ width: "50px", padding: "4px 6px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", textAlign: "center" }}
      />
      <button
        onClick={() => onChange(Math.min(14, value + 1))}
        style={{ width: "30px", height: "30px", fontSize: "18px", border: "1px solid #ccc", borderRadius: "4px", background: "#f5f5f5", cursor: "pointer", lineHeight: 1 }}
      >+</button>
      <span style={{ fontSize: "12px", color: value === 0 ? "#aaa" : "#555" }}>
        {value === 0 ? "pH 0 — reference" : `shift: ${(-0.059 * value).toFixed(3)} V`}
      </span>
    </div>
  );
}

export default function BasicScheme({ customSemiconductors = [] }) {
  const [semiconductor, setSemiconductor] = useState(null);
  const [reductionCouple, setReductionCouple] = useState(null);
  const [oxidationCouple, setOxidationCouple] = useState(null);
  const [pH, setPH] = useState(0);

  const adjusted = semiconductor ? adjustForPH(semiconductor, pH) : null;

  const results =
    adjusted && reductionCouple && oxidationCouple
      ? assessBasicScheme(adjusted, reductionCouple, oxidationCouple)
      : null;

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Basic Scheme</h2>
      <p style={{ color: "#555", marginTop: 0 }}>
        One semiconductor drives both a reduction (CO₂ or H⁺) and an oxidation (H₂O) half-reaction
        using photogenerated electrons and holes.
      </p>

      <SemiconductorPicker
        label="Photocatalyst"
        value={semiconductor?.id}
        onChange={setSemiconductor}
        customSemiconductors={customSemiconductors}
      />
      <PHInput value={pH} onChange={setPH} />
      <RedoxPicker
        label="Reduction half-reaction"
        value={reductionCouple?.id}
        onChange={setReductionCouple}
      />
      <RedoxPicker
        label="Oxidation half-reaction"
        filter="water_oxidation"
        value={oxidationCouple?.id}
        onChange={setOxidationCouple}
      />

      <BandDiagram
        semiconductor={adjusted}
        reductionCouple={reductionCouple}
        oxidationCouple={oxidationCouple}
      />

      <ResultsPanel results={results} semiconductor={adjusted} />
    </div>
  );
}
