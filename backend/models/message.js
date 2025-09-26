import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      required: true,
    },
    // Allow extra metadata (images, attachments, reactions, etc.)
    attachments: [
      {
        url: String,
        type: { type: String }, // e.g., "image", "file"
      },
    ],
    reactions: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        emoji: String,
      },
    ],
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Prevent recompilation error in dev
const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
