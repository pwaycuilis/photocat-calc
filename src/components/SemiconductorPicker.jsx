import semiconductors from "../data/semiconductors";

export default function SemiconductorPicker({ label, value, onChange, customSemiconductors = [] }) {
  const allSemiconductors = [...semiconductors, ...customSemiconductors];

  function handleChange(e) {
    const selected = allSemiconductors.find((s) => s.id === e.target.value);
    onChange(selected);
  }

  const selected = allSemiconductors.find((s) => s.id === value);

  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
        {label}
      </label>
      <select value={value ?? ""} onChange={handleChange} style={{ padding: "6px", minWidth: "260px" }}>
        <option value="" disabled>Select a semiconductor…</option>
        <optgroup label="Library">
          {semiconductors.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} (Eg = {s.bandgapEv} eV)
            </option>
          ))}
        </optgroup>
        {customSemiconductors.length > 0 && (
          <optgroup label="Custom (session)">
            {customSemiconductors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (Eg = {s.bandgapEv} eV)
              </option>
            ))}
          </optgroup>
        )}
      </select>
      {selected && (
        <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#555" }}>
          CB: {selected.cbEdge} V &nbsp;|&nbsp; VB: {selected.vbEdge} V &nbsp;|&nbsp; {selected.notes}
        </p>
      )}
    </div>
  );
}
