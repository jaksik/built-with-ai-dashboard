import { useState, FormEvent } from "react";

export default function SimpleForm() {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(`Submitted: ${value}`);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter something"
        style={{ padding: 8, fontSize: 16 }}
        required
      />
      <button type="submit" style={{ padding: "8px 16px" }}>
        Submit
      </button>
    </form>
  );
}
