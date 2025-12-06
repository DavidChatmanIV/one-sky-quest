import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "/default-avatar.png",
    },

    bio: {
      type: String,
      trim: true,
    },

    xp: {
      type: Number,
      default: 0,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    savedTrips: [
      {
        type: Schema.Types.ObjectId,
        ref: "Place",
      },
    ],

    name: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// ---------- Centralized Indexes ----------
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });

// ---------- Safe JSON Output ----------
UserSchema.methods.toSafeJSON = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    name: this.name,
    avatar: this.avatar,
    bio: this.bio,
    xp: this.xp,
    role: this.role,
    savedTrips: this.savedTrips,
    createdAt: this.createdAt,
  };
};

// ---------- Safe Export for Render/Linux ----------
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
