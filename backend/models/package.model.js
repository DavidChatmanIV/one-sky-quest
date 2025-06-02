const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
title: String,
destination: String,
description: String,
price: Number,
rating: Number,
duration: String,
img: String,
  tags: [String], // e.g. ["adventure", "romantic", "family"]
});

module.exports = mongoose.model("Package", PackageSchema);
