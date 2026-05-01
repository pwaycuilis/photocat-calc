import { useState } from "react";
import SchemeSelector from "./components/SchemeSelector";
import BasicScheme from "./schemes/basic/BasicScheme";
import SScheme from "./schemes/s-scheme/SScheme";
import ZScheme from "./schemes/z-scheme/ZScheme";

function CustomSemiconductorForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [cbEdge, setCbEdge] = useState("");
  const [vbEdge, setVbEdge] = useState("");
  const [bandgapEv, setBandgapEv] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!name.trim()) { setError("Name is required."); return; }
    const cb = parseFloat(cbEdge);
    const vb = parseFloat(vbEdge);
    const eg = parseFloat(bandgapEv);
    if (isNaN(cb) || isNaN(vb) || isNaN(eg)) { setError("CB, VB, and band gap must be valid numbers."); return; }
    onAdd({ id: `custom_${Date.now()}`, name: name.trim(), cbEdge: cb, vbEdge: vb, bandgapEv: eg, notes: notes.trim() });
    setName(""); setCbEdge(""); setVbEdge(""); setBandgapEv(""); setNotes(""); setError("");
    setOpen(false);
  }

  const inputStyle = { width: "100%", padding: "6px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", boxSizing: "border-box" };
  const labelStyle = { display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "4px" };

  return (
    <div style={{ marginBottom: "24px", border: "1px solid #ddd", borderRadius: "6px", overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "10px 16px", background: "#f5f5f5", border: "none", cursor: "pointer", textAlign: "left", fontWeight: "bold", fontSize: "14px" }}
      >
        {open ? "▲" : "▼"} Add custom semiconductor
      </button>
      {open && (
        <div style={{ padding: "16px", display: "grid", gap: "12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="e.g. My Semiconductor" />
            </div>
            <div>
              <label style={labelStyle}>Band gap Eg (eV) *</label>
              <input type="number" value={bandgapEv} onChange={e => setBandgapEv(e.target.value)} style={inputStyle} placeholder="e.g. 2.4" />
            </div>
            <div>
              <label style={labelStyle}>CB edge (V vs NHE, pH 0) *</label>
              <input type="number" value={cbEdge} onChange={e => setCbEdge(e.target.value)} style={inputStyle} placeholder="e.g. -0.5" />
            </div>
            <div>
              <label style={labelStyle}>VB edge (V vs NHE, pH 0) *</label>
              <input type="number" value={vbEdge} onChange={e => setVbEdge(e.target.value)} style={inputStyle} placeholder="e.g. 1.9" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Notes (optional)</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} style={inputStyle} placeholder="e.g. Novel organic semiconductor, visible-light active" />
          </div>
          {error && <p style={{ color: "#721c24", fontSize: "13px", margin: 0 }}>{error}</p>}
          <button
            onClick={handleSubmit}
            style={{ padding: "8px 20px", background: "#1a5276", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", justifySelf: "start" }}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeScheme, setActiveScheme] = useState("basic");
  const [customSemiconductors, setCustomSemiconductors] = useState([]);

  function handleAddCustom(semiconductor) {
    setCustomSemiconductors(prev => [...prev, semiconductor]);
  }

  function handleRemoveCustom(id) {
    setCustomSemiconductors(prev => prev.filter(s => s.id !== id));
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "4px" }}>Photocatalytic Systems Energetics Calculator</h1>
      <p style={{ color: "#666", marginTop: 0, marginBottom: "32px" }}>
        Screen semiconductor–reaction combinations for CO₂ reduction using solar energy.
      </p>

      <SchemeSelector activeScheme={activeScheme} onChange={setActiveScheme} />

      <CustomSemiconductorForm onAdd={handleAddCustom} />

      {customSemiconductors.length > 0 && (
        <div style={{ marginBottom: "24px", padding: "12px 16px", background: "#f9f9f9", border: "1px solid #eee", borderRadius: "6px" }}>
          <p style={{ fontSize: "13px", fontWeight: "bold", margin: "0 0 8px" }}>Custom semiconductors (session only — lost on refresh):</p>
          {customSemiconductors.map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", marginBottom: "4px" }}>
              <span>{s.name} — CB: {s.cbEdge} V, VB: {s.vbEdge} V, Eg: {s.bandgapEv} eV</span>
              <button onClick={() => handleRemoveCustom(s.id)} style={{ fontSize: "12px", color: "#721c24", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Remove</button>
            </div>
          ))}
        </div>
      )}

      {activeScheme === "basic" && <BasicScheme customSemiconductors={customSemiconductors} />}
      {activeScheme === "s-scheme" && <SScheme customSemiconductors={customSemiconductors} />}
      {activeScheme === "z-scheme" && <ZScheme customSemiconductors={customSemiconductors} />}
    </div>
  );
}
