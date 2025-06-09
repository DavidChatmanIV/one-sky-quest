require("dotenv").config();
const mongoose = require("mongoose");
const Package = require("./models/package.model");

mongoose
.connect(process.env.MONGO_URI)
.then(async () => {
    await Package.deleteMany({}); // optional: clear old data

    await Package.insertMany([
    {
        title: "Tropical Paradise",
        destination: "Maldives",
        description: "Enjoy 5 nights on a private island resort",
        price: 1299,
        rating: 4.9,
        duration: "5 nights",
        img: "https://via.placeholder.com/300x200",
        tags: ["romantic", "beach"],
    },
    {
        title: "European Explorer",
        destination: "Paris",
        description: "7-day guided city tour",
        price: 899,
        rating: 4.6,
        duration: "7 days",
        img: "https://via.placeholder.com/300x200",
        tags: ["family", "sightseeing"],
    },
      // Add more if needed
    ]);

    console.log("🎉 Packages seeded!");
    process.exit();
})
.catch((err) => console.error("DB error:", err));
