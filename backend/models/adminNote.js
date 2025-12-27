import mongoose from "mongoose";
const { Schema } = mongoose;

const AdminNoteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // admin/support
    text: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }], // ["spam", "warning", "dm-abuse"]
  },
  { timestamps: true }
);

AdminNoteSchema.index({ userId: 1, createdAt: -1 });

const AdminNote =
  mongoose.models.AdminNote || mongoose.model("AdminNote", AdminNoteSchema);

export default AdminNote;