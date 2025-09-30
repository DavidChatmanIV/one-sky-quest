import { Router } from "express";
import { Notification } from "../models/index.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// 📖 GET: all notifications for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id });
    res.json(notifications);
  } catch (err) {
    console.error("❌ Failed to fetch notifications:", err);
    res.status(500).json({ message: "Error fetching notifications." });
  }
});

// ➕ POST: create notification
router.post("/", auth, async (req, res) => {
  try {
    const notification = new Notification({
      user: req.user.id,
      ...req.body,
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    console.error("❌ Failed to create notification:", err);
    res.status(500).json({ message: "Error creating notification." });
  }
});

export default router;
