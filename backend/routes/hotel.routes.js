const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");

// GET /api/hotels
router.get("/", async (req, res) => {
try {
    const { type, location, maxPrice, minStars } = req.query;
    const query = {};

    if (type) query.type = type;
    if (location) query.location = new RegExp(location, "i");
    if (maxPrice) query.price = { $lte: parseInt(maxPrice) };
    if (minStars) query.stars = { $gte: parseInt(minStars) };

    const hotels = await Hotel.find(query);
    res.json(hotels);
} catch (err) {
    console.error("Error fetching stays:", err);
    res.status(500).json({ message: "Server error" });
}
});

module.exports = router;
