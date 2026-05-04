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
    category: "oxidation",
    equation: "2H₂O → O₂ + 4H⁺ + 4e⁻",
  },
  {
    id: "oh_o2_basic",
    label: "4OH⁻ → O₂ (basic)",
    potential: 0.40,
    category: "oxidation",
    equation: "4OH⁻ → O₂ + 2H₂O + 4e⁻",
  },
  {
    id: "mno4_2_mno4_basic",
    label: "MnO₄²⁻ → MnO₄⁻ (basic)",
    potential: 0.564,
    category: "oxidation",
    equation: "MnO₄²⁻ → MnO₄⁻ + e⁻",
  },
  {
    id: "cl_clo_basic",
    label: "Cl⁻ → ClO⁻ (basic)",
    potential: 0.89,
    category: "oxidation",
    equation: "Cl⁻ + 2OH⁻ → ClO⁻ + H₂O + 2e⁻",
  },
  {
    id: "fe2_fe3_acidic",
    label: "Fe²⁺ → Fe³⁺ (acidic)",
    potential: 0.771,
    category: "oxidation",
    equation: "Fe²⁺ → Fe³⁺ + e⁻",
  },
  {
    id: "hno2_no3_acidic",
    label: "HNO₂ → NO₃⁻ (acidic)",
    potential: 0.94,
    category: "oxidation",
    equation: "HNO₂ + H₂O → NO₃⁻ + 3H⁺ + 2e⁻",
  },
  {
    id: "br_br2_acidic",
    label: "2Br⁻ → Br₂ (acidic)",
    potential: 1.07,
    category: "oxidation",
    equation: "2Br⁻ → Br₂ + 2e⁻",
  },
  {
    id: "i_i2_acidic",
    label: "2I⁻ → I₂ (acidic)",
    potential: 0.535,
    category: "oxidation",
    equation: "2I⁻ → I₂ + 2e⁻",
  },
  {
    id: "cl_cl2_acidic",
    label: "2Cl⁻ → Cl₂ (acidic)",
    potential: 1.36,
    category: "oxidation",
    equation: "2Cl⁻ → Cl₂ + 2e⁻",
  },
  {
    id: "br_bro3_acidic",
    label: "Br⁻ → BrO₃⁻ (acidic)",
    potential: 1.44,
    category: "oxidation",
    equation: "Br⁻ + 3H₂O → BrO₃⁻ + 6H⁺ + 6e⁻",
  },
  {
    id: "mn2_mno4_acidic",
    label: "Mn²⁺ → MnO₄⁻ (acidic)",
    potential: 1.51,
    category: "oxidation",
    equation: "Mn²⁺ + 4H₂O → MnO₄⁻ + 8H⁺ + 5e⁻",
  },
];

export default redoxCouples;
