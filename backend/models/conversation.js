import mongoose from "mongoose";

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    // 1:1 or group participants
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],

    // Optional group fields
    isGroup: { type: Boolean, default: false },
    title: { type: String, trim: true },

    // Convenience for list UI
    lastMessage: { type: String, trim: true },

    // Optional: per-user last-read timestamps
    lastReadAt: {
      type: Map,
      of: Date, // key: userId, value: Date
      default: undefined,
    },
  },
  { timestamps: true }
);

// Helpful indexes
conversationSchema.index({ participants: 1, updatedAt: -1 });
conversationSchema.index({ updatedAt: -1 });

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

export default Conversation;
