const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
name: { type: String, required: true, unique: true },
country: { type: String, required: true },
description: String,
createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Place", placeSchema);
