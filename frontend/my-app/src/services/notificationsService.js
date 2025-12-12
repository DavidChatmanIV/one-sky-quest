const BASE_URL = "/api/notifications";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
}

/**
 * Fetch notifications for the logged-in user.
 *
 * options:
 *  - unread: boolean (only unread if true)
 *  - limit: number
 *  - sort: "asc" | "desc"
 *
 * Returns whatever the backend sends (array by default).
 */
export async function getNotifications(options = {}) {
  const params = new URLSearchParams();

  if (options.unread === true) params.set("unread", "true");
  if (options.limit) params.set("limit", String(options.limit));
  if (options.sort) params.set("sort", options.sort);

  const query = params.toString() ? `?${params.toString()}` : "";

  const res = await fetch(`${BASE_URL}${query}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

/**
 * Convenience wrapper for loading notifications in the dropdown.
 *
 * Uses getNotifications() under the hood and normalizes the output
 * to an array, whether the backend returns:
 *   - an array: [ ... ]
 *   - or an object like { notifications: [...] }
 */
export async function fetchNotifications(options = {}) {
  const data = await getNotifications(options);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.notifications)) return data.notifications;

  return [];
}

/**
 * Get unread notifications count (for bell badge)
 */
export async function getUnreadCount() {
  const res = await fetch(`${BASE_URL}/unread-count`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(res); // => { count: number }
}

/**
 * Create a new notification for the logged-in user.
 *
 * body example:
 * {
 *   type: "booking",
 *   event: "booking_created",
 *   title: "Booking confirmed",
 *   message: "Your trip to Tokyo is confirmed!",
 *   targetType: "booking",
 *   targetId: "<bookingId>",
 *   link: "/dashboard/trips/123"
 * }
 */
export async function createNotification(payload) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

/**
 * Mark a single notification as read
 */
export async function markNotificationRead(id) {
  const res = await fetch(`${BASE_URL}/${id}/read`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead() {
  const res = await fetch(`${BASE_URL}/read-all`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

/**
 * Delete a notification by id
 */
export async function deleteNotification(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}
