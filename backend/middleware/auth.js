import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Small helper to read "Bearer <token>" from headers
function getTokenFromHeader(req) {
  const authHeader =
    req.headers.authorization || req.header("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7); // strip "Bearer "
}

// Strict auth: must be logged in, active user in DB
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

// Convenience admin-only guard (same semantics as old verifyAdmin)
export const requireAdmin = requireRole("admin");

// ---------- Backward-compatible aliases ----------
// If some routes still import { auth, verifyAdmin }:
export const auth = authRequired;
export const verifyAdmin = requireAdmin;