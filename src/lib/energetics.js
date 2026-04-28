import { EV_NM } from "./constants";

// Returns a copy of a semiconductor with CB and VB edges shifted for the given pH.
// Formula from Nernst equation: edge(pH) = edge(pH 0) - 0.059 * pH
// Both CB and VB shift equally, so band gap is unchanged.
export function adjustForPH(semiconductor, pH) {
  if (pH === 0) return semiconductor;
  const shift = 0.059 * pH;
  return {
    ...semiconductor,
    cbEdge: parseFloat((semiconductor.cbEdge - shift).toFixed(3)),
    vbEdge: parseFloat((semiconductor.vbEdge - shift).toFixed(3)),
  };
}

// Returns the wavelength (nm) below which a semiconductor absorbs light.
// Photons with λ < onset carry enough energy to bridge the bandgap.
export function absorptionOnsetNm(bandgapEv) {
  return EV_NM / bandgapEv;
}

// Can the semiconductor's conduction band drive this reduction reaction?
// The CB edge must be more negative (lower V vs NHE) than the reaction potential.
export function canReduce(semiconductor, redoxCouple) {
  return semiconductor.cbEdge < redoxCouple.potential;
}

// Can the semiconductor's valence band drive this oxidation reaction?
// The VB edge must be more positive (higher V vs NHE) than the reaction potential.
export function canOxidize(semiconductor, redoxCouple) {
  return semiconductor.vbEdge > redoxCouple.potential;
}

// Driving force for reduction: how many volts of excess potential exist.
// Larger magnitude = more thermodynamic push. Negative means feasible.
// e.g. CB at -0.5V, reaction at -0.3V → driving force = -0.2V (200 mV excess)
export function reductionDrivingForce(semiconductor, redoxCouple) {
  return semiconductor.cbEdge - redoxCouple.potential;
}

// Driving force for oxidation: how many volts of excess potential exist.
// Positive means feasible (VB is above the oxidation potential).
export function oxidationDrivingForce(semiconductor, redoxCouple) {
  return semiconductor.vbEdge - redoxCouple.potential;
}

// Full feasibility report for the Basic Scheme.
// reductionCouple: the reduction half-reaction (CO₂ → product, or H⁺ → H₂)
// oxidationCouple: the oxidation half-reaction (H₂O → O₂)
export function assessBasicScheme(semiconductor, reductionCouple, oxidationCouple) {
  const reductionFeasible = canReduce(semiconductor, reductionCouple);
  const oxidationFeasible = canOxidize(semiconductor, oxidationCouple);

  return {
    reductionFeasible,
    oxidationFeasible,
    overallFeasible: reductionFeasible && oxidationFeasible,
    reductionDrivingForce: reductionDrivingForce(semiconductor, reductionCouple),
    oxidationDrivingForce: oxidationDrivingForce(semiconductor, oxidationCouple),
    absorptionOnsetNm: absorptionOnsetNm(semiconductor.bandgapEv),
  };
}

// Full feasibility report for the Z-Scheme.
// pc1: photocathode — CB drives reduction, VB holes close the mediator cycle
// pc2: photoanode — VB drives oxidation, CB electrons close the mediator cycle
// mediator: the redox shuttle couple with a single potential value
//
// The mediator potential must sit between pc2.cbEdge and pc1.vbEdge:
//   pc2.cbEdge < mediator.potential < pc1.vbEdge
// This ensures PC2 can reduce the mediator AND PC1 can oxidize it — closing the loop.
export function assessZScheme(pc1, pc2, reductionCouple, oxidationCouple, mediator) {
  const reductionFeasible = canReduce(pc1, reductionCouple);
  const oxidationFeasible = canOxidize(pc2, oxidationCouple);
  // PC2's CB electrons must be energetic enough (more negative) to reduce the mediator
  const pc2ReducesMediator = pc2.cbEdge < mediator.potential;
  // PC1's VB holes must be energetic enough (more positive) to oxidize the mediator
  const pc1OxidizesMediator = pc1.vbEdge > mediator.potential;
  const mediatorValid = pc2ReducesMediator && pc1OxidizesMediator;

  return {
    reductionFeasible,
    oxidationFeasible,
    pc2ReducesMediator,
    pc1OxidizesMediator,
    mediatorValid,
    overallFeasible: reductionFeasible && oxidationFeasible && mediatorValid,
    pc1ReductionDrivingForce: reductionDrivingForce(pc1, reductionCouple),
    pc2OxidationDrivingForce: oxidationDrivingForce(pc2, oxidationCouple),
    pc1MediatorDrivingForce: pc1.vbEdge - mediator.potential,
    pc2MediatorDrivingForce: mediator.potential - pc2.cbEdge,
    pc1AbsorptionOnsetNm: absorptionOnsetNm(pc1.bandgapEv),
    pc2AbsorptionOnsetNm: absorptionOnsetNm(pc2.bandgapEv),
  };
}

// Full feasibility report for the S-Scheme.
// rp: reduction photocatalyst — its CB drives reduction
// op: oxidation photocatalyst — its VB drives oxidation
//
// Two extra alignment checks beyond the Basic Scheme:
//   alignmentValid: op.cbEdge > rp.cbEdge  — confirms OP has the weaker (more positive) CB,
//                                             so the internal electron step goes in the right direction
//   transferDownhill: op.cbEdge < rp.vbEdge — OP CB is at higher electron energy (more negative V)
//                                             than RP VB, so the recombination step is downhill
export function assessSScheme(rp, op, reductionCouple, oxidationCouple) {
  const reductionFeasible = canReduce(rp, reductionCouple);
  const oxidationFeasible = canOxidize(op, oxidationCouple);
  const alignmentValid = op.cbEdge > rp.cbEdge;
  // OP CB must be at higher electron energy (more negative V) than RP VB for the
  // recombination step to be downhill. More negative V = higher energy in V vs NHE.
  const transferDownhill = op.cbEdge < rp.vbEdge;
  const sSchemeValid = alignmentValid && transferDownhill;

  return {
    reductionFeasible,
    oxidationFeasible,
    sSchemeValid,
    alignmentValid,
    transferDownhill,
    overallFeasible: reductionFeasible && oxidationFeasible && sSchemeValid,
    rpReductionDrivingForce: reductionDrivingForce(rp, reductionCouple),
    opOxidationDrivingForce: oxidationDrivingForce(op, oxidationCouple),
    internalTransferForce: op.cbEdge - rp.vbEdge,
    rpAbsorptionOnsetNm: absorptionOnsetNm(rp.bandgapEv),
    opAbsorptionOnsetNm: absorptionOnsetNm(op.bandgapEv),
  };
}
