const API_BASE = "http://localhost:3000/api"; // Update to Render

export async function saveTrip(trip, token) {
const res = await fetch(`${API_BASE}/user/save-trip`, {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 👈 Attach JWT
    },
    body: JSON.stringify(trip),
});

if (!res.ok) throw new Error("Failed to save trip");
return res.json();
}



export async function saveTrip(trip, token) {
  const res = await fetch("http://localhost:3000/api/trips/save-trip", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 👈 Token goes here
    },
    body: JSON.stringify(trip),
  });

  if (!res.ok) throw new Error("Failed to save trip");
  return res.json();
}
