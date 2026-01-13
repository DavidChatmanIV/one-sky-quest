import { Router } from "express";
import PassportShare from "../../models/PassportShare.js";
import InnerCircle from "../../models/InnerCircle.js";
import { authRequired } from "../../middleware/authRequired.js";

const router = Router();

// Get my inner circle
router.get("/inner-circle/mine", authRequired, async (req, res) => {
  const ownerId = req.user.id;

  const items = await InnerCircle.find({ ownerId })
    .sort({ createdAt: 1 })
    .limit(8)
    .lean();

  return res.json({ ok: true, items });
});

// Join an owner's inner circle via shareId
router.post("/inner-circle/join/:shareId", authRequired, async (req, res) => {
  const { shareId } = req.params;
  const joinerId = req.user.id;

  const share = await PassportShare.findOne({ shareId });
  if (!share) return res.json({ ok: false });

  if (share.expiresAt && share.expiresAt < new Date())
    return res.json({ ok: false });

  const ownerId = share.ownerId.toString();
  if (ownerId === joinerId) return res.json({ ok: false, reason: "self" });

  const count = await InnerCircle.countDocuments({ ownerId });
  if (count >= 8) return res.json({ ok: false, reason: "full" });

  await InnerCircle.updateOne(
    { ownerId, userId: joinerId },
    { $setOnInsert: { ownerId, userId: joinerId } },
    { upsert: true }
  );

  return res.json({ ok: true });
});

export default router;