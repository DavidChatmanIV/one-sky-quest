const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  username: String,
  name: String,
  role: String,
  bio: String,
  country: String,
  points: Number,
  lastTrip: String,
  dreamDestinations: [String], // optional
  avatar: String, // image path or URL
});

module.exports = mongoose.model("Profile", profileSchema);
