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
      match: /^[a-zA-Z0-9_]+$/, // Letters, numbers, underscores only
    },

    // 🧑 Display name (optional)
    name: {
      type: String,
      trim: true,
    },

    // 📧 Email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // 🔐 Password (hashed)
    password: {
      type: String,
      required: true,
    },

    // 🏅 XP & Gamification
    xp: {
      type: Number,
      default: 0,
    },

    // 🎁 Referral System
    referralCode: {
      type: String,
      unique: true,
      sparse: true, // allows multiple nulls
    },
    referredBy: {
      type: String, // stores the referralCode of another user
    },

    // ✈️ Saved Trips
    savedTrips: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
      },
    ],

    // 🧑‍🤝‍🧑 Social & Verification
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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
      },
    ],

    // 🚩 Flagged for moderation
    flagged: {
      type: Boolean,
      default: false,
    },

    // 🖼️ Profile image
    profileImage: {
      type: String,
      default: "/images/default-user.png", // Adjust for production/CDN if needed
    },

    // 🪪 Membership (optional)
    membership: {
      type: String,
      enum: ["free", "standard", "premium"],
      default: "free",
    },

    // 🎨 Profile Theme (optional)
    theme: {
      type: String,
      default: "default",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("User", UserSchema);
