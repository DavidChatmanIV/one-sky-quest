import { Router } from "express";
const router = Router();

const USE_MOCKS = process.env.USE_MOCKS !== "false";
const PROVIDER = process.env.PLACES_PROVIDER || "google";

// GET /api/places/search?query=hotel&lat=40.74&lng=-73.99&radius=1500
router.get("/search", async (req, res) => {
  try {
    const { query = "hotel", lat, lng, radius = 2000 } = req.query;

    if (USE_MOCKS) {
      return res.json({
        provider: "mock",
        items: [
          {
            id: "h1",
            name: "Sample Hotel Downtown",
            address: "123 Main St",
            lat: 40.741,
            lng: -73.989,
            rating: 4.4,
            types: ["lodging"],
          },
          {
            id: "h2",
            name: "City View Suites",
            address: "456 Market Ave",
            lat: 40.739,
            lng: -73.992,
            rating: 4.2,
            types: ["lodging"],
          },
        ],
      });
    }

    if (PROVIDER === "google") {
      if (!lat || !lng)
        throw new Error("lat & lng are required for Google Places");
      const key = process.env.GOOGLE_MAPS_KEY;
      if (!key) throw new Error("Missing GOOGLE_MAPS_KEY");

      const url = new URL(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
      );
      url.searchParams.set("location", `${lat},${lng}`);
      url.searchParams.set("radius", String(radius));
      url.searchParams.set("keyword", query);
      url.searchParams.set("type", "lodging");
      url.searchParams.set("key", key);

      const r = await fetch(url);
      const data = await r.json();
      const items = (data.results || []).map((p) => ({
        id: p.place_id,
        name: p.name,
        address: p.vicinity,
        lat: p.geometry?.location?.lat,
        lng: p.geometry?.location?.lng,
        rating: p.rating,
        types: p.types,
      }));
      return res.json({ provider: "google", items });
    }

    if (PROVIDER === "opentripmap") {
      const key = process.env.OPENTRIPMAP_KEY;
      if (!key) throw new Error("Missing OPENTRIPMAP_KEY");
      if (!lat || !lng)
        throw new Error("lat & lng are required for OpenTripMap");

      const url = new URL("https://api.opentripmap.com/0.1/en/places/radius");
      url.searchParams.set("radius", String(radius));
      url.searchParams.set("lon", String(lng));
      url.searchParams.set("lat", String(lat));
      url.searchParams.set("kinds", "accomodations"); // API uses this spelling
      url.searchParams.set("apikey", key);

      const r = await fetch(url);
      const data = await r.json();
      const items = (data.features || []).map((f) => ({
        id: f.id,
        name: f.properties?.name,
        address: f.properties?.address,
        lat: f.geometry?.coordinates?.[1],
        lng: f.geometry?.coordinates?.[0],
        rating: null,
        types: ["lodging"],
      }));
      return res.json({ provider: "opentripmap", items });
    }

    return res
      .status(501)
      .json({ error: `Provider '${PROVIDER}' not implemented` });
  } catch (err) {
    console.error("places/search error:", err);
    res.status(500).json({ error: err.message || "places search failed" });
  }
});

export default router;
