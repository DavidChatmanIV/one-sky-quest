import express from "express";
import Watch from "../models/Watch.js";

// Use your existing auth middleware here.
// Pick ONE that matches your project:
// import requireAuth from "../middleware/requireAuth.js";
// import { protect } from "../middleware/authMiddleware.js";
// import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * Helper: get userId from your auth system
 * - If you store it on req.user.id or req.user._id, this works.
 */
function getUserId(req) {
  return req.user?.id || req.user?._id;
}

/**
 * POST /api/watches
 * Create a watch for the logged-in user
 */
router.post(
  "/",
  /* requireAuth, */ async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const {
        type = "flights",
        destination = "",
        dates = null,
        guests = "",
        lastSeenPrice = null,
      } = req.body || {};

      const watch = await Watch.create({
        userId,
        type,
        destination,
        dates,
        guests,
        lastSeenPrice,
        active: true,
      });

      // Frontend supports both data._id or data.watch._id
      return res.status(201).json({ watch });
    } catch (err) {
      return res.status(500).json({ error: "Failed to create watch" });
    }
  }
);

/**
 * GET /api/watches
 * List the user's active watches
 */
router.get(
  "/",
  /* requireAuth, */ async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const watches = await Watch.find({ userId, active: true })
        .sort({ createdAt: -1 })
        .lean();

      return res.json({ watches });
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch watches" });
    }
  }
);

/**
 * DELETE /api/watches/:id
 * Remove a watch (soft delete by setting active=false)
 */
router.delete(
  "/:id",
  /* requireAuth, */ async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const { id } = req.params;

      const updated = await Watch.findOneAndUpdate(
        { _id: id, userId },
        { active: false },
        { new: true }
      );

      if (!updated) return res.status(404).json({ error: "Not found" });

      return res.json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: "Failed to remove watch" });
    }
  }
);

export default router;
