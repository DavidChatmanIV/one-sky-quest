import { Router } from "express";
import { amadeusGet } from "../../services/amadeusClient.js";

const router = Router();

/**
 * GET /api/flights/search
 * Example:
 * /api/flights/search?origin=JFK&destination=LAX&date=2026-01-20&adults=1&max=20
 */
router.get("/search", async (req, res) => {
  try {
    const {
      origin,
      destination,
      date,
      adults = "1",
      max = "20",
      currencyCode = "USD",
      nonStop = "false",
    } = req.query;

    if (!origin || !destination || !date) {
      return res.status(400).json({
        ok: false,
        error: "Missing required query params: origin, destination, date",
      });
    }

    const data = await amadeusGet("/v2/shopping/flight-offers", {
      originLocationCode: String(origin).toUpperCase(),
      destinationLocationCode: String(destination).toUpperCase(),
      departureDate: String(date),
      adults: Number(adults),
      max: Number(max),
      currencyCode: String(currencyCode).toUpperCase(),
      nonStop: nonStop === "true",
    });

    return res.json({ ok: true, source: "amadeus", data });
  } catch (err) {
    const status = err?.response?.status || 500;
    const details = err?.response?.data || { message: err.message };

    return res.status(status).json({
      ok: false,
      error: "Amadeus request failed",
      details,
    });
  }
});

export default router;