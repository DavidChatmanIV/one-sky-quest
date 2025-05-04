const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve Frontend Files
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes
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

// Start server
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});