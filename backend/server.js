// Mongoose
require("dotenv").config();
const mongoose = require("mongoose");

// server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connected",err))

// Static frontend (optional)
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes for booking/contact
app.post("/book", (req, res) => {
const bookingData = req.body;
console.log("Booking Form Data:", bookingData);
res.send("Thank you for booking! We received your trip details.");
});

app.post("/contact", (req, res) => {
const contactData = req.body;
console.log("Contact Form Data:", contactData);
res.send("Thank you for contacting us! We will get back to you soon.");
});

// ✅ Import and use placeroutes
const placeRoutes = require("./routes/placeroutes");
app.use("/api/places", placeRoutes);

// Start server
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});
