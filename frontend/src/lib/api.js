const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchPrescriptions() {
  const res = await fetch(`${API_URL}/api/prescriptions`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch prescriptions");
  return res.json();
}

export async function fetchPrescription(id) {
  const res = await fetch(`${API_URL}/api/prescriptions/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch prescription");
  return res.json();
}

export async function createPrescription(data) {
  const res = await fetch(`${API_URL}/api/prescriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to create prescription");
  return json;
}
