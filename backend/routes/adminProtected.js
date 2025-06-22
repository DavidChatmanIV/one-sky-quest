const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdminToken");

// 🔐 Admin-only dashboard route
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({
    message: "✅ Welcome, Admin!",
    admin: req.admin, // includes id, role, etc.
  });
});

module.exports = router;
