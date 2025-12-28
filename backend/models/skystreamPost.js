import mongoose from "mongoose";
const { Schema } = mongoose;

const SkystreamPostSchema = new Schema(
  {
    // who posted it
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // tabs (Following is NOT a category—it's a filter)
    category: {
      type: String,
      enum: ["forYou", "deals", "news"],
      default: "forYou",
      index: true,
    },

    title: { type: String, trim: true, maxlength: 160 },
    body: { type: String, trim: true, maxlength: 2400 },

    // keep tags lowercase for search/filter consistency
    tags: [{ type: String, trim: true, lowercase: true, index: true }],

    // lightweight engagement counters (you can wire later)
    likeCount: { type: Number, default: 0, min: 0 },
    replyCount: { type: Number, default: 0, min: 0 },

    // optional XP metadata (if you award XP for posting)
    xpAward: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// feed speed
SkystreamPostSchema.index({ category: 1, createdAt: -1 });
SkystreamPostSchema.index({ authorId: 1, createdAt: -1 });

const SkystreamPost =
  mongoose.models.SkystreamPost ||
  mongoose.model("SkystreamPost", SkystreamPostSchema);

export default SkystreamPost;