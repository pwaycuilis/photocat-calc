import mediators from "../data/mediators";

export default function MediatorPicker({ value, onChange }) {
  function handleChange(e) {
    const selected = mediators.find((m) => m.id === e.target.value);
    onChange(selected);
  }

  const selected = mediators.find((m) => m.id === value);

  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
        Redox Mediator
      </label>
      <select value={value ?? ""} onChange={handleChange} style={{ padding: "6px", minWidth: "260px" }}>
        <option value="" disabled>Select a mediator…</option>
        {mediators.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label} ({m.potential} V vs NHE)
          </option>
        ))}
      </select>
      {selected && (
        <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#555" }}>
          {selected.notes}
        </p>
      )}
    </div>
  );
}
