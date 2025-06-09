const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
name: String,
email: String,
tripDetails: String,
type: {
    type: String,
    enum: ["Flight", "Hotel", "Package", "Cruise", "Car"],
    required: true,
},
date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
