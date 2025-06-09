const express = require("express");
const router = express.Router();
const Package = require("../models/package.model");

// GET all or filtered
router.get("/", async (req, res) => {
try {
    const { maxPrice, tag, destination } = req.query;
    let filter = {};

    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (tag) filter.tags = tag;
    if (destination) filter.destination = new RegExp(destination, "i");

    const packages = await Package.find(filter);
    res.json({ packages });
} catch (err) {
    res.status(500).json({ error: "Server error fetching packages" });
}
});

// POST a new package (for seeding or admin use)
router.post("/", async (req, res) => {
try {
    const newPackage = new Package(req.body);
    await newPackage.save();
    res.status(201).json(newPackage);
} catch (err) {
    res.status(400).json({ error: "Error adding package" });
}
});

module.exports = router;
