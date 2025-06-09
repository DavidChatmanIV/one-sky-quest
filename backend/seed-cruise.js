require("dotenv").config();
const mongoose = require("mongoose");
const Cruise = require("./models/cruise.model"); // Make sure this matches your file name exactly

mongoose
.connect(process.env.MONGO_URI)
.then(async () => {
    console.log("🌊 Connected to MongoDB");

    await Cruise.deleteMany(); // Optional: clears old data

    await Cruise.insertMany([
    {
        name: "Caribbean Explorer",
        destination: "Bahamas",
        duration: "7 nights",
        price: 999,
        rating: 4.8,
        ship: "Oceanic Breeze",
        image: "https://via.placeholder.com/300x200?text=Caribbean+Cruise",
    },
    {
        name: "Mediterranean Charm",
        destination: "Greece & Italy",
        duration: "10 nights",
        price: 1399,
        rating: 4.9,
        ship: "Sunset Voyager",
        image: "https://via.placeholder.com/300x200?text=Mediterranean+Cruise",
    },
    {
        name: "Alaskan Glaciers",
        destination: "Alaska",
        duration: "5 nights",
        price: 899,
        rating: 4.6,
        ship: "Northern Star",
        image: "https://via.placeholder.com/300x200?text=Alaska+Cruise",
    },
    ]);

    console.log("🚢 Cruises seeded successfully!");
    mongoose.disconnect();
})
.catch((err) => {
    console.error("Seeding error:", err);
});
