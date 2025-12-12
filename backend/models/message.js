import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    // normalized to match your API + frontend payload
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // optional now (because images can be sent alone)
    text: {
      type: String,
      trim: true,
      default: "",
    },

    // ✅ NEW: image support
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

//  Prevent completely empty messages (no text + no image)
messageSchema.pre("save", function (next) {
  if (!this.text && !this.imageUrl) {
    return next(new Error("Message must have text or an image."));
  }
  next();
});

//  Hot-reload safe model export (prevents overwrite errors in dev)
const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
