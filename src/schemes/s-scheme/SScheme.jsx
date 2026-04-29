import { useState } from "react";
import SemiconductorPicker from "../../components/SemiconductorPicker";
import RedoxPicker from "../../components/RedoxPicker";
import BandDiagramSScheme from "../../components/BandDiagramSScheme";
import { assessSScheme, adjustForPH } from "../../lib/energetics";
import { usableSolarFraction, lightRegion } from "../../lib/solar";

function Badge({ pass }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: "12px",
      background: pass ? "#d4edda" : "#f8d7da",
      color: pass ? "#155724" : "#721c24",
      fontWeight: "bold", fontSize: "13px", marginLeft: "8px",
    }}>
      {pass ? "FEASIBLE" : "NOT FEASIBLE"}
    </span>
  );
}

function DrivingForceNote({ value }) {
  const magnitude = Math.abs(value);
  let note = "";
  if (magnitude < 0.1) note = "Very small — sluggish kinetics likely, cocatalyst recommended.";
  else if (magnitude < 0.3) note = "Moderate — may work, cocatalyst may help.";
  else note = "Large — strong thermodynamic driving force.";
  return (
    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#555" }}>
      Driving force: {value.toFixed(2)} V — {note}
    </p>
  );
}

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

export default function SScheme() {
  const [rp, setRp] = useState(null);
  const [op, setOp] = useState(null);
  const [reductionCouple, setReductionCouple] = useState(null);
  const [oxidationCouple, setOxidationCouple] = useState(null);
  const [rpPH, setRpPH] = useState(0);
  const [opPH, setOpPH] = useState(0);

  const adjustedRp = rp ? adjustForPH(rp, rpPH) : null;
  const adjustedOp = op ? adjustForPH(op, opPH) : null;

  const results =
    adjustedRp && adjustedOp && reductionCouple && oxidationCouple
      ? assessSScheme(adjustedRp, adjustedOp, reductionCouple, oxidationCouple)
      : null;

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>S-Scheme</h2>
      <p style={{ color: "#555", marginTop: 0, marginBottom: "24px" }}>
        Two semiconductors in direct contact. The Reduction Photocatalyst (RP) drives CO₂ reduction
        using its conduction band electrons. The Oxidation Photocatalyst (OP) drives water oxidation
        using its valence band holes. Weak carriers from each recombine internally at the interface,
        preserving the strongest redox sites on both materials.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "8px" }}>
        <div>
          <p style={{ margin: "0 0 8px", fontWeight: "bold", color: "#1a5276" }}>
            Reduction Photocatalyst (RP)
          </p>
          <SemiconductorPicker label="Semiconductor" value={rp?.id} onChange={setRp} />
          <PHInput value={rpPH} onChange={setRpPH} />
          <RedoxPicker label="Reduction half-reaction" value={reductionCouple?.id} onChange={setReductionCouple} />
        </div>
        <div>
          <p style={{ margin: "0 0 8px", fontWeight: "bold", color: "#784212" }}>
            Oxidation Photocatalyst (OP)
          </p>
          <SemiconductorPicker label="Semiconductor" value={op?.id} onChange={setOp} />
          <PHInput value={opPH} onChange={setOpPH} />
          <RedoxPicker label="Oxidation half-reaction" filter="water_oxidation" value={oxidationCouple?.id} onChange={setOxidationCouple} />
        </div>
      </div>

      <BandDiagramSScheme
        rp={adjustedRp} op={adjustedOp}
        reductionCouple={reductionCouple}
        oxidationCouple={oxidationCouple}
        results={results}
      />

      {results && (
        <div style={{ marginTop: "32px", borderTop: "2px solid #ddd", paddingTop: "24px" }}>
          <h2 style={{ marginTop: 0 }}>Results</h2>
          <p style={{ fontSize: "12px", color: "#888", marginBottom: "16px" }}>
            Note: reduction driving force is negative when feasible (more negative V = higher electron energy).
            Oxidation driving force is positive when feasible.
          </p>

          <div style={{ marginBottom: "16px" }}>
            <strong>Overall system:</strong>
            <Badge pass={results.overallFeasible} />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>RP — Reduction half-reaction:</strong>
            <Badge pass={results.reductionFeasible} />
            {results.reductionFeasible
              ? <DrivingForceNote value={results.rpReductionDrivingForce} />
              : <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#721c24" }}>
                  RP conduction band ({adjustedRp.cbEdge} V) is too positive to drive this reduction.
                </p>
            }
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>OP — Oxidation half-reaction:</strong>
            <Badge pass={results.oxidationFeasible} />
            {results.oxidationFeasible
              ? <DrivingForceNote value={results.opOxidationDrivingForce} />
              : <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#721c24" }}>
                  OP valence band ({adjustedOp.vbEdge} V) is too negative to drive water oxidation.
                </p>
            }
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>S-Scheme band alignment:</strong>
            <Badge pass={results.sSchemeValid} />
            {!results.alignmentValid && (
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#721c24" }}>
                OP CB ({adjustedOp.cbEdge} V) must be more positive than RP CB ({adjustedRp.cbEdge} V) for the correct transfer direction.
              </p>
            )}
            {results.alignmentValid && !results.transferDownhill && (
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#721c24" }}>
                Internal transfer not downhill — OP CB ({adjustedOp.cbEdge} V) must be more negative than RP VB ({adjustedRp.vbEdge} V) to have higher electron energy.
              </p>
            )}
            {results.sSchemeValid && (
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#555" }}>
                Internal transfer force: {results.internalTransferForce.toFixed(2)} V — recombination step is energetically favorable.
              </p>
            )}
          </div>

          <div>
            <strong>Solar absorption:</strong>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#555" }}>
              RP onset: {results.rpAbsorptionOnsetNm.toFixed(0)} nm
              ({lightRegion(results.rpAbsorptionOnsetNm)}) —
              {(usableSolarFraction(rp.bandgapEv) * 100).toFixed(1)}% of AM1.5G
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#555" }}>
              OP onset: {results.opAbsorptionOnsetNm.toFixed(0)} nm
              ({lightRegion(results.opAbsorptionOnsetNm)}) —
              {(usableSolarFraction(op.bandgapEv) * 100).toFixed(1)}% of AM1.5G
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
