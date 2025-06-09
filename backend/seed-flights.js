require("dotenv").config();
const mongoose = require("mongoose");
const Flight = require("./models/Flight");

mongoose.connect(process.env.MONGO_URI).then(async () => {
await Flight.deleteMany();

await Flight.insertMany([
    {
    airline: "SkyQuest Air",
    flightNumber: "SQ123",
    from: "New York",
    to: "Tokyo",
    departureDate: "2025-07-10",
    returnDate: "2025-07-20",
    price: 890,
    stops: 1,
    rating: 4.5,
    image: "https://via.placeholder.com/300x200?text=SkyQuest+Air",
    },
    {
    airline: "Global Jet",
    flightNumber: "GJ456",
    from: "Los Angeles",
    to: "London",
    departureDate: "2025-07-15",
    returnDate: "2025-07-25",
    price: 1020,
    stops: 0,
    rating: 4.7,
    image: "https://via.placeholder.com/300x200?text=Global+Jet",
    },
    {
    airline: "Air Venture",
    flightNumber: "AV789",
    from: "Miami",
    to: "Paris",
    departureDate: "2025-08-01",
    returnDate: "2025-08-10",
    price: 780,
    stops: 2,
    rating: 4.2,
    image: "https://via.placeholder.com/300x200?text=Air+Venture",
    },
]);

console.log("✅ Flights seeded");
mongoose.disconnect();
});
