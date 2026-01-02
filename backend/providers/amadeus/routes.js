import { Router } from "express";
import { amadeusGet } from "./client.js";
import { normalizeFlightOffers } from "./normalize.js";

const r = Router();

const upper = (v, fallback) =>
  String(v ?? fallback ?? "")
    .trim()
    .toUpperCase();

const str = (v, fallback) => String(v ?? fallback ?? "").trim();

const num = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * ✅ Quick ping (no Amadeus call)
 * GET /api/providers/amadeus/_test/ping
 */
r.get("/_test/ping", (_req, res) => {
  res.json({ ok: true, test: "hit" });
});

/**
 * ✅ 1-click smoke test (calls Amadeus)
 * GET /api/providers/amadeus/_test/flight-offers
 */
r.get("/_test/flight-offers", async (_req, res) => {
  try {
    const data = await amadeusGet("/v2/shopping/flight-offers", {
      originLocationCode: "JFK",
      destinationLocationCode: "LAX",
      departureDate: "2026-02-15",
      adults: 1,
      max: 5,
      currencyCode: "USD",
    });

    const normalized = normalizeFlightOffers(data);

    res.json({
      ok: true,
      env: process.env.AMADEUS_ENV || "sandbox",
      rawCount: data?.data?.length || 0,
      normalizedCount: normalized?.length || 0,
      sample: normalized?.[0] || null,
      normalized,
    });
  } catch (e) {
    res.status(502).json({ ok: false, error: e.message });
  }
});

/**
 * ✅ Autocomplete for "Where"
 * GET /api/providers/amadeus/locations?keyword=ewr
 */
r.get("/locations", async (req, res) => {
  try {
    const keyword = str(req.query.keyword, "");
    if (keyword.length < 2) return res.json({ ok: true, data: [] });

    const data = await amadeusGet("/v1/reference-data/locations", {
      subType: "AIRPORT,CITY",
      keyword,
      page: { limit: 8 },
      sort: "analytics.travelers.score",
    });

    const mapped = (data?.data || []).map((l) => ({
      code: l.iataCode,
      name: l.name,
      city: l.address?.cityName,
      country: l.address?.countryName,
      type: l.subType, // AIRPORT or CITY
    }));

    res.json({ ok: true, data: mapped });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * ✅ Real endpoint for your Booking UI
 * GET /api/providers/amadeus/flights/search?origin=JFK&dest=LAX&date=2026-02-15&adults=1&max=10&nonStop=false
 */
r.get("/flights/search", async (req, res) => {
  try {
    const origin = upper(req.query.origin, "JFK");
    const dest = upper(req.query.dest, "LAX");
    const date = str(req.query.date, "2026-02-15");

    const adults = num(req.query.adults, 1);
    const max = num(req.query.max, 10);
    const nonStop = req.query.nonStop === "true" || req.query.nonStop === true;

    // ✅ Use the user's query params (not hardcoded)
    const data = await amadeusGet("/v2/shopping/flight-offers", {
      originLocationCode: origin,
      destinationLocationCode: dest,
      departureDate: date,
      adults,
      max,
      currencyCode: "USD",
      ...(nonStop ? { nonStop: true } : {}),
    });

    const normalized = normalizeFlightOffers(data);

    res.json({
      ok: true,
      source: "amadeus",
      query: { origin, dest, date, adults, max, nonStop },
      count: normalized.length,
      results: normalized,
      // Keep raw while building; remove later for production
      raw: data,
    });
  } catch (e) {
    res.status(502).json({ ok: false, source: "amadeus", error: e.message });
  }
});

export default r;
