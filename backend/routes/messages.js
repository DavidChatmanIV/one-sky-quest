const express = require("express");
const router = express.Router();
const Message = require("../models/Messages"); 

// 📨 Save new message
router.post("/", async (req, res) => {
  try {
    const newMessage = await Message.create(req.body);
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Failed to save message:", err);
    res.status(500).json({ error: "Failed to save message" });
  }
});

// 📜 Get conversation between two users
router.get("/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 },
      ],
    }).sort("timestamp");
    res.status(200).json(messages);
  } catch (err) {
    console.error("Failed to load messages:", err);
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// ✅ Mark messages as seen in a conversation
router.put("/mark-seen/:conversationId", async (req, res) => {
  try {
    await Message.updateMany(
      {
        conversationId: req.params.conversationId,
        to: req.body.userId,
        seen: false,
      },
      { $set: { seen: true } }
    );
    res.status(200).json({ message: "Messages marked as seen" });
  } catch (err) {
    console.error("Failed to mark messages as seen:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Edit a message by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content }, // 🔁 make sure front-end sends `content`
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error("Failed to update message:", err);
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete message by ID
router.delete("/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    console.error("Failed to delete message:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
