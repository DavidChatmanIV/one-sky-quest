const mongoose = require("mongoose");

<<<<<<< HEAD
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
=======
const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: false,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Optional: Add index for efficient queries
MessageSchema.index({ conversationId: 1, timestamp: 1 });
>>>>>>> origin/fresh-start

module.exports = mongoose.model("Message", MessageSchema);
