import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export async function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
      return res
        .status(401)
        .json({ message: "Missing or invalid Authorization header" });
    }

    const payload = jwt.verify(token, JWT_SECRET);

    // ✅ Your tokens use `sub`. Support legacy `id` too.
    const userId = payload.sub || payload.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Confirm user still exists
    const user = await User.findById(userId).lean();
    if (!user) {
      return res
        .status(401)
        .json({ message: "User no longer exists or was removed" });
    }

    // Attach safe user payload
    req.user = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      xp: user.xp,
      isOfficial: !!user.isOfficial,
      preferences: user.preferences || {},
    };

    next();
  } catch (err) {
    console.error("[authRequired] error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired, please log in again" });
    }

    return res.status(401).json({ message: "Invalid or expired token" });
  }
}