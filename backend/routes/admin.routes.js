import { Router } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

const router = Router();

// Register a new admin
router.post("/register", async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const { password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const existing = await Admin.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    // Do NOT hash here; model pre-save will hash it
    const doc = await Admin.create({ email, password });
    return res
      .status(201)
      .json({ message: "Admin registered successfully.", id: doc._id });
  } catch (err) {
    console.error("Registration error:", err);
    // Handle duplicate email gracefully
    if (err?.code === 11000) {
      return res.status(400).json({ message: "Email already in use." });
    }
    return res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." });
    }

    // Need password field; it's select:false by default
    const admin = await Admin.findOne({ email })
      .select("+password")
      .collation({ locale: "en", strength: 2 });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Optional: lockout check
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      return res
        .status(423)
        .json({ message: "Account temporarily locked. Try again later." });
    }

    const ok = await admin.comparePassword(password);
    if (!ok) {
      await admin.recordFailedLogin();
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await admin.clearFailedLogins();

    const token = jwt.sign(
      { role: "admin", id: admin._id, iat: Math.floor(Date.now() / 1000) },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "1h" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
