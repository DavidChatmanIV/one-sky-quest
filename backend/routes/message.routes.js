const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { auth } = require("../middleware/authMiddleware");

// 📬 Get all conversations for a user
router.get("/conversations/:userId", auth, async (req, res) => {
  try {
    const convos = await Conversation.find({
      participants: req.params.userId,
    }).populate("participants", "username");
    res.json(convos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Create new conversation between two users
router.post("/conversations", auth, async (req, res) => {
  try {
    const { receiverId } = req.body;

    let convo = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] },
    });

    if (!convo) {
      convo = new Conversation({
        participants: [req.user.id, receiverId],
      });
      await convo.save();
    }

    res.status(201).json(convo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📨 Send a message (DM)
router.post("/message", auth, async (req, res) => {
  try {
    const newMessage = new Message({
      ...req.body,
      sender: req.user.id,
    });
    await newMessage.save();

    await Conversation.findByIdAndUpdate(req.body.conversationId, {
      lastMessage: req.body.text,
      updatedAt: new Date(),
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📄 Get all messages in a conversation
router.get("/messages/:conversationId", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
