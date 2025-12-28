import { Router } from "express";
import mongoose from "mongoose";
import User from "../../models/User.js";
import SkystreamPost from "../../models/SkystreamPost.js";

const router = Router();

function requireAuth(req, res, next) {
  const id = req.user?.id || req.user?._id || req.headers["x-user-id"];
  if (!id) return res.status(401).json({ ok: false, error: "Unauthorized" });
  req.authUserId = String(id);
  next();
}

function parseCursor(cursor) {
  if (!cursor) return null;
  const d = new Date(cursor);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

/**
 * GET /api/skystream/following?limit=20&cursor=ISO_DATE
 * Returns posts from users I follow (cursor paginated)
 */
router.get("/following", requireAuth, async (req, res) => {
  try {
    const me = req.authUserId;

    if (!mongoose.Types.ObjectId.isValid(me)) {
      return res.status(400).json({ ok: false, error: "Invalid user id" });
    }

    const limit = Math.min(parseInt(req.query.limit || "20", 10), 50);
    const cursor = parseCursor(req.query.cursor);

    const u = await User.findById(me).select("following").lean();
    const followingIds = u?.following || [];

    if (!followingIds.length) {
      return res.json({ ok: true, items: [], nextCursor: null });
    }

    const query = { authorId: { $in: followingIds } };
    if (cursor) query.createdAt = { $lt: cursor };

    const items = await SkystreamPost.find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1) // fetch 1 extra to determine hasMore
      .populate("authorId", "username name avatar isOfficial")
      .lean();

    const hasMore = items.length > limit;
    const page = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore
      ? page[page.length - 1]?.createdAt?.toISOString()
      : null;

    return res.json({ ok: true, items: page, nextCursor });
  } catch (err) {
    console.error("skystream following error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

/**
 * GET /api/skystream/feed?category=forYou&limit=20&cursor=ISO_DATE
 * Returns category feed (cursor paginated)
 */
router.get("/feed", async (req, res) => {
  try {
    const category = String(req.query.category || "forYou");
    if (!["forYou", "deals", "news"].includes(category)) {
      return res.status(400).json({ ok: false, error: "Invalid category" });
    }

    const limit = Math.min(parseInt(req.query.limit || "20", 10), 50);
    const cursor = parseCursor(req.query.cursor);

    const query = { category };
    if (cursor) query.createdAt = { $lt: cursor };

    const items = await SkystreamPost.find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .populate("authorId", "username name avatar isOfficial")
      .lean();

    const hasMore = items.length > limit;
    const page = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore
      ? page[page.length - 1]?.createdAt?.toISOString()
      : null;

    return res.json({ ok: true, items: page, nextCursor });
  } catch (err) {
    console.error("skystream feed error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;