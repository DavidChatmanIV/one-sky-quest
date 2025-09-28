import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

// 🩺 Basic health check
router.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "One Sky Quest API",
    ts: new Date().toISOString(),
  });
});

// 🔍 Status check with DB connection info
router.get("/status", (_req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const dbState = states[mongoose.connection.readyState] || "unknown";

  res.json({
    ok: dbState === "connected",
    db: dbState,
    ts: new Date().toISOString(),
  });
});

export default router;
