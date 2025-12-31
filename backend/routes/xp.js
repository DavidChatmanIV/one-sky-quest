import { Router } from "express";
import mongoose from "mongoose";
import User from "../models/user.js";

const router = Router();

/* -----------------------------
   Tiny auth helper (matches your other routes)
----------------------------- */
function requireAuth(req, res, next) {
  const id = req.user?.id || req.user?._id || req.headers["x-user-id"];
  if (!id) return res.status(401).json({ ok: false, error: "Unauthorized" });
  req.authUserId = String(id);
  next();
}

/* -----------------------------
   GET /api/xp/me
   Returns your current XP (and a few optional fields if present)
----------------------------- */
router.get("/me", requireAuth, async (req, res) => {
  try {
    const me = req.authUserId;
    if (!mongoose.Types.ObjectId.isValid(me)) {
      return res.status(400).json({ ok: false, error: "Invalid user id" });
    }

    const u = await User.findById(me)
      .select("xp level badges xpSeason xpSeasonName")
      .lean();

    if (!u) return res.status(404).json({ ok: false, error: "User not found" });

    res.json({ ok: true, me: { id: me, ...u } });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/* -----------------------------
   POST /api/xp/award
   Body: { amount: number, reason?: string }
   Adds XP safely (simple + clean)
----------------------------- */
router.post("/award", requireAuth, async (req, res) => {
  try {
    const me = req.authUserId;
    const amount = Number(req.body?.amount || 0);
    const reason = String(req.body?.reason || "xp_award");

    if (!Number.isFinite(amount) || amount <= 0 || amount > 5000) {
      return res.status(400).json({
        ok: false,
        error: "Invalid amount (must be 1..5000)",
      });
    }

    const r = await User.findByIdAndUpdate(
      me,
      {
        $inc: { xp: amount, xpSeason: amount },
        $setOnInsert: { xp: 0, xpSeason: 0 },
      },
      { new: true, upsert: false }
    ).select("xp xpSeason xpSeasonName level");

    if (!r) return res.status(404).json({ ok: false, error: "User not found" });

    res.json({
      ok: true,
      awarded: amount,
      reason,
      xp: r.xp ?? 0,
      xpSeason: r.xpSeason ?? 0,
      xpSeasonName: r.xpSeasonName ?? null,
      level: r.level ?? null,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/* -----------------------------
   POST /api/xp/season/set
   Body: { name: string }
   Sets a season name + resets season XP (optional but useful for “2K seasons”)
----------------------------- */
router.post("/season/set", requireAuth, async (req, res) => {
  try {
    const me = req.authUserId;
    const name = String(req.body?.name || "").trim();

    if (!name || name.length > 40) {
      return res.status(400).json({ ok: false, error: "Invalid season name" });
    }

    const r = await User.findByIdAndUpdate(
      me,
      { $set: { xpSeasonName: name, xpSeason: 0 } },
      { new: true }
    ).select("xp xpSeason xpSeasonName");

    if (!r) return res.status(404).json({ ok: false, error: "User not found" });

    res.json({ ok: true, xpSeasonName: r.xpSeasonName, xpSeason: r.xpSeason });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;