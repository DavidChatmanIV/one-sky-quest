import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js"; 
import Admin from "../models/admin.js"; 

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET ?? "supersecret123"; // set on Render!

// 🎯 Helper: Generate a unique referral code (prefix ONE_, up to 5 letters of username + 3 digits)
const generateReferralCode = (username) =>
  `ONE_${String(username || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 5)}${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;

// 🔐 USER REGISTRATION
router.post("/register", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const referredBy =
      (req.query?.ref || req.body?.referredBy || "").trim() || null;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    username = String(username).trim();
    email = String(email).trim().toLowerCase();

    const existing = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existing) {
      if (existing.email === email) {
        return res.status(400).json({ message: "Email already in use." });
      }
      return res.status(409).json({ message: "Username already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const referralCode = generateReferralCode(username);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      referralCode,
      referredBy,
    });
    await newUser.save();

    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy });
      if (referrer) {
        if (String(referrer._id) !== String(newUser._id)) {
          referrer.xp = (referrer.xp || 0) + 50;
          await referrer.save();
        }
      }
    }

    return res.status(201).json({
      message: "User registered successfully.",
      userId: newUser._id,
      username: newUser.username,
      referralCode: newUser.referralCode,
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    return res
      .status(500)
      .json({ message: "Server error during registration." });
  }
});

// 🔓 USER LOGIN
router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id, role: "user" }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        referralCode: user.referralCode,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: "Server error during login." });
  }
});

// 🔓 ADMIN LOGIN
router.post("/admin/login", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(401).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (err) {
    console.error("❌ Admin login error:", err);
    return res.status(500).json({ message: "Server error during login." });
  }
});

export default router;

// (Optional CJS interop)
if (typeof module !== "undefined") {
  // @ts-ignore
  module.exports = router;
}
