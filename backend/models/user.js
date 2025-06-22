const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // 🆔 Unique username
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      match: /^[a-zA-Z0-9_]+$/, // letters, numbers, underscores only
    },

    // 👤 Display name (optional)
    name: {
      type: String,
    },

    // 📧 Email (cleaned + unique)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // 🔐 Hashed password
    password: {
      type: String,
      required: true,
    },

    // ✈️ Saved trips
    savedTrips: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
      },
    ],

    // 🧑‍🤝‍🧑 Social + Verification
    followers: [String], // array of user IDs
    faceVerified: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: String,
      enum: ["face", "followers", "manual", null],
      default: null,
    },

    // 🚫 Blocked users
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    // 🚩 Moderation
    flagged: {
      type: Boolean,
      default: false,
    },

    // 🖼️ Profile image (optional)
    profileImage: {
      type: String,
      default: "/images/default-user.png", // adjust to your frontend folder or CDN
    },
  },
  {
    timestamps: true, // ✅ adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("User", UserSchema);
