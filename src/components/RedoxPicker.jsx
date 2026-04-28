import redoxCouples from "../data/redoxCouples";

// label: displayed above the dropdown
// filter: optional category string — if provided, only shows couples in that category
// value: currently selected couple id
// onChange: called with the full redox couple object when selection changes
export default function RedoxPicker({ label, filter, value, onChange }) {
  const options = filter
    ? redoxCouples.filter((r) => r.category === filter)
    : redoxCouples;

  function handleChange(e) {
    const selected = options.find((r) => r.id === e.target.value);
    onChange(selected);
  }

  const selected = options.find((r) => r.id === value);

  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
        {label}
      </label>
      <select value={value ?? ""} onChange={handleChange} style={{ padding: "6px", minWidth: "260px" }}>
        <option value="" disabled>Select a reaction…</option>
        {options.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label} ({r.potential} V vs NHE)
          </option>
        ))}
      </select>
      {selected && (
        <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#555" }}>
          {selected.equation}
        </p>
      )}
    </div>
  );
}
