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

    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
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
      enum: ["user", "support", "manager", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    savedTrips: [
      {
        type: Schema.Types.ObjectId,
        ref: "Place",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ---------- Instance helpers ----------
UserSchema.methods.toSafeJSON = function () {
  return {
    id: this._id.toString(),
    username: this.username,
    email: this.email,
    name: this.name,
    avatar: this.avatar,
    bio: this.bio,
    xp: this.xp,
    role: this.role,
    isActive: this.isActive,
    savedTrips: this.savedTrips,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// ---------- Clean JSON output (no passwordHash, no __v) ----------
UserSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  },
});

// ---------- Safe Export for Render/Linux ----------
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
