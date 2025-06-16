const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const User = require("../models/User");
const Place = require("../models/Place");

// 🔍 Test route
router.get("/", (req, res) => {
  res.send("✅ User route is working!");
});

// 🔐 View saved trips
router.get("/saved-trips", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedTrips");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ savedTrips: user.savedTrips });
  } catch (err) {
    console.error("Get saved trips error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// 💾 Save a trip
router.post("/save-trip", auth, async (req, res) => {
  const { placeId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.savedTrips.includes(placeId)) {
      return res.status(400).json({ message: "Trip already saved." });
    }

    user.savedTrips.push(placeId);
    await user.save();

    res.json({ message: "Trip saved successfully." });
  } catch (err) {
    console.error("Save trip error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// ❌ Remove a trip
router.delete("/remove-trip/:id", auth, async (req, res) => {
  const tripId = req.params.id;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.savedTrips = user.savedTrips.filter((id) => id.toString() !== tripId);
    await user.save();

    res.json({ message: "Trip removed successfully." });
  } catch (err) {
    console.error("Remove trip error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
