import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, trim: true }, // no inline unique
    email: { type: String, required: true, trim: true, lowercase: true }, // no inline unique
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: "/default-avatar.png" },
    bio: { type: String, trim: true },
    xp: { type: Number, default: 0 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    savedTrips: [{ type: Schema.Types.ObjectId, ref: "Place" }],
  },
  { timestamps: true }
);

// Centralized indexes — single source of truth
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
