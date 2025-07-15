const jwt = require("jsonwebtoken");

// 👤 User token verification middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "🚫 No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains user payload (e.g., id, email)
    next();
  } catch (err) {
    return res.status(403).json({ message: "❌ Invalid or expired token." });
  }
};

// 🛡️ Admin token verification middleware
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "🚫 No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optionally check for role: "admin"
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "❌ Access denied. Admins only." });
    }

    req.admin = decoded; // contains admin payload
    next();
  } catch (err) {
    return res.status(401).json({ message: "❌ Invalid admin token." });
  }
};

module.exports = {
  authMiddleware,
  verifyAdmin,
};
