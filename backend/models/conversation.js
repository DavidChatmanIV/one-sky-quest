import mongoose from "mongoose";
const ConversationSchema = new mongoose.Schema(
  {
    participants: [{ type: String, required: true }], // or ObjectId refs to "User"
    lastMessage: { type: String, default: null },
  },
  { timestamps: true }
);
export default mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);
