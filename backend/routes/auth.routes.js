const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/User");
const Admin = require("../models/Admin");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";

// 🎯 Helper: Generate a unique referral code
const generateReferralCode = (username) => {
  return `ONE_${username.toUpperCase().slice(0, 5)}${Math.floor(
    Math.random() * 1000
  )}`;
};

// 🔐 USER REGISTRATION

<<<<<<< HEAD
// 🔐 User Registration
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(409).json({ message: "Username already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully.", username });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error." });
=======
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const referredBy = req.query.ref || null;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use." });

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

    // 🎁 Reward referrer with XP
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy });
      if (referrer) {
        referrer.xp += 50;
        await referrer.save();
      }
    }

    return res.status(201).json({
      message: "User registered successfully.",
      userId: newUser._id,
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
  const { email, password } = req.body;

  try {
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
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: "Server error during login." });
  }
});

// 🔓 ADMIN LOGIN

router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
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
>>>>>>> origin/fresh-start
  }
});

module.exports = router;
