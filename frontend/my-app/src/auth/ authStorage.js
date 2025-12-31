const KEY = "skyrio_session_v1";

export function loadSession() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_err) {
    return null;
  }
}

export function saveSession(session) {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch (_err) {
    // optional
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch (_err) {
    // optional
  }
}