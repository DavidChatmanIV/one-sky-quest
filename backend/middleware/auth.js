const jwt = require("jsonwebtoken");

<<<<<<< HEAD
// 🔐 General auth middleware
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided." });
=======
// 🔐 Use fallback for dev if no env var
const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";

/**
 * 🔒 Middleware to verify regular authenticated user
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "🚫 No token provided." });
>>>>>>> origin/fresh-start
  }

  const token = authHeader.split(" ")[1];

  try {
<<<<<<< HEAD
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

// 🛡️ Admin-only middleware
=======
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
>>>>>>> origin/fresh-start
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
<<<<<<< HEAD
    return res.status(401).json({ message: "No token provided." });
=======
    return res.status(401).json({ message: "🚫 No token provided." });
>>>>>>> origin/fresh-start
  }

  const token = authHeader.split(" ")[1];

  try {
<<<<<<< HEAD
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied: admin only." });
    }

    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
=======
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
>>>>>>> origin/fresh-start
  }
};

module.exports = {
<<<<<<< HEAD
  auth,
=======
  authMiddleware,
>>>>>>> origin/fresh-start
  verifyAdmin,
};
