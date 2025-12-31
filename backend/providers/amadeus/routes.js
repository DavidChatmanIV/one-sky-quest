import { Router } from "express";
import { amadeusGet } from "./client.js";
import { normalizeFlightOffers } from "./normalize.js";

const r = Router();

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
 * ✅ Real endpoint for your Booking UI
 * GET /api/providers/amadeus/flights/search?origin=JFK&dest=LAX&date=2026-02-15&adults=1&max=10&nonStop=false
 */
r.get("/flights/search", async (req, res) => {
  try {
    const origin = (req.query.origin || "JFK").toString().toUpperCase();
    const dest = (req.query.dest || "LAX").toString().toUpperCase();
    const date = (req.query.date || "2026-02-15").toString();
    const adults = Number(req.query.adults || 1);
    const max = Number(req.query.max || 10);
    const nonStop = req.query.nonStop === "true" || req.query.nonStop === true;

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
      source: "amadeus",
      query: { origin, dest, date, adults, max, nonStop },
      count: normalized.length,
      results: normalized,
      raw: data, // remove later if you want
    });
  } catch (e) {
    res.status(502).json({ ok: false, source: "amadeus", error: e.message });
  }
});

export default r;