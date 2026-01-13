import mongoose from "mongoose";

const PassportShareSchema = new mongoose.Schema(
  {
    shareId: { type: String, unique: true, index: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    expiresAt: { type: Date, index: true },
  },
  { timestamps: true }
);

export default mongoose.model("PassportShare", PassportShareSchema);