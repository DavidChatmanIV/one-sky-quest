import mongoose from "mongoose";

const { Schema } = mongoose;

const ReportSchema = new Schema(
  {
    // ---------- Who reported ----------
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ---------- Who / what was reported ----------
    targetUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Optional: report content type (future-proof)
    targetType: {
      type: String,
      enum: ["user", "post", "comment", "dm"],
      default: "user",
      index: true,
    },

    targetId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    // ---------- Report details ----------
    reason: {
      type: String,
      enum: [
        "harassment",
        "spam",
        "hate",
        "scam",
        "nudity",
        "violence",
        "other",
      ],
      required: true,
      index: true,
    },

    comment: {
      type: String,
      trim: true,
      default: "",
    },

    // ---------- Review workflow ----------
    status: {
      type: String,
      enum: ["open", "reviewing", "resolved", "rejected"],
      default: "open",
      index: true,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    // ---------- Resolution ----------
    resolution: {
      action: {
        type: String,
        enum: ["none", "warned", "muted", "restricted", "suspended", "banned"],
        default: "none",
      },
      note: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  {
    timestamps: true, // replaces manual createdAt
  }
);

/* ---------- Indexes for admin speed ---------- */
ReportSchema.index({ targetUserId: 1, status: 1, createdAt: -1 });
ReportSchema.index({ reporterId: 1, createdAt: -1 });

/* ---------- Safe export (Render/Linux) ---------- */
const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);

export default Report;