const mongoose = require("mongoose");

const cruiseSchema = new mongoose.Schema({
title: String,
destination: String,
departurePort: String,
startDate: String,
endDate: String,
price: Number,
rating: Number,
duration: Number,
image: String,
amenities: [String],
});

module.exports = mongoose.model("Cruise", cruiseSchema);
