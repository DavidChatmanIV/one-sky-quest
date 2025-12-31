import { useCallback, useEffect, useMemo, useState } from "react";

const KEY = "skyrio_saved_flights_v1";

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function useSavedFlights() {
  const [saved, setSaved] = useState(() =>
    safeParse(localStorage.getItem(KEY), [])
  );

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(saved));
  }, [saved]);

  const savedCount = saved.length;

  const isSaved = useCallback(
    (flightId) => saved.some((f) => f.id === flightId),
    [saved]
  );

  const saveFlight = useCallback((flight) => {
    setSaved((prev) => {
      if (prev.some((f) => f.id === flight.id)) return prev;
      return [{ ...flight, savedAt: Date.now() }, ...prev];
    });
  }, []);

  const removeFlight = useCallback((flightId) => {
    setSaved((prev) => prev.filter((f) => f.id !== flightId));
  }, []);

  const clearSaved = useCallback(() => setSaved([]), []);

  const value = useMemo(
    () => ({
      saved,
      savedCount,
      isSaved,
      saveFlight,
      removeFlight,
      clearSaved,
    }),
    [saved, savedCount, isSaved, saveFlight, removeFlight, clearSaved]
  );

  return value;
}