import { Router } from "express";
import mongoose from "mongoose";
import User from "../../models/user.js";
import Follow from "../../models/follow.js";
import { getOrCreateOfficialUser } from "../../lib/official.js";
import { auth as authRequired } from "../../middleware/auth.js";

// If you already have a notification route/model, use that.
// Otherwise, create a model and import it here:
import Notification from "../../models/notification.js";

const router = Router();

router.use(authRequired);

/* -----------------------------
   Helpers
----------------------------- */

function oid(id) {
  return new mongoose.Types.ObjectId(id);
}

/**
 * Ensure the current user follows Official.
 * - Creates Follow if missing
 * - Increments counts (once)
 * - Creates Welcome notification (once)
 *
 * Safe to call repeatedly.
 */
async function ensureOfficialFollow(meId) {
  const official = await getOrCreateOfficialUser();
  const officialId = String(official._id);

  // Don’t try to follow yourself if you are the official account
  if (String(meId) === officialId) {
    return { ok: true, created: false, officialId };
  }

  // Upsert follow relationship
  const r = await Follow.updateOne(
    { followerId: meId, followingId: officialId },
    { $setOnInsert: { followerId: meId, followingId: officialId } },
    { upsert: true }
  );

  const created =
    r?.upsertedCount > 0 ||
    (Array.isArray(r?.upserted) && r.upserted.length > 0) ||
    !!r?.upsertedId;

  if (created) {
    // Increment counts once (guard against missing fields)
    await Promise.all([
      User.updateOne({ _id: meId }, { $inc: { followingCount: 1 } }),
      User.updateOne({ _id: officialId }, { $inc: { followersCount: 1 } }),

      // Create welcome notification once per user
      Notification.create({
        userId: meId,
        type: "WELCOME",
        title: "Welcome to Skyrio ✈️",
        body: "Your Digital Passport is ready. Earn XP when you book, save trips, and explore.",
        fromUserId: officialId,
        read: false,
        meta: { kind: "official_welcome" },
      }).catch(() => {
        // If notification fails, don’t break login flow
      }),
    ]);
  }

  return { ok: true, created, officialId };
}

/**
 * Auto-run on every request (cheap + safe):
 * guarantees Official is followed after login.
 */
router.use(async (req, _res, next) => {
  try {
    const meId = req.user?.id;
    if (meId && mongoose.isValidObjectId(meId)) {
      await ensureOfficialFollow(meId);
    }
  } catch (e) {
    // Never block normal routes if this fails
  }
  next();
});

/* ======================================================
   POST /api/social/follow/:targetId
   ====================================================== */
router.post("/follow/:targetId", async (req, res) => {
  try {
    const meId = req.user.id;
    const { targetId } = req.params;

    if (!mongoose.isValidObjectId(targetId)) {
      return res.status(400).json({ ok: false, message: "Invalid targetId" });
    }
    if (String(meId) === String(targetId)) {
      return res
        .status(400)
        .json({ ok: false, message: "You cannot follow yourself" });
    }

    const target = await User.findById(targetId).select("_id isOfficial");
    if (!target)
      return res.status(404).json({ ok: false, message: "User not found" });

    const r = await Follow.updateOne(
      { followerId: meId, followingId: targetId },
      { $setOnInsert: { followerId: meId, followingId: targetId } },
      { upsert: true }
    );

    const created =
      r?.upsertedCount > 0 ||
      (Array.isArray(r?.upserted) && r.upserted.length > 0) ||
      !!r?.upsertedId;

    if (created) {
      await Promise.all([
        User.updateOne({ _id: meId }, { $inc: { followingCount: 1 } }),
        User.updateOne({ _id: targetId }, { $inc: { followersCount: 1 } }),

        // Optional follow notification (nice polish)
        Notification.create({
          userId: targetId,
          type: "FOLLOW",
          title: "New follower",
          body: "Someone followed you on Skyrio.",
          fromUserId: meId,
          read: false,
          meta: { kind: "follow" },
        }).catch(() => {}),
      ]);
    }

    const [me, them] = await Promise.all([
      User.findById(meId).select("followingCount"),
      User.findById(targetId).select("followersCount"),
    ]);

    return res.json({
      ok: true,
      alreadyFollowing: !created,
      counts: {
        meFollowing: me?.followingCount ?? 0,
        targetFollowers: them?.followersCount ?? 0,
      },
    });
  } catch (err) {
    console.error("❌ POST /api/social/follow failed:", err);
    return res.status(500).json({ ok: false, message: "Failed to follow" });
  }
});

/* ======================================================
   DELETE /api/social/follow/:targetId
   Block unfollowing official
   + safe decrement (no negatives)
   ====================================================== */
router.delete("/follow/:targetId", async (req, res) => {
  try {
    const meId = req.user.id;
    const { targetId } = req.params;

    if (!mongoose.isValidObjectId(targetId)) {
      return res.status(400).json({ ok: false, message: "Invalid targetId" });
    }

    const target = await User.findById(targetId).select("_id isOfficial");
    if (!target)
      return res.status(404).json({ ok: false, message: "User not found" });

    if (target.isOfficial) {
      return res.status(403).json({
        ok: false,
        message:
          "You can’t remove the official Skyrio account. You can mute updates instead.",
        canMuteInstead: true,
      });
    }

    const deleted = await Follow.deleteOne({
      followerId: meId,
      followingId: targetId,
    });

    if (deleted.deletedCount > 0) {
      // Decrement safely: only decrement if > 0
      await Promise.all([
        User.updateOne(
          { _id: meId, followingCount: { $gt: 0 } },
          { $inc: { followingCount: -1 } }
        ),
        User.updateOne(
          { _id: targetId, followersCount: { $gt: 0 } },
          { $inc: { followersCount: -1 } }
        ),
      ]);
    }

    const [me, them] = await Promise.all([
      User.findById(meId).select("followingCount"),
      User.findById(targetId).select("followersCount"),
    ]);

    return res.json({
      ok: true,
      wasFollowing: deleted.deletedCount > 0,
      counts: {
        meFollowing: me?.followingCount ?? 0,
        targetFollowers: them?.followersCount ?? 0,
      },
    });
  } catch (err) {
    console.error("❌ DELETE /api/social/follow failed:", err);
    return res.status(500).json({ ok: false, message: "Failed to unfollow" });
  }
});

/* ======================================================
   GET /api/social/passport/stats
   (Backwards compatible; ok to keep)
   ====================================================== */
router.get("/passport/stats", async (req, res) => {
  try {
    const meId = req.user.id;

    const [me, official] = await Promise.all([
      User.findById(meId).select("followersCount followingCount preferences"),
      getOrCreateOfficialUser(),
    ]);

    if (!me)
      return res.status(404).json({ ok: false, message: "User not found" });

    return res.json({
      ok: true,
      followers: me.followersCount || 0,
      following: me.followingCount || 0,
      officialUpdatesMuted: !!me.preferences?.officialUpdatesMuted,
      officialUserId: String(official._id),
    });
  } catch (err) {
    console.error("❌ GET /api/social/passport/stats failed:", err);
    return res.status(500).json({ ok: false, message: "Failed to load stats" });
  }
});

/* ======================================================
   PATCH /api/social/official/mute
   Body: { muted: true|false }
   ====================================================== */
router.patch("/official/mute", async (req, res) => {
  try {
    const meId = req.user.id;
    const muted = !!req.body?.muted;

    await User.updateOne(
      { _id: meId },
      { $set: { "preferences.officialUpdatesMuted": muted } }
    );

    return res.json({ ok: true, officialUpdatesMuted: muted });
  } catch (err) {
    console.error("❌ PATCH /api/social/official/mute failed:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to update preference" });
  }
});

/* ======================================================
   POST /api/social/ensure-official
   Optional endpoint (handy for debugging)
   ====================================================== */
router.post("/ensure-official", async (req, res) => {
  try {
    const meId = req.user.id;
    const result = await ensureOfficialFollow(meId);
    return res.json(result);
  } catch (err) {
    console.error("❌ POST /api/social/ensure-official failed:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to ensure official follow" });
  }
});

export default router;