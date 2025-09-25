import mongoose from "mongoose";

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
    name: { type: String, trim: true },

    // 📧 Email (unique, cleaned)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // 🔐 Password (store hashed)
    password: { type: String, required: true },

    // 🏅 XP & Gamification
    xp: { type: Number, default: 0 },

    // 🎁 Referrals
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: String },

    // ✈️ Saved Trips
    savedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }],

    // 🧑‍🤝‍🧑 Social & Verification
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    faceVerified: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    verifiedBy: {
      type: String,
      enum: ["face", "followers", "manual", null],
      default: null,
    },

    // 🚫 Blocked users
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // 🚩 Moderation
    flagged: { type: Boolean, default: false },

    // 🖼️ Profile image
    profileImage: {
      type: String,
      default: "/images/default-user.png",
    },

    // 🪪 Membership (optional)
    membership: {
      type: String,
      enum: ["free", "standard", "premium"],
      default: "free",
    },

    // 🎨 Profile Theme (optional)
    theme: { type: String, default: "default" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
