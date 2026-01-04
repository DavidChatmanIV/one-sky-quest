import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const ADMIN_COOKIE_NAME = "skyrio_admin";

// Small helper to read "Bearer <token>" from headers
function getTokenFromHeader(req) {
  const authHeader =
    req.headers.authorization || req.header("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7); // strip "Bearer "
}

function getAdminTokenFromCookie(req) {
  return req.cookies?.[ADMIN_COOKIE_NAME] || null;
}

function safeVerify(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Strict auth: must be logged in, active user in DB (Bearer required)
export async function authRequired(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ message: "Auth token missing" });
    }

    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(payload.id).lean();
    if (!user || user.isActive === false) {
      return res.status(401).json({ message: "User not found or inactive" });
    }

    // Attach a safe, minimal user object to the request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      username: user.username,
      isActive: user.isActive,
    };

    next();
  } catch (err) {
    console.error("authRequired error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Generic RBAC middleware: requireRole("admin"), requireRole("manager", "admin"), etc.
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
}

// Convenience admin-only guard (DB role-based) — use this AFTER authRequired
export const requireAdmin = requireRole("admin");

/**
 * ✅ verifyAdmin (cookie OR Bearer)
 * Use this on admin-only routes when you want:
 * - admin cookie session to work (Passport unlock)
 * - OR Bearer admin token (optional)
 *
 * This does NOT require authRequired first.
 */
export async function verifyAdmin(req, res, next) {
  try {
    // 1) ✅ Admin cookie session (from /api/admin/login)
    const adminCookie = getAdminTokenFromCookie(req);
    if (adminCookie) {
      const decoded = safeVerify(adminCookie);
      if (decoded?.isAdmin) {
        req.admin = decoded; // { isAdmin, email, iat, exp }
        return next();
      }
      return res.status(401).json({ message: "Invalid admin session" });
    }

    // 2) ✅ Bearer token admin (optional support)
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = safeVerify(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // If token directly carries role
    if (decoded.role === "admin") {
      req.admin = decoded;
      return next();
    }

    // If token carries user id, confirm role in DB
    if (decoded.id) {
      const user = await User.findById(decoded.id)
        .select("role isActive email username")
        .lean();

      if (!user || user.isActive === false) {
        return res.status(401).json({ message: "User not found or inactive" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden — Admins only" });
      }

      req.admin = {
        id: decoded.id,
        role: "admin",
        email: user.email,
        username: user.username,
      };
      return next();
    }

    return res.status(403).json({ message: "Forbidden — Admins only" });
  } catch (err) {
    console.error("verifyAdmin error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ---------- Backward-compatible aliases ----------
// If some routes still import { auth }:
export const auth = authRequired;