// backend/models/notification.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    /**
     * ✅ Primary owner of the notification
     * We support BOTH `userId` (preferred) and legacy `user`
     */
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },

    /**
     * Optional: who triggered it (follow, system, etc.)
     */
    fromUserId: { type: Schema.Types.ObjectId, ref: "User", index: true },

    type: { type: String, default: "system" }, // system | social | xp | booking | ...
    event: { type: String, default: "" }, // welcome | follow | ...
    title: { type: String, default: "" },
    message: { type: String, default: "" },

    targetType: { type: String, default: "" }, // passport | user | booking | ...
    targetId: { type: String, default: "" },
    link: { type: String, default: "" },

    // ✅ keep your existing usage
    isRead: { type: Boolean, default: false },

    // optional: for future expansion
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// ✅ Enforce "must have a recipient" (userId OR user)
NotificationSchema.pre("validate", function (next) {
  if (!this.userId && !this.user) {
    this.invalidate("userId", "Notification must have userId or user");
  }
  next();
});

// Helpful query performance
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
