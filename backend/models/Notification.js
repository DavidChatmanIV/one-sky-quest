const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true, // Link notification to a user
    },
    message: {
      type: String,
      required: true,
      trim: true, // Remove surrounding spaces
    },
    type: {
      type: String,
      enum: ["general", "booking", "alert", "promo"], // Easily expandable
      default: "general",
    },
    read: {
      type: Boolean,
      default: false, // All new notifications are unread
    },
    link: {
      type: String,
      default: "", // Optional: can link to related page
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
