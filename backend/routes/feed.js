import { Router } from "express";
import Post from "../models/post.js";

const router = Router();

/**
 * GET /feed
 * Optional query params:
 *   - limit (default 50, max 100)
 *   - before (ISO date) to paginate older posts
 */
router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 100);
    const before = req.query.before ? new Date(req.query.before) : null;

    const filter = {};
    if (before && !isNaN(before.getTime())) {
      filter.createdAt = { $lt: before };
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json(posts);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /feed/:id → fetch single post
 */
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /feed → create a new post
 * body: { text: string, images?: string[], tags?: string[], author?: ObjectId }
 */
router.post("/", async (req, res, next) => {
  try {
    const { text, images = [], tags = [], author } = req.body || {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "text is required" });
    }

    const created = await Post.create({ text, images, tags, author });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

export default router;
