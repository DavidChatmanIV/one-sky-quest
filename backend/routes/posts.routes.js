const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { verifyAdmin } = require("../middleware/authMiddleware");

// 📬 Create a new post
router.post("/posts", async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📚 Get all posts (optionally filter by thread)
router.get("/posts", async (req, res) => {
try {
    const { parentId } = req.query;
    const query = parentId
    ? { threadParent: parentId }
    : { threadParent: null };

    const posts = await Post.find(query)
    .populate("userId")
    .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🧵 Add a reply to a thread
router.post("/posts/:parentId/reply", async (req, res) => {
  try {
    const parent = await Post.findById(req.params.parentId);
    if (!parent)
      return res.status(404).json({ message: "Parent post not found." });

    const reply = new Post({
      ...req.body,
      threadParent: parent._id,
    });

    await reply.save();
    res.status(201).json(reply);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 💬 Add a comment to a post
router.post("/posts/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    post.comments.push(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🗑️ Admin-only: Delete a post
router.delete("/posts/:id", verifyAdmin, async (req, res) => {
try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Post not found." });

    res.status(200).json({ message: "Post deleted by admin." });
} catch (err) {
    res.status(500).json({ error: err.message });
}
});

module.exports = router;
