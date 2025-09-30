import mongoose from "mongoose";

const { Schema } = mongoose;

const ChatSchema = new Schema(
  {
    // Users in this chat (DM = 2 users; group = 3+)
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],

    // Optional title for group chats
    title: { type: String, default: "" },

    // Group vs DM flag
    isGroup: { type: Boolean, default: false },

    // When the last message was sent (helps sort the sidebar)
    lastMessageAt: { type: Date, default: Date.now },

    // Optional: store last message id for quick preview
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

// Prevent model overwrite errors in dev/hot reload
export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
