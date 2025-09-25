import { Router } from "express";
import { auth } from "../middleware/auth.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

const router = Router();
const USE_MOCKS = process.env.USE_MOCKS !== "false";

// GET /api/dm/conversations/:userId
router.get("/conversations/:userId", auth, async (req, res) => {
  try {
    if (USE_MOCKS) {
      return res.json([
        {
          _id: "mock-convo-1",
          participants: [
            { _id: req.params.userId, username: "you" },
            { _id: "u2", username: "Questy" },
          ],
          lastMessage: "Welcome to OSQ DMs 👋",
          updatedAt: new Date(),
        },
      ]);
    }
    const convos = await Conversation.find({ participants: req.params.userId })
      .populate("participants", "username")
      .sort({ updatedAt: -1 });
    res.json(convos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/dm/conversations
router.post("/conversations", auth, async (req, res) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId)
      return res.status(400).json({ error: "receiverId is required" });

    if (USE_MOCKS) {
      return res.status(201).json({
        _id: "mock-convo-created",
        participants: [req.user.id, receiverId],
        lastMessage: null,
        updatedAt: new Date(),
      });
    }

    let convo = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] },
    });

    if (!convo) {
      convo = await Conversation.create({
        participants: [req.user.id, receiverId],
      });
    }

    res.status(201).json(convo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/dm/message
router.post("/message", auth, async (req, res) => {
  try {
    const { conversationId, text, ...rest } = req.body || {};
    if (!conversationId || !text) {
      return res
        .status(400)
        .json({ error: "conversationId and text are required" });
    }

    if (USE_MOCKS) {
      return res.status(201).json({
        _id: "mock-msg-1",
        conversationId,
        text,
        sender: req.user.id,
        createdAt: new Date(),
        ...rest,
      });
    }

    const newMessage = await Message.create({
      conversationId,
      text,
      sender: req.user.id,
      ...rest,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      updatedAt: new Date(),
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dm/messages/:conversationId
router.get("/messages/:conversationId", auth, async (req, res) => {
  try {
    if (USE_MOCKS) {
      return res.json([
        {
          _id: "m1",
          conversationId: req.params.conversationId,
          text: "Hey!",
          sender: "u2",
          createdAt: new Date(Date.now() - 60000),
        },
        {
          _id: "m2",
          conversationId: req.params.conversationId,
          text: "Welcome to One Sky Quest 🙌",
          sender: "u2",
          createdAt: new Date(),
        },
      ]);
    }

    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
      .sort({ createdAt: 1 })
      .lean();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
