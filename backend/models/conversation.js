import mongoose from "mongoose";

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    // 1:1 or group DM participants
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Optional group fields (safe to ignore for 1:1)
    isGroup: { type: Boolean, default: false },
    title: { type: String, trim: true },

    // Convenience for your list UI; you already update this in routes
    lastMessage: { type: String, trim: true },

    // Optional: track last-read per user (handy later)
    lastReadAt: {
      type: Map,
      of: Date, // key: userId (string), value: Date
      default: undefined,
    },
  },
  {
    timestamps: true, // adds createdAt / updatedAt
  }
);

// Helpful indexes
conversationSchema.index({ participants: 1, updatedAt: -1 });
conversationSchema.index({ updatedAt: -1 });

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

export default Conversation;
