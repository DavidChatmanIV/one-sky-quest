const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
},
sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
},
text: { type: String, required: true },
createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
