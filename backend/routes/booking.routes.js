import { Router } from "express";
import {
  Booking,
  User,
  Hotel,
  Flight,
  Package,
  Place,
} from "../models/index.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// 📖 GET: all bookings (admin or user-specific filtering can be added later)
router.get("/", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("user", "email")
      .populate("hotel")
      .populate("flight")
      .populate("package")
      .populate("place");

    res.json(bookings);
  } catch (err) {
    console.error("❌ Failed to fetch bookings:", err);
    res.status(500).json({ message: "Error fetching bookings." });
  }
});

// ➕ POST: create booking
router.post("/", auth, async (req, res) => {
  try {
    const { hotel, flight, pkg, place, dates, travelers } = req.body;

    const newBooking = new Booking({
      user: req.user.id,
      hotel,
      flight,
      package: pkg,
      place,
      dates,
      travelers,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    console.error("❌ Failed to create booking:", err);
    res.status(500).json({ message: "Error creating booking." });
  }
});

// 🗑️ DELETE: cancel booking
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.json({ message: "Booking canceled successfully." });
  } catch (err) {
    console.error("❌ Failed to cancel booking:", err);
    res.status(500).json({ message: "Error canceling booking." });
  }
});

export default router;
