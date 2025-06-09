const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");

// GET /api/hotels with optional filters
router.get("/", async (req, res) => {
try {
    const { location, maxPrice, minStars } = req.query;
    const query = {};

    if (location) query.location = new RegExp(location, "i");
    if (maxPrice) query.price = { $lte: parseInt(maxPrice) };
    if (minStars) query.stars = { $gte: parseInt(minStars) };

    const hotels = await Hotel.find(query);
    res.json(hotels);
} catch (err) {
    res.status(500).json({ error: "Server error" });
}
});

module.exports = router;
