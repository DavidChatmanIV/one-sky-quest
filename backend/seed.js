require("dotenv").config();
const mongoose = require("mongoose");
const Booking = require("./models/Booking");
const Flight = require("./models/Flight");
const Hotel = require("./models/Hotel")
const Package = require("./models/Package");

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

// Flight Routes
const mongoose = require("mongoose");
const Flight = require("./models/Flight");

mongoose.connect(process.env.MONGO_URI).then(async () => {
await Flight.deleteMany();

await Flight.insertMany([
    {
    from: "JFK",
    to: "LAX",
    departure: new Date("2025-06-10"),
    return: new Date("2025-06-15"),
    airline: "One Sky Airlines",
    price: 320,
    rating: 4.5,
    duration: "6h 30m",
    },
    // add more...
]);

console.log("Seeded flight data ✈️");
mongoose.disconnect();
});

// Flights Routes

// hotel Routes
mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Hotel.deleteMany(); // Optional
await Hotel.insertMany([
    {
    name: "Ocean Breeze Resort",
    location: "Miami",
    price: 220,
    rating: 4.7,
    stars: 5,
    amenities: ["Pool", "WiFi", "Gym"],
    image: "https://via.placeholder.com/300x200",
    },
    {
    name: "Budget Stay",
    location: "Miami",
    price: 80,
    rating: 4.2,
    stars: 3,
    amenities: ["WiFi"],
    image: "https://via.placeholder.com/300x200",
    },
]);
console.log("Hotels seeded");
mongoose.connection.close();
});
// hotel Routes

// Package routes
const mongoose = require("mongoose");
const Package = require("./models/Package");

mongoose
.connect(process.env.MONGO_URI)
.then(async () => {
    await Package.deleteMany();

    const sample = [
    {
        name: "Bali Bliss",
        destination: "Bali",
        price: 799,
        rating: 4.9,
        duration: "7 Days",
        description: "Relax in paradise with beaches and temples.",
        img: "https://via.placeholder.com/300x200",
    },
    {
        name: "Alaskan Cruise",
        destination: "Alaska",
        price: 1199,
        rating: 4.7,
        duration: "10 Days",
        description: "Cruise through glaciers and wilderness.",
        img: "https://via.placeholder.com/300x200",
    },
    ];

    await Package.insertMany(sample);
    console.log("🌍 Packages seeded!");
    process.exit();
})
.catch((err) => console.error("Seeding failed:", err));
// Package routes