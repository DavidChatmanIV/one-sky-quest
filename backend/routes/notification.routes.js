import { Router } from "express";
import { Notification } from "../models/index.js";
import { auth } from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/notifications
 * Query params:
 *  - unread=true -> only unread
 *  - limit=20    -> max number to return (default 50)
 *  - sort=desc|asc (default: desc by createdAt)
 */
router.get("/", auth, async (req, res) => {
  try {
    const { unread, limit = 50, sort = "desc" } = req.query;

    const query = { user: req.user.id };
    if (unread === "true") {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .limit(Number(limit));

    res.json(notifications);
  } catch (err) {
    console.error("❌ Failed to fetch notifications:", err);
    res.status(500).json({ message: "Error fetching notifications." });
  }
});

/**
 * GET /api/notifications/unread-count
 * For showing the bell badge number
 */
router.get("/unread-count", auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });
    res.json({ count });
  } catch (err) {
    console.error("❌ Failed to fetch unread count:", err);
    res.status(500).json({ message: "Error fetching unread count." });
  }
});

/**
 * POST /api/notifications
 * Create a new notification for the logged-in user
 * Body example:
 * {
 *   "type": "booking",
 *   "event": "booking_created",
 *   "title": "Booking confirmed",
 *   "message": "Your trip to Tokyo is confirmed!",
 *   "targetType": "booking",
 *   "targetId": "<bookingId>",
 *   "link": "/dashboard/trips/123"
 * }
 */
router.post("/", auth, async (req, res) => {
  try {
    const { type, event, title, message, targetType, targetId, link } =
      req.body;

    if (!event || !message) {
      return res
        .status(400)
        .json({ message: "event and message are required." });
    }

    const notification = new Notification({
      user: req.user.id,
      type,
      event,
      title,
      message,
      targetType,
      targetId,
      link,
    });

    await notification.save();

    // 🔔 Socket.io hook (optional)
    // const io = req.app.get("io");
    // if (io) {
    //   io.to(req.user.id.toString()).emit("notification:new", notification);
    // }

    res.status(201).json(notification);
  } catch (err) {
    console.error("❌ Failed to create notification:", err);
    res.status(500).json({ message: "Error creating notification." });
  }
});

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read
 */
router.patch("/:id/read", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.json(notification);
  } catch (err) {
    console.error("❌ Failed to mark notification as read:", err);
    res.status(500).json({ message: "Error marking notification as read." });
  }
});

/**
 * PATCH /api/notifications/read-all
 * Mark ALL notifications as read for the logged-in user
 */
router.patch("/read-all", auth, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({
      message: "All notifications marked as read.",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("❌ Failed to mark all as read:", err);
    res.status(500).json({ message: "Error marking all as read." });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a single notification
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Notification.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.json({ message: "Notification deleted." });
  } catch (err) {
    console.error("❌ Failed to delete notification:", err);
    res.status(500).json({ message: "Error deleting notification." });
  }
});

export default router;
