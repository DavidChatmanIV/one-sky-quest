const express = require("express");
const router = express.Router();
const Cruise = require("../models/cruise.model");

// Get all or filtered cruises
router.get("/", async (req, res) => {
try {
    const { maxPrice, destination } = req.query;
    const filter = {};

    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (destination) filter.destination = new RegExp(destination, "i");

    const cruises = await Cruise.find(filter);
    res.json({ cruises });
} catch (err) {
    res.status(500).json({ error: "Server error fetching cruises" });
}
});

// Add a cruise (for seeding/admin)
router.post("/", async (req, res) => {
try {
    const newCruise = new Cruise(req.body);
    await newCruise.save();
    res.status(201).json(newCruise);
} catch (err) {
    res.status(400).json({ error: "Error adding cruise" });
}
});

module.exports = router;
