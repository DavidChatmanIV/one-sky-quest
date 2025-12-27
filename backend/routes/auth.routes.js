import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user.js";

// ✅ NEW: soft-launch bootstrap deps
import Follow from "../../models/follow.js";
import Notification from "../../models/notification.js";
import { getOrCreateOfficialUser } from "../../lib/official.js";

// ✅ your middleware (named export)
import { authRequired } from "../../middleware/authRequired.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// ---------- Helpers ----------
const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

function signToken(user) {
  const id = user.id || user._id.toString();

  return jwt.sign(
    {
      sub: id,
      id, // ✅ compatibility (your middleware can read either)
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
    isOfficial: user.isOfficial,
    followersCount: user.followersCount,
    followingCount: user.followingCount,
    preferences: user.preferences,
    settings: user.settings,
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

/**
 * Soft-launch bootstrap:
 * ✅ ensure official user exists
 * ✅ auto-follow official (idempotent + safe counts)
 * ✅ welcome notification (idempotent)
 */
async function postSignupBootstrap(newUser) {
  const newUserId = newUser._id;
  const official = await getOrCreateOfficialUser();

  // 1) Auto-follow official (idempotent)
  // Only increment counts if the follow was newly created
  if (String(official._id) !== String(newUserId)) {
    const r = await Follow.updateOne(
      { followerId: newUserId, followingId: official._id },
      { $setOnInsert: { followerId: newUserId, followingId: official._id } },
      { upsert: true }
    );

    const created =
      r?.upsertedCount > 0 ||
      (Array.isArray(r?.upserted) && r.upserted.length > 0) ||
      !!r?.upsertedId;

    if (created) {
      await Promise.all([
        User.updateOne({ _id: newUserId }, { $inc: { followingCount: 1 } }),
        User.updateOne({ _id: official._id }, { $inc: { followersCount: 1 } }),
      ]);
    }
  }

  // 2) Welcome notification (idempotent) — matches your notifications router/schema
  await Notification.updateOne(
    { user: newUserId, event: "welcome" },
    {
      $setOnInsert: {
        user: newUserId,
        type: "system",
        event: "welcome",
        title: "Welcome to Skyrio ✈️",
        message:
          "Your Digital Passport is ready. Start exploring SkyStream and plan your first trip.",
        link: "/passport",
        isRead: false,
      },
    },
    { upsert: true }
  );
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
      finalUsername = finalUsername.toLowerCase();
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // ✅ Create user with soft-launch defaults (your schema supports these)
    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      name: name?.trim() || normalizedEmail.split("@")[0],
      username: finalUsername,
      role: "user",
      isOfficial: false,

      // counts + preferences default safely even if omitted, but explicit is fine
      followersCount: 0,
      followingCount: 0,
      preferences: { officialUpdatesMuted: false },

      // your schema default is false; set explicitly if you want:
      settings: { rewardsEnabled: false },
    });

    // ✅ Soft-launch bootstrap (official auto-follow + welcome notification)
    await postSignupBootstrap(user);

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: buildPublicUser(user),
    });
  } catch (err) {
    console.error("REGISTER error:", err);
    return res.status(500).json({ error: "Registration failed" });
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

    // passwordHash is select:false in your model, so we must include it
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+passwordHash"
    );

    // Generic error to avoid leaking which field failed
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const storedHash = user.passwordHash;
    if (!storedHash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(password, storedHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Re-fetch safe user fields (since we selected passwordHash above)
    const safeUser = await User.findById(user._id);

    const token = signToken(safeUser);

    return res.json({
      token,
      user: buildPublicUser(safeUser),
    });
  } catch (err) {
    console.error("LOGIN error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

// --------- GET /api/auth/check ---------
router.get("/check", authRequired, (req, res) => {
  // authRequired attaches safe user payload to req.user
  return res.json({
    ok: true,
    user: req.user,
  });
});

// --------- GET /api/auth/health ---------
router.get("/health", (_req, res) => {
  return res.json({ ok: true, scope: "auth" });
});

export default router;