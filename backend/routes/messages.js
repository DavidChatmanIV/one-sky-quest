import { Router } from "express";
import { randomUUID as uuid } from "crypto";
import { loadMock } from "./_utils/mock.js";

const router = Router();
const USE_MOCKS = process.env.USE_MOCKS !== "false";

// --- lazy model loader (only used if USE_MOCKS === false) ---
let MessageModel = null;
async function getMessageModel() {
  if (USE_MOCKS) return null;
  if (MessageModel) return MessageModel;
  try {
    // Supports both `export default` and `module.exports =`
    const mod = await import("../models/Messages.js");
    MessageModel = mod.default || mod.Message || mod;
  } catch {
    MessageModel = null; // keep null if model not available
  }
  return MessageModel;
}

// --- in-memory store (bootstrapped from mock if present) ---
let memBootstrapped = false;
let mem = { messages: [] };

async function ensureMem() {
  if (!memBootstrapped) {
    const data = await loadMock("dm", { messages: [] }); // dm.mock.json optional
    mem.messages = Array.isArray(data.messages) ? data.messages : [];
    memBootstrapped = true;
  }
  return mem;
}

function convId(a, b) {
  const [x, y] = [String(a), String(b)].sort();
  return `${x}__${y}`;
}

/* ------------------------------------------------------------------ */
/*  MERGED ENDPOINTS                                                   */
/*  - DB if available, else fallback to in-memory/mock                 */
/* ------------------------------------------------------------------ */

// 📨 Save new message  (POST /dm/)
router.post("/", async (req, res) => {
  try {
    const Model = await getMessageModel();
    if (Model) {
      const created = await Model.create(req.body);
      return res.status(201).json(created);
    }
    const store = await ensureMem();
    const doc = {
      _id: uuid(),
      ...req.body,
      timestamp: Date.now(),
      conversationId:
        req.body.conversationId || convId(req.body.from, req.body.to),
      seen: !!req.body.seen,
    };
    store.messages.push(doc);
    return res.status(201).json(doc);
  } catch (err) {
    console.error("Failed to save message:", err);
    res.status(500).json({ error: "Failed to save message" });
  }
});

// 📜 Get conversation between two users (GET /dm/:user1/:user2)
router.get("/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const Model = await getMessageModel();
    if (Model) {
      const messages = await Model.find({
        $or: [
          { from: user1, to: user2 },
          { from: user2, to: user1 },
        ],
      }).sort("timestamp");
      return res.status(200).json(messages);
    }
    const store = await ensureMem();
    const list = store.messages
      .filter(
        (m) =>
          (String(m.from) === user1 && String(m.to) === user2) ||
          (String(m.from) === user2 && String(m.to) === user1)
      )
      .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    return res.status(200).json(list);
  } catch (err) {
    console.error("Failed to load messages:", err);
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// ✅ Mark messages as seen (PUT /dm/mark-seen/:conversationId)
router.put("/mark-seen/:conversationId", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;

    const Model = await getMessageModel();
    if (Model) {
      await Model.updateMany(
        { conversationId, to: userId, seen: false },
        { $set: { seen: true } }
      );
      return res.status(200).json({ message: "Messages marked as seen" });
    }

    const store = await ensureMem();
    store.messages.forEach((m) => {
      if (
        m.conversationId === conversationId &&
        String(m.to) === String(userId)
      ) {
        m.seen = true;
      }
    });
    return res.status(200).json({ message: "Messages marked as seen" });
  } catch (err) {
    console.error("Failed to mark messages as seen:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Edit a message by ID (PUT /dm/:id)
router.put("/:id", async (req, res) => {
  try {
    const Model = await getMessageModel();
    if (Model) {
      const updated = await Model.findByIdAndUpdate(
        req.params.id,
        { content: req.body.content },
        { new: true }
      );
      return res.status(200).json(updated);
    }
    const store = await ensureMem();
    const i = store.messages.findIndex(
      (m) => String(m._id) === String(req.params.id)
    );
    if (i === -1) return res.status(404).json({ error: "Not found" });
    store.messages[i] = { ...store.messages[i], content: req.body.content };
    return res.status(200).json(store.messages[i]);
  } catch (err) {
    console.error("Failed to update message:", err);
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete message by ID (DELETE /dm/:id)
router.delete("/:id", async (req, res) => {
  try {
    const Model = await getMessageModel();
    if (Model) {
      await Model.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Message deleted" });
    }
    const store = await ensureMem();
    const before = store.messages.length;
    store.messages = store.messages.filter(
      (m) => String(m._id) !== String(req.params.id)
    );
    if (store.messages.length === before)
      return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    console.error("Failed to delete message:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ------------------------------------------------------------------ */
/*  Compatibility with your earlier mock-style routes                  */
/*  (keep if your frontend currently calls these)                      */
/* ------------------------------------------------------------------ */

// Create a conversation (POST /dm/conversations)
router.post("/conversations", (req, res) => {
  // no DB state kept here yet — just echo a new id for now
  res.status(201).json({ id: uuid(), ...req.body });
});

// Get messages by conversationId (GET /dm/messages/:conversationId)
router.get("/messages/:conversationId", async (req, res) => {
  const { conversationId } = req.params;

  // If DB is available, fetch by conversationId
  const Model = await getMessageModel();
  if (Model) {
    const messages = await Model.find({ conversationId }).sort("timestamp");
    return res.json(messages);
  }

  // Otherwise use memory store
  const store = await ensureMem();
  const list = store.messages
    .filter((m) => String(m.conversationId) === String(conversationId))
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  return res.json(list);
});

// Post message to a conversation (POST /dm/messages/:conversationId)
router.post("/messages/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  const payload = { ...req.body, conversationId };

  // Reuse the primary POST logic by writing to "/" with conversationId set
  req.body = payload; // mutate is safe here for reuse
  return router.handle({ ...req, method: "POST", url: "/" }, res);
});

export default router;
