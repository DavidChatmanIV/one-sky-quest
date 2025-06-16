const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");

// Add a reply
router.post("/:commentId/reply", async (req, res) => {
  const { text, userId } = req.body;
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  comment.replies.push({ userId, text });
  await comment.save();

  res.json({ message: "Reply added", comment });
});

// Add a reaction
router.post("/:commentId/react", async (req, res) => {
const { type } = req.body;
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  if (!comment.reactions[type]) comment.reactions[type] = 0;
  comment.reactions[type] += 1;

  await comment.save();

  res.json({ message: "Reaction added", comment });
});

module.exports = router;
