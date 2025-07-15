const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// 📌 POST /api/notifications — Create a new notification
router.post("/", async (req, res) => {
  try {
    const { userId, message, type = "general", link = "" } = req.body;

    if (!userId || !message) {
      return res
        .status(400)
        .json({ message: "userId and message are required." });
    }

    const newNotification = new Notification({
      userId,
      message,
      type,
      link,
    });

    const saved = await newNotification.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error creating notification:", err.message);
    res.status(500).json({ message: "Failed to create notification." });
  }
});

// 🛎️ GET /api/notifications - Fetch notifications (with optional ?limit=N)
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;

    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json(notifications);
  } catch (err) {
    console.error("❌ Error fetching notifications:", err.message);
    res.status(500).json({
      message: "Internal server error while loading notifications.",
      error: err.message,
    });
  }
});

// ✅ PUT /api/notifications/read-all - Mark all as read
router.put("/read-all", async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      updatedCount: result.modifiedCount || result.nModified || 0,
      message: "All notifications marked as read.",
    });
  } catch (err) {
    console.error("❌ Error marking notifications as read:", err.message);
    res.status(500).json({
      message: "Internal server error updating notifications.",
      error: err.message,
    });
  }
});

module.exports = router;
