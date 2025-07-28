const express = require("express");
const router = express.Router();
<<<<<<< HEAD
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
=======

const Admin = require("../models/Admin");
const User = require("../models/User");
const Place = require("../models/Place");

const { verifyAdmin } = require("../middleware/auth"); // ✅ Admin verification
const { authMiddleware } = require("../middleware/auth"); // ✅ User verification (auth.js is correct)

// 🔐 GET: List all admins (superadmin-only)
router.get("/admins", verifyAdmin, async (req, res) => {
  try {
    const admins = await Admin.find().select("email role");
    res.json(admins);
  } catch (err) {
    console.error("❌ Failed to load admins:", err);
    res.status(500).json({ message: "Error loading admins." });
  }
});

// 📥 GET: Get saved trips for the logged-in user
router.get("/saved-trips", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedTrips");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ savedTrips: user.savedTrips });
  } catch (err) {
    console.error("❌ Failed to retrieve saved trips:", err);
    res.status(500).json({ message: "Server error retrieving saved trips." });
  }
});

// 💾 POST: Save a trip to the user's profile
router.post("/save-trip", authMiddleware, async (req, res) => {
>>>>>>> origin/fresh-start
  const { placeId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

<<<<<<< HEAD
    if (user.savedTrips.includes(placeId)) {
=======
    const alreadySaved = user.savedTrips.some(
      (id) => id.toString() === placeId
    );

    if (alreadySaved) {
>>>>>>> origin/fresh-start
      return res.status(400).json({ message: "Trip already saved." });
    }

    user.savedTrips.push(placeId);
    await user.save();

    res.json({ message: "Trip saved successfully." });
  } catch (err) {
<<<<<<< HEAD
    console.error("Save trip error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// ❌ Remove a trip
router.delete("/remove-trip/:id", auth, async (req, res) => {
  const tripId = req.params.id;
=======
    console.error("❌ Failed to save trip:", err);
    res.status(500).json({ message: "Server error saving trip." });
  }
});

// 🗑️ DELETE: Remove a saved trip by ID
router.delete("/remove-trip/:id", authMiddleware, async (req, res) => {
  const { id: tripId } = req.params;
>>>>>>> origin/fresh-start

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.savedTrips = user.savedTrips.filter((id) => id.toString() !== tripId);
    await user.save();

    res.json({ message: "Trip removed successfully." });
  } catch (err) {
<<<<<<< HEAD
    console.error("Remove trip error:", err);
    res.status(500).json({ message: "Server error." });
=======
    console.error("❌ Failed to remove trip:", err);
    res.status(500).json({ message: "Server error removing trip." });
>>>>>>> origin/fresh-start
  }
});

module.exports = router;
