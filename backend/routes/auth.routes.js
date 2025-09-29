import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js"; // keep direct import; swap to barrel if you prefer

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

/**
 * POST /api/auth/register
 * Body: { email, password }
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const emailNorm = normalizeEmail(email);
    const existing = await User.findOne({ email: emailNorm });
    if (existing) {
      return res.status(400).json({ message: "User already exists." });
    }

    // bcryptjs usage
    const passwordHash = await bcrypt.hash(password, 12);

    const user = new User({
      email: emailNorm,
      passwordHash, // ✅ new canonical field
      // Do NOT store plaintext or un-hashed password
    });
    await user.save();

    return res.status(201).json({ message: "Registered successfully." });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const emailNorm = normalizeEmail(email);
    const user = await User.findOne({ email: emailNorm });
    // Return generic message to avoid leaking which field failed
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // bcryptjs usage
    const storedHash = user.passwordHash || user.password; // support legacy "password" field if it was a hash
    if (!storedHash)
      return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, storedHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // Optional: migrate legacy users to passwordHash automatically
    if (!user.passwordHash && user.password) {
      user.passwordHash = user.password;
      user.password = undefined;
      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: "user" }, JWT_SECRET, {
      expiresIn: "2h",
    });
    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/auth/health
 */
router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

export default router;
