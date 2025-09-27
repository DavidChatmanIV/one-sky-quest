import { Router } from "express";

const router = Router();

/**
 * Direct Message routes
 * Starter version — expand later with Message + Conversation models
 */

// ✅ GET /dm/test → sanity check
router.get("/test", (_req, res) => {
  res.json({ ok: true, route: "dm works" });
});

// ✅ POST /dm/send → placeholder for sending a direct message
router.post("/send", (req, res) => {
  const { from, to, message } = req.body;

  if (!from || !to || !message) {
    return res
      .status(400)
      .json({ error: "from, to, and message are required" });
  }

  // TODO: later connect to Message model & save to DB
  res.status(201).json({
    success: true,
    from,
    to,
    message,
    note: "Saving to DB will be added later.",
  });
});

export default router;
