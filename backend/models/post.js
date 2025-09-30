import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: false },
    text: { type: String, required: true, trim: true },
    images: [{ type: String }], // optional image URLs
    tags: [{ type: String }], // optional tags/hashtags
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;
