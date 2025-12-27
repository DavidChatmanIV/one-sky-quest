import mongoose from "mongoose";
const { Schema } = mongoose;

const XpLedgerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    delta: { type: Number, required: true }, // +xp or -xp (refund)
    reason: { type: String, required: true, trim: true }, // reason code
    meta: { type: Schema.Types.Mixed }, // bookingId, postId, seasonKey, etc.
    seasonKey: { type: String, trim: true }, // if applied
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // admin/support actor (optional)
  },
  { timestamps: true }
);

XpLedgerSchema.index({ userId: 1, createdAt: -1 });

const XpLedger =
  mongoose.models.XpLedger || mongoose.model("XpLedger", XpLedgerSchema);

export default XpLedger;