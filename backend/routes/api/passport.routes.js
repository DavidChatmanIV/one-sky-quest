import { Router } from "express";
import mongoose from "mongoose";
import User from "../../models/User.js";
import Follow from "../../models/Follow.js";
import Notification from "../../models/Notification.js";

const router = Router();

function requireAuth(req, res, next) {
  const id = req.user?.id || req.user?._id || req.headers["x-user-id"];
  if (!id) return res.status(401).json({ ok: false, error: "Unauthorized" });
  req.authUserId = String(id);
  next();
}

/* ---------------------------
   Helpers
--------------------------- */
function getIO(req) {
  // You’ll set this in server.js: app.set("io", io)
  return req.app?.get("io") || null;
}

// Simple milestone table (keep it FUN but not complex)
const FOLLOW_MILESTONES = [5, 10, 25, 50, 100, 250, 500];

function computeMilestoneAward(before, after) {
  const hit = FOLLOW_MILESTONES.find((m) => before < m && after >= m);
  if (!hit) return null;

  // light XP so it’s rewarding but not overpowered
  const xpByMilestone = {
    5: 15,
    10: 25,
    25: 50,
    50: 80,
    100: 120,
    250: 200,
    500: 350,
  };

  return { milestone: hit, xp: xpByMilestone[hit] || 25 };
}

async function awardXpAndNotify({ userId, xp, title, meta = {} }) {
  if (!mongoose.Types.ObjectId.isValid(userId)) return;

  // Update XP (safe)
  await User.updateOne(
    { _id: userId },
    { $inc: { xp: xp } },
    { runValidators: false }
  );

  // Optional notification (if Notification model exists / you want it)
  try {
    await Notification.create({
      userId,
      type: "xp",
      title: title || "XP earned",
      meta: { xp, ...meta },
      read: false,
    });
  } catch (_e) {
    // notification is optional
  }
}

async function getCounts(userId) {
  const u = await User.findById(userId)
    .select("followersCount followingCount xp level")
    .lean();

  return {
    followers: u?.followersCount || 0,
    following: u?.followingCount || 0,
    xp: u?.xp || 0,
    level: u?.level || 1,
  };
}

/* ---------------------------
   Routes
--------------------------- */

// ✅ Passport stats (counts + optional XP/level)
router.get("/stats", requireAuth, async (req, res) => {
  try {
    const me = req.authUserId;
    if (!mongoose.Types.ObjectId.isValid(me)) {
      return res.status(400).json({ ok: false, error: "Invalid user id" });
    }

    const stats = await getCounts(me);

    // unread notifications count example (optional)
    let unread = 0;
    try {
      unread = await Notification.countDocuments({ userId: me, read: false });
    } catch (_e) {}

    res.json({ ok: true, stats: { ...stats, unread } });
  } catch (err) {
    console.error("passport/stats error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ✅ Following list
router.get("/following", requireAuth, async (req, res) => {
  try {
    const me = req.authUserId;
    const limit = Math.min(parseInt(req.query.limit || "25", 10), 50);
    const cursor = req.query.cursor ? String(req.query.cursor) : null;

    const q = { followerId: me };
    if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
      q._id = { $lt: cursor }; // cursor pagination (descending)
    }

    const rows = await Follow.find(q)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate("followingId", "name username avatarUrl isOfficial")
      .lean();

    const hasMore = rows.length > limit;
    const slice = hasMore ? rows.slice(0, limit) : rows;

    const items = slice
      .map((r) => r.followingId)
      .filter(Boolean)
      .map((u) => ({
        id: String(u._id),
        name: u.name || "",
        username: u.username || "",
        avatarUrl: u.avatarUrl || "",
        isOfficial: !!u.isOfficial,
      }));

    const nextCursor = hasMore ? String(slice[slice.length - 1]._id) : null;
    res.json({ ok: true, items, nextCursor });
  } catch (err) {
    console.error("passport/following error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ✅ Followers list
router.get("/followers", requireAuth, async (req, res) => {
  try {
    const me = req.authUserId;
    const limit = Math.min(parseInt(req.query.limit || "25", 10), 50);
    const cursor = req.query.cursor ? String(req.query.cursor) : null;

    const q = { followingId: me };
    if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
      q._id = { $lt: cursor };
    }

    const rows = await Follow.find(q)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate("followerId", "name username avatarUrl isOfficial")
      .lean();

    const hasMore = rows.length > limit;
    const slice = hasMore ? rows.slice(0, limit) : rows;

    const items = slice
      .map((r) => r.followerId)
      .filter(Boolean)
      .map((u) => ({
        id: String(u._id),
        name: u.name || "",
        username: u.username || "",
        avatarUrl: u.avatarUrl || "",
        isOfficial: !!u.isOfficial,
      }));

    const nextCursor = hasMore ? String(slice[slice.length - 1]._id) : null;
    res.json({ ok: true, items, nextCursor });
  } catch (err) {
    console.error("passport/followers error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ✅ Follow / Unfollow (keeps counts + socket + milestones)
// POST /api/passport/follow/:targetUserId
router.post("/follow/:targetUserId", requireAuth, async (req, res) => {
  try {
    const me = req.authUserId;
    const target = String(req.params.targetUserId);

    if (
      !mongoose.Types.ObjectId.isValid(me) ||
      !mongoose.Types.ObjectId.isValid(target)
    ) {
      return res.status(400).json({ ok: false, error: "Invalid id" });
    }
    if (me === target) {
      return res
        .status(400)
        .json({ ok: false, error: "Cannot follow yourself" });
    }

    // Snapshot before
    const beforeMe = await User.findById(me).select("followingCount").lean();
    const beforeFollowing = beforeMe?.followingCount || 0;

    // Create follow (unique index prevents dupes)
    let created = false;
    try {
      await Follow.create({ followerId: me, followingId: target });
      created = true;
    } catch (e) {
      // duplicate -> already following
      created = false;
    }

    if (created) {
      // Update counters (fast)
      await Promise.all([
        User.updateOne({ _id: me }, { $inc: { followingCount: 1 } }),
        User.updateOne({ _id: target }, { $inc: { followersCount: 1 } }),
      ]);

      // Milestone award for FOLLOWING count (simple, fun)
      const afterMe = await User.findById(me).select("followingCount").lean();
      const afterFollowing = afterMe?.followingCount || beforeFollowing + 1;

      const award = computeMilestoneAward(beforeFollowing, afterFollowing);
      if (award) {
        await awardXpAndNotify({
          userId: me,
          xp: award.xp,
          title: `Milestone reached: ${award.milestone} Following`,
          meta: { kind: "follow_milestone", milestone: award.milestone },
        });
      }

      // Optional: notify target they got a follower
      try {
        await Notification.create({
          userId: target,
          type: "follow",
          title: "New follower",
          meta: { fromUserId: me },
          read: false,
        });
      } catch (_e) {}
    }

    const [myCounts, targetCounts] = await Promise.all([
      getCounts(me),
      getCounts(target),
    ]);

    // Live update via Socket.io (if present)
    const io = getIO(req);
    if (io) {
      io.to(`user:${me}`).emit("social:counts:update", myCounts);
      io.to(`user:${target}`).emit("social:counts:update", targetCounts);
    }

    res.json({ ok: true, created, me: myCounts });
  } catch (err) {
    console.error("passport/follow error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// DELETE /api/passport/follow/:targetUserId
router.delete("/follow/:targetUserId", requireAuth, async (req, res) => {
  try {
    const me = req.authUserId;
    const target = String(req.params.targetUserId);

    if (
      !mongoose.Types.ObjectId.isValid(me) ||
      !mongoose.Types.ObjectId.isValid(target)
    ) {
      return res.status(400).json({ ok: false, error: "Invalid id" });
    }

    const del = await Follow.deleteOne({ followerId: me, followingId: target });
    const removed = del.deletedCount > 0;

    if (removed) {
      await Promise.all([
        User.updateOne({ _id: me }, { $inc: { followingCount: -1 } }),
        User.updateOne({ _id: target }, { $inc: { followersCount: -1 } }),
      ]);
    }

    const [myCounts, targetCounts] = await Promise.all([
      getCounts(me),
      getCounts(target),
    ]);

    const io = getIO(req);
    if (io) {
      io.to(`user:${me}`).emit("social:counts:update", myCounts);
      io.to(`user:${target}`).emit("social:counts:update", targetCounts);
    }

    res.json({ ok: true, removed, me: myCounts });
  } catch (err) {
    console.error("passport/unfollow error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;