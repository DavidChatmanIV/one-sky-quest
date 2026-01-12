export async function safeJson(url, opts) {
  try {
    const res = await fetch(url, opts);

    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      if (import.meta.env.DEV) {
        const preview = await res.text().catch(() => "");
        console.warn(
          "[safeJson] non-JSON response:",
          url,
          res.status,
          preview.slice(0, 160)
        );
      }
      return null;
    }

    const data = await res.json().catch(() => null);

    if (!res.ok && import.meta.env.DEV) {
      console.warn("[safeJson] non-2xx JSON:", url, res.status, data);
    }

    return data;
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn("[safeJson] fetch failed:", url, e);
    }
    return null;
  }
}