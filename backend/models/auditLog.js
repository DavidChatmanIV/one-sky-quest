import mongoose from "mongoose";
const { Schema } = mongoose;

const AuditLogSchema = new Schema(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // admin/support
    targetUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    action: {
      type: String,
      enum: [
        "USER_WARNED",
        "USER_MUTED",
        "USER_RESTRICTED",
        "USER_SUSPENDED",
        "USER_UNSUSPENDED",
        "REPORT_RESOLVED",
        "REPORT_REJECTED",
      ],
      required: true,
      index: true,
    },

    meta: { type: Object, default: {} }, // e.g. { days: 3, reason: "spam" }
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true }
);

AuditLogSchema.index({ action: 1, createdAt: -1 });

const AuditLog =
  mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);

export default AuditLog;
