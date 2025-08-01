const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const { verifyAdmin } = require("../middleware/auth"); // ✅ Correctly import from named export

const router = express.Router();

// ✅ POST /api/admin/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET /api/admin/dashboard (protected)
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: "Welcome, verified admin!" });
});

module.exports = router;
