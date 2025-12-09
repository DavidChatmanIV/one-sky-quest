import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // ✅ Link notification to a real user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // faster lookups
    },

    // ✅ High-level category (UI filtering)
    type: {
      type: String,
      enum: ["general", "booking", "alert", "promo", "dm"],
      default: "general",
    },

    // ✅ Machine-readable event type (logic-based)
    event: {
      type: String,
      required: true,
      // examples:
      // 'booking_created'
      // 'dm_new'
      // 'xp_earned'
      // 'trip_updated'
    },

    // ✅ Short headline for UI
    title: {
      type: String,
      trim: true,
      default: "",
    },

    // ✅ Full notification message
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ Read state
    isRead: {
      type: Boolean,
      default: false,
    },

    // ✅ Click-to-open system
    targetType: {
      type: String,
      enum: ["trip", "booking", "dm", "profile", "external"],
      default: null,
    },

    targetId: {
      type: String,
      default: null, // bookingId, conversationId, tripId, etc.
    },

    // ✅ Optional direct link support
    link: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

export default mongoose.model("Notification", notificationSchema);
