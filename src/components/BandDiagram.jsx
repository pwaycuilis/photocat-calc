// SVG band energy diagram showing CB/VB positions vs. redox potentials.
// Y-axis: V vs. NHE. More negative (higher energy electrons) is at the top.
// This matches the convention used in photocatalysis literature.

const SVG_WIDTH = 420;
const SVG_HEIGHT = 340;
const PADDING = { top: 30, bottom: 40, left: 60, right: 20 };
const PLOT_H = SVG_HEIGHT - PADDING.top - PADDING.bottom;
const PLOT_W = SVG_WIDTH - PADDING.left - PADDING.right;

// Map a voltage (V vs NHE) to a Y pixel coordinate.
// Domain: [maxV, minV] → Range: [top, bottom]  (inverted — more negative V = higher on screen)
function voltToY(v, minV, maxV) {
  return PADDING.top + ((maxV - v) / (maxV - minV)) * PLOT_H;
}

export default function BandDiagram({ semiconductor, reductionCouple, oxidationCouple }) {
  if (!semiconductor || !reductionCouple || !oxidationCouple) {
    return (
      <div style={{ color: "#888", fontStyle: "italic", marginTop: "24px" }}>
        Select a semiconductor and both reactions to see the band diagram.
      </div>
    );
  }

  // Compute axis range with 0.5 V padding above and below the extremes
  const allValues = [
    semiconductor.cbEdge,
    semiconductor.vbEdge,
    reductionCouple.potential,
    oxidationCouple.potential,
  ];
  const minV = Math.min(...allValues) - 0.5;
  const maxV = Math.max(...allValues) + 0.5;

  const y = (v) => voltToY(v, minV, maxV);

  // Positions for the semiconductor band block
  const cbY = y(semiconductor.cbEdge);
  const vbY = y(semiconductor.vbEdge);
  const bandX = PADDING.left + PLOT_W * 0.25;
  const bandWidth = PLOT_W * 0.35;

  // Redox line positions
  const redX1 = PADDING.left + PLOT_W * 0.68;
  const redX2 = PADDING.left + PLOT_W;
  const redY = y(reductionCouple.potential);
  const oxY = y(oxidationCouple.potential);

  const reductionFeasible = semiconductor.cbEdge < reductionCouple.potential;
  const oxidationFeasible = semiconductor.vbEdge > oxidationCouple.potential;

  // Y-axis tick marks
  const tickCount = 6;
  const tickStep = (maxV - minV) / tickCount;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => minV + i * tickStep);

  return (
    <div style={{ marginTop: "32px" }}>
      <h3 style={{ marginBottom: "8px" }}>Band Energy Diagram</h3>
      <svg width={SVG_WIDTH} height={SVG_HEIGHT} style={{ fontFamily: "monospace", fontSize: "12px" }}>

        {/* Y-axis line */}
        <line
          x1={PADDING.left} y1={PADDING.top}
          x2={PADDING.left} y2={PADDING.top + PLOT_H}
          stroke="#333" strokeWidth={1.5}
        />

        {/* Y-axis ticks and labels */}
        {ticks.map((v) => {
          const ty = y(v);
          return (
            <g key={v}>
              <line x1={PADDING.left - 5} y1={ty} x2={PADDING.left} y2={ty} stroke="#333" />
              <text x={PADDING.left - 8} y={ty + 4} textAnchor="end" fill="#333">
                {v.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Y-axis label */}
        <text
          x={14} y={PADDING.top + PLOT_H / 2}
          textAnchor="middle"
          fill="#333"
          transform={`rotate(-90, 14, ${PADDING.top + PLOT_H / 2})`}
        >
          V vs. NHE
        </text>

        {/* Semiconductor band gap block */}
        <rect
          x={bandX} y={cbY}
          width={bandWidth} height={vbY - cbY}
          fill="#cce5ff" stroke="#4a90e2" strokeWidth={1.5}
        />

        {/* CB label */}
        <text x={bandX + bandWidth / 2} y={cbY - 6} textAnchor="middle" fill="#1a5276" fontWeight="bold">
          CB
        </text>
        <text x={bandX + bandWidth / 2} y={cbY + 14} textAnchor="middle" fill="#1a5276" fontSize="11">
          {semiconductor.cbEdge.toFixed(2)} V
        </text>

        {/* VB label */}
        <text x={bandX + bandWidth / 2} y={vbY + 16} textAnchor="middle" fill="#1a5276" fontWeight="bold">
          VB
        </text>
        <text x={bandX + bandWidth / 2} y={vbY - 4} textAnchor="middle" fill="#1a5276" fontSize="11">
          {semiconductor.vbEdge.toFixed(2)} V
        </text>

        {/* Semiconductor name */}
        <text x={bandX + bandWidth / 2} y={vbY + 30} textAnchor="middle" fill="#333" fontSize="11">
          {semiconductor.name}
        </text>

        {/* Reduction potential line */}
        <line
          x1={redX1} y1={redY} x2={redX2} y2={redY}
          stroke={reductionFeasible ? "#27ae60" : "#e74c3c"} strokeWidth={2} strokeDasharray="6,3"
        />
        <text x={redX1 - 4} y={redY + 4} textAnchor="end" fill={reductionFeasible ? "#27ae60" : "#e74c3c"} fontSize="11">
          {reductionCouple.label.split("→")[1]?.trim() ?? reductionCouple.label}
        </text>
        <text x={redX2} y={redY + 4} fill="#555" fontSize="10">
          {reductionCouple.potential.toFixed(2)} V
        </text>

        {/* Oxidation potential line */}
        <line
          x1={redX1} y1={oxY} x2={redX2} y2={oxY}
          stroke={oxidationFeasible ? "#27ae60" : "#e74c3c"} strokeWidth={2} strokeDasharray="6,3"
        />
        <text x={redX1 - 4} y={oxY + 4} textAnchor="end" fill={oxidationFeasible ? "#27ae60" : "#e74c3c"} fontSize="11">
          {oxidationCouple.label.split("→")[1]?.trim() ?? oxidationCouple.label}
        </text>
        <text x={redX2} y={oxY + 4} fill="#555" fontSize="10">
          {oxidationCouple.potential.toFixed(2)} V
        </text>

      </svg>

      <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
        Green dashed lines = feasible &nbsp;|&nbsp; Red dashed lines = not feasible &nbsp;|&nbsp;
        More negative (top) = higher electron energy
      </p>
    </div>
  );
}
