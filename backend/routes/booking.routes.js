const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const sendConfirmationEmail = require("../utils/sendConfirmationEmail");
const verifyAdmin = require("../middleware/verifyAdmin");

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
    console.error("Booking error:", err);
    res.status(500).json({ message: "Internal server error" });
}
});

// 🔐 ADMIN: Get all bookings
router.get("/bookings", verifyAdmin, async (req, res) => {
try {
    const bookings = await Booking.find().sort({ date: -1 });
    res.json(bookings);
} catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to load bookings" });
}
});

// 🔐 ADMIN: Delete booking by ID
router.delete("/book/:id", verifyAdmin, async (req, res) => {
try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted ✅" });
} catch (err) {
    res.status(500).json({ message: "Delete failed." });
}
});

// 🔐 ADMIN: Update booking by ID
router.put("/book/:id", verifyAdmin, async (req, res) => {
try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    });
    res.json(updated);
} catch (err) {
    res.status(500).json({ message: "Update failed." });
}
});

module.exports = router;
