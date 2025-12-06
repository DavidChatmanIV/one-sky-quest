import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import authRequired from "../../middleware/authRequired.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Small helper to keep user output consistent
function toSafeUser(user) {
  if (typeof user.toSafeJSON === "function") {
    return user.toSafeJSON();
  }

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    bio: user.bio,
    xp: user.xp,
    createdAt: user.createdAt,
  };
}

// -------------------------------------
// POST /api/auth/register
// -------------------------------------
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();

    // Check for existing user by email OR username
    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existing) {
      const conflictField =
        existing.email === normalizedEmail ? "email" : "username";
      return res
        .status(409)
        .json({ message: `${conflictField} already in use` });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
      name: name?.trim(),
    });

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      token,
      user: toSafeUser(user),
    });
  } catch (err) {
    console.error("[POST /auth/register] error:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
});

// -------------------------------------
// POST /api/auth/login
// Body: { emailOrUsername, password }
// -------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({
        message: "Email/username and password are required",
      });
    }

    const raw = emailOrUsername.trim();
    const query = raw.includes("@")
      ? { email: raw.toLowerCase() }
      : { username: raw };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      token,
      user: toSafeUser(user),
    });
  } catch (err) {
    console.error("[POST /auth/login] error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

// -------------------------------------
// GET /api/auth/check
// Protected: requires Authorization: Bearer <token>
// -------------------------------------
router.get("/check", authRequired, async (req, res) => {
  try {
    // req.user is populated by authRequired
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User no longer exists or was removed" });
    }

    return res.json({
      ok: true,
      user: toSafeUser(user),
    });
  } catch (err) {
    console.error("[GET /auth/check] error:", err);
    return res.status(500).json({ message: "Failed to check auth" });
  }
});

export default router;
