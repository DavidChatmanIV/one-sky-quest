const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
from: String,
to: String,
departure: Date,
return: Date,
airline: String,
price: Number,
rating: Number,
duration: String,
});

module.exports = mongoose.model("Flight", flightSchema);
