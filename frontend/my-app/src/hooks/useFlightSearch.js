import { useCallback, useState } from "react";
import {
  makeMockFlights,
  normalizeAmadeusOffers,
} from "../utils/flightNormalize";

// You will wire this to your backend proxy later (recommended)
// For now it can hit your backend: /api/amadeus/flights (example)
async function fetchAmadeusFlights(params) {
  const res = await fetch("/api/amadeus/flights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Amadeus fetch failed: ${res.status}`);
  return res.json();
}

export function useFlightSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [mode, setMode] = useState("idle"); // idle | mock | live | failed
  const [error, setError] = useState(null);

  const search = useCallback(async (params) => {
    setError(null);
    setLoading(true);

    // 1) Show mock cards immediately
    setResults(
      makeMockFlights({
        origin: params?.origin,
        destination: params?.destination,
      })
    );
    setMode("mock");

    try {
      // 2) Try live
      const payload = await fetchAmadeusFlights(params);
      const live = normalizeAmadeusOffers(payload);

      // If live returns empty, keep mock but mark failed/empty
      if (live?.length) {
        setResults(live);
        setMode("live");
      } else {
        setMode("failed");
      }
    } catch (e) {
      setError(e?.message || "Flight search failed");
      setMode("failed");
      // Keep mock results on screen
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, results, mode, error, search };
}