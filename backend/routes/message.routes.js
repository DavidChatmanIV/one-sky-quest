import { Router } from "express";
import { auth } from "../middleware/auth.js";
import mongoose from "mongoose";

// 👇 match actual lowercase filenames
import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

const router = Router();

// Toggle mock responses with USE_MOCKS=true
const USE_MOCKS = String(process.env.USE_MOCKS).toLowerCase() === "true";

// Helpers
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * GET /api/dm/conversations/:userId
 * Return conversations for a user (sorted by last update)
 */
router.get("/conversations/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (USE_MOCKS) {
      return res.json([
        {
          _id: "mock-convo-1",
          participants: [
            { _id: userId, username: "you" },
            { _id: "u2", username: "Questy" },
          ],
          lastMessage: "Welcome to OSQ DMs 👋",
          updatedAt: new Date(),
        },
      ]);
    }

    if (!isValidId(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const convos = await Conversation.find({ participants: userId })
      .populate("participants", "username avatar")
      .sort({ updatedAt: -1 })
      .lean();

    return res.json(convos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/dm/conversations
 * Create or fetch an existing conversation between the authed user and receiverId
 * body: { receiverId }
 */
router.post("/conversations", auth, async (req, res) => {
  try {
    const { receiverId } = req.body || {};
    const me = req.user?.id;

    if (!receiverId) {
      return res.status(400).json({ error: "receiverId is required" });
    }

    if (USE_MOCKS) {
      return res.status(201).json({
        _id: "mock-convo-created",
        participants: [me, receiverId],
        lastMessage: null,
        updatedAt: new Date(),
      });
    }

    if (!isValidId(receiverId) || !isValidId(me)) {
      return res.status(400).json({ error: "Invalid user id(s)" });
    }

    let convo = await Conversation.findOne({
      participants: { $all: [me, receiverId] },
    });

    if (!convo) {
      convo = await Conversation.create({
        participants: [me, receiverId],
      });
    }

    return res.status(201).json(convo);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/dm/message
 * Send a message in a conversation
 * body: { conversationId, text, ...rest }
 */
router.post("/message", auth, async (req, res) => {
  try {
    const { conversationId, text, ...rest } = req.body || {};
    const me = req.user?.id;

    if (!conversationId || !text) {
      return res
        .status(400)
        .json({ error: "conversationId and text are required" });
    }

    if (USE_MOCKS) {
      return res.status(201).json({
        _id: "mock-msg-1",
        conversationId,
        text: String(text).trim(),
        sender: me,
        createdAt: new Date(),
        ...rest,
      });
    }

    if (!isValidId(conversationId) || !isValidId(me)) {
      return res.status(400).json({ error: "Invalid id(s)" });
    }

    // Ensure conversation exists and user is a participant
    const convo = await Conversation.findById(conversationId).lean();
    if (!convo)
      return res.status(404).json({ error: "Conversation not found" });
    if (!convo.participants?.some((p) => String(p) === String(me))) {
      return res
        .status(403)
        .json({ error: "Not a participant in this conversation" });
    }

    const newMessage = await Message.create({
      conversationId,
      text: String(text).trim(),
      sender: me,
      ...rest,
    });

    await Conversation.findByIdAndUpdate(
      conversationId,
      { $set: { lastMessage: String(text).trim(), updatedAt: new Date() } },
      { new: true }
    );

    return res.status(201).json(newMessage);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/dm/messages/:conversationId
 * Return messages for a conversation (ascending by createdAt)
 * Optional query: ?limit=50&cursor=<messageId or ISO date>
 */
router.get("/messages/:conversationId", auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 100, cursor } = req.query;
    const pageSize = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 200);

    if (USE_MOCKS) {
      return res.json([
        {
          _id: "m1",
          conversationId,
          text: "Hey!",
          sender: "u2",
          createdAt: new Date(Date.now() - 60000),
        },
        {
          _id: "m2",
          conversationId,
          text: "Welcome to One Sky Quest 🙌",
          sender: "u2",
          createdAt: new Date(),
        },
      ]);
    }

    if (!isValidId(conversationId)) {
      return res.status(400).json({ error: "Invalid conversationId" });
    }

    const query = { conversationId };
    if (cursor) {
      // Support cursor as ISO date or message _id
      if (isValidId(cursor)) {
        query._id = { $gt: cursor };
      } else {
        const dt = new Date(cursor);
        if (!isNaN(dt)) query.createdAt = { $gt: dt };
      }
    }

    const messages = await Message.find(query)
      .sort({ createdAt: 1 })
      .limit(pageSize)
      .populate("sender", "username avatar") // ignored if sender is a String
      .lean();

    return res.json(messages);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
