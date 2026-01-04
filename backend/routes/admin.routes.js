import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js"; 
const router = Router();

const COOKIE_NAME = "skyrio_admin";
const JWT_SECRET = process.env.JWT_SECRET;

/* =========================
   Admin Auth Helpers
========================= */
function signAdminToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function setAdminCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  const secure =
    String(process.env.COOKIE_SECURE).toLowerCase() === "true" || isProd;

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearAdminCookie(res) {
  const isProd = process.env.NODE_ENV === "production";
  const secure =
    String(process.env.COOKIE_SECURE).toLowerCase() === "true" || isProd;

  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
  });
}

function readAdminFromCookie(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded?.isAdmin) return null;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * ✅ verifyAdmin middleware (cookie-based)
 * Replaces your previous verifyAdmin import.
 */
function verifyAdmin(req, res, next) {
  if (!JWT_SECRET) {
    return res
      .status(500)
      .json({ ok: false, error: "Server misconfigured: JWT_SECRET missing" });
  }

  const admin = readAdminFromCookie(req);
  if (!admin) {
    return res.status(401).json({ ok: false, error: "Admin unauthorized" });
  }

  req.admin = admin; // { isAdmin, email, iat, exp }
  next();
}

/* =========================
   Auth Endpoints
========================= */

/**
 * 🔐 POST /api/admin/login
 * Sets httpOnly JWT cookie if credentials match env vars.
 */
router.post("/login", async (req, res) => {
  try {
    if (!JWT_SECRET) {
      return res
        .status(500)
        .json({ ok: false, error: "Server misconfigured: JWT_SECRET missing" });
    }

    const { email, password } = req.body || {};
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    const ok =
      email &&
      password &&
      ADMIN_EMAIL &&
      ADMIN_PASSWORD &&
      String(email).toLowerCase() === String(ADMIN_EMAIL).toLowerCase() &&
      String(password) === String(ADMIN_PASSWORD);

    if (!ok) {
      return res.status(401).json({
        ok: false,
        error: "Invalid admin credentials",
      });
    }

    const token = signAdminToken({
      isAdmin: true,
      email: String(email).toLowerCase(),
    });

    setAdminCookie(res, token);

    return res.json({
      ok: true,
      admin: { email: String(email).toLowerCase() },
    });
  } catch (e) {
    console.error("[admin] Login failed:", e);
    return res.status(500).json({ ok: false, error: "Login failed" });
  }
});

/**
 * 🚪 POST /api/admin/logout
 */
router.post("/logout", (req, res) => {
  clearAdminCookie(res);
  return res.json({ ok: true });
});

/**
 * 👤 GET /api/admin/me
 * Confirms admin session from cookie.
 */
router.get("/me", (req, res) => {
  const admin = readAdminFromCookie(req);
  if (!admin) return res.status(401).json({ ok: false, isAdmin: false });

  return res.json({
    ok: true,
    isAdmin: true,
    admin: { email: admin.email },
  });
});

/* =========================
   Admin Data Endpoints
========================= */

/**
 * 🧑‍✈️ GET /api/admin/users
 * List all users (admin-only).
 */
router.get("/users", verifyAdmin, async (_req, res) => {
  try {
    const users = await User.find({})
      // whitelist only safe fields; adjust if your schema differs
      .select("name username email role createdAt updatedAt isActive")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error("[admin] Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users." });
  }
});

/**
 * 🧑‍💼 GET /api/admin/staff
 * List only staff/admin accounts (support, manager, admin).
 */
router.get("/staff", verifyAdmin, async (_req, res) => {
  try {
    const staff = await User.find({
      role: { $in: ["support", "manager", "admin"] },
    })
      .select("name username email role createdAt updatedAt isActive")
      .sort({ createdAt: -1 });

    res.json(staff);
  } catch (err) {
    console.error("[admin] Failed to load staff/admins:", err);
    res.status(500).json({ message: "Error loading staff/admins." });
  }
});

/**
 * 🛠️ PATCH /api/admin/users/:id/role
 * Change a user's role (admin-only).
 *
 * Expected body: { "role": "user" | "support" | "manager" | "admin" }
 */
router.patch("/users/:id/role", verifyAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    // Match your User schema enum: ["user", "support", "manager", "admin"]
    const allowedRoles = ["user", "support", "manager", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("name username email role createdAt updatedAt isActive");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("[admin] Error updating user role:", err);
    res.status(500).json({ message: "Error updating user role" });
  }
});

export default router;