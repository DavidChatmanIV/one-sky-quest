const express = require("express");
const router = express.Router();
const User = require("../models/User");

const reportCounts = new Map();
const AUTO_FLAG_THRESHOLD = 3;

// POST /api/reports
router.post("/", async (req, res) => {
  try {
    const { reporterId, reportedUserId, reason } = req.body;

    if (!reporterId || !reportedUserId || !reason) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) return res.status(404).json({ error: "User not found" });

    const key = `${reportedUserId}`;
    const currentCount = reportCounts.get(key) || 0;
    const newCount = currentCount + 1;
    reportCounts.set(key, newCount);

    if (newCount >= AUTO_FLAG_THRESHOLD && !reportedUser.flagged) {
      reportedUser.flagged = true;
      await reportedUser.save();
    }

    return res.json({
      message: `User reported successfully. Total reports: ${newCount}`,
      flagged: reportedUser.flagged,
    });
  } catch (err) {
    console.error("Error reporting user:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
