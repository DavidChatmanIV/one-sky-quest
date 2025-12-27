import { Router } from "express";
import mongoose from "mongoose";
import User from "../../models/user.js";
import Notification from "../../models/notification.js";
import { auth as authRequired } from "../../middleware/auth.js";

const router = Router();

router.use(authRequired);

router.get("/stats", async (req, res) => {
  try {
    const meId = req.user?.id;
    if (!meId || !mongoose.Types.ObjectId.isValid(meId)) {
      return res.status(400).json({ ok: false, error: "Invalid user id" });
    }

    const [u, unread] = await Promise.all([
      User.findById(meId)
        .select("followersCount followingCount preferences isOfficial")
        .lean(),
      Notification.countDocuments({ user: meId, isRead: false }),
    ]);

    if (!u) return res.status(404).json({ ok: false, error: "User not found" });

    return res.json({
      ok: true,
      passport: {
        followersCount: u.followersCount || 0,
        followingCount: u.followingCount || 0,

        // ✅ matches your existing social.routes.js preference field
        officialUpdatesMuted: !!u?.preferences?.officialUpdatesMuted,

        // ✅ matches your Notification schema
        unreadNotifications: unread || 0,
      },
    });
  } catch (err) {
    console.error("[passport] stats error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;