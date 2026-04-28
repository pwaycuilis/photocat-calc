import { usableSolarFraction, lightRegion } from "../lib/solar";

function Badge({ pass }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "12px",
        background: pass ? "#d4edda" : "#f8d7da",
        color: pass ? "#155724" : "#721c24",
        fontWeight: "bold",
        fontSize: "13px",
        marginLeft: "8px",
      }}
    >
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
      Driving force: {value.toFixed(2)} V &mdash; {note}
    </p>
  );
}

// results: the object returned by assessBasicScheme()
// semiconductor: the selected semiconductor object (for solar fraction)
export default function ResultsPanel({ results, semiconductor }) {
  if (!results || !semiconductor) return null;

  const solarFraction = usableSolarFraction(semiconductor.bandgapEv);
  const onset = results.absorptionOnsetNm.toFixed(0);
  const region = lightRegion(results.absorptionOnsetNm);

  return (
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
        <strong>Reduction half-reaction:</strong>
        <Badge pass={results.reductionFeasible} />
        {results.reductionFeasible && (
          <DrivingForceNote value={results.reductionDrivingForce} type="reduction" />
        )}
        {!results.reductionFeasible && (
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#721c24" }}>
            CB edge ({semiconductor.cbEdge} V) is too positive to drive this reduction.
          </p>
        )}
      </div>

      <div style={{ marginBottom: "16px" }}>
        <strong>Oxidation half-reaction:</strong>
        <Badge pass={results.oxidationFeasible} />
        {results.oxidationFeasible && (
          <DrivingForceNote value={results.oxidationDrivingForce} type="oxidation" />
        )}
        {!results.oxidationFeasible && (
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#721c24" }}>
            VB edge ({semiconductor.vbEdge} V) is too negative to drive water oxidation.
          </p>
        )}
      </div>

      <div style={{ marginBottom: "16px" }}>
        <strong>Solar absorption:</strong>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#555" }}>
          Absorption onset: {onset} nm ({region})
          <br />
          Usable fraction of AM1.5G solar spectrum: {(solarFraction * 100).toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
