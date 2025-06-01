require("dotenv").config();
const mongoose = require("mongoose");
const Booking = require("./models/Booking");

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB ✅");

    return Booking.insertMany([
    {
        name: "David Chatman",
        email: "david@example.com",
        tripDetails: "Tokyo adventure in August",
    },
    {
        name: "Test User",
        email: "test@example.com",
        tripDetails: "Paris getaway for two",
    },
    ]);
})
.then(() => {
    console.log("Data seeded 🎉");
    mongoose.disconnect();
})
.catch((err) => {
    console.error("Seed error:", err);
});
