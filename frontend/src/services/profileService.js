const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getProfile({ userId }) {
  if (!userId) {
    throw new Error("Missing userId for profile request");
  }

  const res = await fetch(`${API_BASE}/api/profile?userId=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to load profile");
  }

  return data;
}
