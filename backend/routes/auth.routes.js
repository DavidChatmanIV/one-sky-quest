import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { authRequired } from "../middleware/authRequired.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// ---------- Helpers ----------

const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id || user._id.toString(),
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function buildPublicUser(user) {
  return {
    id: user.id || user._id.toString(),
    username: user.username,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
    xp: user.xp,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// Generate a username if one wasn't provided
async function generateUsername(base) {
  const safeBase = String(base || "explorer")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_");

  // Try base first
  const exists = await User.findOne({ username: safeBase });
  if (!exists) return safeBase;

  // Fallback: base + random 4 digits
  let candidate;
  for (let i = 0; i < 5; i++) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    candidate = `${safeBase}${suffix}`;
    const clash = await User.findOne({ username: candidate });
    if (!clash) return candidate;
  }

  // Worst-case fallback
  return `${safeBase}_${Date.now()}`;
}

// --------- POST /api/auth/register ---------
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, username } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const normalizedEmail = normalizeEmail(email);

    const existingByEmail = await User.findOne({ email: normalizedEmail });
    if (existingByEmail) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    // Decide username
    let finalUsername = username?.trim();
    if (!finalUsername) {
      const base = normalizedEmail.split("@")[0];
      finalUsername = await generateUsername(base);
    } else {
      // Ensure requested username is unique
      const existingByUsername = await User.findOne({
        username: finalUsername,
      });
      if (existingByUsername) {
        return res
          .status(409)
          .json({ error: "Username is already taken, choose another" });
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      name: name?.trim() || normalizedEmail.split("@")[0],
      username: finalUsername,
      role: "user",
    });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: buildPublicUser(user),
    });
  } catch (err) {
    console.error("REGISTER error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// --------- POST /api/auth/login ---------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    // Generic error to avoid leaking which field failed
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Support legacy "password" field if it was a hash
    const storedHash = user.passwordHash || user.password;
    if (!storedHash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(password, storedHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Optional: migrate legacy users to passwordHash automatically
    if (!user.passwordHash && user.password) {
      user.passwordHash = user.password;
      user.password = undefined;
      await user.save();
    }

    const token = signToken(user);

    res.json({
      token,
      user: buildPublicUser(user),
    });
  } catch (err) {
    console.error("LOGIN error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// --------- GET /api/auth/check ---------
router.get("/check", authRequired, (req, res) => {
  // authRequired should attach a safe user payload to req.user
  res.json({
    ok: true,
    user: req.user,
  });
});

// --------- GET /api/auth/health ---------
router.get("/health", (_req, res) => {
  res.json({ ok: true, scope: "auth" });
});

export default router;