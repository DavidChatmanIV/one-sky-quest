// models/booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  // Optional: if booked by a registered user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },

  // Guest info (for public bookings)
  name: { type: String },
  email: { type: String },

  // Core trip info
  tripDetails: { type: String, required: true },
  type: {
    type: String,
    enum: ["Flight", "Hotel", "Package", "Cruise", "Car"],
    required: true,
  },

  // Optional destination field for clarity/filtering
  destination: { type: String },

  // Date of booking submission
  date: { type: Date, default: Date.now },

  // Booking status for admin workflows
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
});

// Prevent model overwrite in dev/hot reload
const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
