# Photocatalytic CO₂ Reduction Energetics Calculator

A thermodynamic screening tool for solar-driven CO₂ reduction systems, built in collaboration with a chemical engineer. Select semiconductors, redox half-reactions, and system pH to evaluate whether a photocatalytic configuration is energetically feasible.

**[Live Demo](https://photocat-calc.vercel.app/)**

---

## What It Does

Photocatalytic CO₂ reduction converts CO₂ into fuels or feedstocks using solar energy and semiconductor materials. Whether a given system can work depends on whether the semiconductor's band edges are positioned correctly relative to the target redox potentials — this tool checks that thermodynamic condition across three common system architectures.

For each configuration it reports:
- Feasibility of the reduction and oxidation half-reactions
- Driving force (thermodynamic margin) for each step
- Solar absorption onset wavelength and fraction of AM1.5G spectrum usable
- pH-adjusted band edge positions using the Nernst equation (0.059 V/pH unit)

---

## System Configurations

**Basic Scheme** — one semiconductor straddles both the reduction and oxidation potentials, driving both half-reactions with a single material.

**S-Scheme** — two semiconductors in direct contact. The Reduction Photocatalyst (RP) drives CO₂ reduction; the Oxidation Photocatalyst (OP) drives water oxidation. Weak carriers from each recombine internally, preserving the strongest redox sites on both.

**Z-Scheme** — two physically separated semiconductors (photocathode and photoanode) linked by a liquid-phase redox mediator. The mediator potential must sit within the window between the two semiconductors' band edges for the electron shuttle cycle to close.

---

## Features

- 26 semiconductors sourced from literature and a chemical engineer's reference spreadsheet
- 7 CO₂ reduction and water-splitting redox couples
- 7 redox mediators for Z-Scheme (including Fe³⁺/Fe²⁺, I₃⁻/I⁻, Ce⁴⁺/Ce³⁺, and others)
- Per-semiconductor pH adjustment with +/− controls
- Signed driving force display with qualitative kinetics notes
- Pure thermodynamic logic separated from UI — all feasibility functions in `src/lib/energetics.js`

---

## Tech Stack

- React + Vite
- Plain JavaScript (no external science libraries)
- Deployed on Vercel

---

## Running Locally

```bash
npm install
npm run dev
```

---

## Science Notes

All band edge values are referenced to NHE (Normal Hydrogen Electrode) at pH 0. pH adjustment uses the Nernst approximation: both CB and VB shift by −0.059 × pH volts, with band gap unchanged. Solar fraction is estimated from a piecewise linear approximation of the AM1.5G cumulative photon flux curve.

Semiconductor band edge values are aggregated from scientific literature.
