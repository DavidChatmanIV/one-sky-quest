const jwt = require("jsonwebtoken");

// 🔐 Use fallback for dev if no env var
const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";

/**
 * 🔒 Middleware to verify regular authenticated user
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "🚫 No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // expected: { id, role, email? }
    next();
  } catch (err) {
    return res.status(401).json({ message: "❌ Token is invalid or expired." });
  }
};

/**
 * 🛡️ Middleware to verify admin access
 */
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "🚫 No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "❌ Admin access only." });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "❌ Invalid or expired admin token." });
  }
};

module.exports = {
  authMiddleware,
  verifyAdmin,
};
