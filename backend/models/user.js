import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true, // bcrypt hash stored here
    },
    avatar: {
      type: String,
      default: "/default-avatar.png",
    },
    bio: { type: String, trim: true },
    xp: { type: Number, default: 0 },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // used by /saved-trips routes
    savedTrips: [{ type: Schema.Types.ObjectId, ref: "Place" }],
  },
  { timestamps: true }
);

// Helpful indexes
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

// Hide sensitive/internal fields when sending to client
UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});
UserSchema.set("toObject", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

// Keep hot-reload safe
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
