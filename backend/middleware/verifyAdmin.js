const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
}

const token = authHeader.split(" ")[1];

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.role !== "admin") {
    return res.status(403).json({ message: "Forbidden — Admins only" });
    }

    req.admin = decoded; // you can access admin info later if needed
    next();
} catch (err) {
    console.error("Token error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
}
};

module.exports = verifyAdmin;
