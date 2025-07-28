const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get unique users this user has chatted with
    const messages = await Message.find({
      $or: [{ from: userId }, { to: userId }],
    });

    const userSet = new Set();
    messages.forEach((msg) => {
      if (msg.from !== userId) userSet.add(msg.from);
      if (msg.to !== userId) userSet.add(msg.to);
    });

    res.json([...userSet]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
