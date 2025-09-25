import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      index: true,
    },
    sender: { type: String, required: true }, // or ObjectId -> ref: "User"
    text: { type: String, required: true },
  },
  { timestamps: true }
);
export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
