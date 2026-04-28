// Redox mediator couples for Z-Scheme systems.
// The mediator shuttles electrons through the electrolyte between the two semiconductors.
// Each mediator has a single potential (V vs NHE) — the same couple acts as both
// the electron acceptor at PC2's CB and the electron donor at PC1's VB.
//
// For the Z-Scheme to work, the mediator potential must sit between PC1's VB and PC2's CB:
//   PC2 CB < mediator potential < PC1 VB
const mediators = [
  {
    id: "fe3_fe2",
    label: "Fe³⁺/Fe²⁺",
    potential: 0.77,
    notes: "Most common Z-scheme mediator. Works well but only at acidic pH.",
  },
  {
    id: "io3_i",
    label: "IO₃⁻/I⁻",
    potential: 0.67,
    notes: "pH-sensitive. Common in visible-light Z-scheme systems.",
  },
  {
    id: "ferricyanide",
    label: "[Fe(CN)₆]³⁻/[Fe(CN)₆]⁴⁻",
    potential: 0.36,
    notes: "Stable at neutral pH. Lower potential suits wider range of semiconductors.",
  },
  {
    id: "ce4_ce3",
    label: "Ce⁴⁺/Ce³⁺",
    potential: 1.61,
    notes: "Strong oxidant. Potential varies with electrolyte (1.44 V in H₂SO₄, 1.61 V in HNO₃). Only usable with semiconductors that have high VB positions.",
  },
  {
    id: "no3_no2",
    label: "NO₃⁻/NO₂⁻",
    potential: 0.01,
    notes: "Low potential. Suitable when PC2 has a CB close to 0 V.",
  },
  {
    id: "i2_i",
    label: "I₂/I⁻",
    potential: 0.535,
    notes: "Soluble and commonly used in Z-scheme systems. Mild potential suits many visible-light semiconductors.",
  },
  {
    id: "mno4_mno4_2",
    label: "MnO₄⁻/MnO₄²⁻",
    potential: 0.564,
    notes: "Both forms ionic — good shuttle stability. Strong oxidizing character.",
  },
  {
    id: "ptcl6_ptcl4",
    label: "[PtCl₆]²⁻/[PtCl₄]²⁻",
    potential: 0.68,
    notes: "Both forms remain in solution — good shuttle property. Cost-prohibitive at scale but may be viable for lab-scale proof-of-concept work.",
  },
];

export default mediators;
