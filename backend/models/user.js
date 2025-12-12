import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    // ---------- Core Identity ----------
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

    // ---------- Profile ----------
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

    // ---------- RBAC ROLE SYSTEM ----------
    role: {
      type: String,
      enum: ["user", "support", "manager", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ---------- Saved Trips (Skyrio Feature) ----------
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

// ---------- Transform JSON output ----------
UserSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash; // never expose hash
    return ret;
  },
});

// ---------- Render/Linux Safe Export ----------
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
