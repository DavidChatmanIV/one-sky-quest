const BASE_TEST = "https://test.api.amadeus.com";
const BASE_LIVE = "https://api.amadeus.com";

const getBase = () =>
  process.env.AMADEUS_ENV === "production" ? BASE_LIVE : BASE_TEST;

// ✅ One token cache for the whole server process
let cachedToken = null;
let tokenExpiresAt = 0;

function assertEnv() {
  const id = process.env.AMADEUS_CLIENT_ID;
  const secret = process.env.AMADEUS_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error(
      "Missing Amadeus env vars. Set AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET."
    );
  }
  return { id, secret };
}

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 30_000) return cachedToken; // 30s buffer

  const { id, secret } = assertEnv();

  const url = `${getBase()}/v1/security/oauth2/token`;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: id,
    client_secret: secret,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Amadeus token error ${res.status}: ${text}`);
  }

  const json = await res.json();
  cachedToken = json.access_token;
  tokenExpiresAt = Date.now() + json.expires_in * 1000;

  return cachedToken;
}

export async function amadeusGet(path, params = {}) {
  const token = await getAccessToken();

  const url = new URL(`${getBase()}${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Amadeus GET error ${res.status}: ${text}`);
  }

  return res.json();
}