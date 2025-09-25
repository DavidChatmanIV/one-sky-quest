import { Router } from "express";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { existsSync } from "fs";
import { uuid } from "../utils/id.js";

const router = Router();

// Try to load the mock JSON if it exists (works locally & on Render)
let dmData = { messages: [] };

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const jsonPath = resolve(__dirname, "../data/dm.mock.json");

  if (existsSync(jsonPath)) {
    // JSON import with assertion (ESM)
    const mod = await import("../data/dm.mock.json", {
      assert: { type: "json" },
    });
    dmData = mod.default ?? { messages: [] };
  } else {
    console.warn("[dm] ../data/dm.mock.json not found — using empty dataset.");
  }
} catch (err) {
  console.warn(
    "[dm] Failed to load dm.mock.json — using empty dataset.",
    err?.message
  );
}

// Create a conversation
router.post("/dm/conversations", (req, res) => {
  const convo = { id: uuid(), ...req.body, createdAt: Date.now() };
  // (Optional) persist to DB later
  return res.status(201).json(convo);
});

// Get messages for a conversation
router.get("/dm/messages/:conversationId", (req, res) => {
  const { conversationId } = req.params;
  // If using mock, we just return the mock array for now
  return res.json(dmData.messages ?? []);
});

// Post a new message to a conversation
router.post("/dm/messages/:conversationId", (req, res) => {
  const { conversationId } = req.params;
  const message = { id: uuid(), conversationId, ts: Date.now(), ...req.body };
  // (Optional) push into dmData.messages here if you want to reflect writes in-memory
  return res.status(201).json(message);
});

export default router;
