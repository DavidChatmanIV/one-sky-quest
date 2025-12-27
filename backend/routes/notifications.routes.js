import { Router } from "express";
import Notification from "../models/Notification.js";

const router = Router();

function requireAuth(req, _res, next) {
  if (!req.user?.id)
    return next(Object.assign(new Error("Unauthorized"), { status: 401 }));
  next();
}

router.use(requireAuth);

// List notifications (latest first)
router.get("/", async (req, res, next) => {
  try {
    const items = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    res.json({ ok: true, items });
  } catch (err) {
    next(err);
  }
});

// Mark all read
router.patch("/read-all", async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { $set: { read: true } }
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;