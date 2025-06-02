require("dotenv").config();

// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const Booking = require("./models/Booking");
const Contact = require("./models/Contact")
const flightRoutes = require("./routes/flight.routes")
const hotelRoutes = require("./routes/hotel.routes");
const packageRoutes = require("./routes/package.routes");

// App setup
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
.then(() => console.log(" Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Serve frontend statically (optional for full-stack apps)
app.use(express.static(path.join(__dirname, "../frontend")));

// Booking form route
app.post("/book", async (req, res) => {
    try {
        const { name, email, tripDetails } = req.body;
        const newBooking = new Booking({ name, email, TripDetails });
        await newBooking.save();
        res.send("Thank you for booking! We received your trip.");
    } catch (err) {
        console.error("Booking error", err);
        res.status(500).send("Booking failed. Try again.");
    }
});

// Flight Routes
app.use("/api/flights", flightRoutes);
// Flight Routes

// Hotel Routes
app.use("/api/hotels", hotelRoutes);
// Hotel Routes

// package Routes
app.use("/api/packages", packageRoutes);
// package Routes

// Contact form route
app.post("/contact", async (req, res) => {
try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.send(" Thank you for contacting us!");
} catch (err) {
    console.error("Contact error:", err);
    res.status(500).send(" Contact form failed. Try again.");
}
});

// Place API routes
const placeRoutes = require("./routes/placeroutes");
app.use("/api/places", placeRoutes);

// Start server
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
