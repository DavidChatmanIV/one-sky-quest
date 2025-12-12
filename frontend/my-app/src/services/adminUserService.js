const API_BASE = import.meta.env.VITE_API_URL || "";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function fetchAdminUsers() {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load users");
  return data;
}

export async function updateUserRole(userId, role) {
  const res = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update role");
  return data;
}
