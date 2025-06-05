const mongoose = require("mongoose");
require("dotenv").config();

const Flight = require("./models/Flight");

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