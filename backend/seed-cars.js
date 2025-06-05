const mongoose = require("mongoose");
require("dotenv").config();

const mongoose = require("mongoose");
require("dotenv").config();

const Car = require("./models/car.model");

mongoose
.connect(process.env.MONGODB_URI)
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

const cars = [
{
    brand: "Toyota",
    model: "Camry",
    location: "Los Angeles",
    pricePerDay: 55,
    availability: true,
    image: "https://via.placeholder.com/300x200?text=Toyota+Camry",
},
{
    brand: "Honda",
    model: "Civic",
    location: "New York",
    pricePerDay: 49,
    availability: true,
    image: "https://via.placeholder.com/300x200?text=Honda+Civic",
},
{
    brand: "Ford",
    model: "Mustang",
    location: "Miami",
    pricePerDay: 85,
    availability: true,
    image: "https://via.placeholder.com/300x200?text=Ford+Mustang",
},
];

async function seedCars() {
try {
    await Car.deleteMany({});
    await Car.insertMany(cars);
    console.log("🚗 Seeded car data successfully!");
} catch (err) {
    console.error("❌ Error seeding cars:", err);
} finally {
    mongoose.disconnect();
}
}

seedCars();



