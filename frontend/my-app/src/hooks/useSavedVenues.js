import { useEffect, useState } from "react";
import { DEFAULT_VENUES } from "../constants/travel";

export function useSavedVenues() {
  const [savedVenues, setSavedVenues] = useState(DEFAULT_VENUES);

  // Load + merge defaults with custom
  useEffect(() => {
    const stored = localStorage.getItem("osq_saved_venues");
    let custom = [];

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) custom = parsed;
      } catch (err) {
        console.warn(
          "Invalid osq_saved_venues JSON in localStorage; ignoring.",
          err
        );
        // Optional: clear corrupt value
        // localStorage.removeItem("osq_saved_venues");
      }
    }

    const map = new Map();
    [...DEFAULT_VENUES, ...custom].forEach((v) => {
      if (v && v.value)
        map.set(v.value, { label: v.label || v.value, value: v.value });
    });
    setSavedVenues(Array.from(map.values()));
  }, []);

  // Persist only custom
  useEffect(() => {
    const customOnly = savedVenues.filter(
      (v) => !DEFAULT_VENUES.some((d) => d.value === v.value)
    );
    try {
      localStorage.setItem("osq_saved_venues", JSON.stringify(customOnly));
    } catch (err) {
      console.warn("Failed to save osq_saved_venues to localStorage.", err);
    }
  }, [savedVenues]);

  return [savedVenues, setSavedVenues];
}
