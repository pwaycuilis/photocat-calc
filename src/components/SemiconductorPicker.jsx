import semiconductors from "../data/semiconductors";

// label: displayed above the dropdown (e.g. "Photocatalyst" or "Photoanode")
// value: the currently selected semiconductor id (string)
// onChange: called with the full semiconductor object when selection changes
export default function SemiconductorPicker({ label, value, onChange }) {
  function handleChange(e) {
    const selected = semiconductors.find((s) => s.id === e.target.value);
    onChange(selected);
  }

  const selected = semiconductors.find((s) => s.id === value);

  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
        {label}
      </label>
      <select value={value ?? ""} onChange={handleChange} style={{ padding: "6px", minWidth: "260px" }}>
        <option value="" disabled>Select a semiconductor…</option>
        {semiconductors.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} (Eg = {s.bandgapEv} eV)
          </option>
        ))}
      </select>
      {selected && (
        <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#555" }}>
          CB: {selected.cbEdge} V &nbsp;|&nbsp; VB: {selected.vbEdge} V &nbsp;|&nbsp; {selected.notes}
        </p>
      )}
    </div>
  );
}
