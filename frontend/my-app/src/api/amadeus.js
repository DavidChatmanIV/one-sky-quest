export async function searchLocations(keyword) {
  const res = await fetch(
    `/api/providers/amadeus/locations?keyword=${encodeURIComponent(keyword)}`
  );
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Locations failed");
  return json.data || [];
}

export async function searchFlights({
  origin,
  dest,
  date,
  adults = 1,
  max = 10,
  nonStop = false,
}) {
  const qs = new URLSearchParams({
    origin,
    dest,
    date,
    adults: String(adults),
    max: String(max),
    nonStop: String(nonStop),
  }).toString();

  const res = await fetch(`/api/providers/amadeus/flights/search?${qs}`);
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Flights failed");
  return json.results || [];
}
