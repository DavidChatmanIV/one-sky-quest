import { Router } from "express";
import Conversation from "../models/conversation.js";

const router = Router();

// GET /conversations  -> list most recent
router.get("/", async (_req, res, next) => {
  try {
    const items = await Conversation.find({})
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET /conversations/mine?userId=:id  -> conversations that include this user
router.get("/mine", async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const items = await Conversation.find({ participants: userId })
      .sort({ updatedAt: -1 })
      .lean();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// POST /conversations  -> create a conversation
// body: { participants: [userId1, userId2, ...], isGroup?, title? }
router.post("/", async (req, res, next) => {
  try {
    const { participants, isGroup = false, title } = req.body;
    if (!Array.isArray(participants) || participants.length < 2) {
      return res
        .status(400)
        .json({ error: "participants (>=2) array is required" });
    }
    const doc = await Conversation.create({ participants, isGroup, title });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
});

// POST /conversations/ensure  -> for 1:1: find or create stable convo
// body: { a: userIdA, b: userIdB }
router.post("/ensure", async (req, res, next) => {
  try {
    const { a, b } = req.body;
    if (!a || !b) return res.status(400).json({ error: "a and b required" });

    // Find existing 1:1 (two participants, not group)
    const existing = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [a, b], $size: 2 },
    });

    if (existing) return res.json(existing);

    const created = await Conversation.create({
      participants: [a, b],
      isGroup: false,
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// GET /conversations/:id  -> fetch one
router.get("/:id", async (req, res, next) => {
  try {
    const doc = await Conversation.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

// PATCH /conversations/:id  -> update basic fields (title, lastMessage, lastReadAt)
router.patch("/:id", async (req, res, next) => {
  try {
    const { title, lastMessage, lastReadAt } = req.body;
    const update = {};
    if (typeof title === "string") update.title = title;
    if (typeof lastMessage === "string") update.lastMessage = lastMessage;
    if (lastReadAt && typeof lastReadAt === "object")
      update.lastReadAt = lastReadAt;

    const doc = await Conversation.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

export default router;
