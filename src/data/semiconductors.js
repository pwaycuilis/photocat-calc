// All band edge values in V vs. NHE (Normal Hydrogen Electrode) at pH 0.
// CB (conduction band) must be more negative than the reduction potential to drive reduction.
// VB (valence band) must be more positive than the oxidation potential to drive oxidation.
//
// Primary source: ChemE collaborator's spreadsheet (pH 0 reference column).
// Where values differ from original literature estimates, original values are noted in comments.
//
// METALLICS — excluded from dropdown as they have no band gap (no semiconductor behaviour).
// TiN, VO₂, and MoO₂ were removed from the ChemE's updated spreadsheet entirely.
// TiN was replaced by TiON (titanium oxynitride), which is a semiconductor and is included below.

const semiconductors = [
  // --- Original entries not in ChemE spreadsheet — kept from literature ---
  {
    id: "gcn",
    name: "g-C₃N₄",
    bandgapEv: 2.7,
    cbEdge: -1.1,
    vbEdge: 1.6,
    notes: "Visible-light active. Metal-free. Moderate stability.",
  },
  {
    id: "cds",
    name: "CdS",
    bandgapEv: 2.4,
    cbEdge: -0.52,
    vbEdge: 1.88,
    notes: "Visible-light active. Strong CB for CO₂ reduction. Toxic — cadmium hazard.",
  },
  {
    id: "si",
    name: "Silicon (p-type)",
    bandgapEv: 1.12,
    cbEdge: -0.5,
    vbEdge: 0.62,
    notes: "Narrow bandgap — harvests most of visible spectrum. Requires surface passivation.",
  },

  // --- ChemE spreadsheet entries (pH 0) ---
  {
    id: "tio2",
    name: "TiO₂ (anatase)",
    bandgapEv: 3.2,
    cbEdge: -0.5,
    vbEdge: 2.7,
    // Original literature estimate: CB -0.1, VB 3.1
    notes: "Most studied photocatalyst. UV-active only. Highly stable. n-type.",
  },
  {
    id: "tion",
    name: "TiON (titanium oxynitride)",
    bandgapEv: 2.3,
    cbEdge: -0.1,
    vbEdge: 2.2,
    notes: "Visible-light active. Nitrogen-doped analogue of TiO₂ with narrowed bandgap. n-type.",
  },
  {
    id: "mos2",
    name: "MoS₂ (2H)",
    bandgapEv: 1.8,
    cbEdge: -0.1,
    vbEdge: 1.7,
    notes: "Visible-light active. Layered 2D material. n-type/p-type depending on preparation.",
  },
  {
    id: "zno",
    name: "ZnO",
    bandgapEv: 3.2,
    cbEdge: -0.5,
    vbEdge: 2.7,
    // Original literature estimate: CB -0.31, VB 2.89
    notes: "Similar band positions to TiO₂ anatase. UV-active. Prone to photocorrosion in acidic media. n-type.",
  },
  {
    id: "wo3",
    name: "WO₃",
    bandgapEv: 2.7,
    cbEdge: 0.3,
    vbEdge: 3.0,
    // Original literature estimate: CB 0.5, VB 3.2
    notes: "Visible-light active. Strong oxidant. CB too low for most CO₂ reductions. n-type.",
  },
  {
    id: "fe2o3",
    name: "α-Fe₂O₃ (Hematite)",
    bandgapEv: 2.2,
    cbEdge: 0.3,
    vbEdge: 2.5,
    // Original literature estimate: CB 0.28, VB 2.38, Eg 2.1
    notes: "Abundant and cheap. CB too low for H₂ or CO₂ reduction without bias. n-type.",
  },
  {
    id: "mno2",
    name: "MnO₂",
    bandgapEv: 2.5,
    cbEdge: 0.4,
    vbEdge: 2.9,
    notes: "Strong oxidant. CB too positive for most CO₂ reductions. p-type.",
  },
  {
    id: "srtio3",
    name: "SrTiO₃",
    bandgapEv: 3.3,
    cbEdge: -0.9,
    vbEdge: 2.4,
    notes: "UV-active perovskite. Strong CB — good for CO₂ reduction. n-type.",
  },
  {
    id: "sno2",
    name: "SnO₂",
    bandgapEv: 3.5,
    cbEdge: 0.1,
    vbEdge: 3.6,
    notes: "Wide bandgap, UV-only. CB too positive for most CO₂ reductions. n-type.",
  },
  {
    id: "bivo4",
    name: "BiVO₄ (monoclinic)",
    bandgapEv: 2.4,
    cbEdge: 0.0,
    vbEdge: 2.4,
    // Original literature estimate: CB 0.02, VB 2.42
    notes: "Visible-light active. Good for oxidation half-reactions. Limited reduction ability. n-type.",
  },
  {
    id: "taon",
    name: "TaON (beta)",
    bandgapEv: 2.5,
    cbEdge: -0.3,
    vbEdge: 2.2,
    notes: "Visible-light active oxynitride. Strong CB for CO₂ reduction. n-type.",
  },
  {
    id: "feooh",
    name: "FeOOH (alpha Goethite)",
    bandgapEv: 2.2,
    cbEdge: 0.2,
    vbEdge: 2.4,
    notes: "Earth-abundant iron oxyhydroxide. Visible-light active. n-type.",
  },
  {
    id: "nio",
    name: "NiO",
    bandgapEv: 1.8,
    cbEdge: 0.2,
    vbEdge: 2.0,
    notes: "Visible-light active p-type. Often used as a hole transport layer.",
  },
  {
    id: "co3o4",
    name: "Co₃O₄ (spinel)",
    bandgapEv: 1.7,
    cbEdge: 0.0,
    vbEdge: 1.7,
    notes: "Narrow bandgap — broad visible absorption. p-type. Good OER cocatalyst.",
  },
  {
    id: "coo",
    name: "CoO",
    bandgapEv: 2.4,
    cbEdge: 0.0,
    vbEdge: 2.4,
    notes: "Visible-light active. p-type cobalt oxide.",
  },
  {
    id: "cr2o3",
    name: "Cr₂O₃",
    bandgapEv: 2.8,
    cbEdge: -0.2,
    vbEdge: 2.6,
    notes: "Visible-light active. p-type. Used as a cocatalyst shell in core-shell systems.",
  },
  {
    id: "cuo",
    name: "CuO",
    bandgapEv: 1.3,
    cbEdge: 0.1,
    vbEdge: 1.4,
    notes: "Narrow bandgap — good visible absorption. p-type. CB marginal for CO₂ reduction.",
  },
  {
    id: "fes2",
    name: "FeS₂ (pyrite)",
    bandgapEv: 0.9,
    cbEdge: 0.1,
    vbEdge: 1.0,
    notes: "Very narrow bandgap — broad spectrum absorption. n-type. Earth-abundant.",
  },
  {
    id: "fefecn6",
    name: "FeFe(CN)₆ (Prussian blue)",
    bandgapEv: 1.4,
    cbEdge: 0.1,
    vbEdge: 1.5,
    notes: "Coordination polymer semiconductor. Visible-light active. n-type.",
  },
  {
    id: "cu2fecn6",
    name: "Cu₂[Fe(CN)₆]",
    bandgapEv: 2.0,
    cbEdge: -0.2,
    vbEdge: 1.8,
    notes: "Prussian blue analogue. Visible-light active. n-type.",
  },

  // --- Novel organic semiconductors (phthalocyanines) ---
  {
    id: "cupc",
    name: "CuPC (Cu Phthalocyanine)",
    bandgapEv: 1.7,
    cbEdge: -1.7,
    vbEdge: 0.0,
    notes: "Organic semiconductor. Very strong CB — excellent reduction potential. p-type.",
  },
  {
    id: "cl8cupc",
    name: "Cl₈CuPC (chlorinated Cu Phthalocyanine)",
    bandgapEv: 1.6,
    cbEdge: -0.8,
    vbEdge: 0.8,
    notes: "Chlorinated phthalocyanine — shifted band edges vs CuPC. p-type.",
  },
  {
    id: "fl8cupc",
    name: "Fl₈CuPC (fluorinated Cu Phthalocyanine)",
    bandgapEv: 1.5,
    cbEdge: -0.25,
    vbEdge: 1.25,
    notes: "Fluorinated phthalocyanine — further shifted band edges. p-type.",
  },
  {
    id: "fepc",
    name: "FePC (Fe Phthalocyanine)",
    bandgapEv: 1.7,
    cbEdge: -1.3,
    vbEdge: 0.4,
    notes: "Iron phthalocyanine. Strong CB for CO₂ reduction. p-type.",
  },
];

export default semiconductors;
