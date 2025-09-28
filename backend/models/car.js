const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
company: String,
model: String,
location: String,
pickupDate: String,
returnDate: String,
price: Number,
image: String,
rating: Number,
seats: Number,
});

module.exports = mongoose.model("Car", carSchema);