const enc = (s) => encodeURIComponent(String(s || "").trim());

export const buildGoogleDirectionsUrl = (origin, destination, mode) =>
  `https://www.google.com/maps/dir/?api=1&origin=${enc(
    origin
  )}&destination=${enc(destination)}&travelmode=${enc(
    (mode || "driving").toLowerCase()
  )}`;

export const buildAppleDirectionsUrl = (origin, destination, mode) =>
  `https://maps.apple.com/?saddr=${enc(origin)}&daddr=${enc(
    destination
  )}&dirflg=${mode === "TRANSIT" ? "r" : mode === "WALKING" ? "w" : "d"}`;

export const buildNearbySearchUrl = (address, query) =>
  `https://www.google.com/maps/search/${enc(query)}+near+${enc(address)}`;

export const buildNearbyHotelUrl = (address) =>
  buildNearbySearchUrl(address, "hotels");

export const buildPlaceUrl = (address) =>
  `https://www.google.com/maps/search/${enc(address)}`;
