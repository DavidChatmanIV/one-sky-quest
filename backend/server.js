require("dotenv").config();

// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

// Models
const Booking = require("./models/Booking");
const Contact = require("./models/Contact");

// Routes
const flightRoutes = require("./routes/flight.routes");
const hotelRoutes = require("./routes/hotel.routes");
const packageRoutes = require("./routes/package.routes");
const carRoutes = require("./routes/car.routes");
const cruiseRoutes = require("./routes/cruise.route");
const bookingRoutes = require("./routes/booking.routes");
const placeRoutes = require("./routes/placeroutes");
const authRoutes = require("./routes/auth.routes"); // ✅ NEW: Auth route

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection
mongoose
.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Serve frontend statically (optional for full-stack apps)
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Modular Routes
app.use("/api", authRoutes); // 🔐 Login, Register (user/admin)
app.use("/api", bookingRoutes); // 📋 Bookings

// Other Routes
app.use("/api/flights", flightRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/cruises", cruiseRoutes);
app.use("/api/places", placeRoutes);

// 📬 Contact Form
app.post("/contact", async (req, res) => {
try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.send("Thank you for contacting us!");
} catch (err) {
    console.error("Contact error:", err);
    res.status(500).send("Contact form failed. Try again.");
}
});

// Start server
app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});
