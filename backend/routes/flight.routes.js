const express = require("express");
const router = express.Router();
const Flight = require("../models/Flight");

// GET /api/flights/search
router.get("/search", async (req, res) => {
const { from, to, departure, return: returnDate } = req.query;

try {
    const flights = await Flight.find({
    from: new RegExp(from, "i"),
    to: new RegExp(to, "i"),
    departure: { $gte: new Date(departure) },
    return: { $lte: new Date(returnDate) },
    });

    res.json({ results: flights });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed." });
}
});

module.exports = router;
