// Z-Scheme band energy diagram.
// Shows two semiconductor blocks (PC1 left, PC2 right) with the mediator potential
// as a shaded band in the centre. Arrows trace the Z-shaped electron pathway:
//
//   PC1 CB → drives reduction (left)
//   PC2 CB → reduces mediator (arrow from PC2 CB down to mediator band)
//   Mediator → PC1 VB (arrow crossing from right to left through the electrolyte)
//   PC2 VB → drives oxidation (right)

const SVG_WIDTH = 540;
const SVG_HEIGHT = 380;
const PADDING = { top: 30, bottom: 40, left: 60, right: 20 };
const PLOT_H = SVG_HEIGHT - PADDING.top - PADDING.bottom;
const PLOT_W = SVG_WIDTH - PADDING.left - PADDING.right;

function voltToY(v, minV, maxV) {
  return PADDING.top + ((maxV - v) / (maxV - minV)) * PLOT_H;
}

export default function BandDiagramZScheme({ pc1, pc2, mediator, reductionCouple, oxidationCouple, results }) {
  if (!pc1 || !pc2 || !mediator || !reductionCouple || !oxidationCouple) {
    return (
      <div style={{ color: "#888", fontStyle: "italic", marginTop: "24px" }}>
        Select both semiconductors, a mediator, and both reactions to see the band diagram.
      </div>
    );
  }

  const allValues = [
    pc1.cbEdge, pc1.vbEdge,
    pc2.cbEdge, pc2.vbEdge,
    mediator.potential,
    reductionCouple.potential,
    oxidationCouple.potential,
  ];
  const minV = Math.min(...allValues) - 0.5;
  const maxV = Math.max(...allValues) + 0.5;
  const y = (v) => voltToY(v, minV, maxV);

  // PC1 block — left
  const pc1X = PADDING.left + PLOT_W * 0.05;
  const pc1W = PLOT_W * 0.2;
  const pc1CbY = y(pc1.cbEdge);
  const pc1VbY = y(pc1.vbEdge);

  // PC2 block — right
  const pc2X = PADDING.left + PLOT_W * 0.72;
  const pc2W = PLOT_W * 0.2;
  const pc2CbY = y(pc2.cbEdge);
  const pc2VbY = y(pc2.vbEdge);

  // Mediator band — centre, drawn as a shaded rect spanning between the two blocks
  const medY = y(mediator.potential);
  const medBandHeight = 6;
  const medX1 = pc1X + pc1W + 8;
  const medX2 = pc2X - 8;
  const medColor = results?.mediatorValid ? "#8e44ad" : "#bbb";

  // Reduction line — left of PC1
  const redX1 = PADDING.left;
  const redX2 = pc1X - 6;
  const redY = y(reductionCouple.potential);

  // Oxidation line — right of PC2
  const oxX1 = pc2X + pc2W + 6;
  const oxX2 = PADDING.left + PLOT_W;
  const oxY = y(oxidationCouple.potential);

  // Arrow markers
  const arrowColor = medColor;

  // Y-axis ticks
  const tickCount = 6;
  const tickStep = (maxV - minV) / tickCount;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => minV + i * tickStep);

  return (
    <div style={{ marginTop: "32px" }}>
      <h3 style={{ marginBottom: "8px" }}>Band Energy Diagram</h3>
      <svg width={SVG_WIDTH} height={SVG_HEIGHT} style={{ fontFamily: "monospace", fontSize: "12px" }}>
        <defs>
          <marker id="zArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={arrowColor} />
          </marker>
          <marker id="zArrowRed" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={results?.reductionFeasible ? "#27ae60" : "#e74c3c"} />
          </marker>
          <marker id="zArrowOx" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={results?.oxidationFeasible ? "#27ae60" : "#e74c3c"} />
          </marker>
        </defs>

        {/* Y-axis */}
        <line x1={PADDING.left} y1={PADDING.top} x2={PADDING.left} y2={PADDING.top + PLOT_H} stroke="#333" strokeWidth={1.5} />
        {ticks.map((v) => {
          const ty = y(v);
          return (
            <g key={v}>
              <line x1={PADDING.left - 5} y1={ty} x2={PADDING.left} y2={ty} stroke="#333" />
              <text x={PADDING.left - 8} y={ty + 4} textAnchor="end" fill="#333">{v.toFixed(1)}</text>
            </g>
          );
        })}
        <text x={14} y={PADDING.top + PLOT_H / 2} textAnchor="middle" fill="#333"
          transform={`rotate(-90, 14, ${PADDING.top + PLOT_H / 2})`}>
          V vs. NHE
        </text>

        {/* PC1 block (photocathode) */}
        <rect x={pc1X} y={pc1CbY} width={pc1W} height={pc1VbY - pc1CbY} fill="#cce5ff" stroke="#4a90e2" strokeWidth={1.5} />
        <text x={pc1X + pc1W / 2} y={pc1CbY - 6} textAnchor="middle" fill="#1a5276" fontWeight="bold">CB</text>
        <text x={pc1X + pc1W / 2} y={pc1CbY + 13} textAnchor="middle" fill="#1a5276" fontSize="11">{pc1.cbEdge.toFixed(2)} V</text>
        <text x={pc1X + pc1W / 2} y={pc1VbY + 16} textAnchor="middle" fill="#1a5276" fontWeight="bold">VB</text>
        <text x={pc1X + pc1W / 2} y={pc1VbY - 4} textAnchor="middle" fill="#1a5276" fontSize="11">{pc1.vbEdge.toFixed(2)} V</text>
        <text x={pc1X + pc1W / 2} y={pc1VbY + 30} textAnchor="middle" fill="#1a5276" fontSize="10" fontWeight="bold">PC1</text>
        <text x={pc1X + pc1W / 2} y={pc1VbY + 42} textAnchor="middle" fill="#333" fontSize="10">{pc1.name}</text>

        {/* PC2 block (photoanode) */}
        <rect x={pc2X} y={pc2CbY} width={pc2W} height={pc2VbY - pc2CbY} fill="#fde8c8" stroke="#e67e22" strokeWidth={1.5} />
        <text x={pc2X + pc2W / 2} y={pc2CbY - 6} textAnchor="middle" fill="#784212" fontWeight="bold">CB</text>
        <text x={pc2X + pc2W / 2} y={pc2CbY + 13} textAnchor="middle" fill="#784212" fontSize="11">{pc2.cbEdge.toFixed(2)} V</text>
        <text x={pc2X + pc2W / 2} y={pc2VbY + 16} textAnchor="middle" fill="#784212" fontWeight="bold">VB</text>
        <text x={pc2X + pc2W / 2} y={pc2VbY - 4} textAnchor="middle" fill="#784212" fontSize="11">{pc2.vbEdge.toFixed(2)} V</text>
        <text x={pc2X + pc2W / 2} y={pc2VbY + 30} textAnchor="middle" fill="#784212" fontSize="10" fontWeight="bold">PC2</text>
        <text x={pc2X + pc2W / 2} y={pc2VbY + 42} textAnchor="middle" fill="#333" fontSize="10">{pc2.name}</text>

        {/* Mediator band */}
        <rect x={medX1} y={medY - medBandHeight / 2} width={medX2 - medX1} height={medBandHeight}
          fill={medColor} opacity={0.25} />
        <line x1={medX1} y1={medY} x2={medX2} y2={medY} stroke={medColor} strokeWidth={2} strokeDasharray="6,3" />
        <text x={(medX1 + medX2) / 2} y={medY - 10} textAnchor="middle" fill={medColor} fontSize="11" fontWeight="bold">
          {mediator.label}
        </text>
        <text x={(medX1 + medX2) / 2} y={medY + 18} textAnchor="middle" fill={medColor} fontSize="10">
          {mediator.potential.toFixed(2)} V
        </text>

        {/* Z-pathway arrows */}
        {/* PC2 CB → mediator (PC2 electrons reduce mediator, going down in energy) */}
        <line
          x1={pc2X + pc2W / 2} y1={pc2CbY}
          x2={pc2X + pc2W / 2} y2={medY - medBandHeight / 2 - 2}
          stroke={arrowColor} strokeWidth={1.5} markerEnd="url(#zArrow)"
        />

        {/* Mediator → PC1 VB (the Z crossing — electrons shuttle from right to left through electrolyte) */}
        <line
          x1={medX2} y1={medY}
          x2={medX1 + 8} y2={medY}
          stroke={arrowColor} strokeWidth={1.5} markerEnd="url(#zArrow)"
        />

        {/* Reduction potential line */}
        <line
          x1={redX1} y1={redY} x2={redX2} y2={redY}
          stroke={results?.reductionFeasible ? "#27ae60" : "#e74c3c"} strokeWidth={2} strokeDasharray="6,3"
        />
        <text x={redX1} y={redY - 4} fill={results?.reductionFeasible ? "#27ae60" : "#e74c3c"} fontSize="10">
          {reductionCouple.potential.toFixed(2)} V
        </text>
        <text x={redX1} y={redY + 12} fill={results?.reductionFeasible ? "#27ae60" : "#e74c3c"} fontSize="10">
          {reductionCouple.label.split("→")[1]?.trim() ?? reductionCouple.label}
        </text>

        {/* Oxidation potential line */}
        <line
          x1={oxX1} y1={oxY} x2={oxX2} y2={oxY}
          stroke={results?.oxidationFeasible ? "#27ae60" : "#e74c3c"} strokeWidth={2} strokeDasharray="6,3"
        />
        <text x={oxX1} y={oxY - 4} fill={results?.oxidationFeasible ? "#27ae60" : "#e74c3c"} fontSize="10">
          {oxidationCouple.potential.toFixed(2)} V
        </text>
        <text x={oxX1} y={oxY + 12} fill={results?.oxidationFeasible ? "#27ae60" : "#e74c3c"} fontSize="10">
          {oxidationCouple.label.split("→")[1]?.trim() ?? oxidationCouple.label}
        </text>

      </svg>
      <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
        Blue = Photocathode (PC1) &nbsp;|&nbsp; Orange = Photoanode (PC2) &nbsp;|&nbsp;
        Purple = mediator couple &nbsp;|&nbsp; Arrows trace the Z-shaped electron pathway
      </p>
    </div>
  );
}
