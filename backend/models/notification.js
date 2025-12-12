import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    // ------------------------------------------
    // 🔗 WHO the notification belongs to
    // ------------------------------------------
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ------------------------------------------
    // 🎯 HIGH-LEVEL DISPLAY CATEGORY (UI filters)
    // ------------------------------------------
    type: {
      type: String,
      enum: [
        "general",
        "booking",
        "alert",
        "promo",
        "dm",
        "trip",
        "system",
        "xp",
      ],
      default: "general",
      index: true,
    },

    // ------------------------------------------
    // ⚙️ MACHINE-READABLE EVENT TYPE
    // examples:
    // "booking_created", "dm_new", "xp_earned"
    // ------------------------------------------
    event: {
      type: String,
      required: true,
      trim: true,
    },

    // ------------------------------------------
    // 📝 TITLE + MESSAGE
    // ------------------------------------------
    title: {
      type: String,
      trim: true,
      default: "",
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // ------------------------------------------
    // 📍 CLICK-TO-OPEN NAVIGATION SYSTEM
    //
    // "trip" → /trip/:id
    // "booking" → /booking/:id
    // "dm" → /dm/:conversationId
    // "profile" → /profile/:id
    // "external" → full URL
    // ------------------------------------------
    targetType: {
      type: String,
      enum: ["trip", "booking", "dm", "profile", "external", "none"],
      default: "none",
    },

    targetId: {
      type: String,
      default: null,
    },

    // Optional direct link for external URLs
    link: {
      type: String,
      default: "",
    },

    // ------------------------------------------
    // 👁 READ STATUS
    // ------------------------------------------
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

export default mongoose.model("Notification", notificationSchema);
