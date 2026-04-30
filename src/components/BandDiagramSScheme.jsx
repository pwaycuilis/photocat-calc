// S-Scheme band energy diagram.
// Shows two semiconductor blocks (RP left, OP right) with:
//   - Reduction potential line to the left of RP
//   - Oxidation potential line to the right of OP
//   - A stepped arrow between the blocks showing internal electron transfer
//     from OP's CB down into RP's VB (the defining feature of the S-Scheme)

const SVG_WIDTH = 520;
const SVG_HEIGHT = 360;
const PADDING = { top: 30, bottom: 40, left: 60, right: 55 };
const PLOT_H = SVG_HEIGHT - PADDING.top - PADDING.bottom;
const PLOT_W = SVG_WIDTH - PADDING.left - PADDING.right;

function voltToY(v, minV, maxV) {
  return PADDING.top + ((maxV - v) / (maxV - minV)) * PLOT_H;
}

export default function BandDiagramSScheme({ rp, op, reductionCouple, oxidationCouple, results }) {
  if (!rp || !op || !reductionCouple || !oxidationCouple) {
    return (
      <div style={{ color: "#888", fontStyle: "italic", marginTop: "24px" }}>
        Select both semiconductors and both reactions to see the band diagram.
      </div>
    );
  }

  const allValues = [
    rp.cbEdge, rp.vbEdge,
    op.cbEdge, op.vbEdge,
    reductionCouple.potential,
    oxidationCouple.potential,
  ];
  const minV = Math.min(...allValues) - 0.5;
  const maxV = Math.max(...allValues) + 0.5;

  const y = (v) => voltToY(v, minV, maxV);

  // RP block — left side
  const rpX = PADDING.left + PLOT_W * 0.18;
  const rpW = PLOT_W * 0.22;
  const rpCbY = y(rp.cbEdge);
  const rpVbY = y(rp.vbEdge);

  // OP block — right side
  const opX = PADDING.left + PLOT_W * 0.58;
  const opW = PLOT_W * 0.22;
  const opCbY = y(op.cbEdge);
  const opVbY = y(op.vbEdge);

  // Reduction potential line — left of RP
  const redLineX2 = rpX - 8;
  const redLineX1 = PADDING.left + 2;
  const redY = y(reductionCouple.potential);

  // Oxidation potential line — right of OP
  const oxLineX1 = opX + opW + 8;
  const oxLineX2 = PADDING.left + PLOT_W;
  const oxY = y(oxidationCouple.potential);

  // Internal transfer arrow: from OP CB across to RP VB (the "step")
  // Drawn as a right-angle path: horizontal from OP CB midpoint → vertical down → horizontal to RP VB midpoint
  const transferStartX = opX + opW / 2;
  const transferStartY = opCbY;
  const transferEndX = rpX + rpW / 2;
  const transferEndY = rpVbY;
  const transferMidX = (transferStartX + transferEndX) / 2;
  const transferColor = results?.sSchemeValid ? "#8e44ad" : "#bbb";

  // Y-axis ticks
  const tickCount = 6;
  const tickStep = (maxV - minV) / tickCount;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => minV + i * tickStep);

  return (
    <div style={{ marginTop: "32px" }}>
      <h3 style={{ marginBottom: "8px" }}>Band Energy Diagram</h3>
      <svg width={SVG_WIDTH} height={SVG_HEIGHT} style={{ fontFamily: "monospace", fontSize: "12px" }}>
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={transferColor} />
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

        {/* RP block */}
        <rect x={rpX} y={rpCbY} width={rpW} height={rpVbY - rpCbY} fill="#cce5ff" stroke="#4a90e2" strokeWidth={1.5} />
        <text x={rpX + rpW / 2} y={rpCbY - 6} textAnchor="middle" fill="#1a5276" fontWeight="bold">CB</text>
        <text x={rpX + rpW / 2} y={rpCbY + 13} textAnchor="middle" fill="#1a5276" fontSize="11">{rp.cbEdge.toFixed(2)} V</text>
        <text x={rpX + rpW / 2} y={rpVbY + 16} textAnchor="middle" fill="#1a5276" fontWeight="bold">VB</text>
        <text x={rpX + rpW / 2} y={rpVbY - 4} textAnchor="middle" fill="#1a5276" fontSize="11">{rp.vbEdge.toFixed(2)} V</text>
        <text x={rpX + rpW / 2} y={rpVbY + 30} textAnchor="middle" fill="#1a5276" fontSize="10" fontWeight="bold">RP</text>
        <text x={rpX + rpW / 2} y={rpVbY + 42} textAnchor="middle" fill="#333" fontSize="10">{rp.name}</text>

        {/* OP block */}
        <rect x={opX} y={opCbY} width={opW} height={opVbY - opCbY} fill="#fde8c8" stroke="#e67e22" strokeWidth={1.5} />
        <text x={opX + opW / 2} y={opCbY - 6} textAnchor="middle" fill="#784212" fontWeight="bold">CB</text>
        <text x={opX + opW / 2} y={opCbY + 13} textAnchor="middle" fill="#784212" fontSize="11">{op.cbEdge.toFixed(2)} V</text>
        <text x={opX + opW / 2} y={opVbY + 16} textAnchor="middle" fill="#784212" fontWeight="bold">VB</text>
        <text x={opX + opW / 2} y={opVbY - 4} textAnchor="middle" fill="#784212" fontSize="11">{op.vbEdge.toFixed(2)} V</text>
        <text x={opX + opW / 2} y={opVbY + 30} textAnchor="middle" fill="#784212" fontSize="10" fontWeight="bold">OP</text>
        <text x={opX + opW / 2} y={opVbY + 42} textAnchor="middle" fill="#333" fontSize="10">{op.name}</text>

        {/* Internal transfer arrow: OP CB → RP VB (the S-Scheme step) */}
        <path
          d={`M ${transferStartX} ${transferStartY} H ${transferMidX} V ${transferEndY} H ${transferEndX}`}
          fill="none"
          stroke={transferColor}
          strokeWidth={2}
          strokeDasharray="5,3"
          markerEnd="url(#arrowhead)"
        />
        <text x={transferMidX} y={Math.min(transferStartY, transferEndY) - 6}
          textAnchor="middle" fill={transferColor} fontSize="10">
          e⁻ recombination
        </text>

        {/* Reduction potential line — left of RP */}
        <line
          x1={redLineX1} y1={redY} x2={redLineX2} y2={redY}
          stroke={results?.reductionFeasible ? "#27ae60" : "#e74c3c"} strokeWidth={2} strokeDasharray="6,3"
        />
        <text x={redLineX1} y={redY - 4} fill={results?.reductionFeasible ? "#27ae60" : "#e74c3c"} fontSize="10">
          {reductionCouple.potential.toFixed(2)} V
        </text>
        <text x={redLineX1} y={redY + 12} fill={results?.reductionFeasible ? "#27ae60" : "#e74c3c"} fontSize="10">
          {reductionCouple.label.split("→")[1]?.trim() ?? reductionCouple.label}
        </text>

        {/* Oxidation potential line — right of OP */}
        <line
          x1={oxLineX1} y1={oxY} x2={oxLineX2} y2={oxY}
          stroke={results?.oxidationFeasible ? "#27ae60" : "#e74c3c"} strokeWidth={2} strokeDasharray="6,3"
        />
        <text x={oxLineX1} y={oxY - 4} fill={results?.oxidationFeasible ? "#27ae60" : "#e74c3c"} fontSize="10">
          {oxidationCouple.potential.toFixed(2)} V
        </text>
        <text x={oxLineX1} y={oxY + 12} fill={results?.oxidationFeasible ? "#27ae60" : "#e74c3c"} fontSize="10">
          {oxidationCouple.label.split("→")[1]?.trim() ?? oxidationCouple.label}
        </text>

      </svg>
      <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
        Blue = Reduction Photocatalyst (RP) &nbsp;|&nbsp; Orange = Oxidation Photocatalyst (OP) &nbsp;|&nbsp;
        Purple arrow = internal electron transfer step
      </p>
    </div>
  );
}
