import mongoose from "mongoose";

const InnerCircleSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    city: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

InnerCircleSchema.index({ ownerId: 1, userId: 1 }, { unique: true });

export default mongoose.model("InnerCircle", InnerCircleSchema);