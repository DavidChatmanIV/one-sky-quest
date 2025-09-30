const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
name: { type: String, required: true, unique: true },
country: { type: String, required: true },
description: String,
vibe: {
    type: String,
    enum: ["adventure", "cultural", "romantic", "relaxing"],
    required: true,
},
votes: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional: associate with user
createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Place", placeSchema);
