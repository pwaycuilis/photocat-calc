import { useState } from "react";
import SemiconductorPicker from "../../components/SemiconductorPicker";
import RedoxPicker from "../../components/RedoxPicker";
import BandDiagram from "../../components/BandDiagram";
import ResultsPanel from "../../components/ResultsPanel";
import { assessBasicScheme, adjustForPH } from "../../lib/energetics";

export default function BasicScheme({ pH }) {
  const [semiconductor, setSemiconductor] = useState(null);
  const [reductionCouple, setReductionCouple] = useState(null);
  const [oxidationCouple, setOxidationCouple] = useState(null);

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
      />
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
