import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // Link to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Basic user info
    username: { type: String, trim: true },
    firstName: { type: String, trim: true }, // for greetings
    name: { type: String, trim: true }, // full name
    avatar: { type: String, default: "" }, // local path
    avatarUrl: { type: String, default: "" }, // absolute URL

    // Profile extras
    role: { type: String, default: "user" },
    bio: { type: String, trim: true },
    country: { type: String, trim: true },
    lastTrip: { type: String, trim: true },
    dreamDestinations: [{ type: String }],

    // XP + Gamification
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    nextBadge: {
      name: { type: String, default: "" },
    },

    // Dashboard stats
    savedTrips: { type: Number, default: 0 },
    unread: { type: Number, default: 0 },

    // Legacy
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
