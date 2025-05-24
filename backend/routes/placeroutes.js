const express = require("express");
const router = express.Router();
const Place = require("../models/Place"); // MongoDB Mongoose model

// ✅ GET all places
router.get("/", async (req, res) => {
try {
    const places = await Place.find();
    res.json({ success: true, places });
} catch (err) {
    res
    .status(500)
    .json({ message: "Failed to fetch places", error: err.message });
}
});

// ✅ POST a new place
router.post("/", async (req, res) => {
const { name, country, description } = req.body;

if (!name || !country) {
    return res.status(400).json({ message: "Name and country are required." });
}

try {
    const exists = await Place.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (exists) {
    return res
        .status(409)
        .json({ message: "Place with this name already exists." });
    }

    const newPlace = new Place({
    name,
    country,
    description,
    });

    const savedPlace = await newPlace.save();
    res.status(201).json({ message: "Place added", data: savedPlace });
} catch (err) {
    res
    .status(500)
    .json({ message: "Failed to add place", error: err.message });
}
});

// ✅ PATCH a place by ID
router.patch("/:id", async (req, res) => {
const { id } = req.params;

try {
    const updatedPlace = await Place.findByIdAndUpdate(id, req.body, {
    new: true,
    });

    if (!updatedPlace) {
    return res.status(404).json({ message: "Place not found" });
    }

    res.json({ message: "Place updated", data: updatedPlace });
} catch (err) {
    res
    .status(500)
    .json({ message: "Failed to update place", error: err.message });
}
});

// ✅ DELETE a place by ID
router.delete("/:id", async (req, res) => {
const { id } = req.params;

try {
    const deletedPlace = await Place.findByIdAndDelete(id);

    if (!deletedPlace) {
    return res.status(404).json({ message: "Place not found" });
    }

    const count = await Place.countDocuments();
    res.json({ message: "Place deleted", count });
} catch (err) {
    res
    .status(500)
    .json({ message: "Failed to delete place", error: err.message });
}
});

module.exports = router;
