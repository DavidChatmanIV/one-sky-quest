import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

// ✅ IMPORTANT: match exact file name casing
import User from "../../models/User.js";

// ✅ Soft-launch bootstrap deps (also ensure exact casing)
import Follow from "../../models/Follow.js";
import Notification from "../../models/Notification.js";
import { getOrCreateOfficialUser } from "../../lib/official.js";

// ✅ Auth middleware (named export)
import { authRequired } from "../../middleware/authRequired.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// ---------- Rate Limiters (Soft-launch safe) ----------
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 80, // general auth endpoints
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20, // tighter for brute-force
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general limiter to all auth routes
router.use(authLimiter);

// ---------- Helpers ----------
const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

// Keep username rules consistent everywhere
const normalizeUsername = (u) =>
  String(u || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_");

function signToken(user) {
  const id = user.id || user._id.toString();

  return jwt.sign(
    {
      sub: id,
      id,
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
  const safeBase = normalizeUsername(base || "explorer") || "explorer";

  const exists = await User.findOne({ username: safeBase });
  if (!exists) return safeBase;

  let candidate;
  for (let i = 0; i < 5; i++) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    candidate = `${safeBase}${suffix}`;
    const clash = await User.findOne({ username: candidate });
    if (!clash) return candidate;
  }

  return `${safeBase}_${Date.now()}`;
}

async function postSignupBootstrap(newUser) {
  const newUserId = newUser._id;
  const official = await getOrCreateOfficialUser();

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

// --------- GET /api/auth/available ---------
// Supports:
//  - /available?email=someone@email.com
//  - /available?username=some_name
//  - /available?email=...&username=...
router.get("/available", async (req, res) => {
  try {
    const emailQ = req.query.email ? normalizeEmail(req.query.email) : null;
    const usernameQ = req.query.username
      ? normalizeUsername(req.query.username)
      : null;

    if (!emailQ && !usernameQ) {
      return res.status(400).json({
        ok: false,
        error: "Provide email and/or username",
      });
    }

    const [emailHit, usernameHit] = await Promise.all([
      emailQ ? User.exists({ email: emailQ }) : Promise.resolve(false),
      usernameQ ? User.exists({ username: usernameQ }) : Promise.resolve(false),
    ]);

    return res.json({
      ok: true,
      email: emailQ ? { available: !emailHit } : undefined,
      username: usernameQ ? { available: !usernameHit } : undefined,
    });
  } catch (err) {
    console.error("AVAILABLE error:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Availability check failed" });
  }
});

// --------- POST /api/auth/register ---------
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, username } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (String(password).length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const normalizedEmail = normalizeEmail(email);

    const existingByEmail = await User.findOne({ email: normalizedEmail });
    if (existingByEmail) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    let finalUsername = username ? normalizeUsername(username) : "";

    // optional: enforce a simple soft-launch minimum
    if (finalUsername && finalUsername.length < 3) {
      return res
        .status(400)
        .json({ error: "Username must be at least 3 characters" });
    }

    if (!finalUsername) {
      const base = normalizedEmail.split("@")[0];
      finalUsername = await generateUsername(base);
    } else {
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
      isOfficial: false,
      followersCount: 0,
      followingCount: 0,
      preferences: { officialUpdatesMuted: false },
      settings: { rewardsEnabled: false },
    });

    await postSignupBootstrap(user);

    // ✅ Auto-login after register (already what you wanted)
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
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { emailOrUsername, email, password } = req.body || {};

    const identity = String(emailOrUsername || email || "").trim();
    if (!identity || !password) {
      return res
        .status(400)
        .json({ error: "Email/username and password are required" });
    }

    const isEmail = identity.includes("@");
    const normalizedEmail = isEmail ? normalizeEmail(identity) : null;
    const normalizedUsername = !isEmail ? normalizeUsername(identity) : null;

    const user = await User.findOne(
      isEmail ? { email: normalizedEmail } : { username: normalizedUsername }
    ).select("+passwordHash");

    if (!user || !user.passwordHash) {
      return res
        .status(401)
        .json({ error: "Invalid email/username or password" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res
        .status(401)
        .json({ error: "Invalid email/username or password" });
    }

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
  return res.json({ ok: true, user: req.user });
});

// --------- GET /api/auth/health ---------
router.get("/health", (_req, res) => {
  return res.json({ ok: true, scope: "auth" });
});

export default router;