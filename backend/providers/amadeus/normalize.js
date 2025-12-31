// backend/providers/amadeus/normalize.js

function minutesBetween(isoStart, isoEnd) {
  const a = new Date(isoStart).getTime();
  const b = new Date(isoEnd).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return Math.max(0, Math.round((b - a) / 60000));
}

function formatDurationMins(mins) {
  if (mins == null) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function pickMainCarrier(offer) {
  const seg = offer?.itineraries?.[0]?.segments?.[0];
  return seg?.carrierCode || offer?.validatingAirlineCodes?.[0] || null;
}

function buildLeg(itinerary) {
  const segs = itinerary?.segments || [];
  const first = segs[0];
  const last = segs[segs.length - 1];

  const departAt = first?.departure?.at || null;
  const arriveAt = last?.arrival?.at || null;

  const origin = first?.departure?.iataCode || null;
  const destination = last?.arrival?.iataCode || null;

  const stops = Math.max(0, segs.length - 1);
  const durationMins =
    departAt && arriveAt ? minutesBetween(departAt, arriveAt) : null;

  return {
    origin,
    destination,
    departAt,
    arriveAt,
    stops,
    durationMins,
    durationLabel: formatDurationMins(durationMins),
    segments: segs.map((s) => ({
      from: s?.departure?.iataCode || null,
      to: s?.arrival?.iataCode || null,
      departAt: s?.departure?.at || null,
      arriveAt: s?.arrival?.at || null,
      carrier: s?.carrierCode || null,
      flightNumber: s?.number || null,
    })),
  };
}

/**
 * Skyrio flight card shape (frontend-friendly)
 * - id: stable id you can use for drawer/selection
 * - price: numeric + currency + formatted label
 * - rating: mock-ready (set null now; you can add later)
 */
export function normalizeFlightOffers(amadeusResponse) {
  const offers = amadeusResponse?.data || [];
  return offers.map((offer, idx) => {
    const price = offer?.price?.total ? Number(offer.price.total) : null;
    const currency = offer?.price?.currency || "USD";

    const itineraries = offer?.itineraries || [];
    const out = itineraries[0] ? buildLeg(itineraries[0]) : null;
    const back = itineraries[1] ? buildLeg(itineraries[1]) : null;

    const carrier = pickMainCarrier(offer);

    return {
      // ✅ Skyrio card
      id: offer?.id || `amadeus_${idx}`,
      provider: "amadeus",
      type: "flight",

      // what you show on cards
      title: carrier ? `${carrier} • Flight` : "Flight",
      carrierCode: carrier,
      price,
      currency,
      priceLabel:
        price != null
          ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency,
            }).format(price)
          : null,

      // helpful for your filter UI
      nonStop: out?.stops === 0,
      stops: out?.stops ?? null,
      durationMins: out?.durationMins ?? null,
      durationLabel: out?.durationLabel ?? null,

      // leg details for Drawer/Details view
      outbound: out,
      inbound: back,

      // optional metadata
      raw: {
        validatingAirlineCodes: offer?.validatingAirlineCodes || [],
        oneWay: offer?.oneWay ?? null,
        travelerPricings: offer?.travelerPricings
          ? offer.travelerPricings.length
          : 0,
      },
    };
  });
}
