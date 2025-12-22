import { Router } from "express";
import Notification from "../models/notification.js";
import { auth as authRequired } from "../middleware/auth.js";

const router = Router();

/**
 * Safe Socket.io helper:
 * emits to the room named after the userId.
 * (Your client should `socket.emit("notifications:join", { userId })`
 * and server should join them to `socket.join(userId)`.)
 */
function emitToUser(req, userId, event, payload) {
  try {
    const io = req.app.get("io");
    if (!io || !userId) return;
    io.to(String(userId)).emit(event, payload);
  } catch (_e) {
    // ignore socket failures
  }
}

/**
 * GET /api/notifications/mine
 * Bell dropdown payload:
 *  - unread: number
 *  - items: latest 20 notifications
 */
router.get("/mine", authRequired, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const items = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const unread = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });

    return res.json({ unread, items });
  } catch (err) {
    console.error("❌ GET /api/notifications/mine failed:", err);
    return res.status(500).json({ message: "Error fetching notifications." });
  }
});

/**
 * GET /api/notifications
 * Query params:
 *  - unread=true -> only unread
 *  - limit=20    -> max number to return (default 50)
 *  - sort=desc|asc (default: desc by createdAt)
 */
router.get("/", authRequired, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { unread, limit = 50, sort = "desc" } = req.query;

    const query = { user: userId };
    if (unread === "true") query.isRead = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .limit(Number(limit))
      .lean();

    return res.json(notifications);
  } catch (err) {
    console.error("❌ GET /api/notifications failed:", err);
    return res.status(500).json({ message: "Error fetching notifications." });
  }
});

/**
 * GET /api/notifications/unread-count
 * For showing the bell badge number
 */
router.get("/unread-count", authRequired, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const count = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });

    return res.json({ count });
  } catch (err) {
    console.error("❌ GET /api/notifications/unread-count failed:", err);
    return res.status(500).json({ message: "Error fetching unread count." });
  }
});

/**
 * POST /api/notifications
 * Create a new notification for the logged-in user
 */
router.post("/", authRequired, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { type, event, title, message, targetType, targetId, link } =
      req.body || {};

    if (!event || !message) {
      return res
        .status(400)
        .json({ message: "event and message are required." });
    }

    const notification = await Notification.create({
      user: userId,
      type,
      event,
      title,
      message,
      targetType,
      targetId,
      link,
      // isRead defaults to false
    });

    // 🔔 Real-time push
    emitToUser(req, userId, "notification:new", notification);

    return res.status(201).json(notification);
  } catch (err) {
    console.error("❌ POST /api/notifications failed:", err);
    return res.status(500).json({ message: "Error creating notification." });
  }
});

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read
 */
router.patch("/:id/read", authRequired, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    // 🔔 Optional: sync other tabs/devices
    emitToUser(req, userId, "notification:read", { id });

    return res.json(notification);
  } catch (err) {
    console.error("❌ PATCH /api/notifications/:id/read failed:", err);
    return res
      .status(500)
      .json({ message: "Error marking notification read." });
  }
});

/**
 * PATCH /api/notifications/read-all
 * Mark ALL notifications as read for the logged-in user
 */
router.patch("/read-all", authRequired, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await Notification.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true } }
    );

    // 🔔 Optional: sync other tabs/devices
    emitToUser(req, userId, "notification:readAll", { ok: true });

    return res.json({
      message: "All notifications marked as read.",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("❌ PATCH /api/notifications/read-all failed:", err);
    return res.status(500).json({ message: "Error marking all as read." });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a single notification
 */
router.delete("/:id", authRequired, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    const deleted = await Notification.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found." });
    }

    // 🔔 Optional: sync other tabs/devices
    emitToUser(req, userId, "notification:deleted", { id });

    return res.json({ message: "Notification deleted." });
  } catch (err) {
    console.error("❌ DELETE /api/notifications/:id failed:", err);
    return res.status(500).json({ message: "Error deleting notification." });
  }
});

/**
 * POST /api/notifications/test
 * TEMP helper to create a sample notification for the current user
 */
router.post("/test", authRequired, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const {
      type = "general",
      event = "test_notification",
      title = "New trip booked 🎉",
      message = "Your trip to Tokyo has been confirmed.",
      targetType = "trip",
      targetId = "demo-trip-id",
      link = "/dashboard/trips/demo-trip-id",
    } = req.body || {};

    const notification = await Notification.create({
      user: userId,
      type,
      event,
      title,
      message,
      targetType,
      targetId,
      link,
    });

    // 🔔 Real-time push
    emitToUser(req, userId, "notification:new", notification);

    return res.status(201).json(notification);
  } catch (err) {
    console.error("[notifications] POST /test error:", err);
    return res
      .status(500)
      .json({ message: "Failed to create test notification" });
  }
});

export default router;
