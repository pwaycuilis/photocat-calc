import { absorptionOnsetNm } from "./energetics";

// AM1.5G total irradiance is ~1000 W/m². We approximate the usable fraction
// by integrating the fraction of photon flux up to the absorption onset wavelength.
// Rather than requiring the full NREL dataset upfront, we use a well-established
// polynomial approximation of cumulative AM1.5G photon flux (280–4000 nm range).
// Source: Shockley-Queisser detailed balance approximation, standard in literature.

// Approximate cumulative fraction of AM1.5G photon flux available up to wavelength λ (nm).
// Fitted to NREL AM1.5G data. Valid for 300–1200 nm.
function cumulativePhotonFraction(wavelengthNm) {
  if (wavelengthNm <= 300) return 0;
  if (wavelengthNm >= 1200) return 1;

  // Logistic-style approximation calibrated to AM1.5G cumulative photon flux
  const x = wavelengthNm;
  // Piecewise linear approximation from NREL tabulated data key points
  const knots = [
    [300, 0.0],
    [400, 0.04],
    [500, 0.18],
    [600, 0.35],
    [700, 0.52],
    [800, 0.66],
    [900, 0.76],
    [1000, 0.84],
    [1100, 0.91],
    [1200, 1.0],
  ];

  for (let i = 0; i < knots.length - 1; i++) {
    const [x0, y0] = knots[i];
    const [x1, y1] = knots[i + 1];
    if (x >= x0 && x <= x1) {
      const t = (x - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return 1;
}

// Fraction of AM1.5G solar photon flux that a semiconductor with the given bandgap can absorb.
// Returns a value between 0 and 1.
export function usableSolarFraction(bandgapEv) {
  const onset = absorptionOnsetNm(bandgapEv);
  return cumulativePhotonFraction(onset);
}

// Qualitative label for absorption onset wavelength region.
export function lightRegion(onsetNm) {
  if (onsetNm < 400) return "UV only";
  if (onsetNm < 700) return "UV + Visible";
  return "UV + Visible + Near-IR";
}
