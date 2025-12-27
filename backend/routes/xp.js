import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Season from "../models/Season.js";
import XpLedger from "../models/XpLedger.js";
import {
  XP_RULES,
  XP_DAILY_CAP,
  XP_MAX_SINGLE_AWARD,
} from "../config/xpRules.js";
import { requireAuth } from "../middleware/requireAuth.js"; // use your existing one
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

/**
 * POST /api/xp/add
 * Admin-only (support/manager/admin) so YOU control seasonal + manual awards during soft launch.
 *
 * Body:
 * {
 *   userId: "mongoId",
 *   reason: "BOOKING_CONFIRMED" | "SAVED_TRIP" | "SEASONAL_AWARD" | ...
 *   amount?: number,            // required for variable reasons like SEASONAL_AWARD/ADMIN_GRANT
 *   meta?: object,
 *   applySeason?: boolean       // default true for normal reasons, but still only if season is active
 * }
 */
router.post(
  "/add",
  requireAuth,
  requireRole("support", "manager", "admin"),
  async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        userId,
        reason,
        amount,
        meta,
        applySeason = true,
      } = req.body || {};

      if (!userId || !reason) {
        return res
          .status(400)
          .json({ message: "userId and reason are required" });
      }

      const rule = XP_RULES[reason];
      if (!rule) {
        return res.status(400).json({ message: `Unknown reason: ${reason}` });
      }

      // Determine base XP
      let delta = typeof rule.xp === "number" ? rule.xp : 0;

      // Variable reasons: require amount
      const variable = reason === "SEASONAL_AWARD" || reason === "ADMIN_GRANT";
      if (variable) {
        if (typeof amount !== "number" || !Number.isFinite(amount)) {
          return res
            .status(400)
            .json({ message: "amount must be a number for this reason" });
        }
        delta = amount;
      }

      // Guardrails (soft launch)
      if (Math.abs(delta) > XP_MAX_SINGLE_AWARD) {
        return res
          .status(400)
          .json({
            message: `Award too large. Max single award: ${XP_MAX_SINGLE_AWARD}`,
          });
      }

      const user = await User.findById(userId).session(session);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Respect opt-in (unless admin intentionally overrides with a special meta flag)
      const rewardsEnabled = !!user.settings?.rewardsEnabled;
      const overrideOptIn = meta?.overrideOptIn === true;

      if (!rewardsEnabled && !overrideOptIn) {
        return res.status(409).json({
          message: "Rewards are disabled for this user",
          code: "REWARDS_DISABLED",
        });
      }

      // Daily cap check (simple)
      const since = new Date();
      since.setHours(0, 0, 0, 0);

      const today = await XpLedger.aggregate([
        { $match: { userId: user._id, createdAt: { $gte: since } } },
        { $group: { _id: "$userId", sum: { $sum: "$delta" } } },
      ]).session(session);

      const todaySum = today?.[0]?.sum ?? 0;
      if (todaySum + delta > XP_DAILY_CAP && !overrideOptIn) {
        return res.status(429).json({
          message: "Daily XP cap reached",
          code: "XP_DAILY_CAP",
        });
      }

      // Seasonal multiplier (ONLY if active and you allow it)
      let seasonKey = null;

      if (applySeason) {
        const activeSeason = await Season.findOne({ isActive: true }).session(
          session
        );

        if (activeSeason) {
          seasonKey = activeSeason.key;

          const boosted =
            !activeSeason.boostedReasons?.length ||
            activeSeason.boostedReasons.includes(reason);

          if (boosted) {
            const mult = Number(activeSeason.xpMultiplier || 1);
            delta = Math.round(delta * mult);
          }
        }
      }

      // Apply XP + ledger entry (atomic-ish inside transaction)
      user.xp = Math.max(0, (user.xp || 0) + delta);
      await user.save({ session });

      await XpLedger.create(
        [
          {
            userId: user._id,
            delta,
            reason,
            meta: meta || {},
            seasonKey,
            createdBy: req.user?.id,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.json({
        ok: true,
        userId: user._id.toString(),
        newXp: user.xp,
        delta,
        reason,
        seasonKey,
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error("[xp/add] error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;