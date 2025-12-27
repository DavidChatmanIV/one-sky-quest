import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

/**
 * GET /api/hotspots?limit=4
 * Returns trending destinations based on recent bookings.
 */
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "4", 10), 10);

    // last 30 days
    const since = new Date();
    since.setDate(since.getDate() - 30);

    // Aggregate bookings by destination/city
    const rows = await Booking.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            city: "$destinationCity",
            country: "$destinationCountry",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    // Compute a simple "boost%" based on relative count
    const max = rows[0]?.count || 1;

    const hotspots = rows.map((r) => {
      const city = r._id.city || "Unknown";
      const country = r._id.country || "";
      const ratio = r.count / max;
      const boost = Math.round(12 + ratio * 30); // 12–42-ish range

      return {
        city,
        country,
        count: r.count,
        boostPercent: boost, // number
        tag: `#${String(city).replace(/\s+/g, "")}`, // e.g. #PuertoRico
      };
    });

    res.json({ hotspots, windowDays: 30 });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Failed to build hotspots", error: e?.message });
  }
});

export default router;