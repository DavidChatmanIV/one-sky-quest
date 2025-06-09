const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

router.post("/admin/login", async (req, res) => {
const { email, password } = req.body;

if (!email || !password)
    return res.status(400).json({ message: "Email and password required." });

try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
    return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
    { role: "admin", id: admin._id },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h",
    }
    );

    res.json({ token });
} catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
}
});

module.exports = router;
