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
<<<<<<< HEAD
      match: /^[a-zA-Z0-9_]+$/, // letters, numbers, underscores only
    },

    // 👤 Display name (optional)
    name: {
      type: String,
    },

    // 📧 Email (cleaned + unique)
=======
      match: /^[a-zA-Z0-9_]+$/, // Letters, numbers, underscores only
    },

    // 🧑 Display name (optional)
    name: {
      type: String,
      trim: true,
    },

    // 📧 Email
>>>>>>> origin/fresh-start
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

<<<<<<< HEAD
    // 🔐 Hashed password
=======
    // 🔐 Password (hashed)
>>>>>>> origin/fresh-start
    password: {
      type: String,
      required: true,
    },

<<<<<<< HEAD
    // ✈️ Saved trips
=======
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
>>>>>>> origin/fresh-start
    savedTrips: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
      },
    ],

<<<<<<< HEAD
    // 🧑‍🤝‍🧑 Social + Verification
    followers: [String], // array of user IDs
=======
    // 🧑‍🤝‍🧑 Social & Verification
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
>>>>>>> origin/fresh-start
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
<<<<<<< HEAD
        default: [],
      },
    ],

    // 🚩 Moderation
=======
      },
    ],

    // 🚩 Flagged for moderation
>>>>>>> origin/fresh-start
    flagged: {
      type: Boolean,
      default: false,
    },

<<<<<<< HEAD
    // 🖼️ Profile image (optional)
    profileImage: {
      type: String,
      default: "/images/default-user.png", // adjust to your frontend folder or CDN
    },
  },
  {
    timestamps: true, // ✅ adds createdAt and updatedAt
=======
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
>>>>>>> origin/fresh-start
  }
);

module.exports = mongoose.model("User", UserSchema);
