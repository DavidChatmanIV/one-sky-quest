export function makeMockFlights({ origin = "EWR", destination = "MIA" } = {}) {
  const now = Date.now();
  return [
    {
      id: `mock_${now}_1`,
      provider: "mock",
      origin,
      destination,
      airline: "Skyrio Air",
      airlineCode: "SK",
      flightNumber: "101",
      departAt: new Date(now + 1000 * 60 * 60 * 5).toISOString(),
      arriveAt: new Date(now + 1000 * 60 * 60 * 8).toISOString(),
      stops: 0,
      durationMinutes: 180,
      cabin: "ECONOMY",
      price: { total: 219.99, currency: "USD" },
      badges: ["Limited deal"],
    },
    {
      id: `mock_${now}_2`,
      provider: "mock",
      origin,
      destination,
      airline: "SkyJet",
      airlineCode: "SJ",
      flightNumber: "224",
      departAt: new Date(now + 1000 * 60 * 60 * 7).toISOString(),
      arriveAt: new Date(now + 1000 * 60 * 60 * 11).toISOString(),
      stops: 1,
      durationMinutes: 240,
      cabin: "ECONOMY",
      price: { total: 189.49, currency: "USD" },
      badges: ["Best value"],
    },
  ];
}

/**
 * Map Amadeus Flight Offers Search -> normalized Flight objects
 * Expects typical payload: { data: [offer...] , dictionaries: { carriers, aircraft } }
 */
export function normalizeAmadeusOffers(payload) {
  const offers = payload?.data || [];
  const carriers = payload?.dictionaries?.carriers || {};

  return offers
    .map((offer) => {
      const itinerary = offer?.itineraries?.[0];
      const segments = itinerary?.segments || [];
      if (!segments.length) return null;

      const first = segments[0];
      const last = segments[segments.length - 1];

      const airlineCode = first?.carrierCode || "—";
      const airline = carriers[airlineCode] || airlineCode;

      const durationMinutes = isoDurationToMinutes(itinerary?.duration);
      const stops = Math.max(0, segments.length - 1);

      const priceTotal = Number(
        offer?.price?.grandTotal ?? offer?.price?.total ?? 0
      );
      const currency = offer?.price?.currency || "USD";

      const cabin =
        offer?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin ||
        offer?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class ||
        "ECONOMY";

      return {
        id: `amadeus_${offer.id}`,
        provider: "amadeus",
        rawOffer: offer, // keep original for checkout later
        origin: first?.departure?.iataCode || "—",
        destination: last?.arrival?.iataCode || "—",
        airline,
        airlineCode,
        flightNumber: first?.number
          ? `${airlineCode}${first.number}`
          : airlineCode,
        departAt: first?.departure?.at,
        arriveAt: last?.arrival?.at,
        stops,
        durationMinutes,
        cabin: String(cabin).toUpperCase(),
        price: { total: priceTotal, currency },
        badges: stops === 0 ? ["Nonstop"] : ["1+ stop"],
      };
    })
    .filter(Boolean);
}

function isoDurationToMinutes(iso) {
  // e.g. "PT3H25M"
  if (!iso || typeof iso !== "string") return null;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!m) return null;
  const h = Number(m[1] || 0);
  const min = Number(m[2] || 0);
  return h * 60 + min;
}
