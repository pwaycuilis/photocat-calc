// Redox potentials in V vs. NHE at pH 0 (standard conditions).
// For a reduction half-reaction: the semiconductor CB must be more negative (lower) than the potential.
// For an oxidation half-reaction: the semiconductor VB must be more positive (higher) than the potential.
const redoxCouples = [
  // --- CO₂ Reduction products ---
  {
    id: "co2_co",
    label: "CO₂ → CO",
    potential: -0.53,
    category: "co2_reduction",
    equation: "CO₂ + 2H⁺ + 2e⁻ → CO + H₂O",
  },
  {
    id: "co2_hcooh",
    label: "CO₂ → HCOOH (formic acid)",
    potential: -0.61,
    category: "co2_reduction",
    equation: "CO₂ + 2H⁺ + 2e⁻ → HCOOH",
  },
  {
    id: "co2_hcho",
    label: "CO₂ → HCHO (formaldehyde)",
    potential: -0.48,
    category: "co2_reduction",
    equation: "CO₂ + 4H⁺ + 4e⁻ → HCHO + H₂O",
  },
  {
    id: "co2_meoh",
    label: "CO₂ → CH₃OH (methanol)",
    potential: -0.38,
    category: "co2_reduction",
    equation: "CO₂ + 6H⁺ + 6e⁻ → CH₃OH + H₂O",
  },
  {
    id: "co2_ch4",
    label: "CO₂ → CH₄ (methane)",
    potential: -0.24,
    category: "co2_reduction",
    equation: "CO₂ + 8H⁺ + 8e⁻ → CH₄ + 2H₂O",
  },
  // --- Hydrogen evolution ---
  {
    id: "her",
    label: "H⁺ → H₂ (HER)",
    potential: 0.0,
    category: "hydrogen",
    equation: "2H⁺ + 2e⁻ → H₂",
  },
  // --- Oxidation half-reactions ---
  {
    id: "oer",
    label: "H₂O → O₂ (OER / water oxidation)",
    potential: 1.23,
    category: "water_oxidation",
    equation: "2H₂O → O₂ + 4H⁺ + 4e⁻",
  },
];

export default redoxCouples;
