const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
content: String,
createdAt: { type: Date, default: Date.now },
replies: [
    {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    createdAt: { type: Date, default: Date.now },
    },
],
});

const PostSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
content: { type: String, required: true },
media: [String],
location: String,
createdAt: { type: Date, default: Date.now },
threadParent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    default: null,
},
comments: [CommentSchema],
});

module.exports = mongoose.model("Post", PostSchema);
