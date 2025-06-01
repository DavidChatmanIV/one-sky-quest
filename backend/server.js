require("dotenv").config();

// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

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
app.post("/book", (req, res) => {
const bookingData = req.body;
console.log("📦 Booking Form Data:", bookingData);
res.send("✅ Thank you for booking! We received your trip details.");
});

// Contact form route
app.post("/contact", (req, res) => {
const contactData = req.body;
console.log("✉️ Contact Form Data:", contactData);
res.send("✅ Thank you for contacting us! We will get back to you soon.");
});

// Place API routes
const placeRoutes = require("./routes/placeroutes");
app.use("/api/places", placeRoutes);

// Start server
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
