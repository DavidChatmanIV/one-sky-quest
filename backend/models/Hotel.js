// models/Hotel.js or models/Stay.js
const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
name: String,
location: String,
price: Number,
rating: Number,
amenities: [String],
image: String,
description: String,
type: {
    type: String,
    enum: ["hotel", "airbnb", "cabin"], // 
    default: "hotel",
},
});

module.exports = mongoose.model("Hotel", hotelSchema);
