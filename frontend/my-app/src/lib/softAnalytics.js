const KEY = "skyrio_soft_analytics";

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(arr) {
  try {
    localStorage.setItem(KEY, JSON.stringify(arr.slice(-200))); // keep last 200
  } catch {
    // ignore
  }
}

/**
 * ✅ Soft analytics:
 * Stores lightweight events for now (no PII).
 * Later you can POST these to /api/analytics/soft
 */
export function trackSoftEvent(name, payload = {}) {
  const events = read();
  events.push({
    name,
    payload,
    ts: Date.now(),
  });
  write(events);
}