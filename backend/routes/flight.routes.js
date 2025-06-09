const express = require("express");
const router = express.Router();
const Flight = require("../models/Flight");

// GET /api/flights - Basic Listing
router.get("/", async (req, res) => {
const { from, to } = req.query;

try {
    let query = {};
    if (from) query.from = new RegExp(from, "i");
    if (to) query.to = new RegExp(to, "i");

    const flights = await Flight.find(query).limit(20);
    res.json(flights);
} catch (err) {
    res.status(500).json({ message: "Error fetching flights." });
}
});

// 🔍 GET /api/flights/search - Advanced Search With Dates
router.get("/search", async (req, res) => {
const { from, to, departure, return: returnDate } = req.query;

try {
    const flights = await Flight.find({
    from: new RegExp(from, "i"),
    to: new RegExp(to, "i"),
    departureDate: { $gte: departure },
    returnDate: { $lte: returnDate },
    });

    res.json({ results: flights });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed." });
}
});

module.exports = router;
