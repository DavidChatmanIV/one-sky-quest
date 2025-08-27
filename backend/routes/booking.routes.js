const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const sendConfirmationEmail = require("../utils/sendConfirmationEmail");
const verifyAdmin = require("../middleware/verifyAdminToken");

// ✈️ PUBLIC: Create a new booking
router.post("/book", async (req, res) => {
  const { name, email, tripDetails, type } = req.body;

  if (!name || !email || !tripDetails || !type) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newBooking = await Booking.create({ name, email, tripDetails, type });
    await sendConfirmationEmail({ name, email, tripDetails, type });

    res.status(201).json({
      message: "Booking confirmed ✅",
      booking: newBooking,
    });
  } catch (err) {
    console.error("❌ Booking creation error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔐 ADMIN: Get all bookings (formatted)
router.get("/bookings", verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "email")
      .sort({ date: -1 });

    const formatted = bookings.map((b) => ({
      _id: b._id,
      userEmail: b.user?.email || "Unknown",
      destination: b.destination,
      date: b.date,
      status: b.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Admin booking fetch error:", err);
    res.status(500).json({ message: "Failed to load bookings" });
  }
});

// 🔐 ADMIN: Delete a booking
router.delete("/book/:id", verifyAdmin, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted ✅" });
  } catch (err) {
    console.error("❌ Booking delete error:", err);
    res.status(500).json({ message: "Delete failed." });
  }
});

// 🔐 ADMIN: Update a booking
router.put("/book/:id", verifyAdmin, async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error("❌ Booking update error:", err);
    res.status(500).json({ message: "Update failed." });
  }
});

module.exports = router;
