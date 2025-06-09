const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
airline: String,
flightNumber: String,
from: String,
to: String,
departureDate: String,
returnDate: String,
price: Number,
stops: Number,
rating: Number,
image: String,
});

module.exports = mongoose.model("Flight", flightSchema);
