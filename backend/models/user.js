import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true, // usernames should be unique
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // URL to profile image
      default: "/default-avatar.png",
    },

    // optional fields you can expand later
    bio: { type: String, trim: true },
    xp: { type: Number, default: 0 }, // fits your OSQ gamification
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  }
);

// Helpful indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
