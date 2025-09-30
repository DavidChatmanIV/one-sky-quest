const mongoose = require("mongoose");
require("dotenv").config();

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
