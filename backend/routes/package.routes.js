const express = require("express");
const router = express.Router();
const Package = require("../models/Package");

router.get("/", async (req, res) => {
const { destination, maxPrice, type } = req.query;
const query = {};

if (destination) query.destination = new RegExp(destination, "i");
if (maxPrice) query.price = { $lte: parseFloat(maxPrice) };
if (type) query.type = type;

try {
    const packages = await Package.find(query);
    res.json(packages);
} catch (err) {
    console.error("Error fetching packages:", err);
    res.status(500).json({ message: "Error loading packages" });
}
});

module.exports = router;
