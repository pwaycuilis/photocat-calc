import { useState } from "react";
import SemiconductorPicker from "../../components/SemiconductorPicker";
import RedoxPicker from "../../components/RedoxPicker";
import MediatorPicker from "../../components/MediatorPicker";
import BandDiagramZScheme from "../../components/BandDiagramZScheme";
import { assessZScheme, adjustForPH } from "../../lib/energetics";
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

export default function ZScheme({ pH }) {
  const [pc1, setPc1] = useState(null);
  const [pc2, setPc2] = useState(null);
  const [mediator, setMediator] = useState(null);
  const [reductionCouple, setReductionCouple] = useState(null);
  const [oxidationCouple, setOxidationCouple] = useState(null);

  const adjustedPc1 = pc1 ? adjustForPH(pc1, pH) : null;
  const adjustedPc2 = pc2 ? adjustForPH(pc2, pH) : null;

  const results =
    adjustedPc1 && adjustedPc2 && mediator && reductionCouple && oxidationCouple
      ? assessZScheme(adjustedPc1, adjustedPc2, reductionCouple, oxidationCouple, mediator)
      : null;

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Z-Scheme</h2>
      <p style={{ color: "#555", marginTop: 0, marginBottom: "24px" }}>
        Two physically separated semiconductors connected through a liquid electrolyte.
        The Photocathode (PC1) drives CO₂ reduction. The Photoanode (PC2) drives water oxidation.
        A redox mediator couple shuttles electrons between them — its potential must sit
        between PC2's conduction band and PC1's valence band for the cycle to close.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "8px" }}>
        <div>
          <p style={{ margin: "0 0 8px", fontWeight: "bold", color: "#1a5276" }}>
            Photocathode (PC1) — Reduction
          </p>
          <SemiconductorPicker label="Semiconductor" value={pc1?.id} onChange={setPc1} />
          <RedoxPicker label="Reduction half-reaction" value={reductionCouple?.id} onChange={setReductionCouple} />
        </div>
        <div>
          <p style={{ margin: "0 0 8px", fontWeight: "bold", color: "#784212" }}>
            Photoanode (PC2) — Oxidation
          </p>
          <SemiconductorPicker label="Semiconductor" value={pc2?.id} onChange={setPc2} />
          <RedoxPicker label="Oxidation half-reaction" filter="water_oxidation" value={oxidationCouple?.id} onChange={setOxidationCouple} />
        </div>
      </div>

      <MediatorPicker value={mediator?.id} onChange={setMediator} />

      <BandDiagramZScheme
        pc1={adjustedPc1} pc2={adjustedPc2} mediator={mediator}
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
            <strong>PC1 — Reduction half-reaction:</strong>
            <Badge pass={results.reductionFeasible} />
            {results.reductionFeasible
              ? <DrivingForceNote value={results.pc1ReductionDrivingForce} />
              : <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#721c24" }}>
                  PC1 conduction band ({adjustedPc1.cbEdge} V) is too positive to drive this reduction.
                </p>
            }
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>PC2 — Oxidation half-reaction:</strong>
            <Badge pass={results.oxidationFeasible} />
            {results.oxidationFeasible
              ? <DrivingForceNote value={results.pc2OxidationDrivingForce} />
              : <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#721c24" }}>
                  PC2 valence band ({adjustedPc2.vbEdge} V) is too negative to drive water oxidation.
                </p>
            }
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Mediator compatibility:</strong>
            <Badge pass={results.mediatorValid} />
            <div style={{ marginTop: "4px" }}>
              <p style={{ margin: "2px 0", fontSize: "13px", color: results.pc2ReducesMediator ? "#555" : "#721c24" }}>
                PC2 CB → mediator reduction: {results.pc2ReducesMediator ? "✓" : "✗"}
                {results.pc2ReducesMediator
                  ? ` (driving force: ${results.pc2MediatorDrivingForce.toFixed(2)} V)`
                  : ` — PC2 CB (${adjustedPc2.cbEdge} V) must be more negative than mediator (${mediator.potential} V)`
                }
              </p>
              <p style={{ margin: "2px 0", fontSize: "13px", color: results.pc1OxidizesMediator ? "#555" : "#721c24" }}>
                PC1 VB → mediator oxidation: {results.pc1OxidizesMediator ? "✓" : "✗"}
                {results.pc1OxidizesMediator
                  ? ` (driving force: ${results.pc1MediatorDrivingForce.toFixed(2)} V)`
                  : ` — PC1 VB (${adjustedPc1.vbEdge} V) must be more positive than mediator (${mediator.potential} V)`
                }
              </p>
            </div>
          </div>

          <div>
            <strong>Solar absorption:</strong>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#555" }}>
              PC1 onset: {results.pc1AbsorptionOnsetNm.toFixed(0)} nm
              ({lightRegion(results.pc1AbsorptionOnsetNm)}) —
              {(usableSolarFraction(pc1.bandgapEv) * 100).toFixed(1)}% of AM1.5G
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#555" }}>
              PC2 onset: {results.pc2AbsorptionOnsetNm.toFixed(0)} nm
              ({lightRegion(results.pc2AbsorptionOnsetNm)}) —
              {(usableSolarFraction(pc2.bandgapEv) * 100).toFixed(1)}% of AM1.5G
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
