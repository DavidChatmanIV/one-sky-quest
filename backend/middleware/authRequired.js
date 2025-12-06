import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

async function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
      return res
        .status(401)
        .json({ message: "Missing or invalid Authorization header" });
    }

    const payload = jwt.verify(token, JWT_SECRET);

    // Optional but recommended: confirm user still exists
    const user = await User.findById(payload.id).lean();
    if (!user) {
      return res
        .status(401)
        .json({ message: "User no longer exists or was removed" });
    }

    // Attach a safe user object to the request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      xp: user.xp,
    };

    next();
  } catch (err) {
    console.error("[authRequired] error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export default authRequired;
