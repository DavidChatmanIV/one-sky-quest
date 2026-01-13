import { Router } from "express";
import crypto from "crypto";
import PassportShare from "../../models/PassportShare.js";
import { authRequired } from "../../middleware/authRequired.js";
import User from "../../models/user.js";

const router = Router();

// Create share link
router.post("/passport/share", authRequired, async (req, res) => {
  const ownerId = req.user.id;

  const shareId = crypto.randomBytes(10).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

  await PassportShare.create({ shareId, ownerId, expiresAt });

  return res.json({ ok: true, shareId });
});

// Resolve share link (public-ish)
router.get("/passport/share/:shareId", async (req, res) => {
  const { shareId } = req.params;

  const share = await PassportShare.findOne({ shareId });
  if (!share) return res.json({ ok: false });

  if (share.expiresAt && share.expiresAt < new Date())
    return res.json({ ok: false });

  const owner = await User.findById(share.ownerId).select("username name");
  if (!owner) return res.json({ ok: false });

  return res.json({
    ok: true,
    owner: {
      name: owner.name || owner.username || "Explorer",
      username: owner.username || "",
    },
  });
});

export default router;