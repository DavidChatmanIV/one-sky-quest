// Toggle this when you connect your MongoDB-backed API
const USE_MOCK = true;


// 1) Vite-only (recommended for your setup):
const API_BASE = import.meta.env.VITE_API_BASE ?? "";


export async function getProfile({ userId } = {}) {
  if (USE_MOCK) {
    await delay(500);
    return {
      userId: userId || "demo-user-1",
      username: "one_sky_explorer",
      firstName: "David",
      avatarUrl: "",
      level: 7,
      xp: 560,
      nextBadge: { name: "Globetrotter" },
      savedTrips: 3,
      unread: 2,
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(
      `${API_BASE}/api/profile${userId ? `/${userId}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
            ? `Bearer ${localStorage.getItem("token")}`
            : undefined,
        },
        signal: controller.signal,
        credentials: "include",
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Request failed with ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
