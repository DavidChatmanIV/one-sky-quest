// models/Conversation.js
const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
{
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: {
    type: String,
    default: "",
    },
},
  { timestamps: true } // Auto-manage createdAt & updatedAt
);

module.exports = mongoose.model("Conversation", ConversationSchema);
