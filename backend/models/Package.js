const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
name: String,
destination: String,
price: Number,
rating: Number,
duration: String,
description: String,
img: String,
});

module.exports = mongoose.model("Package", packageSchema);
